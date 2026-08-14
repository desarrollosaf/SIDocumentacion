import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CatalogosService } from './catalogos.service';

@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly catalogos: CatalogosService) {}

  @Get('secciones')
  secciones() {
    return this.catalogos.listarSecciones();
  }

  @Get('series')
  series(@Query('seccion') seccion?: string) {
    return this.catalogos.listarSeries(seccion ? Number(seccion) : undefined);
  }

  @Get('subseries')
  subseries(@Query('serie') serie?: string) {
    return this.catalogos.listarSubseries(serie ? Number(serie) : undefined);
  }

  @Get('subfondos')
  subfondos() {
    return this.catalogos.listarSubfondos();
  }

  @Get('tipos-documento')
  tiposDocumento() {
    return this.catalogos.listarTiposDoc();
  }

  @Get('tipos-atencion')
  tiposAtencion() {
    return this.catalogos.listarTiposAtencion();
  }

  @Get('dependencias')
  dependencias() {
    return this.catalogos.listarDependencias();
  }

  @Get('direcciones')
  direcciones(@Query('dependencia') dependencia?: string) {
    return this.catalogos.listarDirecciones(dependencia ? Number(dependencia) : undefined);
  }

  @Get('departamentos')
  departamentos(@Query('direccion') direccion?: string) {
    return this.catalogos.listarDepartamentos(direccion ? Number(direccion) : undefined);
  }

  @Get('mi-clasificacion')
  miClasificacion(@CurrentUser() user: AuthenticatedUser) {
    return this.catalogos.clasificacionDeMiArea(user);
  }

  /** Buscador de destinatarios; excluye al propio usuario en sesión. */
  @Get('servidores')
  servidores(@CurrentUser() user: AuthenticatedUser, @Query('q') q = '') {
    return this.catalogos.buscarServidores(q, user.rfc);
  }

  @Get('tipo_doc_apoyos')
  tipoApoyo() {
    return this.catalogos.tipoApoyo();
  }
}
