import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificacionService } from '../services/notificacion.service';

/**
 * Adjunta el JWT a cada petición y traduce los errores del backend a avisos
 * legibles. Un 401 cierra la sesión, igual que la expiración de sesión en el
 * sistema original.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const avisos = inject(NotificacionService);
  const token = auth.token;

  const peticion = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && auth.autenticado()) {
        avisos.advertencia('Tu sesión expiró. Inicia sesión nuevamente.');
        auth.cerrarSesion();
      } else if (error.status !== 401) {
        avisos.error(mensajeDeError(error));
      }

      return throwError(() => error);
    }),
  );
};

/** El backend responde `message` como cadena o como arreglo de validaciones. */
function mensajeDeError(error: HttpErrorResponse): string {
  const mensaje: unknown = error.error?.message;

  if (Array.isArray(mensaje)) {
    return mensaje.join(' ');
  }
  if (typeof mensaje === 'string' && mensaje.trim()) {
    return mensaje;
  }
  if (error.status === 0) {
    return 'No fue posible conectar con el servidor.';
  }

  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}
