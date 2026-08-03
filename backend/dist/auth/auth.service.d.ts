import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { ModelHasRole, Role } from '../entities/doc/role.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { User } from '../entities/saf/user.entity';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly users;
    private readonly servidores;
    private readonly roles;
    private readonly modelHasRoles;
    private readonly jwt;
    private readonly config;
    constructor(users: Repository<User>, servidores: Repository<ServidorPublico>, roles: Repository<Role>, modelHasRoles: Repository<ModelHasRole>, jwt: JwtService, config: ConfigService);
    login({ usuario, password }: LoginDto): Promise<{
        access_token: string;
        user: AuthenticatedUser;
    }>;
    perfilDe(user: User): Promise<AuthenticatedUser>;
    perfilPorId(id: number): Promise<AuthenticatedUser>;
    cambiarPassword(userId: number, dto: CambiarPasswordDto): Promise<{
        message: string;
    }>;
    penalizarIntentoFallido(userId: number): Promise<{
        intentos: number;
        bloqueado: boolean;
        maximo?: undefined;
    } | {
        intentos: number;
        bloqueado: boolean;
        maximo: number;
    }>;
    reiniciarIntentos(userId: number): Promise<void>;
    private registrarIntentoFallido;
    private rolesDe;
}
