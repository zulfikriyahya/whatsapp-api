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

  @Cron("0 2 * * *") // 02:00 WIB daily
  async run() {
    this.logger.log("Running cleanup...");
    await this.cleanMessageLogs();
    await this.cleanWorkflowLogs();
    await this.cleanAuditLogs();
    await this.cleanWebhookQueue();
    await this.cleanOrphanBroadcastFiles();
    this.logger.log("Cleanup complete");
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

  private async cleanOrphanBroadcastFiles() {
    const storagePath = path.join(
      this.config.get("app.storagePath"),
      "broadcasts",
    );
    if (!fs.existsSync(storagePath)) return;

    const dirs = fs.readdirSync(storagePath);
    for (const dir of dirs) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: dir },
      });
      if (
        !campaign ||
        campaign.status === "completed" ||
        campaign.status === "cancelled"
      ) {
        fs.rmSync(path.join(storagePath, dir), {
          recursive: true,
          force: true,
        });
        this.logger.debug(`Removed orphan broadcast folder: ${dir}`);
      }
    }
  }
}
