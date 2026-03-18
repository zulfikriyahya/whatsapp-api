import { Module, forwardRef } from "@nestjs/common";
import { AiService } from "./ai.service";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    forwardRef(() => NotificationsModule), // forwardRef mencegah circular dependency
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
