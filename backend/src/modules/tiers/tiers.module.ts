import { Module } from "@nestjs/common";
import { TiersController } from "./tiers.controller";
import { TiersService } from "./tiers.service";
import { SubscriptionMonitorService } from "./subscription-monitor.service";
import { GracePeriodService } from "./grace-period.service";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [AuditModule, NotificationsModule],
  controllers: [TiersController],
  providers: [TiersService, SubscriptionMonitorService, GracePeriodService],
  exports: [TiersService],
})
export class TiersModule {}
