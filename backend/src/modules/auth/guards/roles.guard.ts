import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has required role or admin status
    return roles.some((role) => {
      if (role === 'ADMIN') {
        return user.isAdmin || user.role === 'ADMIN';
      }
      if (role === 'MODERATOR') {
        return user.isModerator || user.role === 'MODERATOR';
      }
      return user.role === role;
    });
  }
}