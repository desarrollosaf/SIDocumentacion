import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import {
  FiltroBandeja,
  Paginado,
  ResumenSolicitudes,
  SolicitudBandeja,
  SolicitudDetalle,
} from '../models';
import { aHttpParams } from './http-params.util';

export interface NuevaSolicitud {
  titulo_doc: string;
  fecha_recepcion: string;
  fecha_documento: string;
  fecha_limite_atencion: string;
  tipo_atencion: number;
  tipo_doc?: number;
  serie_id?: number;
  subserie_id?: number;
  remitente_rfc?: string;
  fojas?: number;
  preregistro?: boolean;
  turnos: Array<{ user_rfc: string; instruccion?: string }>;
}

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/solicitudes`;

  resumen() {
    return this.http.get<ResumenSolicitudes>(`${this.base}/resumen`);
  }

  bandejaEntrada(filtro: FiltroBandeja) {
    return this.http.get<Paginado<SolicitudBandeja>>(`${this.base}/entrada`, {
      params: aHttpParams(filtro),
    });
  }

  bandejaSalida(filtro: FiltroBandeja) {
    return this.http.get<Paginado<SolicitudBandeja>>(`${this.base}/salida`, {
      params: aHttpParams(filtro),
    });
  }

  preregistros(filtro: FiltroBandeja) {
    return this.http.get<Paginado<SolicitudBandeja>>(`${this.base}/preregistro`, {
      params: aHttpParams(filtro),
    });
  }

  folios(filtro: FiltroBandeja) {
    return this.http.get<Paginado<SolicitudDetalle>>(`${this.base}/folios`, {
      params: aHttpParams(filtro),
    });
  }

  detalle(id: number) {
    return this.http.get<SolicitudDetalle>(`${this.base}/${id}`);
  }

  crear(solicitud: NuevaSolicitud) {
    return this.http.post<SolicitudDetalle>(this.base, solicitud);
  }

  autorizar(id: number) {
    return this.http.patch<{ message: string }>(`${this.base}/${id}/autorizar`, {});
  }

  rechazar(id: number) {
    return this.http.patch<{ message: string }>(`${this.base}/${id}/rechazar`, {});
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
}
