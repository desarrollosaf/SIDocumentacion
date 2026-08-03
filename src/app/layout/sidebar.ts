import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { environment } from '../../environments/environment';
import { MenuItem } from '../core/models';
import { AuthService } from '../core/services/auth.service';
import { MenuService } from '../core/services/menu.service';

/**
 * Navegación principal. Reproduce el sidebar de Blade: encabezados de sección,
 * grupos desplegables y elementos directos, ya filtrados por el backend.
 */
@Component({
  selector: 'sid-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly menuService = inject(MenuService);
  private readonly auth = inject(AuthService);

  /** En escritorio el sidebar se contrae a solo iconos. */
  readonly colapsado = input<boolean>(false);
  /** En móvil se muestra como panel deslizante. */
  readonly abiertoMovil = input<boolean>(false);
  readonly navegar = output<void>();

  protected readonly appName = environment.appName;
  protected readonly institucion = environment.institucion;
  protected readonly items = this.menuService.items;
  protected readonly usuario = this.auth.usuario;
  protected readonly iniciales = this.auth.iniciales;

  /** Grupos abiertos por su nombre; permite varios expandidos a la vez. */
  private readonly gruposAbiertos = signal<Set<string>>(new Set());

  protected readonly hayMenu = computed(() => this.items().length > 0);

  protected estaAbierto(grupo: MenuItem): boolean {
    return this.gruposAbiertos().has(grupo.name ?? '');
  }

  protected alternarGrupo(grupo: MenuItem): void {
    const nombre = grupo.name ?? '';
    this.gruposAbiertos.update((abiertos) => {
      const copia = new Set(abiertos);
      if (copia.has(nombre)) {
        copia.delete(nombre);
      } else {
        copia.add(nombre);
      }
      return copia;
    });
  }

  protected alNavegar(): void {
    this.navegar.emit();
  }
}
