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
exports.RegistroDoc = void 0;
const typeorm_1 = require("typeorm");
const atencion_doc_entity_1 = require("./atencion-doc.entity");
let RegistroDoc = class RegistroDoc {
    id;
    folio;
    fojas;
    titulo_doc;
    path_doc;
    uuid_doc;
    path_acuse;
    uuid_acuse;
    rfc_registro;
    serie_id;
    subserie_id;
    expediente_id;
    tipo_doc;
    firmado;
    status;
    activo;
    created_at;
    updated_at;
    destinatarios;
};
exports.RegistroDoc = RegistroDoc;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RegistroDoc.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "folio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "fojas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "titulo_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "path_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "uuid_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "path_acuse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "uuid_acuse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "rfc_registro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "serie_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "subserie_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "expediente_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RegistroDoc.prototype, "tipo_doc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', nullable: true }),
    __metadata("design:type", Boolean)
], RegistroDoc.prototype, "firmado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], RegistroDoc.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], RegistroDoc.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RegistroDoc.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RegistroDoc.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => atencion_doc_entity_1.AtencionDoc, (atencion) => atencion.registroDoc),
    __metadata("design:type", Array)
], RegistroDoc.prototype, "destinatarios", void 0);
exports.RegistroDoc = RegistroDoc = __decorate([
    (0, typeorm_1.Entity)({ name: 'registro_docs' })
], RegistroDoc);
//# sourceMappingURL=registro-doc.entity.js.map