import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuthService } from '../auth/auth.service';
import { FirmaDoc } from '../entities/doc/firma-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { FeplemClient } from './feplem.client';

/** Documento pendiente o listo para firmar, en la forma que consume la vista. */
export interface DocumentoFirmable {
  id: number;
  origen: 'oficio' | 'documento';
  folio: string | null;
  nombre: string | null;
  uuid: string | null;
  firmado: boolean;
  /** Sin archivo almacenado no hay nada que enviar a firmar. */
  firmable: boolean;
  created_at: Date | null;
}

@Injectable()
export class FirmaService {
  constructor(
    @InjectRepository(RegistroDoc)
    private readonly oficios: Repository<RegistroDoc>,
    @InjectRepository(FirmaDoc)
    private readonly documentos: Repository<FirmaDoc>,
    private readonly feplem: FeplemClient,
    private readonly auth: AuthService,
  ) {}

  /**
   * Documentos del usuario susceptibles de firma: los oficios que registró y
   * los archivos sueltos de `firma_docs` (RegistroDocumentosController@firmaIndex).
   */
  async listar(user: AuthenticatedUser): Promise<DocumentoFirmable[]> {
    const [oficios, documentos] = await Promise.all([
      this.oficios.find({
        where: { rfc_registro: user.rfc, activo: 1 },
        order: { created_at: 'DESC' },
        take: 100,
      }),
      this.documentos.find({
        where: { rfc_registro: user.rfc, status: 1 },
        order: { created_at: 'DESC' },
        take: 100,
      }),
    ]);

    return [
      ...oficios.map<DocumentoFirmable>((o) => ({
        id: o.id,
        origen: 'oficio',
        folio: o.folio,
        nombre: o.titulo_doc,
        uuid: o.uuid_doc,
        firmado: !!o.firmado,
        firmable: !!o.path_doc && !!o.uuid_doc,
        created_at: o.created_at,
      })),
      ...documentos.map<DocumentoFirmable>((d) => ({
        id: d.id,
        origen: 'documento',
        folio: null,
        nombre: d.nombre_doc,
        uuid: d.uuid_doc,
        // `firma_docs` no guarda el estado de firma; se asume pendiente.
        firmado: false,
        firmable: !!d.path_doc,
        created_at: d.created_at,
      })),
    ].sort((a, b) => (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0));
  }

  /**
   * Valida la FIEL sin firmar nada; sirve para confirmar la contraseña antes
   * de mostrar el resto del flujo.
   */
  async validarCertificado(user: AuthenticatedUser, password: string) {
    const hash = await this.feplem.validarCertificado(user.rfc, password);

    if (!hash) {
      await this.penalizar(user);
    }

    await this.auth.reiniciarIntentos(user.id);
    return { valido: true, hash };
  }

  /** Firma un oficio ya almacenado (`registro_docs`). */
  async firmarOficio(user: AuthenticatedUser, id: number, password: string) {
    const oficio = await this.oficios.findOne({ where: { id } });

    if (!oficio) {
      throw new NotFoundException('El oficio no existe.');
    }
    if (oficio.rfc_registro !== user.rfc) {
      throw new UnauthorizedException('Solo quien registró el oficio puede firmarlo.');
    }
    if (oficio.firmado) {
      throw new ConflictException('El oficio ya cuenta con firma electrónica.');
    }
    if (!oficio.path_doc || !oficio.uuid_doc) {
      throw new BadRequestException(
        'El oficio no tiene un archivo almacenado, por lo que no puede firmarse.',
      );
    }

    const hash = await this.exigirCertificadoValido(user, password);

    const firmado = await this.feplem.firmarDocumento({
      path: oficio.path_doc,
      user_rfc: user.rfc,
      contra: password,
      docI: oficio.uuid_doc,
      tipo: 'documentacion/oficios',
      firma_status: '1',
      status_doc: '1',
      firma: 8,
      tipo_firmante: null,
      fecha_expedicion: FeplemClient.ahora(),
      fecha_certificacion: FeplemClient.ahora(),
    });

    if (!firmado) {
      throw new BadRequestException(
        'El servicio de firma electrónica rechazó la solicitud. Verifica el documento e intenta de nuevo.',
      );
    }

    await this.oficios.update(oficio.id, { firmado: 1 });

    return { message: `El oficio ${oficio.folio ?? ''} quedó firmado.`.trim(), hash };
  }

  /** Firma un documento suelto (`firma_docs`). */
  async firmarDocumento(user: AuthenticatedUser, id: number, password: string) {
    const documento = await this.documentos.findOne({ where: { id } });

    if (!documento) {
      throw new NotFoundException('El documento no existe.');
    }
    if (documento.rfc_registro !== user.rfc) {
      throw new UnauthorizedException('Solo quien cargó el documento puede firmarlo.');
    }
    if (!documento.path_doc) {
      throw new BadRequestException('El documento no tiene un archivo almacenado.');
    }

    const hash = await this.exigirCertificadoValido(user, password);

    const firmado = await this.feplem.firmarDocumento({
      path: documento.path_doc,
      user_rfc: user.rfc,
      contra: password,
      docI: documento.uuid_doc,
      tipo: 'documentacion',
      firma_status: '1',
      status_doc: '1',
      firma: 8,
      tipo_firmante: null,
      fecha_expedicion: FeplemClient.ahora(),
      fecha_certificacion: FeplemClient.ahora(),
    });

    if (!firmado) {
      throw new BadRequestException(
        'El servicio de firma electrónica rechazó la solicitud.',
      );
    }

    return { message: `El documento ${documento.nombre_doc} quedó firmado.`, hash };
  }

  /** Valida la FIEL y penaliza el intento si no es correcta. */
  private async exigirCertificadoValido(
    user: AuthenticatedUser,
    password: string,
  ): Promise<string> {
    const hash = await this.feplem.validarCertificado(user.rfc, password);

    if (!hash) {
      await this.penalizar(user);
    }

    await this.auth.reiniciarIntentos(user.id);
    return hash!;
  }

  /**
   * Registra el intento fallido y siempre lanza: el contador de bloqueo es el
   * mismo que usa el login, tal como en el sistema original.
   */
  private async penalizar(user: AuthenticatedUser): Promise<never> {
    const { intentos, bloqueado, maximo } = await this.auth.penalizarIntentoFallido(user.id);

    if (bloqueado) {
      throw new UnauthorizedException(
        'Tu cuenta quedó bloqueada por intentos fallidos. Contacta al administrador del sistema.',
      );
    }

    const restantes = (maximo ?? 3) - intentos;
    throw new UnauthorizedException(
      `La contraseña no es válida o el certificado no está vigente. Te ${
        restantes === 1 ? 'queda 1 intento' : `quedan ${restantes} intentos`
      }.`,
    );
  }
}
