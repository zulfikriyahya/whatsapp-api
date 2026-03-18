import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";

const MAX_NODES = 20;
const MAX_DELAY_SECONDS = 3600;

@Injectable()
export class WorkflowService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string) {
    const list = await this.prisma.workflow.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return list.map((w) => ({
      ...w,
      triggerCondition: w.triggerCondition,
      nodes: w.nodes,
    }));
  }

  async create(userId: string, dto: CreateWorkflowDto) {
    this.validate(dto);
    const wf = await this.prisma.workflow.create({
      data: {
        userId,
        name: dto.name,
        triggerCondition: dto.triggerCondition as any,
        nodes: dto.nodes as any,
      },
    });
    await this.invalidateCache(userId);
    return wf;
  }

  async update(userId: string, id: string, dto: UpdateWorkflowDto) {
    await this.findOwned(userId, id);
    this.validate(dto as CreateWorkflowDto);
    const wf = await this.prisma.workflow.update({
      where: { id },
      data: {
        name: dto.name,
        triggerCondition: dto.triggerCondition as any,
        nodes: dto.nodes as any,
      },
    });
    await this.invalidateCache(userId);
    return wf;
  }

  async toggle(userId: string, id: string, isActive: boolean) {
    await this.findOwned(userId, id);
    const wf = await this.prisma.workflow.update({
      where: { id },
      data: { isActive },
    });
    await this.invalidateCache(userId);
    return wf;
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.workflow.delete({ where: { id } });
    await this.invalidateCache(userId);
  }

  async getActive(userId: string) {
    const cacheKey = CacheKeys.workflowsActive(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    const workflows = await this.prisma.workflow.findMany({
      where: { userId, isActive: true },
    });
    await this.redis.set(cacheKey, workflows, 300);
    return workflows;
  }

  private validate(dto: Partial<CreateWorkflowDto>) {
    if (dto.nodes) {
      if (dto.nodes.length > MAX_NODES) {
        throw new BadRequestException({
          code: ErrorCodes.WORKFLOW_TOO_MANY_NODES,
        });
      }
      for (const node of dto.nodes) {
        if (!["send_message", "delay", "add_tag"].includes(node.type)) {
          throw new BadRequestException({
            code: ErrorCodes.VALIDATION,
            message: `Invalid node type: ${node.type}`,
          });
        }
        if (node.type === "delay" && node.config?.seconds > MAX_DELAY_SECONDS) {
          throw new BadRequestException({ code: ErrorCodes.DELAY_TOO_LONG });
        }
      }
    }
  }

  private async findOwned(userId: string, id: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { id, userId } });
    if (!wf) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return wf;
  }

  private async invalidateCache(userId: string) {
    await this.redis.del(CacheKeys.workflowsActive(userId));
  }
}
