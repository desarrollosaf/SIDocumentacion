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
exports.CrearOficioDto = exports.DestinatarioDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class DestinatarioDto {
    rfc_atencion;
    tipo_atencion;
}
exports.DestinatarioDto = DestinatarioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El RFC del destinatario es obligatorio.' }),
    __metadata("design:type", String)
], DestinatarioDto.prototype, "rfc_atencion", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['E', 'R', 'A'], { message: 'El papel del destinatario no es válido.' }),
    __metadata("design:type", String)
], DestinatarioDto.prototype, "tipo_atencion", void 0);
class CrearOficioDto {
    titulo_doc;
    fojas;
    serie_id;
    subserie_id;
    expediente_id;
    tipo_doc;
    destinatarios;
}
exports.CrearOficioDto = CrearOficioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título del documento es obligatorio.' }),
    __metadata("design:type", String)
], CrearOficioDto.prototype, "titulo_doc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearOficioDto.prototype, "fojas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearOficioDto.prototype, "serie_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearOficioDto.prototype, "subserie_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearOficioDto.prototype, "expediente_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearOficioDto.prototype, "tipo_doc", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Agrega al menos un destinatario.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DestinatarioDto),
    __metadata("design:type", Array)
], CrearOficioDto.prototype, "destinatarios", void 0);
//# sourceMappingURL=crear-oficio.dto.js.map