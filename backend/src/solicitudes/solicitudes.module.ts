import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { Agenda } from '../entities/doc/agenda.entity';
import { RegistroAtencion } from '../entities/doc/registro-atencion.entity';
import { Registro } from '../entities/doc/registro.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registro, RegistroAtencion, Agenda]),
    TypeOrmModule.forFeature([ServidorPublico], SAF_CONNECTION),
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
