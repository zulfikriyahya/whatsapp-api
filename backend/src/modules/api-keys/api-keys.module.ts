import { Module } from "@nestjs/common";
import { ApiKeysController } from "./api-keys.controller";
import { ApiKeysService } from "./api-keys.service";
import { ApiKeyMonitorService } from "./api-key-monitor.service";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [AuditModule, NotificationsModule],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, ApiKeyMonitorService],
})
export class ApiKeysModule {}
