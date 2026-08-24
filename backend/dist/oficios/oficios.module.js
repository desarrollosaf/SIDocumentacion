"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OficiosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_1 = require("../config/configuration");
const atencion_doc_entity_1 = require("../entities/doc/atencion-doc.entity");
const registro_doc_entity_1 = require("../entities/doc/registro-doc.entity");
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
const oficios_controller_1 = require("./oficios.controller");
const oficios_service_1 = require("./oficios.service");
const axios_1 = require("@nestjs/axios");
const expedientes_entity_1 = require("../entities/doc/expedientes.entity");
let OficiosModule = class OficiosModule {
};
exports.OficiosModule = OficiosModule;
exports.OficiosModule = OficiosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([registro_doc_entity_1.RegistroDoc, atencion_doc_entity_1.AtencionDoc, expedientes_entity_1.Expedientes]),
            typeorm_1.TypeOrmModule.forFeature([servidor_publico_entity_1.ServidorPublico], configuration_1.SAF_CONNECTION),
            axios_1.HttpModule
        ],
        controllers: [oficios_controller_1.OficiosController],
        providers: [oficios_service_1.OficiosService],
    })
], OficiosModule);
//# sourceMappingURL=oficios.module.js.map