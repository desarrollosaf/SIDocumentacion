import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { SAF_CONNECTION } from '../config/configuration';
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
  docsApoyo: Select[]
}

export interface Select {
  id: number | string;
  tipo: string;
}


/**
 * Catálogos de apoyo que en Laravel se resolvían con `Arr::pluck` dentro de
 * cada controlador (series, subseries, secciones, destinatarios, etc.).
 *
 * Cada tabla archivística nombra su descripción con una columna distinta
 * (`seccion`, `serie`, `subserie`, `subfondo`, `tipo_doc`), por eso el mapeo
 * a `Opcion` se hace de forma explícita en cada método.
 */
@Injectable()
export class CatalogosService {
  constructor(
    @InjectRepository(Seccion) private readonly secciones: Repository<Seccion>,
    @InjectRepository(Serie) private readonly series: Repository<Serie>,
    @InjectRepository(SubSerie) private readonly subseries: Repository<SubSerie>,
    @InjectRepository(Subfondo) private readonly subfondos: Repository<Subfondo>,
    @InjectRepository(TipoDoc) private readonly tiposDoc: Repository<TipoDoc>,
    @InjectRepository(TipoAtencion) private readonly tiposAtencion: Repository<TipoAtencion>,
    @InjectRepository(TipoApoyo) private readonly tiposApoyo: Repository<TipoApoyo>,

    @InjectRepository(ServidorPublico, SAF_CONNECTION)
    private readonly servidores: Repository<ServidorPublico>,
    @InjectRepository(Dependencia, SAF_CONNECTION)
    private readonly dependencias: Repository<Dependencia>,
    @InjectRepository(Direccion, SAF_CONNECTION)
    private readonly direcciones: Repository<Direccion>,
    @InjectRepository(Departamento, SAF_CONNECTION)
    private readonly departamentos: Repository<Departamento>,
  ) {}

  async listarSecciones(): Promise<Opcion[]> {
    const filas = await this.secciones.find({
      where: { status: 1 },
      order: { codigo: 'ASC' },
    });
    return filas.map((s) => this.aOpcion(s.id, s.codigo, s.seccion));
  }

  /** SeccionesController@getSerie: series activas de una sección. */
  async listarSeries(seccionId?: number): Promise<Opcion[]> {
    const filas = await this.series.find({
      where: { status: 1, ...(seccionId ? { idSeccion: seccionId } : {}) },
      order: { codigo: 'ASC' },
    });
    return filas.map((s) => this.aOpcion(s.id, s.codigo, s.serie));
  }

  /** SubseriesController@getSubseries: subseries activas de una serie. */
  async listarSubseries(serieId?: number): Promise<Opcion[]> {
    const filas = await this.subseries.find({
      where: { status: 1, ...(serieId ? { idSerie: serieId } : {}) },
      order: { codigo: 'ASC' },
    });
    return filas.map((s) => this.aOpcion(s.id, s.codigo, s.subserie));
  }

  async listarSubfondos(): Promise<Opcion[]> {
    const filas = await this.subfondos.find({ order: { codigo: 'ASC' } });
    return filas.map((s) => this.aOpcion(s.id, s.codigo, s.subfondo));
  }

  async listarTiposDoc(): Promise<Opcion[]> {
    const filas = await this.tiposDoc.find({
      where: { status: 1 },
      order: { tipo_doc: 'ASC' },
    });
    return filas.map((t) => ({ id: t.id, nombre: t.tipo_doc ?? '' }));
  }

  async listarTiposAtencion(): Promise<Opcion[]> {
    const filas = await this.tiposAtencion.find({ order: { id: 'ASC' } });
    return filas.map((t) => ({ id: t.id, nombre: t.tipo ?? '' }));
  }

  async listarDependencias(): Promise<Opcion[]> {
    const filas = await this.dependencias.find({ order: { nombre_completo: 'ASC' } });
    return filas.map((d) => ({
      id: d.id_Dependencia,
      nombre: d.nombre_completo ?? d.Nombre ?? '',
    }));
  }

  async listarDirecciones(dependenciaId?: number): Promise<Opcion[]> {
    const filas = await this.direcciones.find({
      where: dependenciaId ? { id_Dependencia: dependenciaId } : {},
      order: { nombre_completo: 'ASC' },
    });
    return filas.map((d) => ({
      id: d.id_Direccion,
      nombre: d.nombre_completo ?? d.Nombre ?? '',
    }));
  }

  async listarDepartamentos(direccionId?: number): Promise<Opcion[]> {
    const filas = await this.departamentos.find({
      where: direccionId ? { id_Direccion: direccionId } : {},
      order: { nombre_completo: 'ASC' },
    });
    return filas.map((d) => ({
      id: d.id_Departamento,
      nombre: d.nombre_completo ?? d.Nombre ?? '',
    }));
  }

  /**
   * Buscador de destinatarios y remitentes sobre el padrón SAF.
   * Equivale a RegistroController@getDestinatario / @getRemitente.
   * La clave es el RFC (`N_Usuario`) porque es lo que guardan los turnos.
   */
  async buscarServidores(termino: string, excluirRfc?: string) {
    if (!termino || termino.trim().length < 3) {
      return [];
    }

    const servidores = await this.servidores.find({
      where: { Nombre: Like(`%${termino.trim()}%`) },
      relations: { dependencia: true, direccion: true, departamento: true },
      take: 25,
      order: { Nombre: 'ASC' },
    });

    return servidores
      // .filter((s) => s.N_Usuario && s.N_Usuario !== excluirRfc)
      .filter((s) => s.N_Usuario)
      .map((s) => ({
        rfc: s.N_Usuario,
        nombre: s.Nombre ?? 'Usuario no identificado',
        dependencia: s.dependencia?.nombre_completo ?? null,
        direccion: s.direccion?.nombre_completo ?? null,
        departamento: s.departamento?.nombre_completo ?? null,
      }));
  }

  /**
   * Series y subseries del área del usuario, para los formularios de registro.
   * Si el área no tiene clasificación propia se devuelve el catálogo completo,
   * para no dejar el formulario sin opciones.
   */
  async clasificacionDeMiArea(user: AuthenticatedUser) {
    const propias = user.id_Departamento
      ? await this.series.find({
          where: { status: 1, departamento_id: user.id_Departamento },
          relations: { subseries: true },
          order: { codigo: 'ASC' },
        })
      : [];

    const series = propias.length
      ? propias
      : await this.series.find({
          where: { status: 1 },
          relations: { subseries: true },
          order: { codigo: 'ASC' },
        });

    return series.map((serie) => ({
      ...this.aOpcion(serie.id, serie.codigo, serie.serie),
      subseries: (serie.subseries ?? [])
        .filter((sub) => sub.status === 1)
        .map((sub) => this.aOpcion(sub.id, sub.codigo, sub.subserie)),
    }));
  }

  /** El código archivístico antecede al nombre, como en el sistema original. */
  private aOpcion(id: number, codigo: string | null, nombre: string | null): Opcion {
    return {
      id,
      nombre: codigo ? `${codigo} — ${nombre ?? ''}` : (nombre ?? ''),
    };
  }


 async tipoApoyo(): Promise<SelectOp[]> {
    const filas = await this.tiposApoyo.find({
      relations: { docsApoyo: true },
    });

    const result =  filas.map((t) => ({
    id: t.id,
    tipo: t.tipo ?? '',
    docsApoyo: (t.docsApoyo ?? []).map((d) => ({
      id: d.id,
      tipo: d.tipo ?? '',
    })),
  }));
  

  return result;
  }

  
}
