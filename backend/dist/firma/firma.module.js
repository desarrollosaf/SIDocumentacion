"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const firma_doc_entity_1 = require("../entities/doc/firma-doc.entity");
const registro_doc_entity_1 = require("../entities/doc/registro-doc.entity");
const feplem_client_1 = require("./feplem.client");
const firma_controller_1 = require("./firma.controller");
const firma_service_1 = require("./firma.service");
let FirmaModule = class FirmaModule {
};
exports.FirmaModule = FirmaModule;
exports.FirmaModule = FirmaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([registro_doc_entity_1.RegistroDoc, firma_doc_entity_1.FirmaDoc]), auth_module_1.AuthModule],
        controllers: [firma_controller_1.FirmaController],
        providers: [firma_service_1.FirmaService, feplem_client_1.FeplemClient],
    })
], FirmaModule);
//# sourceMappingURL=firma.module.js.map