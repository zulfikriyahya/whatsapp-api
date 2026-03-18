import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WebhookProcessor } from "./processors/webhook.processor";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.WEBHOOK }),
    NotificationsModule, // FIX: diperlukan oleh WebhookProcessor untuk kirim email notifikasi
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookProcessor],
  exports: [WebhookService],
})
export class WebhookModule {}
