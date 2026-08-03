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
exports.RegistroAtencion = void 0;
const typeorm_1 = require("typeorm");
const registro_entity_1 = require("./registro.entity");
let RegistroAtencion = class RegistroAtencion {
    id;
    registro_id;
    user_rfc;
    user_turna;
    indicaciones_turno;
    visto;
    statusAtencion;
    fechaCierre;
    tipoAtencion;
    activo;
    notificacion;
    id_atencion;
    serie_id;
    subserie_id;
    expediente_id;
    created_at;
    updated_at;
    registro;
};
exports.RegistroAtencion = RegistroAtencion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RegistroAtencion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "registro_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], RegistroAtencion.prototype, "user_rfc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "user_turna", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "indicaciones_turno", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], RegistroAtencion.prototype, "visto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], RegistroAtencion.prototype, "statusAtencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "fechaCierre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], RegistroAtencion.prototype, "tipoAtencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], RegistroAtencion.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], RegistroAtencion.prototype, "notificacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "id_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "serie_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "subserie_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "expediente_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => registro_entity_1.Registro, (registro) => registro.atenciones, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'registro_id' }),
    __metadata("design:type", Object)
], RegistroAtencion.prototype, "registro", void 0);
exports.RegistroAtencion = RegistroAtencion = __decorate([
    (0, typeorm_1.Entity)({ name: 'registro_atencions' })
], RegistroAtencion);
//# sourceMappingURL=registro-atencion.entity.js.map