import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { BroadcastController } from "./broadcast.controller";
import { BroadcastService } from "./broadcast.service";
import { BroadcastProcessor } from "./processors/broadcast.processor";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { SessionsModule } from "../sessions/sessions.module";
import { GatewayModule } from "../../gateway/gateway.module";
import * as path from "path";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.BROADCAST }),
    SessionsModule,
    GatewayModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dir = path.join(
              cfg.get("app.storagePath"),
              "broadcasts",
              "tmp",
            );
            require("fs").mkdirSync(dir, { recursive: true });
            cb(null, dir);
          },
          filename: (req, file, cb) =>
            cb(null, `${Date.now()}-${file.originalname}`),
        }),
        limits: {
          fileSize: cfg.get<number>("app.maxFileSizeMb") * 1024 * 1024,
        },
      }),
    }),
  ],
  controllers: [BroadcastController],
  providers: [BroadcastService, BroadcastProcessor],
  exports: [BroadcastService],
})
export class BroadcastModule {}
