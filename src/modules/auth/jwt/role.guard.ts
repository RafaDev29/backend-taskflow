import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
    mixin,
    Type,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  export function JwtRoleGuard(requiredRole: string): Type<CanActivate> {
    @Injectable()
    class RoleGuardMixin extends AuthGuard('jwt') {
      async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = await super.canActivate(context);
        if (!can) throw new UnauthorizedException('No autorizado');
  
        const request = context.switchToHttp().getRequest();
        const user = request.user;
  
        if (!user || user.role !== requiredRole) {
          throw new ForbiddenException(`Solo permitido para el rol ${requiredRole}`);
        }
  
        return true;
      }
    }
  
    return mixin(RoleGuardMixin);
  }
  