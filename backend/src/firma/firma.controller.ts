import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { FirmarDto } from './dto/firmar.dto';
import { FirmaService } from './firma.service';

@Controller('firma')
export class FirmaController {
  constructor(private readonly firma: FirmaService) {}

  @Get('documentos')
  documentos(@CurrentUser() user: AuthenticatedUser) {
    return this.firma.listar(user);
  }

  /** Comprueba la FIEL sin firmar nada. */
  @Post('validar')
  @HttpCode(HttpStatus.OK)
  validar(@CurrentUser() user: AuthenticatedUser, @Body() dto: FirmarDto) {
    return this.firma.validarCertificado(user, dto.password);
  }

  @Post('oficios/:id')
  @HttpCode(HttpStatus.OK)
  firmarOficio(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FirmarDto,
  ) {
    return this.firma.firmarOficio(user, id, dto.password);
  }

  @Post('documentos/:id')
  @HttpCode(HttpStatus.OK)
  firmarDocumento(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FirmarDto,
  ) {
    return this.firma.firmarDocumento(user, id, dto.password);
  }
}
