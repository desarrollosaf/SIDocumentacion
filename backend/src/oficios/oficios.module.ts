import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { AtencionDoc } from '../entities/doc/atencion-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { OficiosController } from './oficios.controller';
import { OficiosService } from './oficios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroDoc, AtencionDoc]),
    TypeOrmModule.forFeature([ServidorPublico], SAF_CONNECTION),
  ],
  controllers: [OficiosController],
  providers: [OficiosService],
})
export class OficiosModule {}
