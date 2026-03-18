import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';

@Injectable()
export class BroadcastListService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    const chats = await this.client(sessionId).getChats();
    return chats.filter(
      (c: any) => c.isBroadcast && c.id?.server === 'broadcast',
    );
  }

  async getById(sessionId: string, broadcastId: string) {
    return this.client(sessionId).getChatById(broadcastId);
  }

  async send(sessionId: string, broadcastId: string, message: string) {
    return this.manager.sendMessage(sessionId, broadcastId, message);
  }
}
