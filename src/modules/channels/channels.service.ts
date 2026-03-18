import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";

@Injectable()
export class ChannelsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    return (this.client(sessionId) as any).getChannels?.() ?? [];
  }

  async search(sessionId: string, query: string) {
    return (this.client(sessionId) as any).searchChannels?.(query) ?? [];
  }

  async subscribe(sessionId: string, channelId: string) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.subscribe?.();
  }

  async unsubscribe(sessionId: string, channelId: string) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.unsubscribe?.();
  }

  async send(sessionId: string, channelId: string, message: string) {
    return this.manager.sendMessage(sessionId, channelId, message);
  }
}
