import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { MENU, MenuItem } from './menu.data';

@Injectable()
export class MenuService {
  /**
   * Devuelve el menú ya filtrado para el usuario en sesión.
   *
   * El sidebar original solo aplica la restricción por `rfcs`: el filtro por
   * roles está comentado en `panels/sidebar.blade.php` y los nombres de rol del
   * JSON ("SUPER USUARIO", "ANALISTA", "AUTORIZAR") ni siquiera existen en la
   * tabla `roles`, que contiene ADMIM, RAC, RAH y RAT. Filtrar por ellos
   * dejaría el menú vacío, así que se replica el comportamiento real.
   *
   * Los agrupadores cuyo submenú queda vacío se descartan.
   */
  paraUsuario(user: AuthenticatedUser): MenuItem[] {
    return this.filtrar(MENU, user);
  }

  private filtrar(items: MenuItem[], user: AuthenticatedUser): MenuItem[] {
    const visibles: MenuItem[] = [];

    for (const item of items) {
      if (!this.esVisible(item, user)) {
        continue;
      }

      if (item.submenu?.length) {
        const submenu = this.filtrar(item.submenu, user);
        if (!submenu.length) {
          continue;
        }
        visibles.push({ ...item, submenu });
        continue;
      }

      visibles.push({ ...item });
    }

    // Un encabezado sin elementos debajo no aporta nada a la navegación.
    return visibles.filter(
      (item, i) => !item.navheader || visibles.slice(i + 1).some((next) => !next.navheader),
    );
  }

  private esVisible(item: MenuItem, user: AuthenticatedUser): boolean {
    return !item.rfcs?.length || item.rfcs.includes(user.rfc);
  }
}
