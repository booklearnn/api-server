import { JWT_KEY } from './../config/jwt.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from './types';
import { loadLoggedInUser } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_KEY.ACCESS_SECRET_KEY),
    });
  }

  validate(payload: TokenPayload) {
    // TODO validate payload (business logic)
    return loadLoggedInUser(payload);
  }
}
