import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { Paginated, paginate } from '../common/dto/pagination.dto';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AtencionDoc } from '../entities/doc/atencion-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { CrearOficioDto } from './dto/crear-oficio.dto';
import { FiltroBandejaDto } from './dto/filtro-bandeja.dto';

export interface OficioBandeja {
  id: number;
  atencion_id: number | null;
  folio: string | null;
  titulo_doc: string | null;
  fojas: number | null;
  firmado: boolean;
  tipo_atencion: string | null;
  visto: boolean;
  atendido: boolean;
  fecha_visto: Date | null;
  fecha_atencion: Date | null;
  created_at: Date | null;
  /** Contraparte del oficio: remitente en entrada, destinatarios en salida. */
  contraparte: string;
}

@Injectable()
export class OficiosService {
  constructor(
    @InjectRepository(RegistroDoc)
    private readonly registros: Repository<RegistroDoc>,
    @InjectRepository(AtencionDoc)
    private readonly atenciones: Repository<AtencionDoc>,
    @InjectRepository(ServidorPublico, SAF_CONNECTION)
    private readonly servidores: Repository<ServidorPublico>,
  ) {}

  /**
   * Bandeja de entrada: oficios dirigidos al RFC en sesión.
   * Equivale a RegistroDocumentosController@ofEntrada.
   */
  async bandejaEntrada(
    user: AuthenticatedUser,
    filtro: FiltroBandejaDto,
  ): Promise<Paginated<OficioBandeja>> {
    const query = this.atenciones
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.registroDoc', 'doc')
      .where('a.rfc_atencion = :rfc', { rfc: user.rfc })
      .andWhere('a.activo = 1');

    this.aplicarEstado(query, filtro.estado, 'a.status_atencion');
    this.aplicarFiltrosComunes(query, filtro, 'doc');

    const [rows, total] = await query
      .orderBy('a.created_at', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    const remitentes = await this.nombresPorRfc(
      rows.map((row) => row.registroDoc?.rfc_registro).filter((rfc): rfc is string => !!rfc),
    );

    const data = rows.map<OficioBandeja>((row) => ({
      id: row.registroDoc!.id,
      atencion_id: row.id,
      folio: row.registroDoc!.folio,
      titulo_doc: row.registroDoc!.titulo_doc,
      fojas: row.registroDoc!.fojas,
      firmado: !!row.registroDoc!.firmado,
      tipo_atencion: row.tipo_atencion,
      visto: !!row.visto,
      atendido: !!row.status_atencion,
      fecha_visto: row.fecha_visto,
      fecha_atencion: row.fecha_atencion,
      created_at: row.created_at,
      contraparte:
        remitentes.get(row.registroDoc!.rfc_registro ?? '') ?? 'Usuario no identificado',
    }));

    return paginate(data, total, filtro);
  }

  /**
   * Bandeja de salida: oficios registrados por el usuario en sesión.
   * Equivale a RegistroDocumentosController@ofSalida.
   */
  async bandejaSalida(
    user: AuthenticatedUser,
    filtro: FiltroBandejaDto,
  ): Promise<Paginated<OficioBandeja>> {
    const query = this.registros
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.destinatarios', 'a')
      .where('doc.rfc_registro = :rfc', { rfc: user.rfc })
      .andWhere('doc.activo = 1');

    // Un oficio enviado cuenta como atendido cuando ningún destinatario vigente
    // sigue pendiente.
    if (filtro.estado === 'atendidos' || filtro.estado === 'pendientes') {
      const existePendiente = `EXISTS (
        SELECT 1 FROM atencion_docs ad
        WHERE ad.id_registro_doc = doc.id AND ad.activo = 1 AND ad.status_atencion = 0
      )`;
      query.andWhere(filtro.estado === 'atendidos' ? `NOT ${existePendiente}` : existePendiente);
    }

    this.aplicarFiltrosComunes(query, filtro, 'doc');

    const [rows, total] = await query
      .orderBy('doc.created_at', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    const nombres = await this.nombresPorRfc(
      rows.flatMap((doc) => (doc.destinatarios ?? []).map((d) => d.rfc_atencion)),
    );

    const data = rows.map<OficioBandeja>((doc) => {
      const destinatarios = doc.destinatarios ?? [];
      return {
        id: doc.id,
        atencion_id: null,
        folio: doc.folio,
        titulo_doc: doc.titulo_doc,
        fojas: doc.fojas,
        firmado: !!doc.firmado,
        tipo_atencion: null,
        // En salida "visto"/"atendido" resumen el avance de todos los destinatarios.
        visto: destinatarios.length > 0 && destinatarios.every((d) => !!d.visto),
        atendido: destinatarios.length > 0 && destinatarios.every((d) => !!d.status_atencion),
        fecha_visto: null,
        fecha_atencion: null,
        created_at: doc.created_at,
        contraparte:
          destinatarios
            .map((d) => nombres.get(d.rfc_atencion) ?? d.rfc_atencion)
            .join(', ') || 'Sin destinatarios',
      };
    });

    return paginate(data, total, filtro);
  }

  /** Detalle del oficio con sus destinatarios resueltos. Equivale a @verEnvioDoc. */
  async detalle(id: number) {
    const doc = await this.registros.findOne({
      where: { id },
      relations: { destinatarios: true },
    });

    if (!doc) {
      throw new NotFoundException('El oficio solicitado no existe.');
    }

    const nombres = await this.nombresPorRfc([
      ...(doc.destinatarios ?? []).flatMap((d) => [d.rfc_atencion, d.rfc_turna ?? '']),
      doc.rfc_registro ?? '',
    ]);

    return {
      ...doc,
      remitente: nombres.get(doc.rfc_registro ?? '') ?? 'Usuario no identificado',
      destinatarios: (doc.destinatarios ?? []).map((d) => ({
        ...d,
        nombre: nombres.get(d.rfc_atencion) ?? d.rfc_atencion,
        turnado_por: d.rfc_turna ? (nombres.get(d.rfc_turna) ?? d.rfc_turna) : null,
      })),
    };
  }

  /** Registra el oficio y sus destinatarios. Equivale a @saveDoc. */
  async crear(user: AuthenticatedUser, dto: CrearOficioDto) {
    const doc = await this.registros.save(
      this.registros.create({
        folio: await this.siguienteFolio(),
        titulo_doc: dto.titulo_doc,
        fojas: dto.fojas ?? null,
        serie_id: dto.serie_id ?? null,
        subserie_id: dto.subserie_id ?? null,
        expediente_id: dto.expediente_id ?? null,
        tipo_doc: dto.tipo_doc ?? null,
        rfc_registro: user.rfc,
        firmado: 0,
        status: 1,
        activo: 1,
      }),
    );

    await this.atenciones.save(
      dto.destinatarios.map((destinatario) =>
        this.atenciones.create({
          id_registro_doc: doc.id,
          rfc_atencion: destinatario.rfc_atencion,
          tipo_atencion: destinatario.tipo_atencion,
          visto: 0,
          status_atencion: 0,
          activo: 1,
        }),
      ),
    );

    return this.detalle(doc.id);
  }

  /** Marca el oficio como visto. Equivale a NotificacionController@vistoEntrada. */
  async marcarVisto(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atencionPropia(user, atencionId);

    if (!atencion.visto) {
      await this.atenciones.update(atencion.id, { visto: 1, fecha_visto: new Date() });
    }

    return { message: 'Oficio marcado como visto.' };
  }

  /** Cierra la atención del oficio para el usuario en sesión. */
  async atender(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atencionPropia(user, atencionId);

    await this.atenciones.update(atencion.id, {
      status_atencion: 1,
      fecha_atencion: new Date(),
      visto: 1,
      fecha_visto: atencion.fecha_visto ?? new Date(),
    });

    return { message: 'El oficio se marcó como atendido.' };
  }

  /** Totales que alimentan el tablero y las insignias del menú. */
  async resumen(user: AuthenticatedUser) {
    const [entradaPendientes, entradaSinVer, salidaTotal] = await Promise.all([
      this.atenciones.count({
        where: { rfc_atencion: user.rfc, status_atencion: 0, activo: 1 },
      }),
      this.atenciones.count({ where: { rfc_atencion: user.rfc, visto: 0, activo: 1 } }),
      this.registros.count({ where: { rfc_registro: user.rfc, activo: 1 } }),
    ]);

    return { entradaPendientes, entradaSinVer, salidaTotal };
  }

  private async atencionPropia(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atenciones.findOne({
      where: { id: atencionId, rfc_atencion: user.rfc },
    });

    if (!atencion) {
      throw new NotFoundException('El oficio no está dirigido a tu bandeja.');
    }

    return atencion;
  }

  /** Folio consecutivo por año, con el formato del sistema original. */
  private async siguienteFolio(): Promise<string> {
    const anio = new Date().getFullYear();
    const total = await this.registros
      .createQueryBuilder('doc')
      .where('YEAR(doc.created_at) = :anio', { anio })
      .getCount();

    return `${anio}-${String(total + 1).padStart(5, '0')}`;
  }

  /** Resuelve nombres desde el padrón SAF en una sola consulta. */
  private async nombresPorRfc(rfcs: string[]): Promise<Map<string, string>> {
    const unicos = [...new Set(rfcs.filter(Boolean))];
    if (!unicos.length) {
      return new Map();
    }

    const servidores = await this.servidores.find({ where: { N_Usuario: In(unicos) } });
    return new Map(
      servidores.map((s) => [s.N_Usuario, s.Nombre ?? 'Usuario no identificado']),
    );
  }

  private aplicarEstado(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    estado: FiltroBandejaDto['estado'],
    campo: string,
  ) {
    if (estado === 'pendientes') {
      query.andWhere(`${campo} = 0`);
    } else if (estado === 'atendidos') {
      query.andWhere(`${campo} = 1`);
    }
  }

  private aplicarFiltrosComunes(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    filtro: FiltroBandejaDto,
    alias: string,
  ) {
    if (filtro.search) {
      query.andWhere(
        `(${alias}.folio LIKE :search OR ${alias}.titulo_doc LIKE :search)`,
        { search: `%${filtro.search}%` },
      );
    }
    if (filtro.serie_id) {
      query.andWhere(`${alias}.serie_id = :serie`, { serie: filtro.serie_id });
    }
    if (filtro.desde && filtro.hasta) {
      query.andWhere(`${alias}.created_at BETWEEN :desde AND :hasta`, {
        desde: `${filtro.desde} 00:00:00`,
        hasta: `${filtro.hasta} 23:59:59`,
      });
    }
  }
}
