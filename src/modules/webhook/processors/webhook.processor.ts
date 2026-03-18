import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { QueueNames } from "../../../common/constants/queue-names.constant";
import axios from "axios";

export const WEBHOOK_RETRY_DELAYS_MS = [
  60_000, // 1 menit
  300_000, // 5 menit
  900_000, // 15 menit
  3_600_000, // 1 jam
  21_600_000, // 6 jam
];

@Processor(QueueNames.WEBHOOK, { concurrency: 5 })
export class WebhookProcessor extends WorkerHost {
  private logger = new Logger("WebhookProcessor");

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job) {
    const { userId, url, payload, headers, dbId } = job.data;
    const attempt = job.attemptsMade; // 0-based

    try {
      await axios.post(url, JSON.parse(payload), { headers, timeout: 10_000 });

      // Update DB: completed
      if (dbId) {
        await this.prisma.webhookQueue
          .update({ where: { id: dbId }, data: { status: "completed" } })
          .catch(() => {});
      }

      this.logger.debug(`Webhook delivered to ${url} (attempt ${attempt + 1})`);
    } catch (e) {
      const delayMs =
        WEBHOOK_RETRY_DELAYS_MS[attempt] ??
        WEBHOOK_RETRY_DELAYS_MS[WEBHOOK_RETRY_DELAYS_MS.length - 1];

      const isFinalAttempt = attempt + 1 >= 5;

      this.logger.warn(
        `Webhook failed (attempt ${attempt + 1}/5, ${isFinalAttempt ? "FINAL" : `retry in ${delayMs / 1000}s`}): ${e.message}`,
      );

      // Update DB
      if (dbId) {
        await this.prisma.webhookQueue
          .update({
            where: { id: dbId },
            data: {
              retries: { increment: 1 },
              lastError: e.message,
              nextRetryAt: new Date(Date.now() + delayMs),
              status: isFinalAttempt ? "failed" : "pending",
            },
          })
          .catch(() => {});
      }

      // FIX: Kirim notifikasi email jika semua retry habis (attempt ke-5 gagal)
      if (isFinalAttempt) {
        const user = await this.prisma.user
          .findUnique({ where: { id: userId }, select: { email: true } })
          .catch(() => null);
        if (user?.email) {
          this.notifications.notifyWebhookPersistentFailure(user.email, url, 5);
        }
      }

      throw e; // BullMQ akan retry sesuai job options
    }
  }
}
