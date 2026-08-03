export declare class TurnoDto {
    user_rfc: string;
    instruccion?: string;
}
export declare class CrearSolicitudDto {
    titulo_doc: string;
    descripcion_doc?: string;
    fecha_recepcion: string;
    fecha_documento: string;
    fecha_limite_atencion: string;
    tipo_atencion: number;
    tipo_doc?: number;
    serie_id?: number;
    subserie_id?: number;
    expediente_id?: number;
    folio_rastreo?: number;
    remitente_rfc?: string;
    fojas?: number;
    preregistro?: boolean;
    turnos: TurnoDto[];
}
