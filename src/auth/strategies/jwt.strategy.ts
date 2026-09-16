import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(config: ConfigService) {
    super({
      // Extract token from "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  // This runs AFTER the token is verified. Whatever you return
  // gets attached to the request object as req.user
  validate(payload: { sub: string; email: string; role: string }) {
    return {
      id: payload.sub,       // "sub" is JWT convention for subject (the user ID)
      email: payload.email,
      role: payload.role,
    };
  }
}