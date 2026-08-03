import { ServidorPublico } from './servidor-publico.entity';
export declare class User {
    id: number;
    name: string | null;
    email: string | null;
    password: string;
    rfc: string | null;
    intentos: number | null;
    bloqueo: number | null;
    cel: string | null;
    path_foto: string | null;
    servidorPublico?: ServidorPublico | null;
}
