import { Component, input } from '@angular/core';

/** Estado vacío de listados: explica la ausencia de datos en lugar de dejar la tabla en blanco. */
@Component({
  selector: 'sid-empty-state',
  template: `
    <div class="text-center py-5 px-3">
      <i class="bi fs-1 text-secondary opacity-50" [class]="icono()" aria-hidden="true"></i>
      <p class="fw-semibold mt-3 mb-1">{{ titulo() }}</p>
      @if (descripcion()) {
        <p class="text-muted-2 mb-0 small">{{ descripcion() }}</p>
      }
      <div class="mt-3">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyState {
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>('');
  readonly icono = input<string>('bi-inbox');
}
