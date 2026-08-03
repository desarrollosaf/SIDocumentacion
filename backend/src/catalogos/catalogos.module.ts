import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { TipoAtencion, TipoDoc } from '../entities/doc/catalogos.entity';
import { Seccion } from '../entities/doc/seccion.entity';
import { Serie } from '../entities/doc/serie.entity';
import { SubSerie } from '../entities/doc/sub-serie.entity';
import { Subfondo } from '../entities/doc/subfondo.entity';
import { Departamento } from '../entities/saf/departamento.entity';
import { Dependencia } from '../entities/saf/dependencia.entity';
import { Direccion } from '../entities/saf/direccion.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { CatalogosController } from './catalogos.controller';
import { CatalogosService } from './catalogos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seccion, Serie, SubSerie, Subfondo, TipoDoc, TipoAtencion]),
    TypeOrmModule.forFeature(
      [ServidorPublico, Dependencia, Direccion, Departamento],
      SAF_CONNECTION,
    ),
  ],
  controllers: [CatalogosController],
  providers: [CatalogosService],
  exports: [CatalogosService],
})
export class CatalogosModule {}
