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
exports.OficiosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configuration_1 = require("../config/configuration");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const atencion_doc_entity_1 = require("../entities/doc/atencion-doc.entity");
const registro_doc_entity_1 = require("../entities/doc/registro-doc.entity");
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
let OficiosService = class OficiosService {
    registros;
    atenciones;
    servidores;
    constructor(registros, atenciones, servidores) {
        this.registros = registros;
        this.atenciones = atenciones;
        this.servidores = servidores;
    }
    async bandejaEntrada(user, filtro) {
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
        const remitentes = await this.nombresPorRfc(rows.map((row) => row.registroDoc?.rfc_registro).filter((rfc) => !!rfc));
        const data = rows.map((row) => ({
            id: row.registroDoc.id,
            atencion_id: row.id,
            folio: row.registroDoc.folio,
            titulo_doc: row.registroDoc.titulo_doc,
            fojas: row.registroDoc.fojas,
            firmado: !!row.registroDoc.firmado,
            tipo_atencion: row.tipo_atencion,
            visto: !!row.visto,
            atendido: !!row.status_atencion,
            fecha_visto: row.fecha_visto,
            fecha_atencion: row.fecha_atencion,
            created_at: row.created_at,
            contraparte: remitentes.get(row.registroDoc.rfc_registro ?? '') ?? 'Usuario no identificado',
        }));
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    async bandejaSalida(user, filtro) {
        const query = this.registros
            .createQueryBuilder('doc')
            .leftJoinAndSelect('doc.destinatarios', 'a')
            .where('doc.rfc_registro = :rfc', { rfc: user.rfc })
            .andWhere('doc.activo = 1');
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
        const nombres = await this.nombresPorRfc(rows.flatMap((doc) => (doc.destinatarios ?? []).map((d) => d.rfc_atencion)));
        const data = rows.map((doc) => {
            const destinatarios = doc.destinatarios ?? [];
            return {
                id: doc.id,
                atencion_id: null,
                folio: doc.folio,
                titulo_doc: doc.titulo_doc,
                fojas: doc.fojas,
                firmado: !!doc.firmado,
                tipo_atencion: null,
                visto: destinatarios.length > 0 && destinatarios.every((d) => !!d.visto),
                atendido: destinatarios.length > 0 && destinatarios.every((d) => !!d.status_atencion),
                fecha_visto: null,
                fecha_atencion: null,
                created_at: doc.created_at,
                contraparte: destinatarios
                    .map((d) => nombres.get(d.rfc_atencion) ?? d.rfc_atencion)
                    .join(', ') || 'Sin destinatarios',
            };
        });
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    async detalle(id) {
        const doc = await this.registros.findOne({
            where: { id },
            relations: { destinatarios: true },
        });
        if (!doc) {
            throw new common_1.NotFoundException('El oficio solicitado no existe.');
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
    async crear(user, dto) {
        const doc = await this.registros.save(this.registros.create({
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
        }));
        await this.atenciones.save(dto.destinatarios.map((destinatario) => this.atenciones.create({
            id_registro_doc: doc.id,
            rfc_atencion: destinatario.rfc_atencion,
            tipo_atencion: destinatario.tipo_atencion,
            visto: 0,
            status_atencion: 0,
            activo: 1,
        })));
        return this.detalle(doc.id);
    }
    async marcarVisto(user, atencionId) {
        const atencion = await this.atencionPropia(user, atencionId);
        if (!atencion.visto) {
            await this.atenciones.update(atencion.id, { visto: 1, fecha_visto: new Date() });
        }
        return { message: 'Oficio marcado como visto.' };
    }
    async atender(user, atencionId) {
        const atencion = await this.atencionPropia(user, atencionId);
        await this.atenciones.update(atencion.id, {
            status_atencion: 1,
            fecha_atencion: new Date(),
            visto: 1,
            fecha_visto: atencion.fecha_visto ?? new Date(),
        });
        return { message: 'El oficio se marcó como atendido.' };
    }
    async resumen(user) {
        const [entradaPendientes, entradaSinVer, salidaTotal] = await Promise.all([
            this.atenciones.count({
                where: { rfc_atencion: user.rfc, status_atencion: 0, activo: 1 },
            }),
            this.atenciones.count({ where: { rfc_atencion: user.rfc, visto: 0, activo: 1 } }),
            this.registros.count({ where: { rfc_registro: user.rfc, activo: 1 } }),
        ]);
        return { entradaPendientes, entradaSinVer, salidaTotal };
    }
    async atencionPropia(user, atencionId) {
        const atencion = await this.atenciones.findOne({
            where: { id: atencionId, rfc_atencion: user.rfc },
        });
        if (!atencion) {
            throw new common_1.NotFoundException('El oficio no está dirigido a tu bandeja.');
        }
        return atencion;
    }
    async siguienteFolio() {
        const anio = new Date().getFullYear();
        const total = await this.registros
            .createQueryBuilder('doc')
            .where('YEAR(doc.created_at) = :anio', { anio })
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
    aplicarEstado(query, estado, campo) {
        if (estado === 'pendientes') {
            query.andWhere(`${campo} = 0`);
        }
        else if (estado === 'atendidos') {
            query.andWhere(`${campo} = 1`);
        }
    }
    aplicarFiltrosComunes(query, filtro, alias) {
        if (filtro.search) {
            query.andWhere(`(${alias}.folio LIKE :search OR ${alias}.titulo_doc LIKE :search)`, { search: `%${filtro.search}%` });
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
};
exports.OficiosService = OficiosService;
exports.OficiosService = OficiosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_doc_entity_1.RegistroDoc)),
    __param(1, (0, typeorm_1.InjectRepository)(atencion_doc_entity_1.AtencionDoc)),
    __param(2, (0, typeorm_1.InjectRepository)(servidor_publico_entity_1.ServidorPublico, configuration_1.SAF_CONNECTION)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OficiosService);
//# sourceMappingURL=oficios.service.js.map