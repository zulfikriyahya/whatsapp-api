import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { MessageMedia } from 'whatsapp-web.js';
import { validateMimeType } from '../../common/utils/mime-validator.util';

@Injectable()
export class ProfileService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getProfile(sessionId: string) {
    const c = this.client(sessionId);
    const info = c.info;
    return {
      wid: info?.wid,
      pushname: info?.pushname,
      platform: info?.platform,
    };
  }

  async setDisplayName(sessionId: string, name: string) {
    const c = this.client(sessionId);
    await (c as any).setDisplayName(name);
    return { updated: true };
  }

  async setStatus(sessionId: string, status: string) {
    await (this.client(sessionId) as any).setStatus(status);
    return { updated: true };
  }

  async setProfilePhoto(sessionId: string, file: Express.Multer.File) {
    await validateMimeType(file.buffer);
    const media = new MessageMedia(
      'image/jpeg',
      file.buffer.toString('base64'),
      file.originalname,
    );
    await (this.client(sessionId) as any).setProfilePicture(media);
    return { updated: true };
  }

  async deleteProfilePhoto(sessionId: string) {
    await (this.client(sessionId) as any).deleteProfilePicture();
    return { deleted: true };
  }

  async getContactProfilePhoto(sessionId: string, contactId: string) {
    const url = await this.client(sessionId).getProfilePicUrl(contactId);
    return { url };
  }

  async blockContact(sessionId: string, contactId: string) {
    const contact = await this.client(sessionId).getContactById(contactId);
    await contact.block();
    return { blocked: true };
  }

  async unblockContact(sessionId: string, contactId: string) {
    const contact = await this.client(sessionId).getContactById(contactId);
    await contact.unblock();
    return { unblocked: true };
  }

  async getBlockedContacts(sessionId: string) {
    return (this.client(sessionId) as any).getBlockedContacts();
  }

  async getContactById(sessionId: string, contactId: string) {
    return this.client(sessionId).getContactById(contactId);
  }

  async getAllContacts(sessionId: string) {
    return this.client(sessionId).getContacts();
  }
}
