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
    console.log('Validating token payload:', payload);
    try {
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        console.log('User not found:', payload.email);
        throw new UnauthorizedException('Invalid token');
      }
      console.log('User found:', {
        id: user._id,
        email: user.email,
        role: user.role
      });
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role as 'ADMIN' | 'USER',
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
