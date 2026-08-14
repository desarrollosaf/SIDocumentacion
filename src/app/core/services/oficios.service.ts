import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import {
  FiltroBandeja,
  OficioBandeja,
  OficioDetalle,
  Paginado,
  ResumenOficios,
} from '../models';
import { aHttpParams } from './http-params.util';
import { Observable } from 'rxjs';

export interface NuevoOficio {
  folio?: string;
  titulo_doc: string;
  fojas?: number;
  tipo_doc?: number;
  serie_id?: number;
  subserie_id?: number;
  tipo_apoyo_id?: number;
  firmado: boolean;
  file_doc: string;
  destinatarios: Array<{ rfc_atencion: string; tipo_atencion: string }>;
}

export type respuesta = {
  hash: string
}

@Injectable({ providedIn: 'root' })
export class OficiosService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/oficios`;

  resumen() {
    return this.http.get<ResumenOficios>(`${this.base}/resumen`);
  }

  bandejaEntrada(filtro: FiltroBandeja) {
    return this.http.get<Paginado<OficioBandeja>>(`${this.base}/entrada`, {
      params: aHttpParams(filtro),
    });
  }

  bandejaSalida(filtro: FiltroBandeja) {
    return this.http.get<Paginado<OficioBandeja>>(`${this.base}/salida`, {
      params: aHttpParams(filtro),
    });
  }

  detalle(id: number) {
    return this.http.get<OficioDetalle>(`${this.base}/${id}`);
  }

  crear(formData: FormData) {
    return this.http.post<OficioDetalle>(this.base, formData);
  }

  marcarVisto(atencionId: number) {
    return this.http.patch<{ message: string }>(
      `${this.base}/atenciones/${atencionId}/visto`,
      {},
    );
  }

  atender(atencionId: number) {
    return this.http.patch<{ message: string }>(
      `${this.base}/atenciones/${atencionId}/atender`,
      {},
    );
  }

  validarPsw(psw: string): Observable<respuesta>{
    return this.http.get<respuesta>(`${this.base}/validarPsw/${psw}`);
  }

  verPdf(id: number, tipo: number) {
    return this.http.get(`${this.base}/verPdf/${id}/${tipo}`,
      {
        responseType: 'blob'
      }
    );
  }

  validarFirmado(id: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.base}/validarFirmado/${id}`);
  }

  firmadDoc(id: number, psw: string): Observable<number>{
    return this.http.get<number>(`${this.base}/firmarDoc/${id}/${psw}`);
  }
}
