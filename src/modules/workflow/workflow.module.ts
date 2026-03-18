import { Module } from "@nestjs/common";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";
import { WorkflowEngine } from "./workflow.engine";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowEngine],
  exports: [WorkflowEngine],
})
export class WorkflowModule {}
