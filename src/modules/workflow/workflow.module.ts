import { Module, forwardRef } from "@nestjs/common";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";
import { WorkflowEngine } from "./workflow.engine";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [forwardRef(() => SessionsModule)],
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowEngine],
  exports: [WorkflowEngine, WorkflowService],
})
export class WorkflowModule {}
