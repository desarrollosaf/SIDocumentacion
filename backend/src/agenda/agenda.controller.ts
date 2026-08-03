import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AgendaService } from './agenda.service';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agenda: AgendaService) {}

  @Get()
  eventos(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.agenda.eventos(desde, hasta);
  }

  @Get(':id')
  detalle(@Param('id', ParseIntPipe) id: number) {
    return this.agenda.detalle(id);
  }
}
