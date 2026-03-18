import { Module } from "@nestjs/common";
import { CallsController } from "./calls.controller";
import { CallsService } from "./calls.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
