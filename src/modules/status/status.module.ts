import { Module } from "@nestjs/common";
import { StatusController } from "./status.controller";
import { StatusService } from "./status.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
