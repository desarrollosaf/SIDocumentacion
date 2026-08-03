import { Subfondo } from './subfondo.entity';
import { Serie } from './serie.entity';
export declare class Seccion {
    id: number;
    codigo: string | null;
    seccion: string | null;
    departamento_id: number | null;
    direccion_id: number | null;
    id_subfondo: number | null;
    id_tipo_seccion: number | null;
    status: number;
    created_at: Date | null;
    updated_at: Date | null;
    subfondo?: Subfondo | null;
    series?: Serie[];
}
