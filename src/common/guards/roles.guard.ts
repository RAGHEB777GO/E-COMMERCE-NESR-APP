import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

   
    if (!user || !user.role) {
      console.warn('⛔ Access denied: No user or role found');
      throw new ForbiddenException('You are not authorized to access this resource');
    }

    const hasAccess = requiredRoles.includes(user.role);

    console.log(`🔎 Checking role for user: ${user.role} | Allowed: ${hasAccess}`);

    if (!hasAccess) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return hasAccess;
  }
}
