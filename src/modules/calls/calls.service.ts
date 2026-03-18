import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaginationDto } from "../../common/dto/pagination.dto";

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

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
}
