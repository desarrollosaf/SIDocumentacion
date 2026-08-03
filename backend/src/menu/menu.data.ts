/**
 * Puerto directo de resources/json/verticalMenu.json del sistema Laravel.
 * Se mantiene como dato del backend para que la navegación siga siendo la
 * fuente única de verdad y el frontend no duplique reglas de visibilidad.
 *
 * Nota: el JSON original trae un campo `roles` en cada entrada, pero está en
 * desuso — el sidebar de Blade tiene ese filtro comentado y los nombres que
 * declara no existen en la tabla `roles`. Por eso no se porta aquí; la única
 * restricción vigente es `rfcs`.
 */
export interface MenuItem {
  /** Ruta del frontend; ausente en encabezados y en agrupadores. */
  url?: string;
  name?: string;
  /** Encabezado de sección (no navegable). */
  navheader?: string;
  icon?: string;
  /** Restricción por RFC, tal como en el sidebar original. */
  rfcs?: string[];
  submenu?: MenuItem[];
}

export const MENU: MenuItem[] = [
  {
    navheader: 'Documentación',
    icon: 'bi-three-dots',
  },
  {
    name: 'Oficios',
    icon: 'bi-folder2-open',
    submenu: [
      { url: '/oficios/carga', name: 'Carga de documento', icon: 'bi-cloud-arrow-up' },
      { url: '/oficios/entrada', name: 'Bandeja de entrada', icon: 'bi-inbox' },
      { url: '/oficios/salida', name: 'Bandeja de salida', icon: 'bi-send' },
    ],
  },
  {
    url: '/manual',
    name: 'Manual',
    icon: 'bi-file-earmark-pdf',
  },
  {
    url: '/firma',
    name: 'Firma de documento',
    icon: 'bi-vector-pen',
  },
  {
    name: 'Documentación',
    icon: 'bi-folder',
    rfcs: ['SAGM990220', 'DIRG940621', 'DOOJ900120'],
    submenu: [
      { url: '/solicitudes/nueva', name: 'Nueva solicitud', icon: 'bi-plus-square' },
      { url: '/solicitudes/preregistro', name: 'Preregistro', icon: 'bi-hourglass-split' },
      { url: '/solicitudes/entrada', name: 'Bandeja de entrada', icon: 'bi-inbox' },
      {
        url: '/solicitudes/atendidos-entrada',
        name: 'Atendidos entrada',
        icon: 'bi-check2-square',
      },
      { url: '/solicitudes/salida', name: 'Bandeja de salida', icon: 'bi-send' },
      {
        url: '/solicitudes/atendidos-salida',
        name: 'Atendidos salida',
        icon: 'bi-check2-all',
      },
      { url: '/agenda', name: 'Agenda', icon: 'bi-calendar3' },
      { url: '/solicitudes/folios', name: 'Folios', icon: 'bi-hash' },
    ],
  },
];
