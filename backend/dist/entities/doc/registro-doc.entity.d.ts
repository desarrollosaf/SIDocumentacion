import { AtencionDoc } from './atencion-doc.entity';
export declare class RegistroDoc {
    id: number;
    folio: string | null;
    fojas: number | null;
    titulo_doc: string | null;
    path_doc: string | null;
    uuid_doc: string | null;
    path_acuse: string | null;
    uuid_acuse: string | null;
    rfc_registro: string | null;
    serie_id: number | null;
    subserie_id: number | null;
    expediente_id: number | null;
    tipo_doc: number | null;
    firmado: number | null;
    status: number;
    activo: number;
    created_at: Date | null;
    updated_at: Date | null;
    destinatarios?: AtencionDoc[];
}
