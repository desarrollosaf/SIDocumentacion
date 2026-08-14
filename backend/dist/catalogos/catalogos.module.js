"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
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
const catalogos_controller_1 = require("./catalogos.controller");
const catalogos_service_1 = require("./catalogos.service");
const tipo_apoyo_entity_1 = require("../entities/doc/tipo-apoyo.entity");
const docs_tipo_apoyo_entity_1 = require("../entities/doc/docs-tipo-apoyo.entity");
let CatalogosModule = class CatalogosModule {
};
exports.CatalogosModule = CatalogosModule;
exports.CatalogosModule = CatalogosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([seccion_entity_1.Seccion, serie_entity_1.Serie, sub_serie_entity_1.SubSerie, subfondo_entity_1.Subfondo, catalogos_entity_1.TipoDoc, catalogos_entity_1.TipoAtencion, tipo_apoyo_entity_1.TipoApoyo, docs_tipo_apoyo_entity_1.DocTipoApoyo]),
            typeorm_1.TypeOrmModule.forFeature([servidor_publico_entity_1.ServidorPublico, dependencia_entity_1.Dependencia, direccion_entity_1.Direccion, departamento_entity_1.Departamento], configuration_1.SAF_CONNECTION),
        ],
        controllers: [catalogos_controller_1.CatalogosController],
        providers: [catalogos_service_1.CatalogosService],
        exports: [catalogos_service_1.CatalogosService],
    })
], CatalogosModule);
//# sourceMappingURL=catalogos.module.js.map