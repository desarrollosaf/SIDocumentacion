import { Injectable, signal } from '@angular/core';

export type TipoAviso = 'exito' | 'error' | 'advertencia' | 'info';

export interface Aviso {
  id: number;
  tipo: TipoAviso;
  mensaje: string;
}

/** Avisos emergentes de la aplicación (sustituye a los toasts de Blade). */
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private siguienteId = 0;
  private readonly _avisos = signal<Aviso[]>([]);

  readonly avisos = this._avisos.asReadonly();

  exito(mensaje: string) {
    this.publicar('exito', mensaje);
  }

  error(mensaje: string) {
    this.publicar('error', mensaje);
  }

  advertencia(mensaje: string) {
    this.publicar('advertencia', mensaje);
  }

  info(mensaje: string) {
    this.publicar('info', mensaje);
  }

  descartar(id: number) {
    this._avisos.update((avisos) => avisos.filter((aviso) => aviso.id !== id));
  }

  private publicar(tipo: TipoAviso, mensaje: string) {
    const id = ++this.siguienteId;
    this._avisos.update((avisos) => [...avisos, { id, tipo, mensaje }]);

    // Los errores permanecen más tiempo porque suelen requerir una acción.
    setTimeout(() => this.descartar(id), tipo === 'error' ? 8000 : 4500);
  }
}
