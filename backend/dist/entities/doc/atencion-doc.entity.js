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
exports.AtencionDoc = void 0;
const typeorm_1 = require("typeorm");
const registro_doc_entity_1 = require("./registro-doc.entity");
let AtencionDoc = class AtencionDoc {
    id;
    id_registro_doc;
    rfc_atencion;
    visto;
    fecha_visto;
    status_atencion;
    fecha_atencion;
    tipo_atencion;
    rfc_turna;
    activo;
    created_at;
    updated_at;
    registroDoc;
};
exports.AtencionDoc = AtencionDoc;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AtencionDoc.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AtencionDoc.prototype, "id_registro_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AtencionDoc.prototype, "rfc_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], AtencionDoc.prototype, "visto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], AtencionDoc.prototype, "fecha_visto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], AtencionDoc.prototype, "status_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], AtencionDoc.prototype, "fecha_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AtencionDoc.prototype, "tipo_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], AtencionDoc.prototype, "rfc_turna", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], AtencionDoc.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AtencionDoc.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AtencionDoc.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => registro_doc_entity_1.RegistroDoc, (doc) => doc.destinatarios, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_registro_doc' }),
    __metadata("design:type", Object)
], AtencionDoc.prototype, "registroDoc", void 0);
exports.AtencionDoc = AtencionDoc = __decorate([
    (0, typeorm_1.Entity)({ name: 'atencion_docs' })
], AtencionDoc);
//# sourceMappingURL=atencion-doc.entity.js.map