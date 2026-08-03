import { AgendaService } from './agenda.service';
export declare class AgendaController {
    private readonly agenda;
    constructor(agenda: AgendaService);
    eventos(desde?: string, hasta?: string): Promise<{
        id: number;
        registro_id: number | null;
        title: string | null;
        descripcion: string | null;
        start: Date | null;
        end: Date | null;
        color: string | null;
    }[]>;
    detalle(id: number): Promise<import("../entities/doc/agenda.entity").Agenda>;
}
