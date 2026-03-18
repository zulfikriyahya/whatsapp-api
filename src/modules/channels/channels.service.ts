import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { MessageMedia } from 'whatsapp-web.js';
import { validateMimeType } from '../../common/utils/mime-validator.util';

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

  async getByInviteCode(sessionId: string, inviteCode: string) {
    return (this.client(sessionId) as any).getChannelByInviteCode?.(inviteCode);
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

  async manageAdmin(
    sessionId: string,
    channelId: string,
    participantJid: string,
    action: 'add' | 'remove',
  ) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    if (action === 'add') return ch?.addAdmin?.(participantJid);
    return ch?.removeAdmin?.(participantJid);
  }

  async transferOwnership(
    sessionId: string,
    channelId: string,
    newOwnerJid: string,
  ) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.transferOwnership?.(newOwnerJid);
  }

  async update(
    sessionId: string,
    channelId: string,
    name?: string,
    description?: string,
  ) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    const results: any = {};
    if (name) results.name = await ch?.setName?.(name);
    if (description)
      results.description = await ch?.setDescription?.(description);
    return results;
  }

  async delete(sessionId: string, channelId: string) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.delete?.();
  }
}
