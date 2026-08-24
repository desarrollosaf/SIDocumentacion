import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { AtencionDoc } from '../entities/doc/atencion-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { OficiosController } from './oficios.controller';
import { OficiosService } from './oficios.service';
import { HttpModule } from '@nestjs/axios';
import { Expedientes } from '../entities/doc/expedientes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroDoc, AtencionDoc, Expedientes]),
    TypeOrmModule.forFeature([ServidorPublico], SAF_CONNECTION),
    HttpModule
  ],
  controllers: [OficiosController],
  providers: [OficiosService],
})
export class OficiosModule {}
