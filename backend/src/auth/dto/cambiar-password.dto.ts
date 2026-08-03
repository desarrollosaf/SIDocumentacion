import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CambiarPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria.' })
  actual: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  nueva: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirma la nueva contraseña.' })
  confirmacion: string;
}
