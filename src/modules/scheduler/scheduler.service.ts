import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { isFuture, nextRecurrence } from "../../common/utils/date.util";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { ScheduledMessageStatus } from "@prisma/client";
import { CreateScheduledMessageDto } from "./dto/create-scheduled-message.dto";
import { QueryScheduledMessagesDto } from "./dto/query-scheduled-messages.dto";

@Injectable()
export class SchedulerService {
  private logger = new Logger("SchedulerService");

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  async findAll(userId: string, dto: QueryScheduledMessagesDto) {
    const where: any = { userId };
    if (dto.status) where.status = dto.status;
    const [data, total] = await Promise.all([
      this.prisma.scheduledMessage.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        orderBy: { scheduledTime: "asc" },
      }),
      this.prisma.scheduledMessage.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async create(userId: string, dto: CreateScheduledMessageDto) {
    const scheduledTime = new Date(dto.scheduledTime);
    if (!isFuture(scheduledTime))
      throw new BadRequestException({ code: ErrorCodes.SCHEDULE_PAST });

    const session = await this.prisma.whatsappSession.findFirst({
      where: { id: dto.sessionId, userId },
    });
    if (!session) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    return this.prisma.scheduledMessage.create({
      data: {
        userId,
        sessionId: dto.sessionId,
        target: dto.target,
        message: dto.message,
        scheduledTime,
        recurrenceType: dto.recurrenceType ?? "none",
      },
    });
  }

  // cancel() hanya untuk status pending — tidak bisa cancel yang sudah sent
  async cancel(userId: string, id: string) {
    const msg = await this.findOwned(userId, id);
    if (msg.status !== ScheduledMessageStatus.pending)
      throw new BadRequestException({ code: ErrorCodes.MESSAGE_ALREADY_SENT });
    return this.prisma.scheduledMessage.update({
      where: { id },
      data: { status: ScheduledMessageStatus.cancelled },
    });
  }

  /**
   * FIX: remove() sebelumnya menolak hapus jika status 'sent'.
   * Sesuai API doc, DELETE /scheduler/:id bisa menghapus record apapun
   * (termasuk yang sudah sent/failed/cancelled) — ini adalah hard delete dari DB.
   * Pembatasan hanya berlaku untuk cancel(), bukan delete().
   */
  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.scheduledMessage.delete({ where: { id } });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduled() {
    const now = new Date();
    const due = await this.prisma.scheduledMessage.findMany({
      where: {
        status: ScheduledMessageStatus.pending,
        scheduledTime: { lte: now },
      },
    });

    for (const msg of due) {
      try {
        const client = this.manager.getClient(msg.sessionId);
        if (!client) continue;

        const jid = toJid(msg.target);
        await this.manager.sendMessage(msg.sessionId, jid, msg.message);
        await this.prisma.scheduledMessage.update({
          where: { id: msg.id },
          data: { status: ScheduledMessageStatus.sent },
        });

        if (msg.recurrenceType !== "none") {
          const nextTime = nextRecurrence(
            msg.scheduledTime,
            msg.recurrenceType,
          );
          await this.prisma.scheduledMessage.create({
            data: {
              userId: msg.userId,
              sessionId: msg.sessionId,
              target: msg.target,
              message: msg.message,
              scheduledTime: nextTime,
              recurrenceType: msg.recurrenceType,
            },
          });
        }
      } catch (e) {
        this.logger.error(`Scheduled message ${msg.id} failed: ${e.message}`);
        await this.prisma.scheduledMessage.update({
          where: { id: msg.id },
          data: { status: ScheduledMessageStatus.failed },
        });
      }
    }
  }

  private async findOwned(userId: string, id: string) {
    const msg = await this.prisma.scheduledMessage.findFirst({
      where: { id, userId },
    });
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return msg;
  }
}
