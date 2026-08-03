import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { PageHeader } from '../../shared/components/page-header';

/** Equivalente a ContrasenaController@cambiarContra. */
@Component({
  selector: 'sid-cambiar-contrasena',
  imports: [ReactiveFormsModule, PageHeader],
  template: `
    <sid-page-header
      titulo="Cambiar contraseña"
      descripcion="Actualiza la contraseña de acceso al sistema."
      [migas]="[{ etiqueta: 'Mi perfil', ruta: '/perfil' }, { etiqueta: 'Contraseña' }]"
    />

    <div class="row">
      <div class="col-12 col-lg-6 col-xl-5">
        <section class="sid-card p-4">
          <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
            <div class="mb-3">
              <label for="actual" class="form-label">Contraseña actual</label>
              <input
                id="actual"
                type="password"
                class="form-control"
                formControlName="actual"
                autocomplete="current-password"
              />
            </div>

            <div class="mb-3">
              <label for="nueva" class="form-label">Nueva contraseña</label>
              <input
                id="nueva"
                type="password"
                class="form-control"
                formControlName="nueva"
                autocomplete="new-password"
                [class.is-invalid]="
                  formulario.controls.nueva.touched && formulario.controls.nueva.invalid
                "
              />
              <div class="form-text">Debe tener al menos 8 caracteres.</div>
            </div>

            <div class="mb-4">
              <label for="confirmacion" class="form-label">Confirmar nueva contraseña</label>
              <input
                id="confirmacion"
                type="password"
                class="form-control"
                formControlName="confirmacion"
                autocomplete="new-password"
                [class.is-invalid]="noCoincide()"
              />
              @if (noCoincide()) {
                <div class="invalid-feedback d-block">Las contraseñas no coinciden.</div>
              }
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="enviando()">
                @if (enviando()) {
                  <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                }
                Guardar cambios
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  `,
})
export class CambiarContrasena {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(NotificacionService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    actual: ['', [Validators.required]],
    nueva: ['', [Validators.required, Validators.minLength(8)]],
    confirmacion: ['', [Validators.required]],
  });

  protected noCoincide(): boolean {
    const { nueva, confirmacion } = this.formulario.getRawValue();
    return this.formulario.controls.confirmacion.touched && !!confirmacion && nueva !== confirmacion;
  }

  protected enviar(): void {
    if (this.formulario.invalid || this.noCoincide()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { actual, nueva, confirmacion } = this.formulario.getRawValue();
    this.enviando.set(true);

    this.auth.cambiarPassword(actual, nueva, confirmacion).subscribe({
      next: ({ message }) => {
        this.enviando.set(false);
        this.avisos.exito(message);
        void this.router.navigate(['/perfil']);
      },
      error: () => this.enviando.set(false),
    });
  }
}
