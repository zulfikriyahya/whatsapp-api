import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { EmailService } from "../notifications/email.service";
import { addDays } from "date-fns";

/**
 * ApiKeyMonitorService — kirim notifikasi email jika API token
 * akan kadaluarsa dalam 7 hari atau 3 hari.
 * Sesuai doc 1 section 30: "Email: Token API mendekati expired"
 */
@Injectable()
export class ApiKeyMonitorService {
  private logger = new Logger("ApiKeyMonitorService");

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private email: EmailService,
  ) {}

  // Setiap hari jam 09:00 WIB (02:00 UTC)
  @Cron("0 2 * * *")
  async checkExpiringApiKeys() {
    const now = new Date();
    const in7Days = addDays(now, 7);

    const expiring = await this.prisma.apiKey.findMany({
      where: {
        expiresAt: { not: null, lte: in7Days, gte: now },
      },
      include: {
        user: { select: { email: true, isActive: true } },
      },
    });

    for (const key of expiring) {
      if (!key.user.isActive || !key.expiresAt) continue;

      const daysLeft = Math.ceil(
        (key.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysLeft !== 7 && daysLeft !== 3) continue;

      // Cek apakah sudah pernah notif hari ini
      const notifKey = `apikey:expiry:notif:${key.id}:${daysLeft}`;
      const already = await this.redis.get<boolean>(notifKey).catch(() => null);
      if (already) continue;

      await this.email.send(
        key.user.email,
        `API Token "${key.name}" Hampir Kadaluarsa`,
        `API token <strong>${key.name}</strong> (preview: <code>${key.keyPreview}...</code>)
         akan kadaluarsa dalam <strong>${daysLeft} hari</strong>
         (${key.expiresAt.toLocaleDateString("id-ID")}).<br><br>
         Segera buat token baru atau perpanjang masa aktifnya di dashboard.`,
      );

      // Tandai sudah notif (TTL 25 jam)
      await this.redis.set(notifKey, true, 25 * 3600);
      this.logger.log(
        `Notified ${key.user.email}: token "${key.name}" expires in ${daysLeft} days`,
      );
    }
  }
}
