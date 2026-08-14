import { Agenda } from '../entities/doc/agenda.entity';
import { AtencionDoc } from '../entities/doc/atencion-doc.entity';
import { FirmaDoc } from '../entities/doc/firma-doc.entity';
import { TipoAtencion, TipoDoc } from '../entities/doc/catalogos.entity';
import { RegistroAtencion } from '../entities/doc/registro-atencion.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { Registro } from '../entities/doc/registro.entity';
import { ModelHasRole, Role } from '../entities/doc/role.entity';
import { Seccion } from '../entities/doc/seccion.entity';
import { Serie } from '../entities/doc/serie.entity';
import { SubSerie } from '../entities/doc/sub-serie.entity';
import { Subfondo } from '../entities/doc/subfondo.entity';
import { TipoApoyo } from '../entities/doc/tipo-apoyo.entity';
import { DocTipoApoyo } from '../entities/doc/docs-tipo-apoyo.entity';
import { Departamento } from '../entities/saf/departamento.entity';
import { Dependencia } from '../entities/saf/dependencia.entity';
import { Direccion } from '../entities/saf/direccion.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { User } from '../entities/saf/user.entity';
export declare const DOC_ENTITIES: (typeof Agenda | typeof Role | typeof ModelHasRole | typeof TipoDoc | typeof TipoAtencion | typeof Subfondo | typeof SubSerie | typeof Serie | typeof Seccion | typeof DocTipoApoyo | typeof TipoApoyo | typeof RegistroDoc | typeof AtencionDoc | typeof FirmaDoc | typeof Registro | typeof RegistroAtencion)[];
export declare const SAF_ENTITIES: (typeof Dependencia | typeof Direccion | typeof Departamento | typeof ServidorPublico | typeof User)[];
export declare class DatabaseModule {
}
