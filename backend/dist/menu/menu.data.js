"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENU = void 0;
exports.MENU = [
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
//# sourceMappingURL=menu.data.js.map