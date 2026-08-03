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
exports.ServidorPublico = void 0;
const typeorm_1 = require("typeorm");
const dependencia_entity_1 = require("./dependencia.entity");
const direccion_entity_1 = require("./direccion.entity");
const departamento_entity_1 = require("./departamento.entity");
let ServidorPublico = class ServidorPublico {
    id_Usuario;
    N_Usuario;
    Nombre;
    id_Dependencia;
    id_Direccion;
    id_Departamento;
    dependencia;
    direccion;
    departamento;
};
exports.ServidorPublico = ServidorPublico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_Usuario' }),
    __metadata("design:type", Number)
], ServidorPublico.prototype, "id_Usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'N_Usuario', type: 'varchar' }),
    __metadata("design:type", String)
], ServidorPublico.prototype, "N_Usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "Nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Dependencia', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "id_Dependencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Direccion', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "id_Direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Departamento', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "id_Departamento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dependencia_entity_1.Dependencia, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_Dependencia', referencedColumnName: 'id_Dependencia' }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "dependencia", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => direccion_entity_1.Direccion, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_Direccion', referencedColumnName: 'id_Direccion' }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => departamento_entity_1.Departamento, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_Departamento', referencedColumnName: 'id_Departamento' }),
    __metadata("design:type", Object)
], ServidorPublico.prototype, "departamento", void 0);
exports.ServidorPublico = ServidorPublico = __decorate([
    (0, typeorm_1.Entity)({ name: 's_usuario' })
], ServidorPublico);
//# sourceMappingURL=servidor-publico.entity.js.map