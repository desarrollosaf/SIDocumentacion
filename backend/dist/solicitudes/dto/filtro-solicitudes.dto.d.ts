import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FiltroSolicitudesDto extends PaginationDto {
    estado: 'pendientes' | 'atendidos' | 'todos';
    desde?: string;
    hasta?: string;
    tipo_atencion?: number;
}
