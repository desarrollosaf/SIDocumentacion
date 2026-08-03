import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CatalogosService } from './catalogos.service';
export declare class CatalogosController {
    private readonly catalogos;
    constructor(catalogos: CatalogosService);
    secciones(): Promise<import("./catalogos.service").Opcion[]>;
    series(seccion?: string): Promise<import("./catalogos.service").Opcion[]>;
    subseries(serie?: string): Promise<import("./catalogos.service").Opcion[]>;
    subfondos(): Promise<import("./catalogos.service").Opcion[]>;
    tiposDocumento(): Promise<import("./catalogos.service").Opcion[]>;
    tiposAtencion(): Promise<import("./catalogos.service").Opcion[]>;
    dependencias(): Promise<import("./catalogos.service").Opcion[]>;
    direcciones(dependencia?: string): Promise<import("./catalogos.service").Opcion[]>;
    departamentos(direccion?: string): Promise<import("./catalogos.service").Opcion[]>;
    miClasificacion(user: AuthenticatedUser): Promise<{
        subseries: import("./catalogos.service").Opcion[];
        id: number | string;
        nombre: string;
        descripcion?: string | null;
    }[]>;
    servidores(user: AuthenticatedUser, q?: string): Promise<{
        rfc: string;
        nombre: string;
        dependencia: string | null;
        direccion: string | null;
        departamento: string | null;
    }[]>;
}
