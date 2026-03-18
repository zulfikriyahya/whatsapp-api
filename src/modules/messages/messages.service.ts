import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import {
  normalizePhone,
  toJid,
} from '../../common/utils/phone-normalizer.util';
import { generatePdf } from '../../common/utils/pdf-generator.util';
import { MessageStatus, MessageType, SessionStatus } from '@prisma/client';
import { MessageMedia } from 'whatsapp-web.js';
import { validateMimeType } from '../../common/utils/mime-validator.util';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMediaDto } from './dto/send-media.dto';
import { SendLocationDto } from './dto/send-location.dto';
import { SendPollDto } from './dto/send-poll.dto';
import { SendContactDto } from './dto/send-contact.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { SendLiveLocationDto } from './dto/send-live-location.dto';
import { SendVoiceNoteDto } from './dto/send-voice-note.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private manager: SessionManagerService,
  ) {}

  async send(userId: string, dto: SendMessageDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    try {
      const opts: any = {};
      if (dto.quotedMessageId) opts.quotedMessageId = dto.quotedMessageId;
      if (dto.mentions) opts.mentions = dto.mentions;
      const result = await this.manager.sendMessage(
        sessionId,
        jid,
        dto.message,
        opts,
      );
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.message,
        MessageType.text,
        MessageStatus.success,
      );
      return { messageId: result?.id?._serialized };
    } catch (e) {
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.message,
        MessageType.text,
        MessageStatus.failed,
        e.message,
      );
      throw new BadRequestException({
        code: ErrorCodes.SEND_FAILED,
        message: e.message,
      });
    }
  }

  async sendMedia(
    userId: string,
    dto: SendMediaDto,
    file: Express.Multer.File,
  ) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const mime = await validateMimeType(file.buffer);
    const media = new MessageMedia(
      mime,
      file.buffer.toString('base64'),
      file.originalname,
    );
    const msgType = this.mimeToType(mime);
    try {
      const result = await this.manager.sendMedia(
        sessionId,
        jid,
        media,
        dto.caption,
      );
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.caption ?? '',
        msgType,
        MessageStatus.success,
      );
      return { messageId: result?.id?._serialized };
    } catch (e) {
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.caption ?? '',
        msgType,
        MessageStatus.failed,
        e.message,
      );
      throw new BadRequestException({
        code: ErrorCodes.SEND_FAILED,
        message: e.message,
      });
    }
  }

  async sendLocation(userId: string, dto: SendLocationDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const result = await client.sendMessage(
      jid,
      dto.latitude + ',' + dto.longitude,
      {
        location: {
          latitude: dto.latitude,
          longitude: dto.longitude,
          description: dto.description,
        },
      } as any,
    );
    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      `Location:${dto.latitude},${dto.longitude}`,
      MessageType.location,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async sendPoll(userId: string, dto: SendPollDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const result = await client.sendMessage(jid, dto.question, {
      poll: { options: dto.options, multiselect: dto.multiselect ?? false },
    } as any);
    return { messageId: result?.id?._serialized };
  }

  async sendContact(userId: string, dto: SendContactDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const contacts = await Promise.all(
      dto.contacts.map(async (num) => {
        const normalized = normalizePhone(num);
        return client.getContactById(`${normalized}@s.whatsapp.net`);
      }),
    );
    const result = await client.sendMessage(jid, contacts as any);
    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      '[vCard]',
      MessageType.vcard,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async editMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    newText: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const result = await (msg as any).edit(newText);
    return { edited: true, messageId: result?.id?._serialized };
  }

  async forwardMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    to: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const jid = toJid(to);
    await msg.forward(jid);
    return { forwarded: true };
  }

  async pinMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    duration?: number,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await (msg as any).pin(duration);
    return { pinned: true };
  }

  async unpinMessage(userId: string, sessionId: string, messageId: string) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await (msg as any).unpin();
    return { unpinned: true };
  }

  async downloadMedia(
    userId: string,
    sessionId: string,
    messageId: string,
    storagePath: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (!msg.hasMedia)
      throw new BadRequestException({ code: ErrorCodes.VALIDATION });
    const media = await msg.downloadMedia();
    if (!media) throw new BadRequestException({ code: ErrorCodes.SEND_FAILED });
    const ext = media.mimetype.split('/')[1]?.split(';')[0] ?? 'bin';
    const filename = `${messageId}.${ext}`;
    const dir = path.join(storagePath, 'uploads', userId);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));
    return { filename, mimetype: media.mimetype, path: filePath };
  }

  async reactMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    reaction: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await msg.react(reaction);
    return { reacted: true };
  }

  async deleteMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    forEveryone = true,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await msg.delete(forEveryone);
    return { deleted: true };
  }

  async isRegisteredUser(userId: string, sessionId: string, phone: string) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const normalized = normalizePhone(phone);
    const isRegistered = await client.isRegisteredUser(
      `${normalized}@s.whatsapp.net`,
    );
    return { phone: normalized, isRegistered };
  }

  async getLogs(userId: string, dto: QueryMessagesDto) {
    const where: any = { userId };
    if (dto.status) where.status = dto.status;
    if (dto.sessionId) where.sessionId = dto.sessionId;
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.messageLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.messageLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportLogsPdf(userId: string, dto: QueryMessagesDto): Promise<Buffer> {
    const result = await this.getLogs(userId, { ...dto, limit: 1000, page: 1 });
    const rows = result.data.map((r) => ({
      timestamp: new Date(r.timestamp).toLocaleString('id-ID'),
      target: r.target,
      type: r.messageType,
      status: r.status,
      message: String(r.message ?? '').slice(0, 50),
    }));
    return generatePdf('Riwayat Pesan', rows);
  }

  async sendLiveLocation(userId: string, dto: SendLiveLocationDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const result = await client.sendMessage(jid, '', {
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
      },
      live: true,
      liveLocationDurationMs: (dto.duration ?? 60) * 1000,
    } as any);

    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      `LiveLocation:${dto.latitude},${dto.longitude}`,
      MessageType.location,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async sendVoiceNote(
    userId: string,
    dto: SendVoiceNoteDto,
    file: Express.Multer.File,
  ) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const mime = await validateMimeType(file.buffer);
    const media = new MessageMedia(
      mime,
      file.buffer.toString('base64'),
      file.originalname,
    );

    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const result = await client.sendMessage(jid, media, {
      sendAudioAsVoice: true,
    } as any);

    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      '[VoiceNote]',
      MessageType.audio,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  private async resolveSession(
    userId: string,
    sessionId?: string,
  ): Promise<string> {
    if (sessionId && sessionId !== 'auto') {
      const s = await this.prisma.whatsappSession.findFirst({
        where: { id: sessionId, userId, status: SessionStatus.connected },
      });
      if (!s)
        throw new BadRequestException({
          code: ErrorCodes.SESSION_NOT_CONNECTED,
        });
      return sessionId;
    }
    const healthy = await this.manager.getHealthySession(userId);
    if (!healthy)
      throw new BadRequestException({ code: ErrorCodes.NO_SESSIONS });
    return healthy;
  }

  private async logMessage(
    userId: string,
    sessionId: string,
    target: string,
    message: string,
    type: MessageType,
    status: MessageStatus,
    error?: string,
  ) {
    await this.prisma.messageLog.create({
      data: {
        userId,
        sessionId,
        target,
        message,
        messageType: type,
        status,
        errorMessage: error,
      },
    });
    if (status === MessageStatus.success) {
      await this.prisma.userQuota.updateMany({
        where: { userId },
        data: { messagesSentToday: { increment: 1 } },
      });
    }
  }

  private mimeToType(mime: string): MessageType {
    if (mime.startsWith('image/')) return MessageType.image;
    if (mime.startsWith('video/')) return MessageType.video;
    if (mime.startsWith('audio/')) return MessageType.audio;
    return MessageType.document;
  }
}
