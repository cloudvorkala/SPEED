import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  isModerator?: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'your_jwt_secret'),
      passReqToCallback: true,
      algorithms: ['HS256']
    });
  }

  async validate(req: any, payload: JwtPayload) {
    try {
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role as 'ADMIN' | 'USER',
        isAdmin: user.isAdmin,
        isModerator: user.isModerator
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
