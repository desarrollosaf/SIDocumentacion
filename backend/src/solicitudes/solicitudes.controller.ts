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
import { CrearSolicitudDto } from './dto/crear-solicitud.dto';
import { FiltroSolicitudesDto } from './dto/filtro-solicitudes.dto';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudes: SolicitudesService) {}

  @Get('resumen')
  resumen(@CurrentUser() user: AuthenticatedUser) {
    return this.solicitudes.resumen(user);
  }

  @Get('entrada')
  entrada(@CurrentUser() user: AuthenticatedUser, @Query() filtro: FiltroSolicitudesDto) {
    return this.solicitudes.bandejaEntrada(user, filtro);
  }

  @Get('salida')
  salida(@CurrentUser() user: AuthenticatedUser, @Query() filtro: FiltroSolicitudesDto) {
    return this.solicitudes.bandejaSalida(user, filtro);
  }

  @Get('preregistro')
  preregistro(@CurrentUser() user: AuthenticatedUser, @Query() filtro: FiltroSolicitudesDto) {
    return this.solicitudes.preregistros(user, filtro);
  }

  @Get('folios')
  folios(@CurrentUser() user: AuthenticatedUser, @Query() filtro: FiltroSolicitudesDto) {
    return this.solicitudes.buscarFolios(user, filtro);
  }

  @Get(':id')
  detalle(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudes.detalle(id);
  }

  // El sistema original no restringe el registro por rol: basta con la sesión.
  @Post()
  crear(@CurrentUser() user: AuthenticatedUser, @Body() dto: CrearSolicitudDto) {
    return this.solicitudes.crear(user, dto);
  }

  @Patch(':id/autorizar')
  @HttpCode(HttpStatus.OK)
  autorizar(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudes.autorizarPreregistro(id);
  }

  @Patch(':id/rechazar')
  @HttpCode(HttpStatus.OK)
  rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudes.rechazarPreregistro(id);
  }

  @Patch('atenciones/:id/visto')
  @HttpCode(HttpStatus.OK)
  marcarVisto(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseIntPipe) id: number) {
    return this.solicitudes.marcarVisto(user, id);
  }

  @Patch('atenciones/:id/atender')
  @HttpCode(HttpStatus.OK)
  atender(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseIntPipe) id: number) {
    return this.solicitudes.atender(user, id);
  }
}
