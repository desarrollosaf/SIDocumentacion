import { Component, computed, input, output } from '@angular/core';

/** Paginación de listados; muestra hasta cinco páginas alrededor de la actual. */
@Component({
  selector: 'sid-paginador',
  template: `
    @if (totalPaginas() > 1) {
      <nav
        class="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2 border-top"
        aria-label="Paginación de resultados"
      >
        <p class="small text-muted-2 mb-0">
          Mostrando {{ desde() }}–{{ hasta() }} de {{ total() }} registros
        </p>

        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" [class.disabled]="pagina() === 1">
            <button type="button" class="page-link" (click)="ir(pagina() - 1)">
              <i class="bi bi-chevron-left" aria-hidden="true"></i>
              <span class="visually-hidden">Página anterior</span>
            </button>
          </li>

          @for (p of paginasVisibles(); track p) {
            <li class="page-item" [class.active]="p === pagina()">
              <button type="button" class="page-link" (click)="ir(p)">{{ p }}</button>
            </li>
          }

          <li class="page-item" [class.disabled]="pagina() === totalPaginas()">
            <button type="button" class="page-link" (click)="ir(pagina() + 1)">
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
              <span class="visually-hidden">Página siguiente</span>
            </button>
          </li>
        </ul>
      </nav>
    }
  `,
})
export class Paginador {
  readonly pagina = input.required<number>();
  readonly totalPaginas = input.required<number>();
  readonly total = input.required<number>();
  readonly porPagina = input<number>(10);

  readonly cambio = output<number>();

  readonly desde = computed(() => (this.pagina() - 1) * this.porPagina() + 1);
  readonly hasta = computed(() => Math.min(this.pagina() * this.porPagina(), this.total()));

  readonly paginasVisibles = computed(() => {
    const total = this.totalPaginas();
    const actual = this.pagina();
    const inicio = Math.max(1, Math.min(actual - 2, total - 4));
    const fin = Math.min(total, inicio + 4);

    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });

  ir(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas() && pagina !== this.pagina()) {
      this.cambio.emit(pagina);
    }
  }
}
