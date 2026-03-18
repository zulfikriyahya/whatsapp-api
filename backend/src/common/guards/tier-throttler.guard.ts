import { Injectable, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from "@nestjs/throttler";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

/**
 * TierThrottlerGuard — override ThrottlerGuard untuk membaca
 * rateLimitPerMinute dari tier aktif user, bukan dari config global.
 *
 * Hierarki:
 *  - Admin/super_admin → bypass (skip)
 *  - User dengan tier  → rateLimitPerMinute dari tier
 *  - Tidak ada tier    → fallback 60 req/mnt
 *  - Tidak login       → 100 req/mnt (global default)
 */
@Injectable()
export class TierThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    // Inject eksplisit karena NestJS tidak bisa resolve parameter
    // tambahan di luar 3 parameter milik ThrottlerGuard
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(RedisService) private readonly redisService: RedisService
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
    if (user?.role === "admin" || user?.role === "super_admin") return true;
    return false;
  }

  protected async getLimit(context: ExecutionContext): Promise<number> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return 100;

    const cacheKey = `tier:ratelimit:${user.id}`;
    const cached = await this.redisService.get<number>(cacheKey);
    if (cached !== null && cached !== undefined) return cached;

    const userTier = await this.prismaService.userTier.findUnique({
      where: { userId: user.id },
      include: { tier: true },
    });

    const limit = userTier?.tier?.rateLimitPerMinute ?? 60;
    await this.redisService.set(cacheKey, limit, 300);
    return limit;
  }

  protected async getTtl(): Promise<number> {
    return 60000;
  }
}
