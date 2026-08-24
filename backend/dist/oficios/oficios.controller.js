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
exports.OficiosController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const crear_oficio_dto_1 = require("./dto/crear-oficio.dto");
const filtro_bandeja_dto_1 = require("./dto/filtro-bandeja.dto");
const oficios_service_1 = require("./oficios.service");
const platform_express_1 = require("@nestjs/platform-express");
let OficiosController = class OficiosController {
    oficios;
    constructor(oficios) {
        this.oficios = oficios;
    }
    resumen(user) {
        return this.oficios.resumen(user);
    }
    entrada(user, filtro) {
        return this.oficios.bandejaEntrada(user, filtro);
    }
    salida(user, filtro) {
        return this.oficios.bandejaSalida(user, filtro);
    }
    detalle(id) {
        return this.oficios.detalle(id);
    }
    validarPsw(user, psw) {
        return this.oficios.validarPsw(user, psw);
    }
    validarFirmado(user, id) {
        return this.oficios.validarFirmado(user, id);
    }
    async verPdf(id, tipo, res) {
        const ruta = await this.oficios.verPdf(id, tipo);
        return res.sendFile(ruta);
    }
    async getExp(id) {
        return this.oficios.getExp(id);
    }
    async firmarDoc(id, psw, user) {
        return this.oficios.firmarDocAcuse(id, psw, user);
    }
    crear(file, user, dto) {
        if (typeof dto.destinatarios === 'string') {
            dto.destinatarios = JSON.parse(dto.destinatarios);
        }
        return this.oficios.crear(user, dto, file);
    }
    marcarVisto(user, id) {
        return this.oficios.marcarVisto(user, id);
    }
    atender(user, id) {
        return this.oficios.atender(user, id);
    }
};
exports.OficiosController = OficiosController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)('entrada'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filtro_bandeja_dto_1.FiltroBandejaDto]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "entrada", null);
__decorate([
    (0, common_1.Get)('salida'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filtro_bandeja_dto_1.FiltroBandejaDto]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "salida", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "detalle", null);
__decorate([
    (0, common_1.Get)('validarPsw/:psw'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('psw')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "validarPsw", null);
__decorate([
    (0, common_1.Get)('validarFirmado/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "validarFirmado", null);
__decorate([
    (0, common_1.Get)('verPdf/:id/:tipo'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('tipo', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], OficiosController.prototype, "verPdf", null);
__decorate([
    (0, common_1.Get)('getExp/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OficiosController.prototype, "getExp", null);
__decorate([
    (0, common_1.Get)('firmarDoc/:id/:psw'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('psw')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], OficiosController.prototype, "firmarDoc", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, crear_oficio_dto_1.CrearOficioDto]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)('atenciones/:id/visto'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "marcarVisto", null);
__decorate([
    (0, common_1.Patch)('atenciones/:id/atender'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], OficiosController.prototype, "atender", null);
exports.OficiosController = OficiosController = __decorate([
    (0, common_1.Controller)('oficios'),
    __metadata("design:paramtypes", [oficios_service_1.OficiosService])
], OficiosController);
//# sourceMappingURL=oficios.controller.js.map