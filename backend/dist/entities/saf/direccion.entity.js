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
exports.Direccion = void 0;
const typeorm_1 = require("typeorm");
let Direccion = class Direccion {
    id_Direccion;
    id_Dependencia;
    nombre_completo;
    Nombre;
};
exports.Direccion = Direccion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_Direccion' }),
    __metadata("design:type", Number)
], Direccion.prototype, "id_Direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Dependencia', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Direccion.prototype, "id_Dependencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Direccion.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Direccion.prototype, "Nombre", void 0);
exports.Direccion = Direccion = __decorate([
    (0, typeorm_1.Entity)({ name: 't_direccion' })
], Direccion);
//# sourceMappingURL=direccion.entity.js.map