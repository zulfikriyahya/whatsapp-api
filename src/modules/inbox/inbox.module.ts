import { Module, forwardRef } from "@nestjs/common";
import { InboxController } from "./inbox.controller";
import { InboxService } from "./inbox.service";
import { SessionsModule } from "../sessions/sessions.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    forwardRef(() => SessionsModule), // FIX: circular — SessionsModule ↔ InboxModule
    NotificationsModule,
  ],
  controllers: [InboxController],
  providers: [InboxService],
  exports: [InboxService],
})
export class InboxModule {}
