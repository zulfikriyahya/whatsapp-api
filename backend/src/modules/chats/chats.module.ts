import { Module } from "@nestjs/common";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
