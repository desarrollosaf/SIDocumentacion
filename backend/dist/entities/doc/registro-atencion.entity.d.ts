import { Registro } from './registro.entity';
export declare class RegistroAtencion {
    id: number;
    registro_id: number | null;
    user_rfc: string;
    user_turna: string | null;
    indicaciones_turno: string | null;
    visto: number;
    statusAtencion: number;
    fechaCierre: string | null;
    tipoAtencion: string;
    activo: number;
    notificacion: number;
    id_atencion: number | null;
    serie_id: number | null;
    subserie_id: number | null;
    expediente_id: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    registro?: Registro | null;
}
