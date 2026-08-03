import { Component, computed, input } from '@angular/core';

/**
 * Insignia de estado de un documento en bandeja. Combina icono y texto para no
 * depender únicamente del color, que es un requisito de accesibilidad.
 */
@Component({
  selector: 'sid-estado-badge',
  template: `
    <span class="badge badge-estado" [class]="clases()">
      <i class="bi" [class]="icono()" aria-hidden="true"></i>
      {{ etiqueta() }}
    </span>
  `,
})
export class EstadoBadge {
  readonly atendido = input<boolean>(false);
  readonly visto = input<boolean>(false);
  /** Días para la fecha límite; si es negativo el documento está vencido. */
  readonly diasRestantes = input<number | null>(null);

  readonly etiqueta = computed(() => {
    if (this.atendido()) return 'Atendido';
    if (this.estaVencido()) return 'Vencido';
    if (this.visto()) return 'En proceso';
    return 'Sin revisar';
  });

  readonly icono = computed(() => {
    if (this.atendido()) return 'bi-check-circle-fill';
    if (this.estaVencido()) return 'bi-exclamation-triangle-fill';
    if (this.visto()) return 'bi-hourglass-split';
    return 'bi-envelope-fill';
  });

  readonly clases = computed(() => {
    if (this.atendido()) return 'text-success-emphasis bg-success-subtle';
    if (this.estaVencido()) return 'text-danger-emphasis bg-danger-subtle';
    if (this.visto()) return 'text-warning-emphasis bg-warning-subtle';
    return 'text-primary-emphasis bg-primary-subtle';
  });

  private estaVencido(): boolean {
    const dias = this.diasRestantes();
    return dias !== null && dias < 0;
  }
}
