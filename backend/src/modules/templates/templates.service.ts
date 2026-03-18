import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { QueryTemplatesDto } from "./dto/query-templates.dto";

@Injectable()
export class TemplatesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string, dto: QueryTemplatesDto) {
    const cacheKey = CacheKeys.templatesUser(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached && !dto.category) return cached;

    const where: any = { userId };
    if (dto.category) where.category = dto.category;

    const templates = await this.prisma.template.findMany({
      where,
      orderBy: { name: "asc" },
    });
    if (!dto.category) await this.redis.set(cacheKey, templates, 3600);
    return templates;
  }

  async create(userId: string, dto: CreateTemplateDto) {
    const exists = await this.prisma.template.findFirst({
      where: { userId, name: dto.name },
    });
    if (exists)
      throw new ConflictException({ code: ErrorCodes.DUPLICATE_TEMPLATE_NAME });
    const t = await this.prisma.template.create({ data: { userId, ...dto } });
    await this.redis.del(CacheKeys.templatesUser(userId));
    return t;
  }

  async update(userId: string, id: string, dto: UpdateTemplateDto) {
    await this.findOwned(userId, id);
    if (dto.name) {
      const exists = await this.prisma.template.findFirst({
        where: { userId, name: dto.name, NOT: { id } },
      });
      if (exists)
        throw new ConflictException({
          code: ErrorCodes.DUPLICATE_TEMPLATE_NAME,
        });
    }
    const t = await this.prisma.template.update({ where: { id }, data: dto });
    await this.redis.del(CacheKeys.templatesUser(userId));
    return t;
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.template.delete({ where: { id } });
    await this.redis.del(CacheKeys.templatesUser(userId));
  }

  private async findOwned(userId: string, id: string) {
    const t = await this.prisma.template.findFirst({ where: { id, userId } });
    if (!t) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return t;
  }
}
