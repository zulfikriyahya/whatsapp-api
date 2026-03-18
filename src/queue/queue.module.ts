import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { QueueNames } from "../common/constants/queue-names.constant";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.BROADCAST }),
    BullModule.registerQueue({ name: QueueNames.WEBHOOK }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
