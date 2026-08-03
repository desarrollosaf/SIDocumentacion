import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { In, Repository } from 'typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { ModelHasRole, Role } from '../entities/doc/role.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { User } from '../entities/saf/user.entity';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Cadena que spatie/laravel-permission guarda en model_has_roles.model_type.
 * En esta instalación el modelo registrado es `UsersSaf`, no `User`.
 */
const MODEL_TYPE = 'App\\Models\\UsersSaf';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, SAF_CONNECTION)
    private readonly users: Repository<User>,
    @InjectRepository(ServidorPublico, SAF_CONNECTION)
    private readonly servidores: Repository<ServidorPublico>,
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
    @InjectRepository(ModelHasRole)
    private readonly modelHasRoles: Repository<ModelHasRole>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login({ usuario, password }: LoginDto) {
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.rfc = :usuario OR u.email = :usuario', { usuario })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    if (user.bloqueo) {
      throw new UnauthorizedException(
        'Tu cuenta está bloqueada por intentos fallidos. Contacta al administrador del sistema.',
      );
    }

    const valido = await bcrypt.compare(password, user.password ?? '');

    if (!valido) {
      await this.registrarIntentoFallido(user);
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    if (user.intentos) {
      await this.users.update(user.id, { intentos: 0 });
    }

    const perfil = await this.perfilDe(user);
    const { id, ...resto } = perfil;

    return {
      access_token: await this.jwt.signAsync({ sub: id, ...resto }),
      user: perfil,
    };
  }

  /** Reconstruye el perfil completo del usuario (datos SAF + roles). */
  async perfilDe(user: User): Promise<AuthenticatedUser> {
    const [servidor, roles] = await Promise.all([
      user.rfc
        ? this.servidores.findOne({
            where: { N_Usuario: user.rfc },
            relations: { dependencia: true, direccion: true, departamento: true },
          })
        : Promise.resolve(null),
      this.rolesDe(user.id),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      rfc: user.rfc ?? '',
      roles,
      nombre: servidor?.Nombre ?? user.name ?? 'Usuario no identificado',
      dependencia: servidor?.dependencia?.nombre_completo ?? null,
      direccion: servidor?.direccion?.nombre_completo ?? null,
      departamento: servidor?.departamento?.nombre_completo ?? null,
      id_Dependencia: servidor?.id_Dependencia ?? null,
      id_Direccion: servidor?.id_Direccion ?? null,
      id_Departamento: servidor?.id_Departamento ?? null,
      c_presup: servidor?.departamento?.c_presup ?? null,
      path_foto: user.path_foto,
    };
  }

  async perfilPorId(id: number): Promise<AuthenticatedUser> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('La sesión ya no es válida.');
    }
    return this.perfilDe(user);
  }

  async cambiarPassword(userId: number, dto: CambiarPasswordDto) {
    if (dto.nueva !== dto.confirmacion) {
      throw new BadRequestException('La confirmación no coincide con la nueva contraseña.');
    }

    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.id = :userId', { userId })
      .getOne();

    if (!user || !(await bcrypt.compare(dto.actual, user.password ?? ''))) {
      throw new BadRequestException('La contraseña actual no es correcta.');
    }

    // Laravel firma con el prefijo $2y$; bcryptjs lo interpreta correctamente.
    const hash = await bcrypt.hash(dto.nueva, 12);
    await this.users.update(user.id, { password: hash.replace(/^\$2a\$/, '$2y$') });

    return { message: 'Tu contraseña se actualizó correctamente.' };
  }

  /**
   * Suma un intento fallido y bloquea la cuenta al llegar al máximo.
   * Lo usan tanto el login como la validación de la FIEL, que en el sistema
   * original comparten el mismo contador.
   *
   * @returns los intentos acumulados y si la cuenta quedó bloqueada.
   */
  async penalizarIntentoFallido(userId: number) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      return { intentos: 0, bloqueado: false };
    }

    const intentos = (user.intentos ?? 0) + 1;
    const maximo = this.config.get<number>('maxIntentosLogin', 3);
    const bloqueado = intentos >= maximo;

    await this.users.update(user.id, {
      intentos,
      bloqueo: bloqueado ? 1 : (user.bloqueo ?? 0),
    });

    return { intentos, bloqueado, maximo };
  }

  /** Reinicia el contador tras una validación exitosa. */
  async reiniciarIntentos(userId: number) {
    await this.users.update(userId, { intentos: 0 });
  }

  private async registrarIntentoFallido(user: User) {
    await this.penalizarIntentoFallido(user.id);
  }

  private async rolesDe(userId: number): Promise<string[]> {
    const asignaciones = await this.modelHasRoles.find({
      where: { model_id: userId, model_type: MODEL_TYPE },
    });

    if (!asignaciones.length) {
      return [];
    }

    const roles = await this.roles.find({
      where: { id: In(asignaciones.map((a) => a.role_id)) },
    });

    return roles.map((role) => role.name);
  }
}
