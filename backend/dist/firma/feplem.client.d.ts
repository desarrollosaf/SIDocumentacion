import { ConfigService } from '@nestjs/config';
export interface SolicitudFirma {
    path: string;
    user_rfc: string;
    contra: string;
    docI: string;
    tipo: string;
    firma_status: string;
    status_doc: string;
    firma: number;
    tipo_firmante: string | null;
    fecha_expedicion: string;
    fecha_certificacion: string;
}
export declare class FeplemClient {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    validarCertificado(rfc: string, password: string): Promise<string | null>;
    firmarDocumento(solicitud: SolicitudFirma): Promise<boolean>;
    static ahora(): string;
    private postear;
}
