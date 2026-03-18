import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { PaginationDto } from "../../common/dto/pagination.dto";

@Injectable()
export class CallsService {
  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  async findAll(userId: string, dto: PaginationDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.callLog.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
      }),
      this.prisma.callLog.count({ where: { userId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // FIX: createCallLink via whatsapp-web.js
  async createCallLink(userId: string, sessionId: string) {
    const session = await this.prisma.whatsappSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_FOUND });

    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    // whatsapp-web.js: createCallLink() tersedia di versi terbaru
    const link = await (client as any).createCallLink?.();
    if (!link) {
      throw new BadRequestException({
        code: ErrorCodes.INTERNAL,
        message: "createCallLink tidak didukung di versi whatsapp-web.js ini.",
      });
    }

    return { callLink: link };
  }
}
