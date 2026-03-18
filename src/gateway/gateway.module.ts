// import { Module } from "@nestjs/common";
// import { AppGateway } from "./app.gateway";
// import { GatewayService } from "./gateway.service";

// @Module({
//   providers: [AppGateway, GatewayService],
//   exports: [GatewayService],
// })
// export class GatewayModule {}
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AppGateway } from "./app.gateway";
import { GatewayService } from "./gateway.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get("jwt.secret"),
        signOptions: { expiresIn: cfg.get("jwt.expiresIn") },
      }),
    }),
  ],
  providers: [AppGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
