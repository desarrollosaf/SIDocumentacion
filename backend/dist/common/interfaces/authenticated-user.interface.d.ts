export interface AuthenticatedUser {
    id: number;
    name: string | null;
    email: string | null;
    rfc: string;
    roles: string[];
    nombre: string | null;
    dependencia: string | null;
    direccion: string | null;
    departamento: string | null;
    id_Departamento: number | null;
    id_Direccion: number | null;
    id_Dependencia: number | null;
    c_presup: string | null;
    path_foto: string | null;
}
