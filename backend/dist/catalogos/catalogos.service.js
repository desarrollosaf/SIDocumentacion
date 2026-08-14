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
exports.CatalogosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configuration_1 = require("../config/configuration");
const catalogos_entity_1 = require("../entities/doc/catalogos.entity");
const seccion_entity_1 = require("../entities/doc/seccion.entity");
const serie_entity_1 = require("../entities/doc/serie.entity");
const sub_serie_entity_1 = require("../entities/doc/sub-serie.entity");
const subfondo_entity_1 = require("../entities/doc/subfondo.entity");
const departamento_entity_1 = require("../entities/saf/departamento.entity");
const dependencia_entity_1 = require("../entities/saf/dependencia.entity");
const direccion_entity_1 = require("../entities/saf/direccion.entity");
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
const tipo_apoyo_entity_1 = require("../entities/doc/tipo-apoyo.entity");
let CatalogosService = class CatalogosService {
    secciones;
    series;
    subseries;
    subfondos;
    tiposDoc;
    tiposAtencion;
    tiposApoyo;
    servidores;
    dependencias;
    direcciones;
    departamentos;
    constructor(secciones, series, subseries, subfondos, tiposDoc, tiposAtencion, tiposApoyo, servidores, dependencias, direcciones, departamentos) {
        this.secciones = secciones;
        this.series = series;
        this.subseries = subseries;
        this.subfondos = subfondos;
        this.tiposDoc = tiposDoc;
        this.tiposAtencion = tiposAtencion;
        this.tiposApoyo = tiposApoyo;
        this.servidores = servidores;
        this.dependencias = dependencias;
        this.direcciones = direcciones;
        this.departamentos = departamentos;
    }
    async listarSecciones() {
        const filas = await this.secciones.find({
            where: { status: 1 },
            order: { codigo: 'ASC' },
        });
        return filas.map((s) => this.aOpcion(s.id, s.codigo, s.seccion));
    }
    async listarSeries(seccionId) {
        const filas = await this.series.find({
            where: { status: 1, ...(seccionId ? { idSeccion: seccionId } : {}) },
            order: { codigo: 'ASC' },
        });
        return filas.map((s) => this.aOpcion(s.id, s.codigo, s.serie));
    }
    async listarSubseries(serieId) {
        const filas = await this.subseries.find({
            where: { status: 1, ...(serieId ? { idSerie: serieId } : {}) },
            order: { codigo: 'ASC' },
        });
        return filas.map((s) => this.aOpcion(s.id, s.codigo, s.subserie));
    }
    async listarSubfondos() {
        const filas = await this.subfondos.find({ order: { codigo: 'ASC' } });
        return filas.map((s) => this.aOpcion(s.id, s.codigo, s.subfondo));
    }
    async listarTiposDoc() {
        const filas = await this.tiposDoc.find({
            where: { status: 1 },
            order: { tipo_doc: 'ASC' },
        });
        return filas.map((t) => ({ id: t.id, nombre: t.tipo_doc ?? '' }));
    }
    async listarTiposAtencion() {
        const filas = await this.tiposAtencion.find({ order: { id: 'ASC' } });
        return filas.map((t) => ({ id: t.id, nombre: t.tipo ?? '' }));
    }
    async listarDependencias() {
        const filas = await this.dependencias.find({ order: { nombre_completo: 'ASC' } });
        return filas.map((d) => ({
            id: d.id_Dependencia,
            nombre: d.nombre_completo ?? d.Nombre ?? '',
        }));
    }
    async listarDirecciones(dependenciaId) {
        const filas = await this.direcciones.find({
            where: dependenciaId ? { id_Dependencia: dependenciaId } : {},
            order: { nombre_completo: 'ASC' },
        });
        return filas.map((d) => ({
            id: d.id_Direccion,
            nombre: d.nombre_completo ?? d.Nombre ?? '',
        }));
    }
    async listarDepartamentos(direccionId) {
        const filas = await this.departamentos.find({
            where: direccionId ? { id_Direccion: direccionId } : {},
            order: { nombre_completo: 'ASC' },
        });
        return filas.map((d) => ({
            id: d.id_Departamento,
            nombre: d.nombre_completo ?? d.Nombre ?? '',
        }));
    }
    async buscarServidores(termino, excluirRfc) {
        if (!termino || termino.trim().length < 3) {
            return [];
        }
        const servidores = await this.servidores.find({
            where: { Nombre: (0, typeorm_2.Like)(`%${termino.trim()}%`) },
            relations: { dependencia: true, direccion: true, departamento: true },
            take: 25,
            order: { Nombre: 'ASC' },
        });
        return servidores
            .filter((s) => s.N_Usuario && s.N_Usuario !== excluirRfc)
            .map((s) => ({
            rfc: s.N_Usuario,
            nombre: s.Nombre ?? 'Usuario no identificado',
            dependencia: s.dependencia?.nombre_completo ?? null,
            direccion: s.direccion?.nombre_completo ?? null,
            departamento: s.departamento?.nombre_completo ?? null,
        }));
    }
    async clasificacionDeMiArea(user) {
        const propias = user.id_Departamento
            ? await this.series.find({
                where: { status: 1, departamento_id: user.id_Departamento },
                relations: { subseries: true },
                order: { codigo: 'ASC' },
            })
            : [];
        const series = propias.length
            ? propias
            : await this.series.find({
                where: { status: 1 },
                relations: { subseries: true },
                order: { codigo: 'ASC' },
            });
        return series.map((serie) => ({
            ...this.aOpcion(serie.id, serie.codigo, serie.serie),
            subseries: (serie.subseries ?? [])
                .filter((sub) => sub.status === 1)
                .map((sub) => this.aOpcion(sub.id, sub.codigo, sub.subserie)),
        }));
    }
    aOpcion(id, codigo, nombre) {
        return {
            id,
            nombre: codigo ? `${codigo} — ${nombre ?? ''}` : (nombre ?? ''),
        };
    }
    async tipoApoyo() {
        const filas = await this.tiposApoyo.find({
            relations: { docsApoyo: true },
        });
        const result = filas.map((t) => ({
            id: t.id,
            tipo: t.tipo ?? '',
            docsApoyo: (t.docsApoyo ?? []).map((d) => ({
                id: d.id,
                tipo: d.tipo ?? '',
            })),
        }));
        return result;
    }
};
exports.CatalogosService = CatalogosService;
exports.CatalogosService = CatalogosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seccion_entity_1.Seccion)),
    __param(1, (0, typeorm_1.InjectRepository)(serie_entity_1.Serie)),
    __param(2, (0, typeorm_1.InjectRepository)(sub_serie_entity_1.SubSerie)),
    __param(3, (0, typeorm_1.InjectRepository)(subfondo_entity_1.Subfondo)),
    __param(4, (0, typeorm_1.InjectRepository)(catalogos_entity_1.TipoDoc)),
    __param(5, (0, typeorm_1.InjectRepository)(catalogos_entity_1.TipoAtencion)),
    __param(6, (0, typeorm_1.InjectRepository)(tipo_apoyo_entity_1.TipoApoyo)),
    __param(7, (0, typeorm_1.InjectRepository)(servidor_publico_entity_1.ServidorPublico, configuration_1.SAF_CONNECTION)),
    __param(8, (0, typeorm_1.InjectRepository)(dependencia_entity_1.Dependencia, configuration_1.SAF_CONNECTION)),
    __param(9, (0, typeorm_1.InjectRepository)(direccion_entity_1.Direccion, configuration_1.SAF_CONNECTION)),
    __param(10, (0, typeorm_1.InjectRepository)(departamento_entity_1.Departamento, configuration_1.SAF_CONNECTION)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CatalogosService);
//# sourceMappingURL=catalogos.service.js.map