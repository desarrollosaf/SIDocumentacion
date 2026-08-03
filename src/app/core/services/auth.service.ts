import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RespuestaLogin, Usuario } from '../models';

const TOKEN_KEY = 'sid.token';
const USER_KEY = 'sid.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _usuario = signal<Usuario | null>(this.leerUsuarioGuardado());

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);
  /** Iniciales para el avatar del encabezado. */
  readonly iniciales = computed(() => {
    const nombre = this._usuario()?.nombre ?? '';
    return (
      nombre
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0]?.toUpperCase() ?? '')
        .join('') || '·'
    );
  });

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(usuario: string, password: string): Observable<RespuestaLogin> {
    return this.http
      .post<RespuestaLogin>(`${environment.apiUrl}/auth/login`, { usuario, password })
      .pipe(
        tap((respuesta) => {
          localStorage.setItem(TOKEN_KEY, respuesta.access_token);
          localStorage.setItem(USER_KEY, JSON.stringify(respuesta.user));
          this._usuario.set(respuesta.user);
        }),
      );
  }

  /** Revalida la sesión contra el backend al arrancar la aplicación. */
  refrescarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/auth/perfil`).pipe(
      tap((usuario) => {
        localStorage.setItem(USER_KEY, JSON.stringify(usuario));
        this._usuario.set(usuario);
      }),
    );
  }

  cambiarPassword(actual: string, nueva: string, confirmacion: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/cambiar-password`, {
      actual,
      nueva,
      confirmacion,
    });
  }

  tieneRol(...roles: string[]): boolean {
    const propios = this._usuario()?.roles ?? [];
    return roles.some((rol) => propios.includes(rol));
  }

  cerrarSesion(redirigir = true): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._usuario.set(null);

    if (redirigir) {
      void this.router.navigate(['/login']);
    }
  }

  private leerUsuarioGuardado(): Usuario | null {
    const crudo = localStorage.getItem(USER_KEY);
    if (!crudo || !localStorage.getItem(TOKEN_KEY)) {
      return null;
    }

    try {
      return JSON.parse(crudo) as Usuario;
    } catch {
      // Sesión corrupta en almacenamiento: se descarta en silencio.
      return null;
    }
  }
}
