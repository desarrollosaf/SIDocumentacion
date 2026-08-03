import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Subject } from 'rxjs';

import { Opcion, OpcionClasificacion, ServidorPublico } from '../../core/models';
import { CatalogosService } from '../../core/services/catalogos.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { OficiosService } from '../../core/services/oficios.service';
import { PageHeader } from '../../shared/components/page-header';

interface DestinatarioElegido extends ServidorPublico {
  /** Papel en el flujo de firma: `E` elaboró · `R` revisó · `A` autorizó. */
  tipo_atencion: string;
}

/** Alta de oficio con sus destinatarios. Equivale a la vista `cargarDoc`. */
@Component({
  selector: 'sid-carga-oficio',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, PageHeader],
  templateUrl: './carga-oficio.html',
})
export class CargaOficio implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly oficios = inject(OficiosService);
  private readonly catalogos = inject(CatalogosService);
  private readonly avisos = inject(NotificacionService);
  private readonly router = inject(Router);

  protected readonly tiposDocumento = signal<Opcion[]>([]);
  protected readonly clasificacion = signal<OpcionClasificacion[]>([]);
  protected readonly subseries = signal<Opcion[]>([]);

  protected readonly resultados = signal<ServidorPublico[]>([]);
  protected readonly destinatarios = signal<DestinatarioElegido[]>([]);
  protected readonly buscando = signal(false);
  protected readonly enviando = signal(false);

  private readonly termino$ = new Subject<string>();

  protected readonly formulario = this.fb.nonNullable.group({
    titulo_doc: ['', [Validators.required, Validators.maxLength(255)]],
    fojas: [1, [Validators.min(1)]],
    tipo_doc: [null as number | null],
    serie_id: [null as number | null],
    subserie_id: [null as number | null],
  });

  ngOnInit(): void {
    this.catalogos.tiposDocumento().subscribe((tipos) => this.tiposDocumento.set(tipos));
    this.catalogos.miClasificacion().subscribe((series) => this.clasificacion.set(series));

    // El buscador consulta al padrón institucional conforme se escribe.
    this.termino$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((termino) => this.catalogos.buscarServidores(termino)),
      )
      .subscribe((servidores) => {
        this.resultados.set(servidores);
        this.buscando.set(false);
      });
  }

  protected buscar(termino: string): void {
    if (termino.trim().length < 3) {
      this.resultados.set([]);
      return;
    }

    this.buscando.set(true);
    this.termino$.next(termino);
  }

  /** Al elegir serie se recargan sus subseries, como los selects encadenados originales. */
  protected alCambiarSerie(serieId: string): void {
    const id = serieId ? Number(serieId) : null;
    this.formulario.patchValue({ serie_id: id, subserie_id: null });

    const serie = this.clasificacion().find((s) => s.id === id);
    this.subseries.set(serie?.subseries ?? []);
  }

  protected agregar(servidor: ServidorPublico): void {
    if (this.destinatarios().some((d) => d.rfc === servidor.rfc)) {
      this.avisos.advertencia('Ese destinatario ya está en la lista.');
      return;
    }

    this.destinatarios.update((lista) => [...lista, { ...servidor, tipo_atencion: 'E' }]);
    this.resultados.set([]);
  }

  protected quitar(rfc: string): void {
    this.destinatarios.update((lista) => lista.filter((d) => d.rfc !== rfc));
  }

  protected cambiarTipo(rfc: string, tipo: string): void {
    this.destinatarios.update((lista) =>
      lista.map((d) => (d.rfc === rfc ? { ...d, tipo_atencion: tipo } : d)),
    );
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (!this.destinatarios().length) {
      this.avisos.advertencia('Agrega al menos un destinatario.');
      return;
    }

    const valores = this.formulario.getRawValue();
    this.enviando.set(true);

    this.oficios
      .crear({
        titulo_doc: valores.titulo_doc,
        fojas: valores.fojas ?? undefined,
        tipo_doc: valores.tipo_doc ?? undefined,
        serie_id: valores.serie_id ?? undefined,
        subserie_id: valores.subserie_id ?? undefined,
        destinatarios: this.destinatarios().map((d) => ({
          rfc_atencion: d.rfc,
          tipo_atencion: d.tipo_atencion,
        })),
      })
      .subscribe({
        next: (oficio) => {
          this.enviando.set(false);
          this.avisos.exito(`Oficio registrado con folio ${oficio.folio}.`);
          void this.router.navigate(['/oficios', oficio.id]);
        },
        error: () => this.enviando.set(false),
      });
  }
}
