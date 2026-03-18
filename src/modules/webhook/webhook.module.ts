import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WebhookProcessor } from "./processors/webhook.processor";
import { QueueNames } from "../../common/constants/queue-names.constant";

@Module({
  imports: [BullModule.registerQueue({ name: QueueNames.WEBHOOK })],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookProcessor],
  exports: [WebhookService],
})
export class WebhookModule {}
