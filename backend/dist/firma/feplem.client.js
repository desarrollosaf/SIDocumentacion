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
var FeplemClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeplemClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let FeplemClient = FeplemClient_1 = class FeplemClient {
    config;
    logger = new common_1.Logger(FeplemClient_1.name);
    constructor(config) {
        this.config = config;
    }
    async validarCertificado(rfc, password) {
        const cuerpo = await this.postear('/api/validaCertificados', {
            rfc,
            password,
        });
        return cuerpo === '0' || cuerpo === '' ? null : cuerpo;
    }
    async firmarDocumento(solicitud) {
        const cuerpo = await this.postear('/api/firmaDocumentos', solicitud);
        return cuerpo === '1';
    }
    static ahora() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    async postear(ruta, cuerpo) {
        const baseUrl = this.config.get('feplem.baseUrl', 'https://feplem.gob.mx');
        const timeout = this.config.get('feplem.timeoutMs', 30_000);
        try {
            const respuesta = await fetch(`${baseUrl}${ruta}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuerpo),
                signal: AbortSignal.timeout(timeout),
            });
            return (await respuesta.text()).trim();
        }
        catch (error) {
            this.logger.error(`Falló la comunicación con FEPLEM (${ruta}): ${error.message}`);
            throw new common_1.ServiceUnavailableException('No fue posible comunicarse con el servicio de firma electrónica. Intenta más tarde.');
        }
    }
};
exports.FeplemClient = FeplemClient;
exports.FeplemClient = FeplemClient = FeplemClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FeplemClient);
//# sourceMappingURL=feplem.client.js.map