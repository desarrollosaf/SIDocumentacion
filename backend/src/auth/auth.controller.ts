import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuthService } from './auth.service';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  /** Perfil vigente del usuario: el frontend lo usa para rehidratar la sesión. */
  @Get('perfil')
  perfil(@CurrentUser() user: AuthenticatedUser) {
    return this.auth.perfilPorId(user.id);
  }

  /** Equivalente a ContrasenaController@cambiarContra. */
  @Post('cambiar-password')
  @HttpCode(HttpStatus.OK)
  cambiarPassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: CambiarPasswordDto) {
    return this.auth.cambiarPassword(user.id, dto);
  }
}
