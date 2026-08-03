/** Perfil del usuario en sesión, tal como lo devuelve /auth/perfil. */
export interface Usuario {
  id: number;
  name: string | null;
  email: string | null;
  rfc: string;
  roles: string[];
  nombre: string | null;
  dependencia: string | null;
  direccion: string | null;
  departamento: string | null;
  id_Dependencia: number | null;
  id_Direccion: number | null;
  id_Departamento: number | null;
  path_foto: string | null;
}

export interface RespuestaLogin {
  access_token: string;
  user: Usuario;
}

/** Elemento del menú lateral; el backend ya lo entrega filtrado por rol y RFC. */
export interface MenuItem {
  url?: string;
  name?: string;
  navheader?: string;
  icon?: string;
  submenu?: MenuItem[];
}

export interface Paginado<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface Opcion {
  id: number | string;
  nombre: string;
  descripcion?: string | null;
}

export interface OpcionClasificacion extends Opcion {
  subseries: Opcion[];
}

export interface ServidorPublico {
  rfc: string;
  nombre: string;
  dependencia: string | null;
  direccion: string | null;
  departamento: string | null;
}

/** Fila de las bandejas de oficios. */
export interface OficioBandeja {
  id: number;
  atencion_id: number | null;
  folio: string | null;
  titulo_doc: string | null;
  fojas: number | null;
  firmado: boolean;
  tipo_atencion: string | null;
  visto: boolean;
  atendido: boolean;
  fecha_visto: string | null;
  fecha_atencion: string | null;
  created_at: string | null;
  contraparte: string;
}

export interface OficioDetalle {
  id: number;
  folio: string | null;
  titulo_doc: string | null;
  fojas: number | null;
  firmado: number | null;
  path_doc: string | null;
  uuid_doc: string | null;
  created_at: string | null;
  remitente: string;
  destinatarios: Array<{
    id: number;
    rfc_atencion: string;
    nombre: string;
    turnado_por: string | null;
    /** `E` elaboró · `R` revisó · `A` autorizó. */
    tipo_atencion: string;
    visto: number;
    status_atencion: number;
    fecha_visto: string | null;
    fecha_atencion: string | null;
  }>;
}

/** Papeles del flujo de firma de un oficio, tal como los guarda la base. */
export const PAPEL_OFICIO: Record<string, string> = {
  E: 'Elaboró',
  R: 'Revisó',
  A: 'Autorizó',
};

/** Un oficio puede acumular varios papeles separados por coma ("E,R"). */
export function etiquetaPapel(tipo: string | null): string {
  if (!tipo) {
    return '—';
  }
  return tipo
    .split(',')
    .map((codigo) => PAPEL_OFICIO[codigo.trim()] ?? codigo.trim())
    .join(' · ');
}

/** Fila de las bandejas de solicitudes. */
export interface SolicitudBandeja {
  id: number;
  atencion_id: number | null;
  folio: string | null;
  titulo_doc: string | null;
  tipo_atencion: number | null;
  fecha_recepcion: string | null;
  fecha_limite_atencion: string | null;
  dias_restantes: number | null;
  visto: boolean;
  atendido: boolean;
  contraparte: string;
  created_at: string | null;
}

export interface SolicitudDetalle {
  id: number;
  folio: string | null;
  titulo_doc: string | null;
  fecha_recepcion: string | null;
  fecha_documento: string | null;
  fecha_limite_atencion: string | null;
  tipo_atencion: number | null;
  fojas: number | null;
  status_envio: number | null;
  remitente: string;
  atenciones: Array<{
    id: number;
    user_rfc: string | null;
    nombre: string | null;
    turnado_por: string | null;
    instruccion: string | null;
    visto: number | null;
    status_atencion: number | null;
    fecha_visto: string | null;
    fecha_atencion: string | null;
  }>;
}

export interface EventoAgenda {
  id: number;
  registro_id: number | null;
  title: string | null;
  descripcion: string | null;
  start: string | null;
  end: string | null;
  color: string | null;
}

export interface ResumenOficios {
  entradaPendientes: number;
  entradaSinVer: number;
  salidaTotal: number;
}

export interface ResumenSolicitudes {
  pendientes: number;
  sinVer: number;
  registradas: number;
  preregistros: number;
  vencidas: number;
}

/** Filtros compartidos por todas las bandejas. */
export interface FiltroBandeja {
  page?: number;
  perPage?: number;
  search?: string;
  estado?: 'pendientes' | 'atendidos' | 'todos';
  desde?: string;
  hasta?: string;
}
