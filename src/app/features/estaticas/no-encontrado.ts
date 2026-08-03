import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sid-no-encontrado',
  imports: [RouterLink],
  template: `
    <div class="text-center py-5">
      <p class="display-4 fw-semibold text-primary mb-2">404</p>
      <h1 class="h5 mb-2">Página no encontrada</h1>
      <p class="text-muted-2 mb-4">
        La sección que buscas no existe o no tienes permiso para consultarla.
      </p>
      <a routerLink="/inicio" class="btn btn-primary">
        <i class="bi bi-house me-1" aria-hidden="true"></i>Ir al inicio
      </a>
    </div>
  `,
})
export class NoEncontrado {}
