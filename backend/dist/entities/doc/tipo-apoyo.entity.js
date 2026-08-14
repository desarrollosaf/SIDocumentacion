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
exports.TipoApoyo = void 0;
const typeorm_1 = require("typeorm");
const docs_tipo_apoyo_entity_1 = require("./docs-tipo-apoyo.entity");
let TipoApoyo = class TipoApoyo {
    id;
    tipo;
    created_at;
    updated_at;
    docsApoyo;
};
exports.TipoApoyo = TipoApoyo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TipoApoyo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TipoApoyo.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], TipoApoyo.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], TipoApoyo.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => docs_tipo_apoyo_entity_1.DocTipoApoyo, (docsA) => docsA.tipoApoyo),
    __metadata("design:type", Array)
], TipoApoyo.prototype, "docsApoyo", void 0);
exports.TipoApoyo = TipoApoyo = __decorate([
    (0, typeorm_1.Entity)({ name: 'tipo_doc_apoyos' })
], TipoApoyo);
//# sourceMappingURL=tipo-apoyo.entity.js.map