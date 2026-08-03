import { Component, input } from '@angular/core';

/** Indicador de carga para tablas y tarjetas. */
@Component({
  selector: 'sid-cargando',
  template: `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando</span>
      </div>
      <p class="text-muted-2 small mt-3 mb-0">{{ mensaje() }}</p>
    </div>
  `,
})
export class Cargando {
  readonly mensaje = input<string>('Cargando información…');
}
