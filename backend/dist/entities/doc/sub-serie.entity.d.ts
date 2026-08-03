import { Serie } from './serie.entity';
export declare class SubSerie {
    id: number;
    codigo: string | null;
    subserie: string | null;
    idSerie: number | null;
    id_Departamento: number | null;
    status: number;
    anio_tramite: number | null;
    anios_consentracion: number | null;
    total_anios: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    serie?: Serie | null;
}
