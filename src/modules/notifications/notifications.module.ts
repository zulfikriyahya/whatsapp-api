// import { Module } from "@nestjs/common";
// import { NotificationsService } from "./notifications.service";
// import { EmailService } from "./email.service";

// @Module({
//   providers: [NotificationsService, EmailService],
//   exports: [NotificationsService],
// })
// export class NotificationsModule {}
import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EmailService } from "./email.service";
import { GatewayModule } from "../../gateway/gateway.module";

@Module({
  imports: [GatewayModule],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
