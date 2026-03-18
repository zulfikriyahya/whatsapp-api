// import { Module } from "@nestjs/common";
// import { AnalyticsController } from "./analytics.controller";
// import { AnalyticsService } from "./analytics.service";

// @Module({ controllers: [AnalyticsController], providers: [AnalyticsService] })
// export class AnalyticsModule {}
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { QueueNames } from "../../common/constants/queue-names.constant";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.BROADCAST }),
    BullModule.registerQueue({ name: QueueNames.WEBHOOK }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
