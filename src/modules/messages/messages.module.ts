import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [
    SessionsModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
