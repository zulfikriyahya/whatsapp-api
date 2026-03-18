import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

const GRACE_PERIOD_DAYS = 3; // grace period 3 hari setelah expired

/**
 * GracePeriodService:
 * - Cek tier yang sudah expired → set isGrace: true
 * - Cek tier yang grace period-nya juga sudah habis → nonaktifkan akun / downgrade ke Free
 * - Invalidasi cache tier setiap perubahan
 */
@Injectable()
export class GracePeriodService {
  private logger = new Logger("GracePeriodService");

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // Cek setiap jam
  @Cron("0 * * * *")
  async processExpiredTiers() {
    const now = new Date();
    const graceCutoff = new Date(
      now.getTime() - GRACE_PERIOD_DAYS * 24 * 3600 * 1000,
    );

    // 1. Tier baru expired → set isGrace: true
    const newlyExpired = await this.prisma.userTier.findMany({
      where: {
        expiresAt: { lte: now },
        isGrace: false,
      },
    });

    for (const ut of newlyExpired) {
      await this.prisma.userTier.update({
        where: { id: ut.id },
        data: { isGrace: true },
      });
      await this.invalidateTierCache(ut.userId);
      this.logger.log(`User ${ut.userId}: tier expired → grace period started`);
    }

    // 2. Grace period habis → downgrade ke Free tier
    const gracePeriodExpired = await this.prisma.userTier.findMany({
      where: {
        expiresAt: { lte: graceCutoff },
        isGrace: true,
      },
      include: { user: true },
    });

    const freeTier = await this.prisma.tier.findFirst({
      where: { name: "Free" },
    });
    if (!freeTier) return;

    for (const ut of gracePeriodExpired) {
      await this.prisma.userTier.update({
        where: { id: ut.id },
        data: {
          tierId: freeTier.id,
          isGrace: false,
          expiresAt: null, // Free tier tidak expired
        },
      });
      await this.invalidateTierCache(ut.userId);
      this.logger.log(
        `User ${ut.userId}: grace period ended → downgraded to Free`,
      );
    }
  }

  private async invalidateTierCache(userId: string) {
    await this.redis.del(`tier:features:${userId}`);
    await this.redis.del(`tier:ratelimit:${userId}`);
  }
}
