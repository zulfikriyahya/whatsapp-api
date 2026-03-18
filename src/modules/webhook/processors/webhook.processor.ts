import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { QueueNames } from "../../../common/constants/queue-names.constant";
import axios from "axios";

const RETRY_DELAYS = [60, 300, 900, 3600, 21600]; // seconds

@Processor(QueueNames.WEBHOOK, { concurrency: 5 })
export class WebhookProcessor extends WorkerHost {
  private logger = new Logger("WebhookProcessor");

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    const { userId, url, payload, headers } = job.data;
    try {
      await axios.post(url, JSON.parse(payload), { headers, timeout: 10000 });
    } catch (e) {
      const retries = job.attemptsMade;
      this.logger.warn(`Webhook failed (attempt ${retries + 1}): ${e.message}`);
      const delay =
        (RETRY_DELAYS[retries] ?? RETRY_DELAYS[RETRY_DELAYS.length - 1]) * 1000;
      throw Object.assign(e, { delay });
    }
  }
}
