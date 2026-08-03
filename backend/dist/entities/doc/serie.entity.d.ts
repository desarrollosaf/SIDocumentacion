import { Seccion } from './seccion.entity';
import { SubSerie } from './sub-serie.entity';
export declare class Serie {
    id: number;
    codigo: string | null;
    serie: string | null;
    idSeccion: number | null;
    departamento_id: number | null;
    status: number;
    anio_tramite: number | null;
    anios_consentracion: number | null;
    total_anios: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    seccion?: Seccion | null;
    subseries?: SubSerie[];
}
