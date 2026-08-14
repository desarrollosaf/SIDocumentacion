import { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { TipoAtencion, TipoDoc } from '../entities/doc/catalogos.entity';
import { Seccion } from '../entities/doc/seccion.entity';
import { Serie } from '../entities/doc/serie.entity';
import { SubSerie } from '../entities/doc/sub-serie.entity';
import { Subfondo } from '../entities/doc/subfondo.entity';
import { Departamento } from '../entities/saf/departamento.entity';
import { Dependencia } from '../entities/saf/dependencia.entity';
import { Direccion } from '../entities/saf/direccion.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { TipoApoyo } from '../entities/doc/tipo-apoyo.entity';
export interface Opcion {
    id: number | string;
    nombre: string;
    descripcion?: string | null;
}
export interface SelectOp {
    id: number | string;
    tipo: string;
    docsApoyo: Select[];
}
export interface Select {
    id: number | string;
    tipo: string;
}
export declare class CatalogosService {
    private readonly secciones;
    private readonly series;
    private readonly subseries;
    private readonly subfondos;
    private readonly tiposDoc;
    private readonly tiposAtencion;
    private readonly tiposApoyo;
    private readonly servidores;
    private readonly dependencias;
    private readonly direcciones;
    private readonly departamentos;
    constructor(secciones: Repository<Seccion>, series: Repository<Serie>, subseries: Repository<SubSerie>, subfondos: Repository<Subfondo>, tiposDoc: Repository<TipoDoc>, tiposAtencion: Repository<TipoAtencion>, tiposApoyo: Repository<TipoApoyo>, servidores: Repository<ServidorPublico>, dependencias: Repository<Dependencia>, direcciones: Repository<Direccion>, departamentos: Repository<Departamento>);
    listarSecciones(): Promise<Opcion[]>;
    listarSeries(seccionId?: number): Promise<Opcion[]>;
    listarSubseries(serieId?: number): Promise<Opcion[]>;
    listarSubfondos(): Promise<Opcion[]>;
    listarTiposDoc(): Promise<Opcion[]>;
    listarTiposAtencion(): Promise<Opcion[]>;
    listarDependencias(): Promise<Opcion[]>;
    listarDirecciones(dependenciaId?: number): Promise<Opcion[]>;
    listarDepartamentos(direccionId?: number): Promise<Opcion[]>;
    buscarServidores(termino: string, excluirRfc?: string): Promise<{
        rfc: string;
        nombre: string;
        dependencia: string | null;
        direccion: string | null;
        departamento: string | null;
    }[]>;
    clasificacionDeMiArea(user: AuthenticatedUser): Promise<{
        subseries: Opcion[];
        id: number | string;
        nombre: string;
        descripcion?: string | null;
    }[]>;
    private aOpcion;
    tipoApoyo(): Promise<SelectOp[]>;
}
