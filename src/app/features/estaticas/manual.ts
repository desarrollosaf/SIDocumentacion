import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeader } from '../../shared/components/page-header';

/**
 * Guía de uso del sistema. En el sistema original esta ruta entrega un PDF;
 * aquí se resume el flujo y se deja el enlace de descarga cuando exista.
 */
@Component({
  selector: 'sid-manual',
  imports: [RouterLink, PageHeader],
  template: `
    <sid-page-header
      titulo="Manual de usuario"
      descripcion="Guía rápida para operar el sistema de documentación."
      [migas]="[{ etiqueta: 'Manual' }]"
    />

    <div class="row g-3">
      <div class="col-12 col-lg-8">
        <section class="sid-card p-4">
          <h2 class="h6 mb-3">Flujo de trabajo</h2>

          <ol class="sid-manual__pasos">
            <li>
              <strong>Registro del documento.</strong> Captura el asunto, las
              fechas y la clasificación archivística desde
              <a routerLink="/oficios/carga">Carga de documento</a> o
              <a routerLink="/solicitudes/nueva">Nueva solicitud</a>.
            </li>
            <li>
              <strong>Turno.</strong> Elige a las personas destinatarias e indica
              si el documento es para atención o para conocimiento.
            </li>
            <li>
              <strong>Seguimiento.</strong> Consulta la
              <a routerLink="/oficios/entrada">bandeja de entrada</a> para los
              documentos dirigidos a ti y la
              <a routerLink="/oficios/salida">bandeja de salida</a> para los que
              enviaste. Abrir un documento lo marca como visto.
            </li>
            <li>
              <strong>Cierre.</strong> Al concluir la gestión marca el documento
              como atendido; la fecha de atención queda registrada.
            </li>
            <li>
              <strong>Plazos.</strong> La <a routerLink="/agenda">agenda</a>
              muestra las fechas límite; los documentos fuera de plazo se
              resaltan en rojo en las bandejas.
            </li>
          </ol>
        </section>
      </div>

      <div class="col-12 col-lg-4">
        <section class="sid-card p-4 h-100">
          <h2 class="h6 mb-3">Estados de un documento</h2>

          <ul class="list-unstyled small mb-0 d-grid gap-3">
            <li>
              <span class="badge badge-estado text-primary-emphasis bg-primary-subtle">
                Sin revisar
              </span>
              <p class="mb-0 mt-1 text-muted-2">Aún no has abierto el documento.</p>
            </li>
            <li>
              <span class="badge badge-estado text-warning-emphasis bg-warning-subtle">
                En proceso
              </span>
              <p class="mb-0 mt-1 text-muted-2">Ya lo abriste pero no lo has concluido.</p>
            </li>
            <li>
              <span class="badge badge-estado text-success-emphasis bg-success-subtle">
                Atendido
              </span>
              <p class="mb-0 mt-1 text-muted-2">La gestión quedó cerrada.</p>
            </li>
            <li>
              <span class="badge badge-estado text-danger-emphasis bg-danger-subtle">
                Vencido
              </span>
              <p class="mb-0 mt-1 text-muted-2">Se superó la fecha límite de atención.</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: `
    .sid-manual__pasos {
      margin: 0;
      padding-inline-start: 1.15rem;
      display: grid;
      gap: 0.9rem;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  `,
})
export class Manual {}
