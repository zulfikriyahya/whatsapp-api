import { Module } from "@nestjs/common";
import { TiersController } from "./tiers.controller";
import { TiersService } from "./tiers.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [TiersController],
  providers: [TiersService],
  exports: [TiersService],
})
export class TiersModule {}
