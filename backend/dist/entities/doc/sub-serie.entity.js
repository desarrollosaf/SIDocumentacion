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
exports.SubSerie = void 0;
const typeorm_1 = require("typeorm");
const serie_entity_1 = require("./serie.entity");
let SubSerie = class SubSerie {
    id;
    codigo;
    subserie;
    idSerie;
    id_Departamento;
    status;
    anio_tramite;
    anios_consentracion;
    total_anios;
    created_at;
    updated_at;
    serie;
};
exports.SubSerie = SubSerie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubSerie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "subserie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "idSerie", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Departamento', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "id_Departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], SubSerie.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "anio_tramite", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "anios_consentracion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "total_anios", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], SubSerie.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => serie_entity_1.Serie, (serie) => serie.subseries, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'idSerie' }),
    __metadata("design:type", Object)
], SubSerie.prototype, "serie", void 0);
exports.SubSerie = SubSerie = __decorate([
    (0, typeorm_1.Entity)({ name: 'sub_series' })
], SubSerie);
//# sourceMappingURL=sub-serie.entity.js.map