import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RedisService } from "../../redis/redis.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { AuditAction } from "@prisma/client";
import { generateTempToken } from "../../common/utils/token-generator.util";

const IMPERSONATE_TTL = 3600; // 1 jam

@Injectable()
export class ImpersonationService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
    private redis: RedisService,
  ) {}

  async impersonate(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    ip: string,
    ua: string,
  ) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!target) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    // Admin tidak bisa impersonate sesama admin/super_admin
    if (target.role === "admin" || target.role === "super_admin") {
      throw new ForbiddenException({
        code: ErrorCodes.FORBIDDEN,
        message: "Tidak bisa impersonate akun admin.",
      });
    }

    // Buat JWT sementara atas nama target dengan claim impersonation
    const token = this.jwt.sign(
      {
        sub: target.id,
        email: target.email,
        role: target.role,
        impersonatedBy: adminId,
      },
      { expiresIn: "1h" },
    );

    // Simpan sesi impersonation di Redis (untuk audit trail & invalidasi)
    const sessionKey = `impersonate:${adminId}:${target.id}`;
    await this.redis.set(
      sessionKey,
      { adminId, targetId: target.id, token },
      IMPERSONATE_TTL,
    );

    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.UPDATE_USER,
      details: {
        action: "IMPERSONATE_START",
        targetId: target.id,
        targetEmail: target.email,
      },
      ip,
      userAgent: ua,
    });

    return {
      token,
      targetUser: {
        id: target.id,
        email: target.email,
        name: target.name,
        role: target.role,
      },
      expiresIn: IMPERSONATE_TTL,
    };
  }

  async exitImpersonation(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    ip: string,
    ua: string,
  ) {
    const sessionKey = `impersonate:${adminId}:${targetUserId}`;
    await this.redis.del(sessionKey);

    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.UPDATE_USER,
      details: { action: "IMPERSONATE_END", targetId: targetUserId },
      ip,
      userAgent: ua,
    });

    return { message: "Impersonation ended." };
  }
}
