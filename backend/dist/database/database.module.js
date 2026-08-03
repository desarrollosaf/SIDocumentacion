"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.SAF_ENTITIES = exports.DOC_ENTITIES = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_1 = require("../config/configuration");
const agenda_entity_1 = require("../entities/doc/agenda.entity");
const atencion_doc_entity_1 = require("../entities/doc/atencion-doc.entity");
const firma_doc_entity_1 = require("../entities/doc/firma-doc.entity");
const catalogos_entity_1 = require("../entities/doc/catalogos.entity");
const registro_atencion_entity_1 = require("../entities/doc/registro-atencion.entity");
const registro_doc_entity_1 = require("../entities/doc/registro-doc.entity");
const registro_entity_1 = require("../entities/doc/registro.entity");
const role_entity_1 = require("../entities/doc/role.entity");
const seccion_entity_1 = require("../entities/doc/seccion.entity");
const serie_entity_1 = require("../entities/doc/serie.entity");
const sub_serie_entity_1 = require("../entities/doc/sub-serie.entity");
const subfondo_entity_1 = require("../entities/doc/subfondo.entity");
const departamento_entity_1 = require("../entities/saf/departamento.entity");
const dependencia_entity_1 = require("../entities/saf/dependencia.entity");
const direccion_entity_1 = require("../entities/saf/direccion.entity");
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
const user_entity_1 = require("../entities/saf/user.entity");
exports.DOC_ENTITIES = [
    agenda_entity_1.Agenda,
    atencion_doc_entity_1.AtencionDoc,
    firma_doc_entity_1.FirmaDoc,
    role_entity_1.ModelHasRole,
    registro_entity_1.Registro,
    registro_atencion_entity_1.RegistroAtencion,
    registro_doc_entity_1.RegistroDoc,
    role_entity_1.Role,
    seccion_entity_1.Seccion,
    serie_entity_1.Serie,
    sub_serie_entity_1.SubSerie,
    subfondo_entity_1.Subfondo,
    catalogos_entity_1.TipoAtencion,
    catalogos_entity_1.TipoDoc,
];
exports.SAF_ENTITIES = [
    departamento_entity_1.Departamento,
    dependencia_entity_1.Dependencia,
    direccion_entity_1.Direccion,
    servidor_publico_entity_1.ServidorPublico,
    user_entity_1.User,
];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST', '127.0.0.1'),
                    port: parseInt(config.get('DB_PORT', '3306'), 10),
                    database: config.get('DB_DATABASE', 'documentacion'),
                    username: config.get('DB_USERNAME', 'root'),
                    password: config.get('DB_PASSWORD', ''),
                    entities: exports.DOC_ENTITIES,
                    synchronize: false,
                    timezone: 'Z',
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: configuration_1.SAF_CONNECTION,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    name: configuration_1.SAF_CONNECTION,
                    type: 'mysql',
                    host: config.get('DB_SAF_HOST', '127.0.0.1'),
                    port: parseInt(config.get('DB_SAF_PORT', '3306'), 10),
                    database: config.get('DB_SAF_DATABASE', 'adminplem_saf'),
                    username: config.get('DB_SAF_USERNAME', 'root'),
                    password: config.get('DB_SAF_PASSWORD', ''),
                    entities: exports.SAF_ENTITIES,
                    synchronize: false,
                    timezone: 'Z',
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map