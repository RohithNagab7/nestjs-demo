import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtStrategyPayload } from '../interface/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN!,
    });
  }

  async validate(payload: JwtStrategyPayload) {
    try {
      const user = await this.authService.getUserById(payload.sub);

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials', error);
    }
  }
}
