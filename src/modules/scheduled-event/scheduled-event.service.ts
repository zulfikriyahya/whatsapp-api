import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { toJid } from '../../common/utils/phone-normalizer.util';
import { SessionStatus } from '@prisma/client';
import { CreateScheduledEventDto } from './dto/create-scheduled-event.dto';
import { RespondEventDto, EventResponse } from './dto/respond-event.dto';

@Injectable()
export class ScheduledEventService {
  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  async send(userId: string, dto: CreateScheduledEventDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const jid = toJid(dto.to);
    const result = await client.sendMessage(jid, dto.title, {
      scheduledEvent: {
        title: dto.title,
        description: dto.description ?? '',
        location: dto.location ?? '',
        startTime: new Date(dto.startTime).getTime(),
      },
    } as any);

    return { messageId: result?.id?._serialized };
  }

  async respond(userId: string, dto: RespondEventDto) {
    const client = this.manager.getClient(dto.sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const msg = await client.getMessageById(dto.messageId);
    if (!msg) throw new BadRequestException({ code: ErrorCodes.NOT_FOUND });

    if (dto.response === EventResponse.ACCEPT) {
      await (msg as any).acceptScheduledEvent?.();
    } else {
      await (msg as any).declineScheduledEvent?.();
    }

    return { responded: true, response: dto.response };
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
}
