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
exports.Departamento = void 0;
const typeorm_1 = require("typeorm");
let Departamento = class Departamento {
    id_Departamento;
    id_Dependencia;
    id_Direccion;
    nombre_completo;
    Nombre;
    c_presup;
};
exports.Departamento = Departamento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_Departamento' }),
    __metadata("design:type", Number)
], Departamento.prototype, "id_Departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Dependencia', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Departamento.prototype, "id_Dependencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Direccion', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Departamento.prototype, "id_Direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Departamento.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Departamento.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Departamento.prototype, "c_presup", void 0);
exports.Departamento = Departamento = __decorate([
    (0, typeorm_1.Entity)({ name: 't_departamento' })
], Departamento);
//# sourceMappingURL=departamento.entity.js.map