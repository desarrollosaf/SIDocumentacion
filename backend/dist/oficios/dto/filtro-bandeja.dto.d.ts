import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FiltroBandejaDto extends PaginationDto {
    estado: 'pendientes' | 'atendidos' | 'todos';
    desde?: string;
    hasta?: string;
    serie_id?: number;
}
