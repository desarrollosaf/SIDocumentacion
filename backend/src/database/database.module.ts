import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SAF_CONNECTION } from '../config/configuration';

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

import { Departamento } from '../entities/saf/departamento.entity';
import { Dependencia } from '../entities/saf/dependencia.entity';
import { Direccion } from '../entities/saf/direccion.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { User } from '../entities/saf/user.entity';

/** Entidades de la base de documentación (conexión por defecto). */
export const DOC_ENTITIES = [
  Agenda,
  AtencionDoc,
  FirmaDoc,
  ModelHasRole,
  Registro,
  RegistroAtencion,
  RegistroDoc,
  Role,
  Seccion,
  Serie,
  SubSerie,
  Subfondo,
  TipoAtencion,
  TipoDoc,
];

/** Entidades de la base institucional SAF. */
export const SAF_ENTITIES = [
  Departamento,
  Dependencia,
  Direccion,
  ServidorPublico,
  User,
];

/**
 * Replica el esquema de conexiones de Laravel: `mysql` (documentación) como
 * conexión por defecto y `mysqlSaf` como conexión secundaria de solo lectura
 * para el padrón institucional.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        database: config.get<string>('DB_DATABASE', 'documentacion'),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        entities: DOC_ENTITIES,
        // El esquema ya existe y es administrado por las migraciones de Laravel.
        synchronize: false,
        timezone: 'Z',
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: SAF_CONNECTION,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        name: SAF_CONNECTION,
        type: 'mysql' as const,
        host: config.get<string>('DB_SAF_HOST', '127.0.0.1'),
        port: parseInt(config.get<string>('DB_SAF_PORT', '3306'), 10),
        database: config.get<string>('DB_SAF_DATABASE', 'adminplem_saf'),
        username: config.get<string>('DB_SAF_USERNAME', 'root'),
        password: config.get<string>('DB_SAF_PASSWORD', ''),
        entities: SAF_ENTITIES,
        synchronize: false,
        timezone: 'Z',
      }),
    }),
  ],
})
export class DatabaseModule {}
