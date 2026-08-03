import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DocumentoFirmable, FirmaService } from '../../core/services/firma.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Cargando } from '../../shared/components/cargando';
import { EmptyState } from '../../shared/components/empty-state';
import { PageHeader } from '../../shared/components/page-header';

/**
 * Firma electrónica de documentos contra el servicio institucional FEPLEM.
 * La contraseña de la FIEL solo vive en memoria durante la petición.
 */
@Component({
  selector: 'sid-firma',
  imports: [FormsModule, DatePipe, PageHeader, EmptyState, Cargando],
  templateUrl: './firma.html',
})
export class Firma implements OnInit {
  private readonly firma = inject(FirmaService);
  private readonly avisos = inject(NotificacionService);

  protected readonly documentos = signal<DocumentoFirmable[]>([]);
  protected readonly cargando = signal(true);
  protected readonly filtro = signal<'pendientes' | 'firmados' | 'todos'>('pendientes');

  /** Documento en proceso de firma; abre el diálogo de contraseña. */
  protected readonly seleccionado = signal<DocumentoFirmable | null>(null);
  protected readonly password = signal('');
  protected readonly mostrarPassword = signal(false);
  protected readonly firmando = signal(false);

  protected readonly visibles = computed(() => {
    const filtro = this.filtro();
    return this.documentos().filter((d) =>
      filtro === 'todos' ? true : filtro === 'firmados' ? d.firmado : !d.firmado,
    );
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);

    this.firma.documentos().subscribe({
      next: (documentos) => {
        this.documentos.set(documentos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected abrirDialogo(documento: DocumentoFirmable): void {
    this.seleccionado.set(documento);
    this.password.set('');
    this.mostrarPassword.set(false);
  }

  protected cerrarDialogo(): void {
    if (this.firmando()) {
      return;
    }
    this.seleccionado.set(null);
    this.password.set('');
  }

  protected confirmarFirma(): void {
    const documento = this.seleccionado();
    const password = this.password();

    if (!documento || !password || this.firmando()) {
      return;
    }

    this.firmando.set(true);

    this.firma.firmar(documento, password).subscribe({
      next: ({ message }) => {
        this.firmando.set(false);
        this.password.set('');
        this.seleccionado.set(null);
        this.avisos.exito(message);
        this.cargar();
      },
      error: () => {
        // El interceptor ya muestra el motivo; se conserva el diálogo abierto
        // para que la persona pueda reintentar sin volver a empezar.
        this.firmando.set(false);
        this.password.set('');
      },
    });
  }
}
