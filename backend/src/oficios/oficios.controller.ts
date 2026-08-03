import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CrearOficioDto } from './dto/crear-oficio.dto';
import { FiltroBandejaDto } from './dto/filtro-bandeja.dto';
import { OficiosService } from './oficios.service';

@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficios: OficiosService) {}

  @Get('resumen')
  resumen(@CurrentUser() user: AuthenticatedUser) {
    return this.oficios.resumen(user);
  }

  @Get('entrada')
  entrada(@CurrentUser() user: AuthenticatedUser, @Query() filtro: FiltroBandejaDto) {
    return this.oficios.bandejaEntrada(user, filtro);
  }

  @Get('salida')
  salida(@CurrentUser() user: AuthenticatedUser, @Query() filtro: FiltroBandejaDto) {
    return this.oficios.bandejaSalida(user, filtro);
  }

  @Get(':id')
  detalle(@Param('id', ParseIntPipe) id: number) {
    return this.oficios.detalle(id);
  }

  // El sistema original no restringe el registro por rol: basta con la sesión.
  @Post()
  crear(@CurrentUser() user: AuthenticatedUser, @Body() dto: CrearOficioDto) {
    return this.oficios.crear(user, dto);
  }

  @Patch('atenciones/:id/visto')
  @HttpCode(HttpStatus.OK)
  marcarVisto(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.oficios.marcarVisto(user, id);
  }

  @Patch('atenciones/:id/atender')
  @HttpCode(HttpStatus.OK)
  atender(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseIntPipe) id: number) {
    return this.oficios.atender(user, id);
  }
}
