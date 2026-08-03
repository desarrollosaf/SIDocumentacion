export declare class DestinatarioDto {
    rfc_atencion: string;
    tipo_atencion: string;
}
export declare class CrearOficioDto {
    titulo_doc: string;
    fojas?: number;
    serie_id?: number;
    subserie_id?: number;
    expediente_id?: number;
    tipo_doc?: number;
    destinatarios: DestinatarioDto[];
}
