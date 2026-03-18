import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RedisService } from "../../redis/redis.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { AuditAction, Role } from "@prisma/client";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateQuotaDto } from "./dto/update-quota.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private redis: RedisService,
  ) {}

  async findAll(dto: QueryUsersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (dto.search)
      where.OR = [
        { name: { contains: dto.search } },
        { email: { contains: dto.search } },
      ];
    if (dto.role) where.role = dto.role;
    if (typeof dto.isActive !== "undefined") where.isActive = dto.isActive;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { tier: { include: { tier: true } }, quota: true },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tier: { include: { tier: true } }, quota: true },
    });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async updateUser(
    adminId: string,
    adminEmail: string,
    targetId: string,
    dto: UpdateUserDto,
    ip: string,
    ua: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: targetId } });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: dto,
    });
    await this.redis.del(CacheKeys.user(targetId));
    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.UPDATE_USER,
      details: { targetId, ...dto },
      ip,
      userAgent: ua,
    });
    return updated;
  }

  async deleteUser(
    adminId: string,
    adminEmail: string,
    targetId: string,
    ip: string,
    ua: string,
  ) {
    if (adminId === targetId)
      throw new ForbiddenException({ code: ErrorCodes.CANNOT_DELETE_SELF });
    await this.prisma.user.delete({ where: { id: targetId } });
    await this.redis.del(CacheKeys.user(targetId));
    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.DELETE_USER,
      details: { targetId },
      ip,
      userAgent: ua,
    });
  }

  // FIX: self-delete — user menghapus akunnya sendiri
  async deleteSelf(userId: string, userEmail: string, ip: string, ua: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    // Catat audit log sebelum data user dihapus
    await this.audit.log({
      userId,
      userEmail,
      action: AuditAction.DELETE_USER,
      details: { selfDelete: true },
      ip,
      userAgent: ua,
    });

    // Hapus cache
    await this.redis.del(CacheKeys.user(userId));

    // Hapus user — Prisma Cascade akan menghapus semua relasi terkait
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async updateQuota(targetId: string, dto: UpdateQuotaDto) {
    return this.prisma.userQuota.upsert({
      where: { userId: targetId },
      create: { userId: targetId, ...dto },
      update: dto,
    });
  }
}
