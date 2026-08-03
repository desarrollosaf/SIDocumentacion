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
exports.Registro = exports.ESTADO_ENVIO = void 0;
const typeorm_1 = require("typeorm");
const serie_entity_1 = require("./serie.entity");
const registro_atencion_entity_1 = require("./registro-atencion.entity");
exports.ESTADO_ENVIO = {
    PREREGISTRO: 0,
    VOBO: 2,
    LIBERADO: 4,
};
let Registro = class Registro {
    id;
    folio;
    folio_rastreo;
    fecha_recepcion;
    fecha_documento;
    referencia_documento;
    fecha_limite_atencion;
    hora_atencion;
    tipo_atencion;
    serie_id;
    subserie_id;
    expediente_id;
    titulo_doc;
    descripcion_doc;
    path;
    user_registro;
    remitente_rfc;
    otro_remitente;
    nombre_remitente;
    fojas;
    uuid;
    firmado;
    tipo_doc;
    status_envio;
    rfc_autorizado;
    rfc_vobo;
    status;
    activo;
    created_at;
    updated_at;
    serie;
    atenciones;
};
exports.Registro = Registro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Registro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Registro.prototype, "folio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "folio_rastreo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "fecha_recepcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "fecha_documento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "referencia_documento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Registro.prototype, "fecha_limite_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "hora_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Registro.prototype, "tipo_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Registro.prototype, "serie_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "subserie_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "expediente_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Registro.prototype, "titulo_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext' }),
    __metadata("design:type", String)
], Registro.prototype, "descripcion_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Registro.prototype, "user_registro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Registro.prototype, "remitente_rfc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "otro_remitente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "nombre_remitente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "fojas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "firmado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "tipo_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', nullable: true, default: exports.ESTADO_ENVIO.LIBERADO }),
    __metadata("design:type", Object)
], Registro.prototype, "status_envio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "rfc_autorizado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "rfc_vobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Registro.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Registro.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Registro.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => serie_entity_1.Serie, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'serie_id' }),
    __metadata("design:type", Object)
], Registro.prototype, "serie", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => registro_atencion_entity_1.RegistroAtencion, (atencion) => atencion.registro),
    __metadata("design:type", Array)
], Registro.prototype, "atenciones", void 0);
exports.Registro = Registro = __decorate([
    (0, typeorm_1.Entity)({ name: 'registro' })
], Registro);
//# sourceMappingURL=registro.entity.js.map