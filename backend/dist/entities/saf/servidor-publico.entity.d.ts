import { Dependencia } from './dependencia.entity';
import { Direccion } from './direccion.entity';
import { Departamento } from './departamento.entity';
export declare class ServidorPublico {
    id_Usuario: number;
    N_Usuario: string;
    Nombre: string | null;
    id_Dependencia: number | null;
    id_Direccion: number | null;
    id_Departamento: number | null;
    dependencia?: Dependencia | null;
    direccion?: Direccion | null;
    departamento?: Departamento | null;
}
