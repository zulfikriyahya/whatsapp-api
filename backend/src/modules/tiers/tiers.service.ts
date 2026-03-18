import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateTierDto } from "./dto/create-tier.dto";
import { UpdateTierDto } from "./dto/update-tier.dto";
import { AssignTierDto } from "./dto/assign-tier.dto";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "@prisma/client";

@Injectable()
export class TiersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async findAll() {
    return this.prisma.tier.findMany({ orderBy: { name: "asc" } });
  }

  async create(dto: CreateTierDto) {
    return this.prisma.tier.create({
      data: { ...dto, features: dto.features as any },
    });
  }

  async update(id: string, dto: UpdateTierDto) {
    return this.prisma.tier.update({
      where: { id },
      data: { ...dto, features: dto.features as any },
    });
  }

  async remove(id: string) {
    await this.prisma.tier.delete({ where: { id } });
  }

  async assignToUser(
    adminId: string,
    adminEmail: string,
    dto: AssignTierDto,
    ip: string,
    ua: string,
  ) {
    const tier = await this.prisma.tier.findUnique({
      where: { id: dto.tierId },
    });
    if (!tier) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    const result = await this.prisma.userTier.upsert({
      where: { userId: dto.userId },
      create: {
        userId: dto.userId,
        tierId: dto.tierId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isGrace: false,
      },
      update: {
        tierId: dto.tierId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isGrace: false,
      },
    });

    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.ASSIGN_TIER,
      details: {
        targetUserId: dto.userId,
        tierId: dto.tierId,
        tierName: tier.name,
      },
      ip,
      userAgent: ua,
    });

    return result;
  }

  /**
   * FIX: Prisma JSON filter `path` harus berupa string, bukan string[].
   * Untuk MySQL, gunakan string_contains atau raw query karena
   * Prisma JSON filter dengan path tidak mendukung MySQL secara penuh.
   * Solusi: filter di aplikasi setelah query semua ASSIGN_TIER logs.
   */
  async getTierHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Ambil semua ASSIGN_TIER logs lalu filter di aplikasi
    // karena Prisma JSON path filter tidak konsisten di MySQL
    const allLogs = await this.prisma.auditLog.findMany({
      where: { action: AuditAction.ASSIGN_TIER },
      orderBy: { timestamp: "desc" },
    });

    // Filter: details.targetUserId === userId
    const filtered = allLogs.filter((log) => {
      try {
        const details = log.details as any;
        return details?.targetUserId === userId;
      } catch {
        return false;
      }
    });

    const total = filtered.length;
    const data = filtered.slice(skip, skip + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
