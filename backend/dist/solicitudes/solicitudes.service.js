"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudesService = exports.ESTADO_ENVIO = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configuration_1 = require("../config/configuration");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const agenda_entity_1 = require("../entities/doc/agenda.entity");
const registro_atencion_entity_1 = require("../entities/doc/registro-atencion.entity");
const registro_entity_1 = require("../entities/doc/registro.entity");
Object.defineProperty(exports, "ESTADO_ENVIO", { enumerable: true, get: function () { return registro_entity_1.ESTADO_ENVIO; } });
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
let SolicitudesService = class SolicitudesService {
    registros;
    atenciones;
    agendas;
    servidores;
    constructor(registros, atenciones, agendas, servidores) {
        this.registros = registros;
        this.atenciones = atenciones;
        this.agendas = agendas;
        this.servidores = servidores;
    }
    async bandejaEntrada(user, filtro) {
        const query = this.atenciones
            .createQueryBuilder('a')
            .innerJoinAndSelect('a.registro', 'r')
            .where('a.user_rfc = :rfc', { rfc: user.rfc })
            .andWhere('a.activo = 1')
            .andWhere('r.status_envio = :liberado', { liberado: registro_entity_1.ESTADO_ENVIO.LIBERADO });
        if (filtro.estado === 'pendientes') {
            query.andWhere('a.statusAtencion = 0');
        }
        else if (filtro.estado === 'atendidos') {
            query.andWhere('a.statusAtencion = 1');
        }
        this.aplicarFiltros(query, filtro);
        const [rows, total] = await query
            .orderBy('r.fecha_limite_atencion', 'ASC')
            .addOrderBy('a.created_at', 'DESC')
            .skip((filtro.page - 1) * filtro.perPage)
            .take(filtro.perPage)
            .getManyAndCount();
        const nombres = await this.nombresPorRfc(rows.flatMap((row) => [row.user_turna ?? '', row.registro?.remitente_rfc ?? '']));
        const data = rows.map((row) => ({
            id: row.registro.id,
            atencion_id: row.id,
            folio: row.registro.folio,
            titulo_doc: row.registro.titulo_doc,
            tipo_atencion: row.registro.tipo_atencion,
            fecha_recepcion: row.registro.fecha_recepcion,
            fecha_limite_atencion: row.registro.fecha_limite_atencion,
            dias_restantes: this.diasRestantes(row.registro.fecha_limite_atencion),
            visto: !!row.visto,
            atendido: !!row.statusAtencion,
            contraparte: nombres.get(row.user_turna ?? '') ??
                row.registro?.nombre_remitente ??
                nombres.get(row.registro?.remitente_rfc ?? '') ??
                'Usuario no identificado',
            created_at: row.created_at,
        }));
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    async bandejaSalida(user, filtro, soloPreregistro = false) {
        const query = this.registros
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.atenciones', 'a')
            .where('r.user_registro = :id', { id: user.id })
            .andWhere('r.status = 1');
        if (soloPreregistro) {
            query.andWhere('r.status_envio = :estado', { estado: registro_entity_1.ESTADO_ENVIO.PREREGISTRO });
        }
        else {
            query.andWhere('r.status_envio <> :preregistro', {
                preregistro: registro_entity_1.ESTADO_ENVIO.PREREGISTRO,
            });
            if (filtro.estado === 'atendidos' || filtro.estado === 'pendientes') {
                const existePendiente = `EXISTS (
          SELECT 1 FROM registro_atencions ra
          WHERE ra.registro_id = r.id AND ra.activo = 1 AND ra.statusAtencion = 0
        )`;
                query.andWhere(filtro.estado === 'atendidos' ? `NOT ${existePendiente}` : existePendiente);
            }
        }
        this.aplicarFiltros(query, filtro);
        const [rows, total] = await query
            .orderBy('r.created_at', 'DESC')
            .skip((filtro.page - 1) * filtro.perPage)
            .take(filtro.perPage)
            .getManyAndCount();
        const nombres = await this.nombresPorRfc(rows.flatMap((r) => (r.atenciones ?? []).map((a) => a.user_rfc)));
        const data = rows.map((registro) => {
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
                contraparte: turnos.map((t) => nombres.get(t.user_rfc) ?? t.user_rfc).join(', ') || 'Sin turnar',
                created_at: registro.created_at,
            };
        });
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    preregistros(user, filtro) {
        return this.bandejaSalida(user, filtro, true);
    }
    async detalle(id) {
        const registro = await this.registros.findOne({
            where: { id },
            relations: { atenciones: true, serie: true },
        });
        if (!registro) {
            throw new common_1.NotFoundException('La solicitud no existe.');
        }
        const nombres = await this.nombresPorRfc([
            ...(registro.atenciones ?? []).flatMap((a) => [a.user_rfc, a.user_turna ?? '']),
            registro.remitente_rfc,
        ]);
        return {
            ...registro,
            remitente: registro.nombre_remitente ??
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
    async crear(user, dto) {
        const registro = await this.registros.save(this.registros.create({
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
            status_envio: dto.preregistro ? registro_entity_1.ESTADO_ENVIO.PREREGISTRO : registro_entity_1.ESTADO_ENVIO.LIBERADO,
        }));
        await this.atenciones.save(dto.turnos.map((turno) => this.atenciones.create({
            registro_id: registro.id,
            user_rfc: turno.user_rfc,
            user_turna: user.rfc,
            indicaciones_turno: turno.instruccion ?? null,
            tipoAtencion: String(dto.tipo_atencion),
            visto: 0,
            statusAtencion: 0,
            activo: 1,
            notificacion: 1,
        })));
        if (!dto.preregistro) {
            await this.crearEventoAgenda(registro);
        }
        return this.detalle(registro.id);
    }
    async autorizarPreregistro(id) {
        const registro = await this.registros.findOne({ where: { id } });
        if (!registro) {
            throw new common_1.NotFoundException('El preregistro no existe.');
        }
        await this.registros.update(id, { status_envio: registro_entity_1.ESTADO_ENVIO.LIBERADO });
        await this.crearEventoAgenda(registro);
        return { message: 'El preregistro fue autorizado.' };
    }
    async rechazarPreregistro(id) {
        const resultado = await this.registros.update(id, { status: 0, activo: 0 });
        if (!resultado.affected) {
            throw new common_1.NotFoundException('El preregistro no existe.');
        }
        return { message: 'El preregistro fue rechazado.' };
    }
    async marcarVisto(user, atencionId) {
        const atencion = await this.atencionPropia(user, atencionId);
        if (!atencion.visto) {
            await this.atenciones.update(atencion.id, { visto: 1 });
        }
        return { message: 'Solicitud marcada como vista.' };
    }
    async atender(user, atencionId) {
        const atencion = await this.atencionPropia(user, atencionId);
        await this.atenciones.update(atencion.id, {
            statusAtencion: 1,
            fechaCierre: new Date().toISOString().slice(0, 10),
            visto: 1,
        });
        return { message: 'La solicitud se marcó como atendida.' };
    }
    async buscarFolios(user, filtro) {
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
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    async resumen(user) {
        const [pendientes, sinVer, registradas, preregistros] = await Promise.all([
            this.atenciones.count({ where: { user_rfc: user.rfc, statusAtencion: 0, activo: 1 } }),
            this.atenciones.count({ where: { user_rfc: user.rfc, visto: 0, activo: 1 } }),
            this.registros.count({ where: { user_registro: user.id, status: 1 } }),
            this.registros.count({
                where: {
                    user_registro: user.id,
                    status: 1,
                    status_envio: registro_entity_1.ESTADO_ENVIO.PREREGISTRO,
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
    async atencionPropia(user, atencionId) {
        const atencion = await this.atenciones.findOne({
            where: { id: atencionId, user_rfc: user.rfc },
        });
        if (!atencion) {
            throw new common_1.NotFoundException('La solicitud no está turnada a tu bandeja.');
        }
        return atencion;
    }
    async crearEventoAgenda(registro) {
        if (!registro.fecha_limite_atencion) {
            return;
        }
        await this.agendas.save(this.agendas.create({
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
        }));
    }
    diasRestantes(fechaLimite) {
        if (!fechaLimite) {
            return null;
        }
        const limite = new Date(`${fechaLimite}T00:00:00`);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return Math.round((limite.getTime() - hoy.getTime()) / 86_400_000);
    }
    async siguienteFolio() {
        const anio = new Date().getFullYear();
        const total = await this.registros
            .createQueryBuilder('r')
            .where('YEAR(r.created_at) = :anio', { anio })
            .getCount();
        return `${anio}-${String(total + 1).padStart(5, '0')}`;
    }
    async nombresPorRfc(rfcs) {
        const unicos = [...new Set(rfcs.filter(Boolean))];
        if (!unicos.length) {
            return new Map();
        }
        const servidores = await this.servidores.find({ where: { N_Usuario: (0, typeorm_2.In)(unicos) } });
        return new Map(servidores.map((s) => [s.N_Usuario, s.Nombre ?? 'Usuario no identificado']));
    }
    aplicarFiltros(query, filtro) {
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
};
exports.SolicitudesService = SolicitudesService;
exports.SolicitudesService = SolicitudesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_entity_1.Registro)),
    __param(1, (0, typeorm_1.InjectRepository)(registro_atencion_entity_1.RegistroAtencion)),
    __param(2, (0, typeorm_1.InjectRepository)(agenda_entity_1.Agenda)),
    __param(3, (0, typeorm_1.InjectRepository)(servidor_publico_entity_1.ServidorPublico, configuration_1.SAF_CONNECTION)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SolicitudesService);
//# sourceMappingURL=solicitudes.service.js.map