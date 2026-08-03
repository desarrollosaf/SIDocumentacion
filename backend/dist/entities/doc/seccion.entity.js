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
exports.Seccion = void 0;
const typeorm_1 = require("typeorm");
const subfondo_entity_1 = require("./subfondo.entity");
const serie_entity_1 = require("./serie.entity");
let Seccion = class Seccion {
    id;
    codigo;
    seccion;
    departamento_id;
    direccion_id;
    id_subfondo;
    id_tipo_seccion;
    status;
    created_at;
    updated_at;
    subfondo;
    series;
};
exports.Seccion = Seccion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Seccion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "seccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "departamento_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "direccion_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "id_subfondo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "id_tipo_seccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Seccion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Seccion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subfondo_entity_1.Subfondo, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_subfondo' }),
    __metadata("design:type", Object)
], Seccion.prototype, "subfondo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => serie_entity_1.Serie, (serie) => serie.seccion),
    __metadata("design:type", Array)
], Seccion.prototype, "series", void 0);
exports.Seccion = Seccion = __decorate([
    (0, typeorm_1.Entity)({ name: 'secciones' })
], Seccion);
//# sourceMappingURL=seccion.entity.js.map