import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EmailService } from "./email.service";
import { SystemMonitorService } from "./system-monitor.service";
import { GatewayModule } from "../../gateway/gateway.module";

@Module({
  imports: [GatewayModule],
  providers: [NotificationsService, EmailService, SystemMonitorService],
  // FIX: export EmailService agar bisa dipakai oleh module lain
  // yang import NotificationsModule (seperti ApiKeysModule)
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}
