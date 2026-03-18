import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { SessionManagerService } from "../../sessions/session-manager.service";
import { GatewayService } from "../../../gateway/gateway.service";
import { QueueNames } from "../../../common/constants/queue-names.constant";
import { CampaignStatus, MessageStatus, MessageType } from "@prisma/client";
import { toJid } from "../../../common/utils/phone-normalizer.util";
import { MessageMedia } from "whatsapp-web.js";
import { validateMimeType } from "../../../common/utils/mime-validator.util";
import * as fs from "fs";
import * as path from "path";

@Processor(QueueNames.BROADCAST, { concurrency: 1 })
export class BroadcastProcessor extends WorkerHost {
  private logger = new Logger("BroadcastProcessor");

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
    private gateway: GatewayService,
  ) {
    super();
  }

  async process(job: Job) {
    const { campaignId, userId, recipients, message, mediaPath, sessions } =
      job.data;

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.processing },
    });

    let rrIdx = 0;
    let successCount = 0;
    let failedCount = 0;

    let media: MessageMedia | null = null;
    if (mediaPath && fs.existsSync(mediaPath)) {
      const buf = fs.readFileSync(mediaPath);
      const mime = await validateMimeType(buf).catch(() => null);
      if (mime)
        media = new MessageMedia(
          mime,
          buf.toString("base64"),
          path.basename(mediaPath),
        );
    }

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const sessionId = sessions[rrIdx % sessions.length];
      rrIdx++;

      try {
        const jid = toJid(recipient);
        if (media) {
          await this.manager.sendMedia(sessionId, jid, media, message);
        } else {
          await this.manager.sendMessage(sessionId, jid, message);
        }
        successCount++;
        await this.prisma.messageLog.create({
          data: {
            userId,
            sessionId,
            campaignId,
            target: recipient,
            message,
            messageType: MessageType.text,
            status: MessageStatus.success,
          },
        });
      } catch (e) {
        failedCount++;
        await this.prisma.messageLog.create({
          data: {
            userId,
            sessionId: sessions[0],
            campaignId,
            target: recipient,
            message,
            messageType: MessageType.text,
            status: MessageStatus.failed,
            errorMessage: e.message,
          },
        });
      }

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { processedCount: i + 1, successCount, failedCount },
      });

      this.gateway.emitBroadcastProgress(userId, {
        campaignId,
        current: i + 1,
        total: recipients.length,
        percentage: Math.round(((i + 1) / recipients.length) * 100),
        successCount,
        failedCount,
      });

      const delay = 1000 + Math.random() * 2000;
      await new Promise((r) => setTimeout(r, delay));
    }

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.completed },
    });
    this.gateway.emitBroadcastComplete(
      userId,
      campaignId,
      successCount,
      failedCount,
    );
    await this.prisma.userQuota.updateMany({
      where: { userId },
      data: { broadcastsThisMonth: { increment: 1 } },
    });
  }
}
