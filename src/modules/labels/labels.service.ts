import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";

@Injectable()
export class LabelsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    return (this.client(sessionId) as any).getLabels?.() ?? [];
  }
  async getById(sessionId: string, labelId: string) {
    return (this.client(sessionId) as any).getLabelById?.(labelId);
  }
  async addToChat(sessionId: string, chatId: string, labelId: string) {
    return (this.client(sessionId) as any).addOrRemoveLabels?.(
      [labelId],
      [chatId],
      "add",
    );
  }
  async removeFromChat(sessionId: string, chatId: string, labelId: string) {
    return (this.client(sessionId) as any).addOrRemoveLabels?.(
      [labelId],
      [chatId],
      "remove",
    );
  }
  async getChatsByLabel(sessionId: string, labelId: string) {
    return (this.client(sessionId) as any).getChatsByLabel?.(labelId) ?? [];
  }
}
