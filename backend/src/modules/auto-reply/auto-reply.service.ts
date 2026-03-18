import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { CreateAutoReplyDto } from "./dto/create-auto-reply.dto";
import { UpdateAutoReplyDto } from "./dto/update-auto-reply.dto";
import { MatchType } from "@prisma/client";

@Injectable()
export class AutoReplyService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.autoReply.findMany({
      where: { userId },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    });
  }

  async create(userId: string, dto: CreateAutoReplyDto) {
    if (dto.matchType === MatchType.regex) this.validateRegex(dto.keyword);
    const rule = await this.prisma.autoReply.create({
      data: { userId, ...dto },
    });
    await this.redis.del(CacheKeys.workflowsActive(userId));
    return rule;
  }

  async update(userId: string, id: string, dto: UpdateAutoReplyDto) {
    await this.findOwned(userId, id);
    if (dto.matchType === MatchType.regex && dto.keyword)
      this.validateRegex(dto.keyword);
    const rule = await this.prisma.autoReply.update({
      where: { id },
      data: dto,
    });
    await this.redis.del(CacheKeys.workflowsActive(userId));
    return rule;
  }

  async toggle(userId: string, id: string, isActive: boolean) {
    await this.findOwned(userId, id);
    return this.prisma.autoReply.update({ where: { id }, data: { isActive } });
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.autoReply.delete({ where: { id } });
  }

  private async findOwned(userId: string, id: string) {
    const rule = await this.prisma.autoReply.findFirst({
      where: { id, userId },
    });
    if (!rule) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return rule;
  }

  private validateRegex(pattern: string) {
    try {
      new RegExp(pattern);
    } catch {
      throw new BadRequestException({ code: ErrorCodes.INVALID_REGEX });
    }
  }
}
