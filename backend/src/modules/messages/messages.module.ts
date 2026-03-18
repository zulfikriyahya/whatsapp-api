import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { SessionsModule } from "../sessions/sessions.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    SessionsModule,
    NotificationsModule, // FIX: diperlukan oleh QuotaGuard (inject NotificationsService)
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
