import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { Paginated, paginate } from '../common/dto/pagination.dto';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { Agenda } from '../entities/doc/agenda.entity';
import { RegistroAtencion } from '../entities/doc/registro-atencion.entity';
import { ESTADO_ENVIO, Registro } from '../entities/doc/registro.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { CrearSolicitudDto } from './dto/crear-solicitud.dto';
import { FiltroSolicitudesDto } from './dto/filtro-solicitudes.dto';

export { ESTADO_ENVIO };

export interface SolicitudBandeja {
  id: number;
  atencion_id: number | null;
  folio: string | null;
  titulo_doc: string | null;
  tipo_atencion: number | null;
  fecha_recepcion: string | null;
  fecha_limite_atencion: string | null;
  /** Días restantes para la fecha límite; negativo indica vencida. */
  dias_restantes: number | null;
  visto: boolean;
  atendido: boolean;
  contraparte: string;
  created_at: Date | null;
}

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Registro)
    private readonly registros: Repository<Registro>,
    @InjectRepository(RegistroAtencion)
    private readonly atenciones: Repository<RegistroAtencion>,
    @InjectRepository(Agenda)
    private readonly agendas: Repository<Agenda>,
    @InjectRepository(ServidorPublico, SAF_CONNECTION)
    private readonly servidores: Repository<ServidorPublico>,
  ) {}

  /**
   * Solicitudes turnadas al usuario en sesión (entradaController@index).
   * Solo se muestran las liberadas (`status_envio = 4`), igual que el original.
   */
  async bandejaEntrada(
    user: AuthenticatedUser,
    filtro: FiltroSolicitudesDto,
  ): Promise<Paginated<SolicitudBandeja>> {
    const query = this.atenciones
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.registro', 'r')
      .where('a.user_rfc = :rfc', { rfc: user.rfc })
      .andWhere('a.activo = 1')
      .andWhere('r.status_envio = :liberado', { liberado: ESTADO_ENVIO.LIBERADO });

    if (filtro.estado === 'pendientes') {
      query.andWhere('a.statusAtencion = 0');
    } else if (filtro.estado === 'atendidos') {
      query.andWhere('a.statusAtencion = 1');
    }

    this.aplicarFiltros(query, filtro);

    const [rows, total] = await query
      .orderBy('r.fecha_limite_atencion', 'ASC')
      .addOrderBy('a.created_at', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    // `user_turna` viene vacío en buena parte de los registros históricos, así
    // que la contraparte cae al remitente de la solicitud, que sí está poblado.
    const nombres = await this.nombresPorRfc(
      rows.flatMap((row) => [row.user_turna ?? '', row.registro?.remitente_rfc ?? '']),
    );

    const data = rows.map<SolicitudBandeja>((row) => ({
      id: row.registro!.id,
      atencion_id: row.id,
      folio: row.registro!.folio,
      titulo_doc: row.registro!.titulo_doc,
      tipo_atencion: row.registro!.tipo_atencion,
      fecha_recepcion: row.registro!.fecha_recepcion,
      fecha_limite_atencion: row.registro!.fecha_limite_atencion,
      dias_restantes: this.diasRestantes(row.registro!.fecha_limite_atencion),
      visto: !!row.visto,
      atendido: !!row.statusAtencion,
      contraparte:
        nombres.get(row.user_turna ?? '') ??
        row.registro?.nombre_remitente ??
        nombres.get(row.registro?.remitente_rfc ?? '') ??
        'Usuario no identificado',
      created_at: row.created_at,
    }));

    return paginate(data, total, filtro);
  }

  /** Solicitudes registradas por el usuario en sesión (salidaController@index). */
  async bandejaSalida(
    user: AuthenticatedUser,
    filtro: FiltroSolicitudesDto,
    soloPreregistro = false,
  ): Promise<Paginated<SolicitudBandeja>> {
    const query = this.registros
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.atenciones', 'a')
      .where('r.user_registro = :id', { id: user.id })
      .andWhere('r.status = 1');

    if (soloPreregistro) {
      query.andWhere('r.status_envio = :estado', { estado: ESTADO_ENVIO.PREREGISTRO });
    } else {
      query.andWhere('r.status_envio <> :preregistro', {
        preregistro: ESTADO_ENVIO.PREREGISTRO,
      });

      // Una solicitud cuenta como atendida cuando ninguno de sus turnos
      // vigentes sigue pendiente; así "Atendidos salida" no repite "Salida".
      if (filtro.estado === 'atendidos' || filtro.estado === 'pendientes') {
        const existePendiente = `EXISTS (
          SELECT 1 FROM registro_atencions ra
          WHERE ra.registro_id = r.id AND ra.activo = 1 AND ra.statusAtencion = 0
        )`;
        query.andWhere(
          filtro.estado === 'atendidos' ? `NOT ${existePendiente}` : existePendiente,
        );
      }
    }

    this.aplicarFiltros(query, filtro);

    const [rows, total] = await query
      .orderBy('r.created_at', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    const nombres = await this.nombresPorRfc(
      rows.flatMap((r) => (r.atenciones ?? []).map((a) => a.user_rfc)),
    );

    const data = rows.map<SolicitudBandeja>((registro) => {
      const turnos = registro.atenciones ?? [];
      return {
        id: registro.id,
        atencion_id: null,
        folio: registro.folio,
        titulo_doc: registro.titulo_doc,
        tipo_atencion: registro.tipo_atencion,
        fecha_recepcion: registro.fecha_recepcion,
        fecha_limite_atencion: registro.fecha_limite_atencion,
        dias_restantes: this.diasRestantes(registro.fecha_limite_atencion),
        visto: turnos.length > 0 && turnos.every((t) => !!t.visto),
        atendido: turnos.length > 0 && turnos.every((t) => !!t.statusAtencion),
        contraparte:
          turnos.map((t) => nombres.get(t.user_rfc) ?? t.user_rfc).join(', ') || 'Sin turnar',
        created_at: registro.created_at,
      };
    });

    return paginate(data, total, filtro);
  }

  /** Preregistros pendientes de autorizar (RegistroController@preregistro). */
  preregistros(user: AuthenticatedUser, filtro: FiltroSolicitudesDto) {
    return this.bandejaSalida(user, filtro, true);
  }

  async detalle(id: number) {
    const registro = await this.registros.findOne({
      where: { id },
      relations: { atenciones: true, serie: true },
    });

    if (!registro) {
      throw new NotFoundException('La solicitud no existe.');
    }

    const nombres = await this.nombresPorRfc([
      ...(registro.atenciones ?? []).flatMap((a) => [a.user_rfc, a.user_turna ?? '']),
      registro.remitente_rfc,
    ]);

    return {
      ...registro,
      remitente:
        registro.nombre_remitente ??
        nombres.get(registro.remitente_rfc) ??
        'Usuario no identificado',
      atenciones: (registro.atenciones ?? []).map((a) => ({
        id: a.id,
        user_rfc: a.user_rfc,
        nombre: nombres.get(a.user_rfc) ?? a.user_rfc,
        turnado_por: nombres.get(a.user_turna ?? '') ?? a.user_turna,
        instruccion: a.indicaciones_turno,
        visto: a.visto,
        status_atencion: a.statusAtencion,
        fecha_visto: null,
        fecha_atencion: a.fechaCierre,
      })),
    };
  }

  /**
   * Crea la solicitud, sus turnos y el evento de agenda de la fecha límite,
   * replicando RegistroController@store.
   */
  async crear(user: AuthenticatedUser, dto: CrearSolicitudDto) {
    const registro = await this.registros.save(
      this.registros.create({
        folio: await this.siguienteFolio(),
        titulo_doc: dto.titulo_doc,
        descripcion_doc: dto.descripcion_doc ?? dto.titulo_doc,
        fecha_recepcion: dto.fecha_recepcion,
        fecha_documento: dto.fecha_documento,
        fecha_limite_atencion: dto.fecha_limite_atencion,
        tipo_atencion: dto.tipo_atencion,
        tipo_doc: dto.tipo_doc ?? null,
        serie_id: dto.serie_id ?? 0,
        subserie_id: dto.subserie_id ?? null,
        expediente_id: dto.expediente_id ?? null,
        folio_rastreo: dto.folio_rastreo ?? null,
        remitente_rfc: dto.remitente_rfc ?? user.rfc,
        user_registro: user.id,
        fojas: dto.fojas ?? null,
        status: 1,
        activo: 1,
        status_envio: dto.preregistro ? ESTADO_ENVIO.PREREGISTRO : ESTADO_ENVIO.LIBERADO,
      }),
    );

    await this.atenciones.save(
      dto.turnos.map((turno) =>
        this.atenciones.create({
          registro_id: registro.id,
          user_rfc: turno.user_rfc,
          user_turna: user.rfc,
          indicaciones_turno: turno.instruccion ?? null,
          tipoAtencion: String(dto.tipo_atencion),
          visto: 0,
          statusAtencion: 0,
          activo: 1,
          notificacion: 1,
        }),
      ),
    );

    if (!dto.preregistro) {
      await this.crearEventoAgenda(registro);
    }

    return this.detalle(registro.id);
  }

  /** Autoriza un preregistro y lo libera a las bandejas de entrada. */
  async autorizarPreregistro(id: number) {
    const registro = await this.registros.findOne({ where: { id } });
    if (!registro) {
      throw new NotFoundException('El preregistro no existe.');
    }

    await this.registros.update(id, { status_envio: ESTADO_ENVIO.LIBERADO });
    await this.crearEventoAgenda(registro);

    return { message: 'El preregistro fue autorizado.' };
  }

  /** Rechaza un preregistro dándolo de baja (RegistroController@rechazaPre). */
  async rechazarPreregistro(id: number) {
    const resultado = await this.registros.update(id, { status: 0, activo: 0 });

    if (!resultado.affected) {
      throw new NotFoundException('El preregistro no existe.');
    }

    return { message: 'El preregistro fue rechazado.' };
  }

  async marcarVisto(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atencionPropia(user, atencionId);

    if (!atencion.visto) {
      await this.atenciones.update(atencion.id, { visto: 1 });
    }

    return { message: 'Solicitud marcada como vista.' };
  }

  /** Cierra el turno (BusquedasController@terminarTurno). */
  async atender(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atencionPropia(user, atencionId);

    await this.atenciones.update(atencion.id, {
      statusAtencion: 1,
      fechaCierre: new Date().toISOString().slice(0, 10),
      visto: 1,
    });

    return { message: 'La solicitud se marcó como atendida.' };
  }

  /** Búsqueda de folios (BusquedasController@BuscarFolios). */
  async buscarFolios(user: AuthenticatedUser, filtro: FiltroSolicitudesDto) {
    const query = this.registros
      .createQueryBuilder('r')
      .where('r.status = 1')
      .andWhere('r.user_registro = :id', { id: user.id });

    this.aplicarFiltros(query, filtro);

    const [data, total] = await query
      .orderBy('r.created_at', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    return paginate(data, total, filtro);
  }

  async resumen(user: AuthenticatedUser) {
    const [pendientes, sinVer, registradas, preregistros] = await Promise.all([
      this.atenciones.count({ where: { user_rfc: user.rfc, statusAtencion: 0, activo: 1 } }),
      this.atenciones.count({ where: { user_rfc: user.rfc, visto: 0, activo: 1 } }),
      this.registros.count({ where: { user_registro: user.id, status: 1 } }),
      this.registros.count({
        where: {
          user_registro: user.id,
          status: 1,
          status_envio: ESTADO_ENVIO.PREREGISTRO,
        },
      }),
    ]);

    const vencidas = await this.atenciones
      .createQueryBuilder('a')
      .innerJoin('a.registro', 'r')
      .where('a.user_rfc = :rfc', { rfc: user.rfc })
      .andWhere('a.activo = 1')
      .andWhere('a.statusAtencion = 0')
      .andWhere('r.fecha_limite_atencion < CURDATE()')
      .getCount();

    return { pendientes, sinVer, registradas, preregistros, vencidas };
  }

  private async atencionPropia(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atenciones.findOne({
      where: { id: atencionId, user_rfc: user.rfc },
    });

    if (!atencion) {
      throw new NotFoundException('La solicitud no está turnada a tu bandeja.');
    }

    return atencion;
  }

  /** El color distingue lo urgente de lo ordinario, igual que en el original. */
  private async crearEventoAgenda(registro: Registro) {
    if (!registro.fecha_limite_atencion) {
      return;
    }

    await this.agendas.save(
      this.agendas.create({
        registro_id: registro.id,
        title: registro.folio,
        descripcion: registro.titulo_doc,
        start: new Date(`${registro.fecha_limite_atencion}T00:00:00`),
        end: new Date(`${registro.fecha_limite_atencion}T23:59:59`),
        empieza: registro.fecha_limite_atencion,
        termina: registro.fecha_limite_atencion,
        hora: '00:00:00',
        color: registro.tipo_atencion === 1 ? '#F8D720' : '#F78300',
        status: 1,
      }),
    );
  }

  private diasRestantes(fechaLimite: string | null): number | null {
    if (!fechaLimite) {
      return null;
    }

    const limite = new Date(`${fechaLimite}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return Math.round((limite.getTime() - hoy.getTime()) / 86_400_000);
  }

  private async siguienteFolio(): Promise<string> {
    const anio = new Date().getFullYear();
    const total = await this.registros
      .createQueryBuilder('r')
      .where('YEAR(r.created_at) = :anio', { anio })
      .getCount();

    return `${anio}-${String(total + 1).padStart(5, '0')}`;
  }

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

  private aplicarFiltros(
    query: SelectQueryBuilder<Registro> | SelectQueryBuilder<RegistroAtencion>,
    filtro: FiltroSolicitudesDto,
  ) {
    if (filtro.search) {
      query.andWhere('(r.folio LIKE :search OR r.titulo_doc LIKE :search)', {
        search: `%${filtro.search}%`,
      });
    }
    if (filtro.tipo_atencion) {
      query.andWhere('r.tipo_atencion = :tipo', { tipo: filtro.tipo_atencion });
    }
    if (filtro.desde && filtro.hasta) {
      query.andWhere('r.fecha_recepcion BETWEEN :desde AND :hasta', {
        desde: filtro.desde,
        hasta: filtro.hasta,
      });
    }
  }
}
