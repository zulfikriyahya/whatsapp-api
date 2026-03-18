import { Module } from "@nestjs/common";
import { AutoReplyController } from "./auto-reply.controller";
import { AutoReplyService } from "./auto-reply.service";
import { AutoReplyEngine } from "./auto-reply.engine";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [AutoReplyController],
  providers: [AutoReplyService, AutoReplyEngine],
  exports: [AutoReplyEngine],
})
export class AutoReplyModule {}
