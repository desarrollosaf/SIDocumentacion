import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OficioDetalle, etiquetaPapel } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { OficiosService } from '../../core/services/oficios.service';
import { Cargando } from '../../shared/components/cargando';
import { PageHeader } from '../../shared/components/page-header';

@Component({
  selector: 'sid-detalle-oficio',
  imports: [DatePipe, PageHeader, Cargando],
  templateUrl: './detalle-oficio.html',
})
export class DetalleOficio implements OnInit {
  private readonly oficios = inject(OficiosService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(NotificacionService);

  protected readonly oficio = signal<OficioDetalle | null>(null);
  protected readonly cargando = signal(true);

  /** `E` elaboró · `R` revisó · `A` autorizó. */
  protected readonly etiquetaPapel = etiquetaPapel;

  ngOnInit(): void {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  /** Turno del usuario en sesión dentro de este oficio, si lo tiene. */
  protected miAtencion() {
    const rfc = this.auth.usuario()?.rfc;
    return this.oficio()?.destinatarios.find((d) => d.rfc_atencion === rfc) ?? null;
  }

  protected atender(): void {
    const atencion = this.miAtencion();
    if (!atencion) {
      return;
    }

    this.oficios.atender(atencion.id).subscribe(({ message }) => {
      this.avisos.exito(message);
      this.cargar(this.oficio()!.id);
    });
  }

  protected regresar(): void {
    this.location.back();
  }

  private cargar(id: number): void {
    this.cargando.set(true);

    this.oficios.detalle(id).subscribe({
      next: (oficio) => {
        this.oficio.set(oficio);
        this.cargando.set(false);

        // Abrir el detalle equivale a acusar de vista, igual que en el original.
        const atencion = this.miAtencion();
        if (atencion && !atencion.visto) {
          this.oficios.marcarVisto(atencion.id).subscribe();
        }
      },
      error: () => this.cargando.set(false),
    });
  }
}
