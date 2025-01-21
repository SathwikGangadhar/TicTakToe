import { Injectable } from '@nestjs/common';
import { Authentication } from '../services/authentication.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  validate(payload: any) {
    return { userId: payload.userId, username: payload.name };
  }
  constructor(private readonly authentication: Authentication) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'yourSecretKey', // move to env
    });
  }
}
