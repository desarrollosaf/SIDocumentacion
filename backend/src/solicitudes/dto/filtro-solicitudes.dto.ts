import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FiltroSolicitudesDto extends PaginationDto {
  @IsOptional()
  @IsIn(['pendientes', 'atendidos', 'todos'])
  estado: 'pendientes' | 'atendidos' | 'todos' = 'pendientes';

  @IsOptional()
  @IsString()
  desde?: string;

  @IsOptional()
  @IsString()
  hasta?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tipo_atencion?: number;
}
