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
exports.DocTipoApoyo = void 0;
const typeorm_1 = require("typeorm");
const tipo_apoyo_entity_1 = require("./tipo-apoyo.entity");
let DocTipoApoyo = class DocTipoApoyo {
    id;
    tipo_apoyo_id;
    tipo;
    created_at;
    updated_at;
    tipoApoyo;
};
exports.DocTipoApoyo = DocTipoApoyo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DocTipoApoyo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DocTipoApoyo.prototype, "tipo_apoyo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], DocTipoApoyo.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], DocTipoApoyo.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], DocTipoApoyo.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_apoyo_entity_1.TipoApoyo, (tipoApoyo) => tipoApoyo.docsApoyo),
    (0, typeorm_1.JoinColumn)({ name: 'tipo_apoyo_id' }),
    __metadata("design:type", tipo_apoyo_entity_1.TipoApoyo)
], DocTipoApoyo.prototype, "tipoApoyo", void 0);
exports.DocTipoApoyo = DocTipoApoyo = __decorate([
    (0, typeorm_1.Entity)({ name: 'documentos_apoyos' })
], DocTipoApoyo);
//# sourceMappingURL=docs-tipo-apoyo.entity.js.map