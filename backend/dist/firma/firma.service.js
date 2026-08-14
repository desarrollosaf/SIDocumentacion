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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const firma_doc_entity_1 = require("../entities/doc/firma-doc.entity");
const registro_doc_entity_1 = require("../entities/doc/registro-doc.entity");
const feplem_client_1 = require("./feplem.client");
let FirmaService = class FirmaService {
    oficios;
    documentos;
    feplem;
    auth;
    constructor(oficios, documentos, feplem, auth) {
        this.oficios = oficios;
        this.documentos = documentos;
        this.feplem = feplem;
        this.auth = auth;
    }
    async listar(user) {
        const [oficios, documentos] = await Promise.all([
            this.oficios.find({
                where: { rfc_registro: user.rfc, activo: 1 },
                order: { created_at: 'DESC' },
                take: 100,
            }),
            this.documentos.find({
                where: { rfc_registro: user.rfc, status: 1 },
                order: { created_at: 'DESC' },
                take: 100,
            }),
        ]);
        return [
            ...oficios.map((o) => ({
                id: o.id,
                origen: 'oficio',
                folio: o.folio,
                nombre: o.titulo_doc,
                uuid: o.uuid_doc,
                firmado: !!o.firmado,
                firmable: !!o.path_doc && !!o.uuid_doc,
                created_at: o.created_at,
            })),
            ...documentos.map((d) => ({
                id: d.id,
                origen: 'documento',
                folio: null,
                nombre: d.nombre_doc,
                uuid: d.uuid_doc,
                firmado: false,
                firmable: !!d.path_doc,
                created_at: d.created_at,
            })),
        ].sort((a, b) => (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0));
    }
    async validarCertificado(user, password) {
        const hash = await this.feplem.validarCertificado(user.rfc, password);
        if (!hash) {
            await this.penalizar(user);
        }
        await this.auth.reiniciarIntentos(user.id);
        return { valido: true, hash };
    }
    async firmarOficio(user, id, password) {
        const oficio = await this.oficios.findOne({ where: { id } });
        if (!oficio) {
            throw new common_1.NotFoundException('El oficio no existe.');
        }
        if (oficio.rfc_registro !== user.rfc) {
            throw new common_1.UnauthorizedException('Solo quien registró el oficio puede firmarlo.');
        }
        if (oficio.firmado) {
            throw new common_1.ConflictException('El oficio ya cuenta con firma electrónica.');
        }
        if (!oficio.path_doc || !oficio.uuid_doc) {
            throw new common_1.BadRequestException('El oficio no tiene un archivo almacenado, por lo que no puede firmarse.');
        }
        const hash = await this.exigirCertificadoValido(user, password);
        const firmado = await this.feplem.firmarDocumento({
            path: oficio.path_doc,
            user_rfc: user.rfc,
            contra: password,
            docI: oficio.uuid_doc,
            tipo: 'documentacion/oficios',
            firma_status: '1',
            status_doc: '1',
            firma: 8,
            tipo_firmante: null,
            fecha_expedicion: feplem_client_1.FeplemClient.ahora(),
            fecha_certificacion: feplem_client_1.FeplemClient.ahora(),
        });
        if (!firmado) {
            throw new common_1.BadRequestException('El servicio de firma electrónica rechazó la solicitud. Verifica el documento e intenta de nuevo.');
        }
        await this.oficios.update(oficio.id, { firmado: true });
        return { message: `El oficio ${oficio.folio ?? ''} quedó firmado.`.trim(), hash };
    }
    async firmarDocumento(user, id, password) {
        const documento = await this.documentos.findOne({ where: { id } });
        if (!documento) {
            throw new common_1.NotFoundException('El documento no existe.');
        }
        if (documento.rfc_registro !== user.rfc) {
            throw new common_1.UnauthorizedException('Solo quien cargó el documento puede firmarlo.');
        }
        if (!documento.path_doc) {
            throw new common_1.BadRequestException('El documento no tiene un archivo almacenado.');
        }
        const hash = await this.exigirCertificadoValido(user, password);
        const firmado = await this.feplem.firmarDocumento({
            path: documento.path_doc,
            user_rfc: user.rfc,
            contra: password,
            docI: documento.uuid_doc,
            tipo: 'documentacion',
            firma_status: '1',
            status_doc: '1',
            firma: 8,
            tipo_firmante: null,
            fecha_expedicion: feplem_client_1.FeplemClient.ahora(),
            fecha_certificacion: feplem_client_1.FeplemClient.ahora(),
        });
        if (!firmado) {
            throw new common_1.BadRequestException('El servicio de firma electrónica rechazó la solicitud.');
        }
        return { message: `El documento ${documento.nombre_doc} quedó firmado.`, hash };
    }
    async exigirCertificadoValido(user, password) {
        const hash = await this.feplem.validarCertificado(user.rfc, password);
        if (!hash) {
            await this.penalizar(user);
        }
        await this.auth.reiniciarIntentos(user.id);
        return hash;
    }
    async penalizar(user) {
        const { intentos, bloqueado, maximo } = await this.auth.penalizarIntentoFallido(user.id);
        if (bloqueado) {
            throw new common_1.UnauthorizedException('Tu cuenta quedó bloqueada por intentos fallidos. Contacta al administrador del sistema.');
        }
        const restantes = (maximo ?? 3) - intentos;
        throw new common_1.UnauthorizedException(`La contraseña no es válida o el certificado no está vigente. Te ${restantes === 1 ? 'queda 1 intento' : `quedan ${restantes} intentos`}.`);
    }
};
exports.FirmaService = FirmaService;
exports.FirmaService = FirmaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_doc_entity_1.RegistroDoc)),
    __param(1, (0, typeorm_1.InjectRepository)(firma_doc_entity_1.FirmaDoc)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        feplem_client_1.FeplemClient,
        auth_service_1.AuthService])
], FirmaService);
//# sourceMappingURL=firma.service.js.map