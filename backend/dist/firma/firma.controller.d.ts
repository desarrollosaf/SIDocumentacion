import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { FirmarDto } from './dto/firmar.dto';
import { FirmaService } from './firma.service';
export declare class FirmaController {
    private readonly firma;
    constructor(firma: FirmaService);
    documentos(user: AuthenticatedUser): Promise<import("./firma.service").DocumentoFirmable[]>;
    validar(user: AuthenticatedUser, dto: FirmarDto): Promise<{
        valido: boolean;
        hash: string | null;
    }>;
    firmarOficio(user: AuthenticatedUser, id: number, dto: FirmarDto): Promise<{
        message: string;
        hash: string;
    }>;
    firmarDocumento(user: AuthenticatedUser, id: number, dto: FirmarDto): Promise<{
        message: string;
        hash: string;
    }>;
}
