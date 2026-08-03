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
exports.Serie = void 0;
const typeorm_1 = require("typeorm");
const seccion_entity_1 = require("./seccion.entity");
const sub_serie_entity_1 = require("./sub-serie.entity");
let Serie = class Serie {
    id;
    codigo;
    serie;
    idSeccion;
    departamento_id;
    status;
    anio_tramite;
    anios_consentracion;
    total_anios;
    created_at;
    updated_at;
    seccion;
    subseries;
};
exports.Serie = Serie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Serie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "serie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "idSeccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "departamento_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Serie.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "anio_tramite", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "anios_consentracion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "total_anios", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Serie.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seccion_entity_1.Seccion, (seccion) => seccion.series, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'idSeccion' }),
    __metadata("design:type", Object)
], Serie.prototype, "seccion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sub_serie_entity_1.SubSerie, (sub) => sub.serie),
    __metadata("design:type", Array)
], Serie.prototype, "subseries", void 0);
exports.Serie = Serie = __decorate([
    (0, typeorm_1.Entity)({ name: 'series' })
], Serie);
//# sourceMappingURL=serie.entity.js.map