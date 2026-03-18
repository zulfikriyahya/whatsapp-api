import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();
    if (user && !user.isActive) {
      throw new ForbiddenException({ code: ErrorCodes.ACCOUNT_DISABLED });
    }
    return true;
  }
}
