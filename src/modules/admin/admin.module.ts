import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ImpersonationController } from "./impersonation.controller";
import { ImpersonationService } from "./impersonation.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [
    AuditModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get("jwt.secret"),
        signOptions: { expiresIn: cfg.get("jwt.expiresIn") },
      }),
    }),
  ],
  controllers: [ImpersonationController],
  providers: [ImpersonationService],
})
export class AdminModule {}
