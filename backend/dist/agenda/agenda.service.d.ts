import { Repository } from 'typeorm';
import { Agenda } from '../entities/doc/agenda.entity';
export declare class AgendaService {
    private readonly agendas;
    constructor(agendas: Repository<Agenda>);
    eventos(desde?: string, hasta?: string): Promise<{
        id: number;
        registro_id: number | null;
        title: string | null;
        descripcion: string | null;
        start: Date | null;
        end: Date | null;
        color: string | null;
    }[]>;
    detalle(id: number): Promise<Agenda>;
}
