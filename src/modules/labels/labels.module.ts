import { Module } from "@nestjs/common";
import { LabelsController } from "./labels.controller";
import { LabelsService } from "./labels.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
