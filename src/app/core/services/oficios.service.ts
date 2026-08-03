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

export interface NuevoOficio {
  titulo_doc: string;
  fojas?: number;
  serie_id?: number;
  subserie_id?: number;
  tipo_doc?: number;
  destinatarios: Array<{ rfc_atencion: string; tipo_atencion: string }>;
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

  crear(oficio: NuevoOficio) {
    return this.http.post<OficioDetalle>(this.base, oficio);
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
