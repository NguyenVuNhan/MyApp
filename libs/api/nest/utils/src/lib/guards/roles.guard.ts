import { Role } from '@app/api/shared/constances';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUser, JwtTokenGuard } from '@app/authentication/shared';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtTokenGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role == role;
    }
  }

  return mixin(RoleGuardMixin);
};
