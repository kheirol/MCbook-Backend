import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let hasRole = false;
    for (const role of roles) {
      if (role === RoleType.admin) {
        hasRole = user && user.isAdmin;
      } else if (role === RoleType.normal) {
        hasRole = !!user.id;
      } else if (role === RoleType.optional) {
        hasRole = true
      }
    }
    return hasRole;
  }
}
