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
exports.Subfondo = void 0;
const typeorm_1 = require("typeorm");
let Subfondo = class Subfondo {
    id;
    id_Dependencia;
    codigo;
    subfondo;
    created_at;
    updated_at;
};
exports.Subfondo = Subfondo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Subfondo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_Dependencia', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Subfondo.prototype, "id_Dependencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Subfondo.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Subfondo.prototype, "subfondo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Subfondo.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Subfondo.prototype, "updated_at", void 0);
exports.Subfondo = Subfondo = __decorate([
    (0, typeorm_1.Entity)({ name: 'subfondo' })
], Subfondo);
//# sourceMappingURL=subfondo.entity.js.map