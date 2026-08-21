import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { OficioDetalle, etiquetaPapel } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { OficiosService } from '../../core/services/oficios.service';
import { Cargando } from '../../shared/components/cargando';
import { PageHeader } from '../../shared/components/page-header';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { required } from '@angular/forms/signals';


@Component({
  selector: 'sid-detalle-oficio',
  imports: [DatePipe, PageHeader, Cargando, ReactiveFormsModule ],
  templateUrl: './detalle-oficio.html',
})
export class DetalleOficio implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly oficios = inject(OficiosService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(NotificacionService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly oficio = signal<OficioDetalle | null>(null);
  protected readonly cargando = signal(true);
  protected archivoUrl: SafeResourceUrl | null = null;
  protected modalFirmaAbierto = signal(false);
  /** `E` elaboró · `R` revisó · `A` autorizó. */
  protected readonly etiquetaPapel = etiquetaPapel;
  protected readonly formulario = this.fb.nonNullable.group({
      psw:  ['', [Validators.required]],
  });

  psw?: string | '';

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
          // this.oficios.marcarVisto(atencion.id).subscribe();
        }
      },
      error: () => this.cargando.set(false),
    });
  }

  verPdf(id: number, tipo: number): void {
    this.oficios.validarFirmado(id).subscribe({
      next: (bandera: boolean) => {
        if(bandera == false){
          this.abrirModalFirma();
        }else{
          this.oficios.verPdf(id, tipo).subscribe({
            next: (pdf: Blob) => {
              const url = URL.createObjectURL(pdf);
              this.archivoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            },
            error: (error) => {
              console.error('Error al obtener PDF:', error);
            }
          })
        }
      }
    });
    
  }

  protected abrirModalFirma(): void {
    this.modalFirmaAbierto.set(true);
  }

  protected cerrarVisor(): void {
    this.archivoUrl = null;
  }

  protected cerrarModalFirma(): void {
    this.modalFirmaAbierto.set(false);
  }

  validarPsw(){
    this.psw = this.formulario.get('psw')?.value ?? '';
    this.oficios.validarPsw(this.psw).subscribe({
        next: (oficio) => {
          if(oficio.hash == '0'){
            this.avisos.advertencia(`La contraseña no es valida o el certificado no esta vigente.`);
            this.formulario.get('psw')?.reset();
            return;
          }
        },
      });
  }


  firmarDoc(id: number){
    this.validarPsw();
    console.log('id del doc ', id)
    this.psw = this.formulario.get('psw')?.value ?? '';
    this.oficios.firmadDoc(id, this.psw).subscribe({
      next: (oficio) => {
        if(oficio == 1){
           this.cerrarModalFirma();
          this.avisos.exito('Documento firmado correctamente.');
          return;     
        }else{
          console.log(oficio)
          this.avisos.advertencia('El documento no se pudo firmar.');
          return;  
        }
      }
    })

  }
}
