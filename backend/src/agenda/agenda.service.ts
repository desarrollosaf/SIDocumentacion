import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from '../entities/doc/agenda.entity';

/** Equivalente a AgendaController: eventos de fecha límite de las solicitudes. */
@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda) private readonly agendas: Repository<Agenda>,
  ) {}

  /** AgendaController@getEvents, en el formato que consume el calendario. */
  async eventos(desde?: string, hasta?: string) {
    const query = this.agendas.createQueryBuilder('a').where('a.status = 1');

    if (desde && hasta) {
      query.andWhere('a.start BETWEEN :desde AND :hasta', {
        desde: `${desde} 00:00:00`,
        hasta: `${hasta} 23:59:59`,
      });
    }

    const eventos = await query.orderBy('a.start', 'ASC').getMany();

    return eventos.map((evento) => ({
      id: evento.id,
      registro_id: evento.registro_id,
      title: evento.title,
      descripcion: evento.descripcion,
      start: evento.start,
      end: evento.end,
      color: evento.color,
    }));
  }

  /** AgendaController@getDetail. */
  async detalle(id: number) {
    const evento = await this.agendas.findOne({ where: { id, status: 1 } });

    if (!evento) {
      throw new NotFoundException('El evento no existe.');
    }

    return evento;
  }
}
