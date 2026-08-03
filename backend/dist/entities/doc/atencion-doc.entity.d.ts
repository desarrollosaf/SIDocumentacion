import { RegistroDoc } from './registro-doc.entity';
export declare class AtencionDoc {
    id: number;
    id_registro_doc: number;
    rfc_atencion: string;
    visto: number;
    fecha_visto: Date | null;
    status_atencion: number;
    fecha_atencion: Date | null;
    tipo_atencion: string;
    rfc_turna: string | null;
    activo: number;
    created_at: Date | null;
    updated_at: Date | null;
    registroDoc?: RegistroDoc | null;
}
