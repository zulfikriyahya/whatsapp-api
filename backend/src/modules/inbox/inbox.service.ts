import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { QueryInboxDto } from "./dto/query-inbox.dto";
import { isGroupJid } from "../../common/utils/phone-normalizer.util";

@Injectable()
export class InboxService {
  constructor(
    private prisma: PrismaService,
    // FIX: forwardRef karena SessionsModule ↔ InboxModule saling import
    @Inject(forwardRef(() => SessionManagerService))
    private manager: SessionManagerService,
  ) {}

  async findAll(userId: string, dto: QueryInboxDto) {
    const where: any = { userId };
    if (dto.unread) where.isRead = false;
    if (dto.jid) where.remoteJid = dto.jid;

    const [data, total] = await Promise.all([
      this.prisma.inbox.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        orderBy: { timestamp: "desc" },
      }),
      this.prisma.inbox.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async getConversations(userId: string) {
    const allMessages = await this.prisma.inbox.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    const conversationMap = new Map<string, any>();

    for (const msg of allMessages) {
      if (!conversationMap.has(msg.remoteJid)) {
        conversationMap.set(msg.remoteJid, {
          remoteJid: msg.remoteJid,
          pushName: msg.pushName,
          lastMessage: msg.messageContent,
          messageType: msg.messageType,
          lastTime: msg.timestamp,
          sessionId: msg.sessionId,
          unreadCount: 0,
          isGroup: isGroupJid(msg.remoteJid),
        });
      }
      if (!msg.isRead) {
        conversationMap.get(msg.remoteJid)!.unreadCount++;
      }
    }

    return [...conversationMap.values()].sort(
      (a, b) => b.lastTime.getTime() - a.lastTime.getTime(),
    );
  }

  async markRead(userId: string, id: string) {
    const msg = await this.prisma.inbox.findFirst({ where: { id, userId } });
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await this.prisma.inbox.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string, jid: string) {
    await this.prisma.inbox.updateMany({
      where: { userId, remoteJid: jid },
      data: { isRead: true },
    });
  }

  async reply(
    userId: string,
    inboxId: string,
    message: string,
    quotedMessageId?: string,
  ) {
    const msg = await this.prisma.inbox.findFirst({
      where: { id: inboxId, userId },
    });
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (!msg.sessionId)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const opts: any = {};
    if (quotedMessageId) opts.quotedMessageId = quotedMessageId;

    const result = await this.manager.sendMessage(
      msg.sessionId,
      msg.remoteJid,
      message,
      opts,
    );

    await this.prisma.userQuota.updateMany({
      where: { userId },
      data: { messagesSentToday: { increment: 1 } },
    });

    return { messageId: result?.id?._serialized };
  }

  async saveIncoming(data: {
    id: string;
    userId: string;
    sessionId: string;
    remoteJid: string;
    pushName: string;
    messageContent: string;
    messageType: string;
  }) {
    await this.prisma.inbox.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        userId: data.userId,
        sessionId: data.sessionId,
        remoteJid: data.remoteJid,
        pushName: this.sanitize(data.pushName),
        messageContent: data.messageContent,
        messageType: data.messageType as any,
      },
      update: {},
    });
  }

  private sanitize(input: string): string {
    if (!input) return "";
    return input
      .replace(/<[^>]*>/g, "")
      .replace(/[<>"']/g, "")
      .trim()
      .slice(0, 100);
  }
}
