import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Opcion, OpcionApoyo, OpcionClasificacion, ServidorPublico } from '../models';
import { aHttpParams } from './http-params.util';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/catalogos`;

  /** Los catálogos estáticos se piden una sola vez por sesión. */
  private readonly cache = new Map<string, Observable<Opcion[]>>();

  tiposAtencion() {
    return this.enCache('tipos-atencion');
  }

  tiposDocumento() {
    return this.enCache('tipos-documento');
  }

  secciones() {
    return this.enCache('secciones');
  }

  subfondos() {
    return this.enCache('subfondos');
  }

  series(seccion?: number) {
    return this.http.get<Opcion[]>(`${this.base}/series`, {
      params: aHttpParams({ seccion }),
    });
  }

  subseries(serie?: number) {
    return this.http.get<Opcion[]>(`${this.base}/subseries`, {
      params: aHttpParams({ serie }),
    });
  }

  /** Series con sus subseries del área del usuario, para el formulario de registro. */
  miClasificacion() {
    return this.http.get<OpcionClasificacion[]>(`${this.base}/mi-clasificacion`);
  }

  /** Buscador de destinatarios; el backend exige al menos 3 caracteres. */
  buscarServidores(termino: string) {
    return this.http.get<ServidorPublico[]>(`${this.base}/servidores`, {
      params: aHttpParams({ q: termino }),
    });
  }

  private enCache(recurso: string): Observable<Opcion[]> {
    if (!this.cache.has(recurso)) {
      this.cache.set(
        recurso,
        this.http
          .get<Opcion[]>(`${this.base}/${recurso}`)
          .pipe(shareReplay({ bufferSize: 1, refCount: false })),
      );
    }

    return this.cache.get(recurso)!;
  } 

  tiposApoyo(){
    return this.http.get<OpcionApoyo[]>(`${this.base}/tipo_doc_apoyos`);
  }

  // tipoApoyoOp(tipo_apoyo_id?: number) {
  //   return this.http.get<Select[]>(`${this.base}/documentos_apoyos`, {
  //     params: aHttpParams({ tipo_apoyo_id }),
  //   });
  // }
}
