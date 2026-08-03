import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

export interface JwtPayload extends Omit<AuthenticatedUser, 'id'> {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'cambia-esta-clave-en-produccion'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    const { sub, ...perfil } = payload;
    return { id: sub, ...perfil };
  }
}
