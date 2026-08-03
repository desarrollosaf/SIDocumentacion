import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface DocumentoFirmable {
  id: number;
  origen: 'oficio' | 'documento';
  folio: string | null;
  nombre: string | null;
  uuid: string | null;
  firmado: boolean;
  /** Sin archivo almacenado no hay nada que enviar a firmar. */
  firmable: boolean;
  created_at: string | null;
}

export interface ResultadoFirma {
  message: string;
  hash: string | null;
}

/** Firma electrónica institucional (FIEL) a través del servicio FEPLEM. */
@Injectable({ providedIn: 'root' })
export class FirmaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/firma`;

  documentos() {
    return this.http.get<DocumentoFirmable[]>(`${this.base}/documentos`);
  }

  /** Comprueba la contraseña de la FIEL sin firmar nada. */
  validar(password: string) {
    return this.http.post<{ valido: boolean; hash: string | null }>(`${this.base}/validar`, {
      password,
    });
  }

  firmar(documento: DocumentoFirmable, password: string) {
    const ruta = documento.origen === 'oficio' ? 'oficios' : 'documentos';
    return this.http.post<ResultadoFirma>(`${this.base}/${ruta}/${documento.id}`, {
      password,
    });
  }
}
