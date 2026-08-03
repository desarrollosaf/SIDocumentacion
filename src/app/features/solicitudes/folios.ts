import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FiltroBandeja, Paginado, SolicitudDetalle } from '../../core/models';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { Cargando } from '../../shared/components/cargando';
import { EmptyState } from '../../shared/components/empty-state';
import { PageHeader } from '../../shared/components/page-header';
import { Paginador } from '../../shared/components/paginador';

/** Consulta de folios emitidos. Equivale a BusquedasController@BuscarFolios. */
@Component({
  selector: 'sid-folios',
  imports: [RouterLink, FormsModule, DatePipe, PageHeader, EmptyState, Paginador, Cargando],
  templateUrl: './folios.html',
})
export class Folios implements OnInit {
  private readonly solicitudes = inject(SolicitudesService);

  protected readonly pagina = signal<Paginado<SolicitudDetalle> | null>(null);
  protected readonly cargando = signal(true);
  protected readonly filtro = signal<FiltroBandeja>({ page: 1, perPage: 15 });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);

    this.solicitudes.folios(this.filtro()).subscribe({
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

  protected filtrarPorFechas(desde: string, hasta: string): void {
    this.filtro.update((f) => ({ ...f, desde, hasta, page: 1 }));
    this.cargar();
  }

  protected cambiarPagina(page: number): void {
    this.filtro.update((f) => ({ ...f, page }));
    this.cargar();
  }
}
