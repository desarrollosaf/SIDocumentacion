import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Datos que exige POST /api/firmaDocumentos del servicio FEPLEM. */
export interface SolicitudFirma {
  /** Ruta del PDF dentro del almacenamiento compartido, sin la carpeta raíz. */
  path: string;
  user_rfc: string;
  /** Contraseña de la FIEL; nunca se almacena ni se registra en bitácora. */
  contra: string;
  /** Identificador único del documento. */
  docI: string;
  /** Carpeta lógica: "documentacion/oficios" para oficios. */
  tipo: string;
  firma_status: string;
  status_doc: string;
  firma: number;
  tipo_firmante: string | null;
  fecha_expedicion: string;
  fecha_certificacion: string;
}

/**
 * Cliente del servicio institucional de firma electrónica (FEPLEM).
 *
 * Contrato observado en el sistema Laravel y verificado contra el servicio:
 *  - `validaCertificados` responde `0` si la contraseña es incorrecta o el
 *    certificado no está vigente; en caso contrario devuelve el hash de firma.
 *  - `firmaDocumentos` responde `1` cuando el documento quedó firmado.
 *
 * Ambas respuestas son texto plano, no JSON.
 */
@Injectable()
export class FeplemClient {
  private readonly logger = new Logger(FeplemClient.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * Valida la FIEL del usuario.
   * @returns el hash de firma, o `null` si las credenciales no son válidas.
   */
  async validarCertificado(rfc: string, password: string): Promise<string | null> {
    const cuerpo = await this.postear('/api/validaCertificados', {
      rfc,
      password,
    });

    // El servicio responde exactamente "0" cuando no valida.
    return cuerpo === '0' || cuerpo === '' ? null : cuerpo;
  }

  /** Solicita la firma de un documento ya almacenado. */
  async firmarDocumento(solicitud: SolicitudFirma): Promise<boolean> {
    const cuerpo = await this.postear('/api/firmaDocumentos', solicitud);
    return cuerpo === '1';
  }

  /** Fecha en el formato `Y-m-d H:i:s` que espera el servicio. */
  static ahora(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  private async postear(ruta: string, cuerpo: unknown): Promise<string> {
    const baseUrl = this.config.get<string>('feplem.baseUrl', 'https://feplem.gob.mx');
    const timeout = this.config.get<number>('feplem.timeoutMs', 30_000);

    try {
      const respuesta = await fetch(`${baseUrl}${ruta}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
        signal: AbortSignal.timeout(timeout),
      });

      // Igual que el original, un 4xx/5xx también trae cuerpo aprovechable.
      return (await respuesta.text()).trim();
    } catch (error) {
      // No se registra el cuerpo: contiene la contraseña de la FIEL.
      this.logger.error(
        `Falló la comunicación con FEPLEM (${ruta}): ${(error as Error).message}`,
      );
      throw new ServiceUnavailableException(
        'No fue posible comunicarse con el servicio de firma electrónica. Intenta más tarde.',
      );
    }
  }
}
