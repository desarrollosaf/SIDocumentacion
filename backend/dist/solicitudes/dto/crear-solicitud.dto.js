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
exports.CrearSolicitudDto = exports.TurnoDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TurnoDto {
    user_rfc;
    instruccion;
}
exports.TurnoDto = TurnoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El RFC del destinatario es obligatorio.' }),
    __metadata("design:type", String)
], TurnoDto.prototype, "user_rfc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TurnoDto.prototype, "instruccion", void 0);
class CrearSolicitudDto {
    titulo_doc;
    descripcion_doc;
    fecha_recepcion;
    fecha_documento;
    fecha_limite_atencion;
    tipo_atencion;
    tipo_doc;
    serie_id;
    subserie_id;
    expediente_id;
    folio_rastreo;
    remitente_rfc;
    fojas;
    preregistro;
    turnos;
}
exports.CrearSolicitudDto = CrearSolicitudDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título del documento es obligatorio.' }),
    __metadata("design:type", String)
], CrearSolicitudDto.prototype, "titulo_doc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearSolicitudDto.prototype, "descripcion_doc", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de recepción no es válida.' }),
    __metadata("design:type", String)
], CrearSolicitudDto.prototype, "fecha_recepcion", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha del documento no es válida.' }),
    __metadata("design:type", String)
], CrearSolicitudDto.prototype, "fecha_documento", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha límite de atención no es válida.' }),
    __metadata("design:type", String)
], CrearSolicitudDto.prototype, "fecha_limite_atencion", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Selecciona un tipo de atención.' }),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "tipo_atencion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "tipo_doc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "serie_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "subserie_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "expediente_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "folio_rastreo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearSolicitudDto.prototype, "remitente_rfc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearSolicitudDto.prototype, "fojas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CrearSolicitudDto.prototype, "preregistro", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Turna la solicitud al menos a una persona.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TurnoDto),
    __metadata("design:type", Array)
], CrearSolicitudDto.prototype, "turnos", void 0);
//# sourceMappingURL=crear-solicitud.dto.js.map