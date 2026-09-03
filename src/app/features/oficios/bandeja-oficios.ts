import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FiltroBandeja, OficioBandeja, Paginado } from '../../core/models';
import { NotificacionService } from '../../core/services/notificacion.service';
import { OficiosService } from '../../core/services/oficios.service';
import { Cargando } from '../../shared/components/cargando';
import { EmptyState } from '../../shared/components/empty-state';
import { EstadoBadge } from '../../shared/components/estado-badge';
import { PageHeader } from '../../shared/components/page-header';
import { Paginador } from '../../shared/components/paginador';

/**
 * Bandeja de oficios. Sirve tanto a entrada como a salida: la ruta declara el
 * tipo en `data.tipo`, evitando duplicar una pantalla casi idéntica.
 */
@Component({
  selector: 'sid-bandeja-oficios',
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
  templateUrl: './bandeja-oficios.html',
})
export class BandejaOficios implements OnInit {
  private readonly oficios = inject(OficiosService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly avisos = inject(NotificacionService);

  protected readonly tipo = signal<'entrada' | 'salida'>('entrada');
  protected readonly pagina = signal<Paginado<OficioBandeja> | null>(null);
  protected readonly cargando = signal(true);

  protected modalEliminarAbierto = signal(false);

  protected readonly filtro = signal<FiltroBandeja>({
    page: 1,
    perPage: 10,
    estado: 'pendientes',
    search: '',
  });

  ngOnInit(): void {
    this.tipo.set((this.ruta.snapshot.data['tipo'] as 'entrada' | 'salida') ?? 'entrada');

    // La bandeja de salida no filtra por estado de atención propio.
    if (this.tipo() === 'salida') {
      this.filtro.update((f) => ({ ...f, estado: 'todos' }));
    }
    this.cargar();
  }

  protected get esEntrada(): boolean {
    return this.tipo() === 'entrada';
  }

  protected cargar(): void {
    this.cargando.set(true);
    const filtro = this.filtro();

    const peticion = this.esEntrada
      ? this.oficios.bandejaEntrada(filtro)
      : this.oficios.bandejaSalida(filtro);

    peticion.subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected cambiarEstado(estado: FiltroBandeja['estado']): void {
    this.filtro.update((f) => ({ ...f, estado, page: 1 }));
    this.cargar();
  }

  protected buscar(termino: string): void {
    this.filtro.update((f) => ({ ...f, search: termino, page: 1 }));
    this.cargar();
  }

  protected cambiarPagina(page: number): void {
    this.filtro.update((f) => ({ ...f, page }));
    this.cargar();
  }

  protected limpiarFiltros(): void {
    this.filtro.set({
      page: 1,
      perPage: 10,
      estado: this.esEntrada ? 'pendientes' : 'todos',
      search: '',
    });
    this.cargar();
  }

  protected atender(oficio: OficioBandeja): void {
    if (!oficio.atencion_id) {
      return;
    }

    this.oficios.atender(oficio.atencion_id).subscribe(({ message }) => {
      this.avisos.exito(message);
      this.cargar();
    });
  }

  
  eliminar(id: number) {
    this.abrirModalEliminar();
  }

   protected abrirModalEliminar(): void {
    this.modalEliminarAbierto.set(true);
  }

  protected cerrarModalEliminar(): void {
    this.modalEliminarAbierto.set(false);
  }

  eliminarR(id: number){
    this.oficios.eliminarRegistro(id).subscribe({
      next: (oficio) => {
        if(oficio == true){
           this.cerrarModalEliminar();
          this.avisos.exito('Eliminado correctamente.');
           this.cargar();
          return;     
        }else{
          this.avisos.advertencia('El registro no se pudo eliminar.');
          return;  
        }
      }
    });
  }
}
