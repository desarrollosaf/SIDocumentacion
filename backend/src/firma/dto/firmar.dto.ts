import { IsNotEmpty, IsString } from 'class-validator';

/** La contraseña de la FIEL viaja solo en el cuerpo y nunca se persiste. */
export class FirmarDto {
  @IsString()
  @IsNotEmpty({ message: 'Captura la contraseña de tu firma electrónica.' })
  password: string;
}
