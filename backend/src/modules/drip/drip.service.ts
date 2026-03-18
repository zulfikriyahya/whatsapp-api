import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateDripDto } from "./dto/create-drip.dto";
import { UpdateDripDto } from "./dto/update-drip.dto";
import { QuerySubscribersDto } from "./dto/query-subscribers.dto";

@Injectable()
export class DripService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const campaigns = await this.prisma.dripCampaign.findMany({
      where: { userId },
      include: {
        steps: { orderBy: { dayOffset: "asc" } },
        _count: { select: { subscriptions: { where: { status: "active" } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return campaigns.map((c) => ({
      ...c,
      subscriberCount: c._count.subscriptions,
    }));
  }

  async create(userId: string, dto: CreateDripDto) {
    this.validateSteps(dto.steps);
    return this.prisma.$transaction(async (tx) => {
      const campaign = await tx.dripCampaign.create({
        data: {
          userId,
          name: dto.name,
          triggerTag: dto.triggerTag,
          sessionId: dto.sessionId,
        },
      });
      await tx.dripStep.createMany({
        data: dto.steps.map((s) => ({ dripId: campaign.id, ...s })),
      });
      return tx.dripCampaign.findUnique({
        where: { id: campaign.id },
        include: { steps: true },
      });
    });
  }

  async update(userId: string, id: string, dto: UpdateDripDto) {
    await this.findOwned(userId, id);
    if (dto.steps) this.validateSteps(dto.steps);
    return this.prisma.$transaction(async (tx) => {
      await tx.dripCampaign.update({
        where: { id },
        data: {
          name: dto.name,
          triggerTag: dto.triggerTag,
          sessionId: dto.sessionId,
        },
      });
      if (dto.steps) {
        await tx.dripStep.deleteMany({ where: { dripId: id } });
        await tx.dripStep.createMany({
          data: dto.steps.map((s) => ({ dripId: id, ...s })),
        });
      }
      return tx.dripCampaign.findUnique({
        where: { id },
        include: { steps: true },
      });
    });
  }

  async toggle(userId: string, id: string, isActive: boolean) {
    await this.findOwned(userId, id);
    return this.prisma.dripCampaign.update({
      where: { id },
      data: { isActive },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.dripCampaign.delete({ where: { id } });
  }

  async getSubscribers(
    userId: string,
    dripId: string,
    dto: QuerySubscribersDto,
  ) {
    await this.findOwned(userId, dripId);
    const where: any = { dripId };
    if (dto.status) where.status = dto.status;
    const [data, total] = await Promise.all([
      this.prisma.dripSubscription.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        include: { contact: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.dripSubscription.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async cancelSubscription(userId: string, subscriptionId: string) {
    const sub = await this.prisma.dripSubscription.findFirst({
      where: { id: subscriptionId },
      include: { drip: true },
    });
    if (!sub || sub.drip.userId !== userId) {
      throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    }
    return this.prisma.dripSubscription.update({
      where: { id: subscriptionId },
      data: { status: "cancelled" },
    });
  }

  private validateSteps(steps: any[]) {
    const days = steps.map((s) => s.dayOffset);
    if (new Set(days).size !== days.length) {
      throw new BadRequestException({ code: ErrorCodes.DUPLICATE_DRIP_DAY });
    }
    for (const s of steps) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.timeAt)) {
        throw new BadRequestException({ code: ErrorCodes.INVALID_TIME_FORMAT });
      }
    }
  }

  private async findOwned(userId: string, id: string) {
    const c = await this.prisma.dripCampaign.findFirst({
      where: { id, userId },
    });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return c;
  }
}
