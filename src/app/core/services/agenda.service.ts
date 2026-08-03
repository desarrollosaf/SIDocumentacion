import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { EventoAgenda } from '../models';
import { aHttpParams } from './http-params.util';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/agenda`;

  eventos(desde?: string, hasta?: string) {
    return this.http.get<EventoAgenda[]>(this.base, {
      params: aHttpParams({ desde, hasta }),
    });
  }

  detalle(id: number) {
    return this.http.get<EventoAgenda>(`${this.base}/${id}`);
  }
}
