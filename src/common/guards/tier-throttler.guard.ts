import { Injectable, ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerRequest } from "@nestjs/throttler";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

/**
 * TierThrottlerGuard menggantikan ThrottlerGuard default.
 * Membaca rateLimitPerMinute dari tier aktif user, bukan limit global.
 *
 * Hierarki limit:
 *  1. API Key  → rateLimitPerMinute dari tier user pemilik key (default 300 jika tidak ada tier)
 *  2. User JWT → rateLimitPerMinute dari tier user (default 60)
 *  3. Auth endpoint → 10 req/mnt per IP (ditangani ThrottlerModule config)
 *
 * Daftarkan di AppModule sebagai provider global:
 *   { provide: APP_GUARD, useClass: TierThrottlerGuard }
 */
@Injectable()
export class TierThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: any,
    storageService: any,
    reflector: any,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Tracker unik per user (jika login) atau per IP (jika tidak login)
    const userId = req.user?.id;
    return userId ? `throttle:user:${userId}` : req.ip;
  }

  protected async getLimit(ctx: ExecutionContext): Promise<number> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return 10; // unauthenticated / auth endpoint

    // Admin tidak dibatasi
    if (user.role === "admin" || user.role === "super_admin") return 10000;

    // Cek cache
    const cacheKey = `tier:ratelimit:${user.id}`;
    const cached = await this.redis.get<number>(cacheKey);
    if (cached) return cached;

    const userTier = await this.prisma.userTier.findUnique({
      where: { userId: user.id },
      include: { tier: true },
    });

    const limit = userTier?.tier?.rateLimitPerMinute ?? 60;
    await this.redis.set(cacheKey, limit, 300);
    return limit;
  }

  protected async getTtl(): Promise<number> {
    return 60; // 1 menit dalam detik
  }
}
