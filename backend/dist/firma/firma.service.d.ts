import { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuthService } from '../auth/auth.service';
import { FirmaDoc } from '../entities/doc/firma-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { FeplemClient } from './feplem.client';
export interface DocumentoFirmable {
    id: number;
    origen: 'oficio' | 'documento';
    folio: string | null;
    nombre: string | null;
    uuid: string | null;
    firmado: boolean;
    firmable: boolean;
    created_at: Date | null;
}
export declare class FirmaService {
    private readonly oficios;
    private readonly documentos;
    private readonly feplem;
    private readonly auth;
    constructor(oficios: Repository<RegistroDoc>, documentos: Repository<FirmaDoc>, feplem: FeplemClient, auth: AuthService);
    listar(user: AuthenticatedUser): Promise<DocumentoFirmable[]>;
    validarCertificado(user: AuthenticatedUser, password: string): Promise<{
        valido: boolean;
        hash: string | null;
    }>;
    firmarOficio(user: AuthenticatedUser, id: number, password: string): Promise<{
        message: string;
        hash: string;
    }>;
    firmarDocumento(user: AuthenticatedUser, id: number, password: string): Promise<{
        message: string;
        hash: string;
    }>;
    private exigirCertificadoValido;
    private penalizar;
}
