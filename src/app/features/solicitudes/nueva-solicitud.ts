import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { Opcion, OpcionClasificacion, ServidorPublico } from '../../core/models';
import { CatalogosService } from '../../core/services/catalogos.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { PageHeader } from '../../shared/components/page-header';

interface TurnoElegido extends ServidorPublico {
  instruccion: string;
}

/** Alta de solicitud con turnos. Equivale a la vista `registro` del sistema original. */
@Component({
  selector: 'sid-nueva-solicitud',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, PageHeader],
  templateUrl: './nueva-solicitud.html',
})
export class NuevaSolicitud implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly solicitudes = inject(SolicitudesService);
  private readonly catalogos = inject(CatalogosService);
  private readonly avisos = inject(NotificacionService);
  private readonly router = inject(Router);

  protected readonly tiposAtencion = signal<Opcion[]>([]);
  protected readonly tiposDocumento = signal<Opcion[]>([]);
  protected readonly clasificacion = signal<OpcionClasificacion[]>([]);
  protected readonly subseries = signal<Opcion[]>([]);

  protected readonly resultados = signal<ServidorPublico[]>([]);
  protected readonly turnos = signal<TurnoElegido[]>([]);
  protected readonly enviando = signal(false);

  private readonly termino$ = new Subject<string>();

  private readonly hoy = new Date().toISOString().slice(0, 10);

  protected readonly formulario = this.fb.nonNullable.group({
    titulo_doc: ['', [Validators.required, Validators.maxLength(255)]],
    fecha_recepcion: [this.hoy, [Validators.required]],
    fecha_documento: [this.hoy, [Validators.required]],
    fecha_limite_atencion: ['', [Validators.required]],
    tipo_atencion: [null as number | null, [Validators.required]],
    tipo_doc: [null as number | null],
    subserie_id: [null as number | null],
    fojas: [1, [Validators.min(1)]],
  });

  ngOnInit(): void {
    this.catalogos.tiposAtencion().subscribe((tipos) => this.tiposAtencion.set(tipos));
    this.catalogos.tiposDocumento().subscribe((tipos) => this.tiposDocumento.set(tipos));
    this.catalogos.miClasificacion().subscribe((series) => this.clasificacion.set(series));

    this.termino$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((termino) => this.catalogos.buscarServidores(termino)),
      )
      .subscribe((servidores) => this.resultados.set(servidores));
  }

  protected buscar(termino: string): void {
    if (termino.trim().length < 3) {
      this.resultados.set([]);
      return;
    }
    this.termino$.next(termino);
  }

  protected alCambiarSerie(serieId: string): void {
    const id = serieId ? Number(serieId) : null;
    this.formulario.patchValue({ subserie_id: null });

    const serie = this.clasificacion().find((s) => s.id === id);
    this.subseries.set(serie?.subseries ?? []);
  }

  protected agregar(servidor: ServidorPublico): void {
    if (this.turnos().some((t) => t.rfc === servidor.rfc)) {
      this.avisos.advertencia('Esa persona ya está en la lista de turnos.');
      return;
    }

    this.turnos.update((lista) => [...lista, { ...servidor, instruccion: '' }]);
    this.resultados.set([]);
  }

  protected quitar(rfc: string): void {
    this.turnos.update((lista) => lista.filter((t) => t.rfc !== rfc));
  }

  protected cambiarInstruccion(rfc: string, instruccion: string): void {
    this.turnos.update((lista) =>
      lista.map((t) => (t.rfc === rfc ? { ...t, instruccion } : t)),
    );
  }

  /** `preregistro` deja la solicitud en espera de autorización. */
  protected enviar(preregistro = false): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (!this.turnos().length) {
      this.avisos.advertencia('Turna la solicitud al menos a una persona.');
      return;
    }

    const valores = this.formulario.getRawValue();
    this.enviando.set(true);

    this.solicitudes
      .crear({
        titulo_doc: valores.titulo_doc,
        fecha_recepcion: valores.fecha_recepcion,
        fecha_documento: valores.fecha_documento,
        fecha_limite_atencion: valores.fecha_limite_atencion,
        tipo_atencion: valores.tipo_atencion!,
        tipo_doc: valores.tipo_doc ?? undefined,
        subserie_id: valores.subserie_id ?? undefined,
        fojas: valores.fojas ?? undefined,
        preregistro,
        turnos: this.turnos().map((t) => ({
          user_rfc: t.rfc,
          instruccion: t.instruccion || undefined,
        })),
      })
      .subscribe({
        next: (solicitud) => {
          this.enviando.set(false);
          this.avisos.exito(
            preregistro
              ? `Preregistro guardado con folio ${solicitud.folio}.`
              : `Solicitud registrada con folio ${solicitud.folio}.`,
          );
          void this.router.navigate(['/solicitudes', solicitud.id]);
        },
        error: () => this.enviando.set(false),
      });
  }
}
