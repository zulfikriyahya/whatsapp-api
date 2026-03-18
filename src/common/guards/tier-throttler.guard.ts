import { Injectable, ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerRequest } from "@nestjs/throttler";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

/**
 * TierThrottlerGuard — override ThrottlerGuard untuk membaca
 * rateLimitPerMinute dari tier aktif user, bukan dari config global.
 *
 * Hierarki:
 *  - Admin/super_admin → limit sangat tinggi (bypass efektif)
 *  - User dengan tier  → rateLimitPerMinute dari tier
 *  - Tidak ada tier    → fallback 60 req/mnt
 *  - Tidak login       → config global (10 untuk auth endpoint, 100 lainnya)
 */
@Injectable()
export class TierThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: any,
    storageService: any,
    reflector: any,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const userId = req.user?.id;
    return userId ? `throttle:user:${userId}` : (req.ip ?? "unknown");
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    // Admin tidak dibatasi
    if (user?.role === "admin" || user?.role === "super_admin") return true;
    return false;
  }

  protected async getLimit(context: ExecutionContext): Promise<number> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return 100; // unauthenticated → global default

    // Cek cache Redis
    const cacheKey = `tier:ratelimit:${user.id}`;
    const cached = await this.redisService.get<number>(cacheKey);
    if (cached !== null && cached !== undefined) return cached;

    const userTier = await this.prismaService.userTier.findUnique({
      where: { userId: user.id },
      include: { tier: true },
    });

    const limit = userTier?.tier?.rateLimitPerMinute ?? 60;
    await this.redisService.set(cacheKey, limit, 300); // cache 5 menit
    return limit;
  }

  protected async getTtl(): Promise<number> {
    return 60000; // 1 menit dalam ms (ThrottlerGuard v6 pakai ms)
  }
}
