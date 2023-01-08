import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { RoleType } from './roles.enum';

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {

  // Override handleRequest so it never throws an error
  handleRequest(err, user, info, context) {
    return user;
  }

}

export function Auth(...roles: string[]) {
  if (!roles) {
    roles = [RoleType.normal];
  }
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(OptionalJwtAuthGuard, RolesGuard),
  );
}
