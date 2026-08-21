import { Routes } from '@angular/router';

import { authGuard, invitadoGuard } from './core/guards/auth.guard';

// El sistema original no restringe ninguna ruta por rol: los nombres de rol del
// menú JSON son código muerto y la tabla `roles` contiene otros valores
// (ADMIM, RAC, RAH, RAT). Basta con la sesión activa.

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
    title: 'Iniciar sesión · SIGAPLEM',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },

      {
        path: 'inicio',
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
        title: 'Inicio · SIGAPLEM',
      },

      // --- Oficios ---------------------------------------------------------
      {
        path: 'oficios',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'entrada' },
          {
            path: 'entrada',
            data: { tipo: 'entrada' },
            loadComponent: () =>
              import('./features/oficios/bandeja-oficios').then((m) => m.BandejaOficios),
            title: 'Bandeja de entrada · Oficios',
          },
          {
            path: 'salida',
            data: { tipo: 'salida' },
            loadComponent: () =>
              import('./features/oficios/bandeja-oficios').then((m) => m.BandejaOficios),
            title: 'Bandeja de salida · Oficios',
          },
          {
            path: 'carga',
            loadComponent: () =>
              import('./features/oficios/carga-oficio').then((m) => m.CargaOficio),
            title: 'Carga de documento · Oficios',
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/oficios/detalle-oficio').then((m) => m.DetalleOficio),
            title: 'Detalle de oficio',
          },
        ],
      },

      // --- Solicitudes -----------------------------------------------------
      {
        path: 'solicitudes',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'entrada' },
          {
            path: 'nueva',
            loadComponent: () =>
              import('./features/solicitudes/nueva-solicitud').then((m) => m.NuevaSolicitud),
            title: 'Nueva solicitud',
          },
          {
            path: 'preregistro',
            data: { vista: 'preregistro' },
            loadComponent: () =>
              import('./features/solicitudes/bandeja-solicitudes').then(
                (m) => m.BandejaSolicitudes,
              ),
            title: 'Preregistro · Solicitudes',
          },
          {
            path: 'entrada',
            data: { vista: 'entrada' },
            loadComponent: () =>
              import('./features/solicitudes/bandeja-solicitudes').then(
                (m) => m.BandejaSolicitudes,
              ),
            title: 'Bandeja de entrada · Solicitudes',
          },
          {
            path: 'atendidos-entrada',
            data: { vista: 'atendidos-entrada' },
            loadComponent: () =>
              import('./features/solicitudes/bandeja-solicitudes').then(
                (m) => m.BandejaSolicitudes,
              ),
            title: 'Atendidos de entrada · Solicitudes',
          },
          {
            path: 'salida',
            data: { vista: 'salida' },
            loadComponent: () =>
              import('./features/solicitudes/bandeja-solicitudes').then(
                (m) => m.BandejaSolicitudes,
              ),
            title: 'Bandeja de salida · Solicitudes',
          },
          {
            path: 'atendidos-salida',
            data: { vista: 'atendidos-salida' },
            loadComponent: () =>
              import('./features/solicitudes/bandeja-solicitudes').then(
                (m) => m.BandejaSolicitudes,
              ),
            title: 'Atendidos de salida · Solicitudes',
          },
          {
            path: 'folios',
            loadComponent: () => import('./features/solicitudes/folios').then((m) => m.Folios),
            title: 'Folios',
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/solicitudes/detalle-solicitud').then((m) => m.DetalleSolicitud),
            title: 'Detalle de solicitud',
          },
        ],
      },

      // --- Otras secciones del menú ----------------------------------------
      {
        path: 'agenda',
        loadComponent: () => import('./features/agenda/agenda').then((m) => m.Agenda),
        title: 'Agenda',
      },
      {
        path: 'manual',
        loadComponent: () => import('./features/estaticas/manual').then((m) => m.Manual),
        title: 'Manual de usuario',
      },
      {
        path: 'firma',
        loadComponent: () => import('./features/firma/firma').then((m) => m.Firma),
        title: 'Firma de documento',
      },

      // --- Cuenta ----------------------------------------------------------
      {
        path: 'perfil',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/perfil/perfil').then((m) => m.Perfil),
            title: 'Mi perfil',
          },
          {
            path: 'contrasena',
            loadComponent: () =>
              import('./features/perfil/cambiar-contrasena').then((m) => m.CambiarContrasena),
            title: 'Cambiar contraseña',
          },
        ],
      },

      {
        path: '**',
        loadComponent: () =>
          import('./features/estaticas/no-encontrado').then((m) => m.NoEncontrado),
        title: 'Página no encontrada',
      },
    ],
  },
];
