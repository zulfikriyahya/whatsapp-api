import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { sha256 } from "../utils/hash.util";

/**
 * FIX: MaintenanceMiddleware sebelumnya mengandalkan req.user yang belum
 * ter-populate saat middleware berjalan (JWT strategy berjalan di guard, bukan middleware).
 *
 * Solusi:
 * 1. Untuk session cookie → decode JWT secara manual dari cookie.
 * 2. Untuk API Key       → lookup langsung dari header X-API-Key ke database/cache.
 * 3. Jika role admin/super_admin → bypass maintenance.
 */
@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Cek maintenance mode
    const row = await this.prisma.globalSetting.findUnique({
      where: { key: "maintenanceMode" },
    });
    if (row?.value !== "true") return next();

    // Coba resolve role dari berbagai sumber auth
    const role = await this.resolveRole(req);
    if (role === "admin" || role === "super_admin") return next();

    throw new ServiceUnavailableException({
      status: false,
      error:
        "Server sedang dalam maintenance. Silakan coba beberapa saat lagi.",
      code: "ERR_MAINTENANCE",
    });
  }

  private async resolveRole(req: Request): Promise<string | null> {
    // 1. Coba dari API Key header
    const apiKeyHeader = req.headers["x-api-key"] as string;
    if (apiKeyHeader) {
      const hash = sha256(apiKeyHeader);
      // Cek cache Redis dulu
      const cached = await this.redis
        .get<{ role: string }>(`apikey:${hash}`)
        .catch(() => null);
      if (cached?.role) return cached.role;

      // Fallback ke database
      const apiKey = await this.prisma.apiKey
        .findUnique({
          where: { keyHash: hash },
          include: { user: { select: { role: true, isActive: true } } },
        })
        .catch(() => null);
      if (apiKey?.user?.isActive) return apiKey.user.role;
    }

    // 2. Coba dari JWT cookie (decode tanpa verify — hanya untuk cek role)
    //    Verifikasi signature tetap dilakukan oleh JwtAuthGuard selanjutnya.
    const token = (req as any).cookies?.auth_token;
    if (token) {
      try {
        const [, payloadB64] = token.split(".");
        if (payloadB64) {
          const payload = JSON.parse(
            Buffer.from(payloadB64, "base64url").toString("utf8"),
          );
          if (payload?.role) return payload.role;
        }
      } catch {
        // token tidak valid, abaikan
      }
    }

    return null;
  }
}
