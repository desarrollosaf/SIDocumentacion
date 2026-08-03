import { Component, inject } from '@angular/core';
import { NotificacionService, TipoAviso } from '../../core/services/notificacion.service';

/** Contenedor de avisos emergentes, anclado en la esquina inferior derecha. */
@Component({
  selector: 'sid-avisos',
  template: `
    <div class="sid-avisos" role="status" aria-live="polite">
      @for (aviso of avisos.avisos(); track aviso.id) {
        <div class="toast show align-items-center border-0 mb-2" [class]="clase(aviso.tipo)">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-start gap-2">
              <i class="bi mt-1" [class]="icono(aviso.tipo)" aria-hidden="true"></i>
              <span>{{ aviso.mensaje }}</span>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar aviso"
              (click)="avisos.descartar(aviso.id)"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .sid-avisos {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 1080;
      max-width: min(24rem, calc(100vw - 2rem));
    }
  `,
})
export class Avisos {
  protected readonly avisos = inject(NotificacionService);

  protected clase(tipo: TipoAviso): string {
    return {
      exito: 'text-bg-success',
      error: 'text-bg-danger',
      advertencia: 'text-bg-warning',
      info: 'text-bg-secondary',
    }[tipo];
  }

  protected icono(tipo: TipoAviso): string {
    return {
      exito: 'bi-check-circle-fill',
      error: 'bi-x-octagon-fill',
      advertencia: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
    }[tipo];
  }
}
