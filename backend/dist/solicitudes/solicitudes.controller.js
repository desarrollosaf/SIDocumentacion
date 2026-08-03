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
exports.SolicitudesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const crear_solicitud_dto_1 = require("./dto/crear-solicitud.dto");
const filtro_solicitudes_dto_1 = require("./dto/filtro-solicitudes.dto");
const solicitudes_service_1 = require("./solicitudes.service");
let SolicitudesController = class SolicitudesController {
    solicitudes;
    constructor(solicitudes) {
        this.solicitudes = solicitudes;
    }
    resumen(user) {
        return this.solicitudes.resumen(user);
    }
    entrada(user, filtro) {
        return this.solicitudes.bandejaEntrada(user, filtro);
    }
    salida(user, filtro) {
        return this.solicitudes.bandejaSalida(user, filtro);
    }
    preregistro(user, filtro) {
        return this.solicitudes.preregistros(user, filtro);
    }
    folios(user, filtro) {
        return this.solicitudes.buscarFolios(user, filtro);
    }
    detalle(id) {
        return this.solicitudes.detalle(id);
    }
    crear(user, dto) {
        return this.solicitudes.crear(user, dto);
    }
    autorizar(id) {
        return this.solicitudes.autorizarPreregistro(id);
    }
    rechazar(id) {
        return this.solicitudes.rechazarPreregistro(id);
    }
    marcarVisto(user, id) {
        return this.solicitudes.marcarVisto(user, id);
    }
    atender(user, id) {
        return this.solicitudes.atender(user, id);
    }
};
exports.SolicitudesController = SolicitudesController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)('entrada'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filtro_solicitudes_dto_1.FiltroSolicitudesDto]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "entrada", null);
__decorate([
    (0, common_1.Get)('salida'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filtro_solicitudes_dto_1.FiltroSolicitudesDto]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "salida", null);
__decorate([
    (0, common_1.Get)('preregistro'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filtro_solicitudes_dto_1.FiltroSolicitudesDto]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "preregistro", null);
__decorate([
    (0, common_1.Get)('folios'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filtro_solicitudes_dto_1.FiltroSolicitudesDto]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "folios", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "detalle", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, crear_solicitud_dto_1.CrearSolicitudDto]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id/autorizar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "autorizar", null);
__decorate([
    (0, common_1.Patch)(':id/rechazar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "rechazar", null);
__decorate([
    (0, common_1.Patch)('atenciones/:id/visto'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "marcarVisto", null);
__decorate([
    (0, common_1.Patch)('atenciones/:id/atender'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "atender", null);
exports.SolicitudesController = SolicitudesController = __decorate([
    (0, common_1.Controller)('solicitudes'),
    __metadata("design:paramtypes", [solicitudes_service_1.SolicitudesService])
], SolicitudesController);
//# sourceMappingURL=solicitudes.controller.js.map