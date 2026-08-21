export const environment = {
  production: false,
  // El backend se publica en el 3050 (ver docker-compose.yml). El 3000 del host
  // está ocupado por otro servicio.
  apiUrl: 'http://localhost:3050/api',
  appName: 'SIGAPLEM',
  institucion: 'Secretaría de Administración y Finanzas',
};
