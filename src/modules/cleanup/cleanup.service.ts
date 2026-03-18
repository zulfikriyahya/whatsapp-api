import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { subDays } from "date-fns";
import * as fs from "fs";
import * as path from "path";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CleanupService {
  private logger = new Logger("CleanupService");

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Cron("0 2 * * *")
  async run() {
    this.logger.log("Running cleanup...");
    await this.cleanMessageLogs();
    await this.cleanWorkflowLogs();
    await this.cleanAuditLogs();
    await this.cleanWebhookQueue();
    await this.cleanOrphanBroadcastFiles(); // FIX
    await this.cleanOrphanUploadFiles(); // FIX: tambah cleanup upload lama
    this.logger.log("Cleanup complete");
  }

  @Cron("0 17 * * *") // 00:00 WIB
  async resetDailyQuota() {
    const { count } = await this.prisma.userQuota.updateMany({
      data: { messagesSentToday: 0, lastDailyResetAt: new Date() },
    });
    this.logger.log(`Daily quota reset for ${count} users`);
  }

  @Cron("0 17 1 * *") // Tgl 1 tiap bulan 00:00 WIB
  async resetMonthlyQuota() {
    const { count } = await this.prisma.userQuota.updateMany({
      data: { broadcastsThisMonth: 0, lastMonthlyResetAt: new Date() },
    });
    this.logger.log(`Monthly broadcast quota reset for ${count} users`);
  }

  private async cleanMessageLogs() {
    const days = this.config.get<number>("app.logRetentionDays");
    const { count } = await this.prisma.messageLog.deleteMany({
      where: { timestamp: { lt: subDays(new Date(), days) } },
    });
    this.logger.debug(`Deleted ${count} old message logs`);
  }

  private async cleanWorkflowLogs() {
    const days = this.config.get<number>("app.logRetentionDays");
    const { count } = await this.prisma.workflowLog.deleteMany({
      where: { timestamp: { lt: subDays(new Date(), days) } },
    });
    this.logger.debug(`Deleted ${count} old workflow logs`);
  }

  private async cleanAuditLogs() {
    const days = this.config.get<number>("app.auditLogRetentionDays");
    const { count } = await this.prisma.auditLog.deleteMany({
      where: { timestamp: { lt: subDays(new Date(), days) } },
    });
    this.logger.debug(`Deleted ${count} old audit logs`);
  }

  private async cleanWebhookQueue() {
    const { count } = await this.prisma.webhookQueue.deleteMany({
      where: {
        status: { in: ["completed", "failed"] },
        createdAt: { lt: subDays(new Date(), 7) },
      },
    });
    this.logger.debug(`Deleted ${count} old webhook queue entries`);
  }

  /**
   * FIX: Broadcast files disimpan flat di /broadcasts/tmp/{timestamp}-{filename}
   * Cleanup file tmp yang lebih dari 24 jam dan campaign-nya sudah completed/cancelled.
   * Logika lama salah karena mencari folder bernama campaign ID (tidak ada).
   */
  private async cleanOrphanBroadcastFiles() {
    const tmpPath = path.join(
      this.config.get("app.storagePath"),
      "broadcasts",
      "tmp",
    );
    if (!fs.existsSync(tmpPath)) return;

    const files = fs.readdirSync(tmpPath);
    const cutoff = Date.now() - 24 * 3600 * 1000; // lebih dari 24 jam

    for (const file of files) {
      const filePath = path.join(tmpPath, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
          this.logger.debug(`Removed old broadcast tmp file: ${file}`);
        }
      } catch (e) {
        this.logger.warn(`Could not clean file ${file}: ${e.message}`);
      }
    }
  }

  /**
   * FIX: Hapus file upload media yang lebih dari 7 hari
   * (file dari POST /messages/:sessionId/messages/:messageId/download)
   */
  private async cleanOrphanUploadFiles() {
    const uploadsPath = path.join(
      this.config.get("app.storagePath"),
      "uploads",
    );
    if (!fs.existsSync(uploadsPath)) return;

    const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
    const userDirs = fs.readdirSync(uploadsPath);

    for (const userDir of userDirs) {
      const userPath = path.join(uploadsPath, userDir);
      if (!fs.statSync(userPath).isDirectory()) continue;

      const files = fs.readdirSync(userPath);
      for (const file of files) {
        const filePath = path.join(userPath, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.mtimeMs < cutoff) {
            fs.unlinkSync(filePath);
            this.logger.debug(`Removed old upload file: ${userDir}/${file}`);
          }
        } catch (e) {
          this.logger.warn(`Could not clean upload file ${file}: ${e.message}`);
        }
      }
    }
  }
}
