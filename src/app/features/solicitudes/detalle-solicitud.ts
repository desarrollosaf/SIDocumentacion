import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SolicitudDetalle } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { Cargando } from '../../shared/components/cargando';
import { PageHeader } from '../../shared/components/page-header';

@Component({
  selector: 'sid-detalle-solicitud',
  imports: [DatePipe, PageHeader, Cargando],
  templateUrl: './detalle-solicitud.html',
})
export class DetalleSolicitud implements OnInit {
  private readonly solicitudes = inject(SolicitudesService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(NotificacionService);

  protected readonly solicitud = signal<SolicitudDetalle | null>(null);
  protected readonly cargando = signal(true);

  ngOnInit(): void {
    this.cargar(Number(this.ruta.snapshot.paramMap.get('id')));
  }

  protected miTurno() {
    const rfc = this.auth.usuario()?.rfc;
    return this.solicitud()?.atenciones.find((a) => a.user_rfc === rfc) ?? null;
  }

  protected atender(): void {
    const turno = this.miTurno();
    if (!turno) {
      return;
    }

    this.solicitudes.atender(turno.id).subscribe(({ message }) => {
      this.avisos.exito(message);
      this.cargar(this.solicitud()!.id);
    });
  }

  protected regresar(): void {
    this.location.back();
  }

  private cargar(id: number): void {
    this.cargando.set(true);

    this.solicitudes.detalle(id).subscribe({
      next: (solicitud) => {
        this.solicitud.set(solicitud);
        this.cargando.set(false);

        // Abrir el detalle acusa de vista el turno propio.
        const turno = this.miTurno();
        if (turno && !turno.visto) {
          this.solicitudes.marcarVisto(turno.id).subscribe();
        }
      },
      error: () => this.cargando.set(false),
    });
  }
}
