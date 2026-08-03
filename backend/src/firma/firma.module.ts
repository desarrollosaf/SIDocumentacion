import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { FirmaDoc } from '../entities/doc/firma-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { FeplemClient } from './feplem.client';
import { FirmaController } from './firma.controller';
import { FirmaService } from './firma.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroDoc, FirmaDoc]), AuthModule],
  controllers: [FirmaController],
  providers: [FirmaService, FeplemClient],
})
export class FirmaModule {}
