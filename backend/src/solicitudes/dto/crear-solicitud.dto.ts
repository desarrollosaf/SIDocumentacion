import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TurnoDto {
  @IsString()
  @IsNotEmpty({ message: 'El RFC del destinatario es obligatorio.' })
  user_rfc: string;

  @IsOptional()
  @IsString()
  instruccion?: string;
}

/** Equivalente al payload de RegistroController@store. */
export class CrearSolicitudDto {
  @IsString()
  @IsNotEmpty({ message: 'El título del documento es obligatorio.' })
  titulo_doc: string;

  /** La columna es NOT NULL; si se omite se reutiliza el título. */
  @IsOptional()
  @IsString()
  descripcion_doc?: string;

  @IsDateString({}, { message: 'La fecha de recepción no es válida.' })
  fecha_recepcion: string;

  @IsDateString({}, { message: 'La fecha del documento no es válida.' })
  fecha_documento: string;

  @IsDateString({}, { message: 'La fecha límite de atención no es válida.' })
  fecha_limite_atencion: string;

  @Type(() => Number)
  @IsInt({ message: 'Selecciona un tipo de atención.' })
  tipo_atencion: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tipo_doc?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  serie_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subserie_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  expediente_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  folio_rastreo?: number;

  @IsOptional()
  @IsString()
  remitente_rfc?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fojas?: number;

  /** Si es true la solicitud queda en preregistro (status_envio = 0). */
  @IsOptional()
  preregistro?: boolean;

  @IsArray()
  @ArrayMinSize(1, { message: 'Turna la solicitud al menos a una persona.' })
  @ValidateNested({ each: true })
  @Type(() => TurnoDto)
  turnos: TurnoDto[];
}
