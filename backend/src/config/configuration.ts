export const SAF_CONNECTION = 'saf';

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim()),
  storagePath: process.env.STORAGE_PATH ?? './storage',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'cambia-esta-clave-en-produccion',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  },
  maxIntentosLogin: parseInt(process.env.MAX_INTENTOS_LOGIN ?? '3', 10),
  /** Servicio institucional de firma electrónica (FIEL). */
  feplem: {
    baseUrl: process.env.FEPLEM_URL ?? 'https://feplem.gob.mx',
    timeoutMs: parseInt(process.env.FEPLEM_TIMEOUT_MS ?? '30000', 10),
  },
});
