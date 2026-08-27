import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Subject } from 'rxjs';

import { Opcion, OpcionApoyo, OpcionClasificacion, Select, ServidorPublico } from '../../core/models';
import { CatalogosService } from '../../core/services/catalogos.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { OficiosService } from '../../core/services/oficios.service';
import { PageHeader } from '../../shared/components/page-header';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  protected readonly tiposApoyo = signal<OpcionApoyo[]>([]);
  protected readonly tipoApoyoOp = signal<OpcionApoyo[]>([]);
  protected readonly tipoApoyoVal = signal<Select[]>([]);
  
  protected readonly resultados = signal<ServidorPublico[]>([]);
  protected readonly destinatarios = signal<DestinatarioElegido[]>([]);
  protected readonly buscando = signal(false);
  protected readonly enviando = signal(false);

  protected readonly mostrarPassword = signal(false);

  private readonly termino$ = new Subject<string>();
 protected readonly expedientesArray = signal<Select[]>([]);

  archivo?: File;
  archivoUrl?: SafeResourceUrl;
  archivoSeleccionado?: File;
  hash?: string;
  psw?: string;

  protected readonly formulario = this.fb.nonNullable.group({
    folio: [''],
    titulo_doc: ['', [Validators.required, Validators.maxLength(255)]],
    fojas: [1, [Validators.min(1)]],
    tipo_doc: [null as number | null],
    serie_id: [null as number | null],
    subserie_id: [null as number | null],
    tipo_apoyo: false,
    tipo_apoyo_id: null as number | null,
    opcion_id: null as  number | null,
    firmar_doc: false,
    psw: [{ value: '', disabled: true }],
    file_path: ['', [Validators.required]],
    expediente_id: null as  number | null,
  });

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.archivoSeleccionado = input.files[0];
    const archivo = input.files[0];
    const url = URL.createObjectURL(archivo);
    this.formulario.patchValue({
      file_path: url
    });

    this.archivoUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.catalogos.tiposDocumento().subscribe((tipos) => this.tiposDocumento.set(tipos));
    this.catalogos.miClasificacion().subscribe((series) => this.clasificacion.set(series));
    this.catalogos.tiposApoyo().subscribe((tiposApoyo) => this.tiposApoyo.set(tiposApoyo));
    this.formulario.controls.tipo_apoyo.valueChanges.subscribe((tipoApoyo) => {
      const serie = this.formulario.controls.serie_id;
      if (tipoApoyo === false) {
        serie.setValidators([Validators.required]);
      } else {
        serie.clearValidators();
      }
      serie.updateValueAndValidity();
  });


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

    this.formulario.get('firmar_doc')?.valueChanges.subscribe((firmar: boolean) => {
      const psw = this.formulario.get('psw');

      if (firmar) {
        psw?.enable();
      } else {
        psw?.disable();
        psw?.reset(); // 
      }
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
    this.getExp(Number(serieId), 1);
  }

  protected alCambiarApoyo(apoyoId: string): void {
    const id = apoyoId ? Number(apoyoId) : null;
    this.formulario.patchValue({ tipo_apoyo_id: id});

    const tipoApoyo = this.tiposApoyo().find((s) => s.id === id);
    this.tipoApoyoVal.set(tipoApoyo?.docsApoyo ?? []);
  }
  

  protected agregar(servidor: ServidorPublico): void {
    // if (this.destinatarios().some((d) => d.rfc === servidor.rfc)) {
    //   this.avisos.advertencia('Ese destinatario ya está en la lista.');
    //   return;
    // }

    this.destinatarios.update((lista) => [...lista, { ...servidor, tipo_atencion: 'E' }]);
    this.resultados.set([]);
  }

  protected quitar(rfc: string): void {
    this.destinatarios.update((lista) => lista.filter((d) => d.rfc !== rfc));
  }

  protected cambiarTipo(index: number, tipo: string): void {
    this.destinatarios.update((lista) =>
        lista.map((d, i) => 
          (i === index ? { ...d, tipo_atencion: tipo } : d)),
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
  
    const formData = new FormData();

    if (this.archivoSeleccionado) {
      formData.append('file', this.archivoSeleccionado);
    }
    formData.append('folio', valores.folio ?? '');
    formData.append('titulo_doc', valores.titulo_doc);
    formData.append('fojas', String(valores.fojas ?? ''));
    formData.append('tipo_doc', String(valores.tipo_doc ?? ''));
    formData.append('serie_id', String(valores.serie_id ?? ''));
    formData.append('subserie_id', String(valores.subserie_id ?? ''));
    formData.append('tipo_apoyo_id', String(valores.opcion_id ?? ''));
    formData.append('firmado', String(valores.firmar_doc ?? false));
    formData.append('hash', String(this.hash ?? ''));
    formData.append('psw', String(this.psw));
    formData.append('expediente_id', String(valores.expediente_id ?? ''));
    formData.append(
      'destinatarios',
      JSON.stringify(this.destinatarios())
    );
    this.oficios.crear(formData).subscribe({
        next: (oficio) => {
          this.enviando.set(false);
          this.avisos.exito(`Oficio registrado con folio ${oficio.folio}.`);
          void this.router.navigate(['/oficios', oficio.id]);
        },
        error: () => this.enviando.set(false),
      });
  }

  validarPsw(){
    this.psw = this.formulario.get('psw')?.value ?? '';
    this.oficios.validarPsw(this.psw).subscribe({
        next: (oficio) => {
          if(oficio.hash == '0'){
            this.avisos.advertencia(`La contraseña no es valida o el certificado no esta vigente.`);
            this.formulario.get('psw')?.reset();
            return;
          }else{
            this.hash = oficio.hash;
          }
        },
        error: () => this.enviando.set(false),
      });
  }

  getExp(idS: any, tipo: number){
    this.oficios.getExp(idS, tipo).subscribe((oficio) => {
      this.expedientesArray.set(oficio);
    });
  }

  protected alternarPassword(): void {
    this.mostrarPassword.update((visible) => !visible);
  }

}
