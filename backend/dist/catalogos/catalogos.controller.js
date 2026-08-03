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
exports.CatalogosController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const catalogos_service_1 = require("./catalogos.service");
let CatalogosController = class CatalogosController {
    catalogos;
    constructor(catalogos) {
        this.catalogos = catalogos;
    }
    secciones() {
        return this.catalogos.listarSecciones();
    }
    series(seccion) {
        return this.catalogos.listarSeries(seccion ? Number(seccion) : undefined);
    }
    subseries(serie) {
        return this.catalogos.listarSubseries(serie ? Number(serie) : undefined);
    }
    subfondos() {
        return this.catalogos.listarSubfondos();
    }
    tiposDocumento() {
        return this.catalogos.listarTiposDoc();
    }
    tiposAtencion() {
        return this.catalogos.listarTiposAtencion();
    }
    dependencias() {
        return this.catalogos.listarDependencias();
    }
    direcciones(dependencia) {
        return this.catalogos.listarDirecciones(dependencia ? Number(dependencia) : undefined);
    }
    departamentos(direccion) {
        return this.catalogos.listarDepartamentos(direccion ? Number(direccion) : undefined);
    }
    miClasificacion(user) {
        return this.catalogos.clasificacionDeMiArea(user);
    }
    servidores(user, q = '') {
        return this.catalogos.buscarServidores(q, user.rfc);
    }
};
exports.CatalogosController = CatalogosController;
__decorate([
    (0, common_1.Get)('secciones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "secciones", null);
__decorate([
    (0, common_1.Get)('series'),
    __param(0, (0, common_1.Query)('seccion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "series", null);
__decorate([
    (0, common_1.Get)('subseries'),
    __param(0, (0, common_1.Query)('serie')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "subseries", null);
__decorate([
    (0, common_1.Get)('subfondos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "subfondos", null);
__decorate([
    (0, common_1.Get)('tipos-documento'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "tiposDocumento", null);
__decorate([
    (0, common_1.Get)('tipos-atencion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "tiposAtencion", null);
__decorate([
    (0, common_1.Get)('dependencias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "dependencias", null);
__decorate([
    (0, common_1.Get)('direcciones'),
    __param(0, (0, common_1.Query)('dependencia')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "direcciones", null);
__decorate([
    (0, common_1.Get)('departamentos'),
    __param(0, (0, common_1.Query)('direccion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "departamentos", null);
__decorate([
    (0, common_1.Get)('mi-clasificacion'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "miClasificacion", null);
__decorate([
    (0, common_1.Get)('servidores'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogosController.prototype, "servidores", null);
exports.CatalogosController = CatalogosController = __decorate([
    (0, common_1.Controller)('catalogos'),
    __metadata("design:paramtypes", [catalogos_service_1.CatalogosService])
], CatalogosController);
//# sourceMappingURL=catalogos.controller.js.map