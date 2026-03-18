// ── src/common/guards/quota.guard.ts ─────────────────────────
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../../modules/notifications/notifications.service";
import { QuotaThresholds } from "../constants/quota.constant";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return true;

    const quota = await this.prisma.userQuota.findUnique({
      where: { userId: user.id },
    });
    const tier = await this.prisma.userTier.findUnique({
      where: { userId: user.id },
      include: { tier: true },
    });

    if (!quota || !tier) return true;

    const dailyLimit = tier.tier.maxDailyMessages;
    const used = quota.messagesSentToday;
    const ratio = used / dailyLimit;

    if (ratio >= QuotaThresholds.EXCEEDED) {
      this.notifications.notifyQuotaExceeded(user.id, "daily");
      throw new HttpException(
        { code: ErrorCodes.QUOTA_DAILY_EXCEEDED },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (ratio >= QuotaThresholds.WARNING) {
      const pct = Math.round(ratio * 100);
      this.notifications.notifyQuotaWarning(user.id, "daily", pct);
    }
    return true;
  }
}
