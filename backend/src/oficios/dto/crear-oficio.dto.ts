import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DestinatarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El RFC del destinatario es obligatorio.' })
  rfc_atencion: string;

  /** Papel en el flujo de firma: `E` elaboró · `R` revisó · `A` autorizó. */
  @IsIn(['E', 'R', 'A'], { message: 'El papel del destinatario no es válido.' })
  tipo_atencion: string;
}

/** Equivalente al payload de RegistroDocumentosController@saveDoc. */
export class CrearOficioDto {
  @IsString()
  @IsNotEmpty({ message: 'El título del documento es obligatorio.' })
  titulo_doc: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fojas?: number;

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
  tipo_doc?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Agrega al menos un destinatario.' })
  @ValidateNested({ each: true })
  @Type(() => DestinatarioDto)
  destinatarios: DestinatarioDto[];
}
