import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
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
  rfc: string;

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
  @IsString()
  folio?: string;

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

  @Type(() => Boolean)
  @IsBoolean()
  firmado?: boolean;

  @IsOptional()
  @IsString()
  hash?: string;

  @IsOptional()
  @IsString()
  psw?: string;


  @Transform(({ value }) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (error) {
      console.log('ERROR AL PARSEAR:', error);
      return value;
    }
  }

  return value;
})
@IsArray()
@ArrayMinSize(1, {
  message: 'Agrega al menos un destinatario.',
})
@ValidateNested({ each: true })
@Type(() => DestinatarioDto)
destinatarios: DestinatarioDto[];
}
