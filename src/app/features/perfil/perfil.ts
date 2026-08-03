import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { PageHeader } from '../../shared/components/page-header';

/** Datos de adscripción del usuario, tomados del padrón institucional. */
@Component({
  selector: 'sid-perfil',
  imports: [RouterLink, PageHeader],
  template: `
    <sid-page-header
      titulo="Mi perfil"
      descripcion="Información de tu cuenta y adscripción institucional."
      [migas]="[{ etiqueta: 'Mi perfil' }]"
    >
      <a routerLink="/perfil/contrasena" class="btn btn-outline-primary">
        <i class="bi bi-key me-1" aria-hidden="true"></i>Cambiar contraseña
      </a>
    </sid-page-header>

    <div class="row g-3">
      <div class="col-12 col-lg-4">
        <section class="sid-card p-4 text-center h-100">
          <span class="sid-perfil__avatar">{{ iniciales() }}</span>
          <h2 class="h6 mt-3 mb-1">{{ usuario()?.nombre }}</h2>
          <p class="text-muted-2 small mb-3">{{ usuario()?.rfc }}</p>

          <div>
            @for (rol of usuario()?.roles ?? []; track rol) {
              <span class="badge text-bg-secondary me-1 mb-1">{{ rol }}</span>
            } @empty {
              <span class="badge text-bg-light border">Sin roles asignados</span>
            }
          </div>
        </section>
      </div>

      <div class="col-12 col-lg-8">
        <section class="sid-card p-4 h-100">
          <h2 class="h6 mb-3">Adscripción</h2>

          <dl class="row mb-0 small">
            <dt class="col-sm-4 text-muted-2 fw-normal">Nombre</dt>
            <dd class="col-sm-8">{{ usuario()?.nombre ?? '—' }}</dd>

            <dt class="col-sm-4 text-muted-2 fw-normal">RFC</dt>
            <dd class="col-sm-8 tabular">{{ usuario()?.rfc }}</dd>

            <dt class="col-sm-4 text-muted-2 fw-normal">Correo electrónico</dt>
            <dd class="col-sm-8">{{ usuario()?.email ?? '—' }}</dd>

            <dt class="col-sm-4 text-muted-2 fw-normal">Dependencia</dt>
            <dd class="col-sm-8">{{ usuario()?.dependencia ?? '—' }}</dd>

            <dt class="col-sm-4 text-muted-2 fw-normal">Dirección</dt>
            <dd class="col-sm-8">{{ usuario()?.direccion ?? '—' }}</dd>

            <dt class="col-sm-4 text-muted-2 fw-normal">Departamento</dt>
            <dd class="col-sm-8 mb-0">{{ usuario()?.departamento ?? '—' }}</dd>
          </dl>

          <div class="alert alert-light border small mt-4 mb-0">
            <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
            Los datos de adscripción provienen del padrón institucional. Para
            corregirlos comunícate con la unidad administrativa correspondiente.
          </div>
        </section>
      </div>
    </div>
  `,
  styles: `
    .sid-perfil__avatar {
      display: grid;
      place-items: center;
      width: 5rem;
      height: 5rem;
      margin-inline: auto;
      border-radius: 50%;
      background: var(--sid-primary);
      color: #fff;
      font-size: 1.75rem;
      font-weight: 700;
    }
  `,
})
export class Perfil {
  private readonly auth = inject(AuthService);

  protected readonly usuario = this.auth.usuario;
  protected readonly iniciales = this.auth.iniciales;
}
