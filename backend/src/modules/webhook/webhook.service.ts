import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../../prisma/prisma.service";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { generateWebhookSecret } from "../../common/utils/token-generator.util";
import { generateHmacSignature } from "../../common/utils/hmac.util";
import { WEBHOOK_RETRY_DELAYS_MS } from "./processors/webhook.processor";
import { UpdateWebhookDto } from "./dto/update-webhook.dto";
import axios from "axios";

@Injectable()
export class WebhookService {
  constructor(
    @InjectQueue(QueueNames.WEBHOOK) private webhookQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async getConfig(userId: string) {
    return this.prisma.webhookConfig.findUnique({ where: { userId } });
  }

  async updateConfig(userId: string, dto: UpdateWebhookDto) {
    return this.prisma.webhookConfig.upsert({
      where: { userId },
      create: {
        userId,
        webhookUrl: dto.webhookUrl,
        isActive: dto.isActive ?? true,
      },
      update: { webhookUrl: dto.webhookUrl, isActive: dto.isActive },
    });
  }

  async generateSecret(userId: string) {
    const secret = generateWebhookSecret();
    await this.prisma.webhookConfig.upsert({
      where: { userId },
      create: { userId, webhookSecret: secret },
      update: { webhookSecret: secret },
    });
    return { secret };
  }

  async testWebhook(userId: string) {
    const config = await this.prisma.webhookConfig.findUnique({
      where: { userId },
    });
    if (!config?.webhookUrl)
      throw new BadRequestException({
        code: ErrorCodes.WEBHOOK_NOT_CONFIGURED,
      });

    const payload = {
      event: "test",
      timestamp: new Date().toISOString(),
      message: "Webhook test from WA Gateway",
    };
    const start = Date.now();
    try {
      const res = await axios.post(config.webhookUrl, payload, {
        timeout: 10_000,
      });
      return {
        targetStatus: res.status,
        responseTime: `${Date.now() - start}ms`,
      };
    } catch (e) {
      throw new BadRequestException({
        code: ErrorCodes.INTERNAL,
        message: `Webhook error: ${e.message}`,
      });
    }
  }

  async dispatch(userId: string, event: string, payload: any) {
    const config = await this.prisma.webhookConfig.findUnique({
      where: { userId },
    });
    if (!config?.webhookUrl || !config.isActive) return;

    const body = JSON.stringify({ event, ...payload });
    const signature = config.webhookSecret
      ? generateHmacSignature(body, config.webhookSecret)
      : undefined;
    const headers: any = { "Content-Type": "application/json" };
    if (signature) headers["X-Hub-Signature"] = signature;

    // Catat di database sebelum enqueue
    const record = await this.prisma.webhookQueue.create({
      data: {
        userId,
        url: config.webhookUrl,
        payload: JSON.parse(body),
        headers,
        status: "pending",
        maxRetries: 5,
      },
    });

    // FIX: set attempts & custom backoff sesuai WEBHOOK_RETRY_DELAYS_MS
    await this.webhookQueue.add(
      "dispatch",
      {
        userId,
        url: config.webhookUrl,
        payload: body,
        headers,
        dbId: record.id,
      },
      {
        attempts: 5,
        backoff: {
          // BullMQ 'custom' backoff — nilai delay diambil dari array berdasarkan attemptsMade
          type: "custom",
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
