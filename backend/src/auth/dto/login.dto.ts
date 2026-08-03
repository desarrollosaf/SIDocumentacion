import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** RFC institucional o correo electrónico. */
  @IsString()
  @IsNotEmpty({ message: 'El usuario es obligatorio.' })
  usuario: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;
}
