import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { ModelHasRole, Role } from '../entities/doc/role.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { User } from '../entities/saf/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Role, ModelHasRole]),
    TypeOrmModule.forFeature([User, ServidorPublico], SAF_CONNECTION),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'cambia-esta-clave-en-produccion'),
        // `expiresIn` de jsonwebtoken usa un tipo literal de plantilla; el
        // valor viene del entorno, así que se afirma como cadena válida.
        signOptions: {
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
            '8h',
          ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
