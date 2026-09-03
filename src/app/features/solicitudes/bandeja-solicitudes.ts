import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FiltroBandeja, Paginado, SolicitudBandeja } from '../../core/models';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { Cargando } from '../../shared/components/cargando';
import { EmptyState } from '../../shared/components/empty-state';
import { EstadoBadge } from '../../shared/components/estado-badge';
import { PageHeader } from '../../shared/components/page-header';
import { Paginador } from '../../shared/components/paginador';

/** Vistas de solicitudes que comparte la ruta mediante `data.vista`. */
export type VistaSolicitudes =
  | 'entrada'
  | 'salida'
  | 'atendidos-entrada'
  | 'atendidos-salida'
  | 'preregistro';

const TITULOS: Record<VistaSolicitudes, { titulo: string; descripcion: string }> = {
  entrada: {
    titulo: 'Bandeja de entrada',
    descripcion: 'Solicitudes turnadas a tu persona pendientes de atención.',
  },
  salida: {
    titulo: 'Bandeja de salida',
    descripcion: 'Solicitudes que registraste y turnaste a otras áreas.',
  },
  'atendidos-entrada': {
    titulo: 'Atendidos de entrada',
    descripcion: 'Solicitudes turnadas a tu persona que ya concluiste.',
  },
  'atendidos-salida': {
    titulo: 'Atendidos de salida',
    descripcion: 'Solicitudes que registraste y que ya fueron atendidas.',
  },
  preregistro: {
    titulo: 'Preregistro',
    descripcion: 'Solicitudes capturadas en espera de autorización.',
  },
};

@Component({
  selector: 'sid-bandeja-solicitudes',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    PageHeader,
    EstadoBadge,
    EmptyState,
    Paginador,
    Cargando,
  ],
  templateUrl: './bandeja-solicitudes.html',
})
export class BandejaSolicitudes implements OnInit {
  private readonly solicitudes = inject(SolicitudesService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly avisos = inject(NotificacionService);

  protected readonly vista = signal<VistaSolicitudes>('entrada');
  protected readonly pagina = signal<Paginado<SolicitudBandeja> | null>(null);
  protected readonly cargando = signal(true);
  protected readonly filtro = signal<FiltroBandeja>({ page: 1, perPage: 10 });


  ngOnInit(): void {
    // La ruta se reutiliza para las cinco vistas; se relee en cada navegación.
    this.ruta.data.subscribe((data) => {
      this.vista.set((data['vista'] as VistaSolicitudes) ?? 'entrada');
      this.filtro.set({ page: 1, perPage: 10, estado: this.estadoInicial() });
      this.cargar();
    });
  }

  protected get titulo(): string {
    return TITULOS[this.vista()].titulo;
  }

  protected get descripcion(): string {
    return TITULOS[this.vista()].descripcion;
  }

  protected get esEntrada(): boolean {
    return this.vista() === 'entrada' || this.vista() === 'atendidos-entrada';
  }

  protected get esPreregistro(): boolean {
    return this.vista() === 'preregistro';
  }

  /**
   * El sistema original no condiciona la autorización a un rol, así que
   * cualquier sesión válida puede resolver los preregistros que consulta.
   */
  protected get puedeAutorizar(): boolean {
    return true;
  }

  protected cargar(): void {
    this.cargando.set(true);
    const filtro = this.filtro();

    const peticion = this.esPreregistro
      ? this.solicitudes.preregistros(filtro)
      : this.esEntrada
        ? this.solicitudes.bandejaEntrada(filtro)
        : this.solicitudes.bandejaSalida(filtro);

    peticion.subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected buscar(termino: string): void {
    this.filtro.update((f) => ({ ...f, search: termino, page: 1 }));
    this.cargar();
  }

  protected cambiarPagina(page: number): void {
    this.filtro.update((f) => ({ ...f, page }));
    this.cargar();
  }

  protected atender(solicitud: SolicitudBandeja): void {
    if (!solicitud.atencion_id) {
      return;
    }

    this.solicitudes.atender(solicitud.atencion_id).subscribe(({ message }) => {
      this.avisos.exito(message);
      this.cargar();
    });
  }

  protected autorizar(solicitud: SolicitudBandeja): void {
    this.solicitudes.autorizar(solicitud.id).subscribe(({ message }) => {
      this.avisos.exito(message);
      this.cargar();
    });
  }

  protected rechazar(solicitud: SolicitudBandeja): void {
    this.solicitudes.rechazar(solicitud.id).subscribe(({ message }) => {
      this.avisos.exito(message);
      this.cargar();
    });
  }

  /** Texto del plazo, con el detalle del retraso cuando ya venció. */
  protected textoPlazo(dias: number | null): string {
    if (dias === null) return '—';
    if (dias < 0) return `Vencida hace ${Math.abs(dias)} d`;
    if (dias === 0) return 'Vence hoy';
    return `${dias} d restantes`;
  }

  private estadoInicial(): FiltroBandeja['estado'] {
    switch (this.vista()) {
      case 'entrada':
        return 'pendientes';
      case 'atendidos-entrada':
      case 'atendidos-salida':
        return 'atendidos';
      default:
        return 'todos';
    }
  }

}
