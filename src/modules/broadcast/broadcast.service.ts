import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { QueueNames } from '../../common/constants/queue-names.constant';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { SessionStatus } from '@prisma/client';
import { normalizePhone } from '../../common/utils/phone-normalizer.util';
import { parseCsvContacts } from '../../common/utils/csv-parser.util';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { QueryCampaignsDto } from './dto/query-campaigns.dto';

const CANCELLABLE_STATUSES = ['pending', 'processing'] as const;

@Injectable()
export class BroadcastService {
  constructor(
    @InjectQueue(QueueNames.BROADCAST) private broadcastQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async findAll(userId: string, dto: QueryCampaignsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (dto.status) where.status = dto.status;

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(
    userId: string,
    dto: CreateBroadcastDto,
    file?: Express.Multer.File,
  ) {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { userId, status: SessionStatus.connected },
    });
    if (!sessions.length)
      throw new BadRequestException({ code: ErrorCodes.NO_SESSIONS });

    const recipients = await this.resolveRecipients(userId, dto);
    if (!recipients.length)
      throw new BadRequestException({ code: ErrorCodes.NO_RECIPIENTS });

    const deduped = [...new Set(recipients)].slice(0, 10000);

    const campaign = await this.prisma.campaign.create({
      data: {
        userId,
        name: dto.name,
        message: dto.message,
        mediaPath: file?.path,
        totalRecipients: deduped.length,
        status: 'pending',
      },
    });

    await this.broadcastQueue.add('send', {
      campaignId: campaign.id,
      userId,
      recipients: deduped,
      message: dto.message,
      mediaPath: file?.path,
      sessions: sessions.map((s) => s.id),
    });

    return campaign;
  }

  async cancel(userId: string, campaignId: string) {
    const c = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    if (!(CANCELLABLE_STATUSES as readonly string[]).includes(c.status)) {
      throw new BadRequestException({
        code: ErrorCodes.CAMPAIGN_NOT_CANCELLABLE,
      });
    }

    const jobs = await this.broadcastQueue.getJobs(['waiting', 'active']);
    for (const job of jobs) {
      if (job.data?.campaignId === campaignId)
        await job.remove().catch(() => {});
    }

    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'cancelled' },
    });
  }

  private async resolveRecipients(
    userId: string,
    dto: CreateBroadcastDto,
  ): Promise<string[]> {
    const nums: string[] = [];

    if (dto.recipients?.length) {
      for (const r of dto.recipients) {
        try {
          nums.push(normalizePhone(r));
        } catch {}
      }
    }
    if (dto.csvData) {
      const rows = parseCsvContacts(dto.csvData);
      for (const r of rows) {
        try {
          nums.push(normalizePhone(r.number));
        } catch {}
      }
    }
    if (dto.filterTag) {
      const contacts = await this.prisma.contact.findMany({
        where: { userId, tag: dto.filterTag },
      });
      for (const c of contacts) nums.push(c.number);
    }

    return nums;
  }
}
