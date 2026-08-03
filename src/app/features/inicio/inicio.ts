import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OficioBandeja, ResumenOficios, ResumenSolicitudes, SolicitudBandeja } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { OficiosService } from '../../core/services/oficios.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { Cargando } from '../../shared/components/cargando';
import { EmptyState } from '../../shared/components/empty-state';
import { EstadoBadge } from '../../shared/components/estado-badge';
import { PageHeader } from '../../shared/components/page-header';

/** Tablero de inicio: sustituye la redirección directa a la bandeja de entrada. */
@Component({
  selector: 'sid-inicio',
  imports: [RouterLink, DatePipe, EstadoBadge, EmptyState, Cargando],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements OnInit, OnDestroy {
  private readonly oficios = inject(OficiosService);
  private readonly solicitudes = inject(SolicitudesService);
  private readonly auth = inject(AuthService);

  protected readonly usuario = this.auth.usuario;

  protected readonly resumenOficios = signal<ResumenOficios | null>(null);
  protected readonly resumenSolicitudes = signal<ResumenSolicitudes | null>(null);
  protected readonly ultimosOficios = signal<OficioBandeja[]>([]);
  protected readonly ultimasSolicitudes = signal<SolicitudBandeja[]>([]);
  protected readonly cargando = signal(true);

  protected readonly hoy = new Date();
  protected readonly hora = signal(this.horaActual());
  private reloj?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Reloj del encabezado, como en el tablero del sistema institucional.
    this.reloj = setInterval(() => this.hora.set(this.horaActual()), 1000);

    this.oficios.resumen().subscribe((resumen) => this.resumenOficios.set(resumen));
    this.solicitudes.resumen().subscribe((resumen) => this.resumenSolicitudes.set(resumen));

    this.oficios
      .bandejaEntrada({ page: 1, perPage: 5, estado: 'pendientes' })
      .subscribe({
        next: (pagina) => {
          this.ultimosOficios.set(pagina.data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });

    this.solicitudes
      .bandejaEntrada({ page: 1, perPage: 5, estado: 'pendientes' })
      .subscribe((pagina) => this.ultimasSolicitudes.set(pagina.data));
  }

  ngOnDestroy(): void {
    clearInterval(this.reloj);
  }

  private horaActual(): string {
    return new Date().toLocaleTimeString('es-MX', { hour12: false });
  }

  /** Saludo según la hora, para dar un tono cercano sin perder formalidad. */
  protected saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
