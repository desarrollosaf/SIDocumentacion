import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from '../entities/doc/agenda.entity';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda])],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}
