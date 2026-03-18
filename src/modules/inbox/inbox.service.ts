import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { QueryInboxDto } from "./dto/query-inbox.dto";
import { isGroupJid } from "../../common/utils/phone-normalizer.util";

@Injectable()
export class InboxService {
  constructor(private prisma: PrismaService) {}

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
    // Group by remoteJid, get latest message per conversation
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT
        i.remoteJid,
        i.pushName,
        i.messageContent AS lastMessage,
        i.messageType,
        i.timestamp AS lastTime,
        i.sessionId,
        SUM(CASE WHEN i.isRead = 0 THEN 1 ELSE 0 END) AS unreadCount
      FROM inbox i
      INNER JOIN (
        SELECT remoteJid, MAX(timestamp) AS maxTs
        FROM inbox
        WHERE userId = ${userId}
        GROUP BY remoteJid
      ) latest ON i.remoteJid = latest.remoteJid AND i.timestamp = latest.maxTs
      WHERE i.userId = ${userId}
      GROUP BY i.remoteJid, i.pushName, i.messageContent, i.messageType, i.timestamp, i.sessionId
      ORDER BY i.timestamp DESC
    `;
    return rows.map((r) => ({ ...r, isGroup: isGroupJid(r.remoteJid) }));
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

  // Called by SessionManager on incoming message
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
