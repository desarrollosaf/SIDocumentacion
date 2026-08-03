import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificacionService } from '../services/notificacion.service';

/** Equivale al middleware `auth` de Laravel. */
export const authGuard: CanActivateFn = (_ruta, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.autenticado()) {
    return true;
  }

  // Se conserva el destino para volver a él tras iniciar sesión.
  return router.createUrlTree(['/login'], {
    queryParams: { destino: estado.url },
  });
};

/** Impide volver al login con una sesión activa (middleware `guest`). */
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.autenticado() ? router.createUrlTree(['/inicio']) : true;
};

/**
 * Restringe rutas por rol. Se declara con `data: { roles: [...] }`,
 * equivalente al filtro por roles del sidebar y de spatie/laravel-permission.
 */
export const rolGuard: CanActivateFn = (ruta) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const avisos = inject(NotificacionService);

  const roles = (ruta.data?.['roles'] as string[] | undefined) ?? [];

  if (!roles.length || auth.tieneRol(...roles)) {
    return true;
  }

  avisos.advertencia('No cuentas con permisos para acceder a esa sección.');
  return router.createUrlTree(['/inicio']);
};
