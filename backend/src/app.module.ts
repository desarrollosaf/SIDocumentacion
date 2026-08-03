import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './auth/auth.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { FirmaModule } from './firma/firma.module';
import { MenuModule } from './menu/menu.module';
import { OficiosModule } from './oficios/oficios.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    AuthModule,
    MenuModule,
    CatalogosModule,
    FirmaModule,
    OficiosModule,
    SolicitudesModule,
    AgendaModule,
  ],
  providers: [
    // Toda la API exige JWT salvo lo marcado con @Public(), igual que el
    // grupo Route::middleware('auth') del sistema original.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
