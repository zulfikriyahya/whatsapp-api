import { Module } from "@nestjs/common";
import { DripController } from "./drip.controller";
import { DripService } from "./drip.service";
import { DripManager } from "./drip.manager";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [DripController],
  providers: [DripService, DripManager],
  exports: [DripManager],
})
export class DripModule {}
