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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expedientes = void 0;
const typeorm_1 = require("typeorm");
let Expedientes = class Expedientes {
    id;
    id_serie;
    id_subserie;
    nombre_ex;
    status;
    fecha_cierre_exp;
    anio;
    id_tipo_expediente;
    rfc_usuario_expediente;
    id_solicitud_transferencia;
    created_at;
    updated_at;
};
exports.Expedientes = Expedientes;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Expedientes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "id_serie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "id_subserie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "nombre_ex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Object)
], Expedientes.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "fecha_cierre_exp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "id_tipo_expediente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "rfc_usuario_expediente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "id_solicitud_transferencia", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Expedientes.prototype, "updated_at", void 0);
exports.Expedientes = Expedientes = __decorate([
    (0, typeorm_1.Entity)({ name: 'expediente_serie_subses' })
], Expedientes);
//# sourceMappingURL=expedientes.entity.js.map