import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../../modules/notifications/notifications.service";
import { QuotaThresholds } from "../constants/quota.constant";
import { ErrorCodes } from "../constants/error-codes.constant";

export const QUOTA_TYPE_KEY = "quotaType";
// FIX: QuotaType sebagai NestJS SetMetadata decorator yang benar
export const QuotaType = (type: "daily" | "monthly") =>
  SetMetadata(QUOTA_TYPE_KEY, type);

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return true;

    // Admin bypass quota
    if (user.role === "admin" || user.role === "super_admin") return true;

    const quotaType =
      this.reflector.get<"daily" | "monthly">(
        QUOTA_TYPE_KEY,
        ctx.getHandler(),
      ) ?? "daily";

    const [quota, userTier] = await Promise.all([
      this.prisma.userQuota.findUnique({ where: { userId: user.id } }),
      this.prisma.userTier.findUnique({
        where: { userId: user.id },
        include: { tier: true },
      }),
    ]);

    if (!quota || !userTier) return true;

    const { used, limit } =
      quotaType === "monthly"
        ? {
            used: quota.broadcastsThisMonth,
            limit: userTier.tier.maxMonthlyBroadcasts,
          }
        : {
            used: quota.messagesSentToday,
            limit: userTier.tier.maxDailyMessages,
          };

    const ratio = used / limit;

    if (ratio >= QuotaThresholds.EXCEEDED) {
      this.notifications.notifyQuotaExceeded(user.id, quotaType);
      throw new HttpException(
        {
          code:
            quotaType === "monthly"
              ? ErrorCodes.QUOTA_MONTHLY_EXCEEDED
              : ErrorCodes.QUOTA_DAILY_EXCEEDED,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (ratio >= QuotaThresholds.WARNING) {
      this.notifications.notifyQuotaWarning(
        user.id,
        quotaType,
        Math.round(ratio * 100),
      );
    }

    return true;
  }
}
