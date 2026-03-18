import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { addDays, isBefore } from "date-fns";

/**
 * SubscriptionMonitorService — cek langganan yang hampir habis.
 *
 * Sesuai doc 1 section 30 "Email: Langganan hampir habis".
 * Cek harian pada jam 08:00 WIB, kirim notifikasi jika langganan
 * akan berakhir dalam 7 hari atau 3 hari.
 */
@Injectable()
export class SubscriptionMonitorService {
  private logger = new Logger("SubscriptionMonitorService");

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  // Setiap hari jam 08:00 WIB (UTC+7 = 01:00 UTC)
  @Cron("0 1 * * *")
  async checkExpiringSubscriptions() {
    this.logger.log("Checking expiring subscriptions...");

    const now = new Date();
    const in7Days = addDays(now, 7);

    const expiringTiers = await this.prisma.userTier.findMany({
      where: {
        expiresAt: {
          not: null,
          lte: in7Days,
          gte: now,
        },
        isGrace: false,
      },
      include: {
        user: { select: { id: true, email: true, isActive: true } },
        tier: { select: { name: true } },
      },
    });

    for (const ut of expiringTiers) {
      if (!ut.user.isActive || !ut.expiresAt) continue;

      const daysLeft = Math.ceil(
        (ut.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Kirim notifikasi pada 7 hari dan 3 hari sebelum habis
      if (daysLeft === 7 || daysLeft === 3) {
        this.notifications.notifySubscriptionExpiringSoon(
          ut.user.id,
          ut.user.email,
          ut.tier.name,
          daysLeft,
        );
        this.logger.log(
          `Notified user ${ut.user.email}: subscription '${ut.tier.name}' expires in ${daysLeft} days`,
        );
      }
    }
  }
}
