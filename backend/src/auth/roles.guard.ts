import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    // Check user roles (case-insensitive)
    const userRoles = roles.map(role => role.toLowerCase());
    if (userRoles.includes('analyst') && user.isAnalyst) return true;
    if (userRoles.includes('moderator') && user.isModerator) return true;
    if (userRoles.includes('admin') && user.isAdmin) return true;

    return false;
  }
}
