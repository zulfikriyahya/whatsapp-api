import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";

@Injectable()
export class ChatsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    return this.client(sessionId).getChats();
  }
  async getById(sessionId: string, chatId: string) {
    return this.client(sessionId).getChatById(chatId);
  }
  async archive(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).archive();
  }
  async unarchive(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).unarchive();
  }
  async mute(sessionId: string, chatId: string, duration?: number) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).mute(duration);
  }
  async unmute(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).unmute();
  }
  async pin(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).pin();
  }
  async unpin(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).unpin();
  }
  async delete(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).delete();
  }
  async markRead(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).sendSeen();
  }
  async search(sessionId: string, query: string) {
    return this.client(sessionId).searchMessages(query, {});
  }
}
