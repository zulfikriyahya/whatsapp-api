import { Module } from "@nestjs/common";
import { SchedulerController } from "./scheduler.controller";
import { SchedulerService } from "./scheduler.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
