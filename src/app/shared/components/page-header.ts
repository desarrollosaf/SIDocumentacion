import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Miga {
  etiqueta: string;
  ruta?: string;
}

/** Encabezado de página: título, ruta de navegación y acciones contextuales. */
@Component({
  selector: 'sid-page-header',
  imports: [RouterLink],
  template: `
    <header class="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
      <div>
        @if (migas().length) {
          <nav aria-label="Ruta de navegación">
            <ol class="breadcrumb mb-1 small">
              <li class="breadcrumb-item">
                <a routerLink="/inicio" class="text-decoration-none">Inicio</a>
              </li>
              @for (miga of migas(); track miga.etiqueta) {
                <li class="breadcrumb-item" [class.active]="!miga.ruta">
                  @if (miga.ruta) {
                    <a [routerLink]="miga.ruta" class="text-decoration-none">
                      {{ miga.etiqueta }}
                    </a>
                  } @else {
                    {{ miga.etiqueta }}
                  }
                </li>
              }
            </ol>
          </nav>
        }

        <h1 class="sid-page-title">{{ titulo() }}</h1>

        @if (descripcion()) {
          <p class="text-muted-2 mb-0 mt-1">{{ descripcion() }}</p>
        }
      </div>

      <div class="d-flex flex-wrap gap-2">
        <ng-content />
      </div>
    </header>
  `,
})
export class PageHeader {
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>('');
  readonly migas = input<Miga[]>([]);
}
