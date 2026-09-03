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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CrearOficioDto } from './dto/crear-oficio.dto';
import { FiltroBandejaDto } from './dto/filtro-bandeja.dto';
import { OficiosService } from './oficios.service';
import {FileInterceptor } from '@nestjs/platform-express';
import { NotFoundException } from '@nestjs/common';
import * as path from 'path';
import type { Response } from 'express';

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

  @Get('validarPsw/:psw')
  validarPsw(@CurrentUser() user: AuthenticatedUser, @Param('psw') psw: string) {
    return this.oficios.validarPsw(user, psw);
  }

  @Get('validarFirmado/:id')
  validarFirmado(@CurrentUser() user: AuthenticatedUser, @Param('id') id: number) {
    return this.oficios.validarFirmado(user, id);
  }

  @Get('verPdf/:id/:tipo')
  async verPdf(
    @Param('id', ParseIntPipe) id: number,
    @Param('tipo', ParseIntPipe) tipo: number, 
    @Res() res: Response){
     const ruta = await this.oficios.verPdf(id, tipo);
    return res.sendFile(ruta);
  }

  @Get('eliminarRegistro/:id')
    eliminarRegistro(@Param('id', ParseIntPipe) id: number){
     return this.oficios.eliminarRegistro(id);
  }

  @Get('getExp/:id/:tipo')
  async getExp(
     @Param('id', ParseIntPipe) id: number,
     @Param('tipo', ParseIntPipe) tipo: number
  ){
    return this.oficios.getExp(id, tipo);
  }

  @Get('firmarDoc/:id/:psw')
  async firmarDoc(
    @Param('id', ParseIntPipe) id: number, 
    @Param('psw') psw: string, 
    @CurrentUser() user: AuthenticatedUser){
      return this.oficios.firmarDocAcuse(id, psw, user);
    }
  
  
  // El sistema original no restringe el registro por rol: basta con la sesión.
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  crear(
    @UploadedFile() file: Express.Multer.File, 
    @CurrentUser() user: AuthenticatedUser, 
    @Body() dto: CrearOficioDto) {
      if (typeof dto.destinatarios === 'string') {
        dto.destinatarios = JSON.parse(dto.destinatarios);
      }
    return this.oficios.crear(user, dto, file);
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
