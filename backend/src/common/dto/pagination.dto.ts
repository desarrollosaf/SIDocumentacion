import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Parámetros de paginación y búsqueda compartidos por los listados. */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

/** Envoltura estándar de los listados paginados que consume el frontend. */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export function paginate<T>(
  data: T[],
  total: number,
  { page, perPage }: PaginationDto,
): Paginated<T> {
  return {
    data,
    total,
    page,
    perPage,
    lastPage: Math.max(1, Math.ceil(total / perPage)),
  };
}
