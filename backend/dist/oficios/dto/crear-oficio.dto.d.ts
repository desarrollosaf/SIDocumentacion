export declare class DestinatarioDto {
    rfc: string;
    tipo_atencion: string;
}
export declare class CrearOficioDto {
    titulo_doc: string;
    folio?: string;
    fojas?: number;
    serie_id?: number;
    subserie_id?: number;
    expediente_id?: number;
    tipo_doc?: number;
    firmado?: boolean;
    hash?: string;
    psw?: string;
    destinatarios: DestinatarioDto[];
}
