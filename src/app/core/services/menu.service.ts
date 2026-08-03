import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MenuItem } from '../models';

/**
 * El menú lo entrega el backend ya filtrado por rol y RFC, replicando las
 * reglas del sidebar de Blade sin duplicarlas en el cliente.
 */
@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  private readonly _items = signal<MenuItem[]>([]);
  readonly items = this._items.asReadonly();

  cargar() {
    return this.http
      .get<MenuItem[]>(`${environment.apiUrl}/menu`)
      .pipe(tap((items) => this._items.set(items)));
  }

  limpiar() {
    this._items.set([]);
  }
}
