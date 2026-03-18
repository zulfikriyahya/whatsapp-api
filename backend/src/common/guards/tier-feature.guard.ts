import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { ErrorCodes } from "../constants/error-codes.constant";

export const TIER_FEATURE_KEY = "tierFeature";

// FIX: gunakan SetMetadata dari @nestjs/common, bukan Reflect.metadata langsung
export const RequireFeature = (feature: string) =>
  SetMetadata(TIER_FEATURE_KEY, feature);

@Injectable()
export class TierFeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const feature = this.reflector.getAllAndOverride<string>(TIER_FEATURE_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!feature) return true;

    const { user } = ctx.switchToHttp().getRequest();
    if (!user) return false;

    // Admin selalu bypass
    if (user.role === "admin" || user.role === "super_admin") return true;

    const cacheKey = `tier:features:${user.id}`;
    let features = await this.redis.get<string[]>(cacheKey);

    if (!features) {
      const userTier = await this.prisma.userTier.findUnique({
        where: { userId: user.id },
        include: { tier: true },
      });

      if (!userTier) {
        throw new ForbiddenException({
          code: ErrorCodes.FORBIDDEN,
          message: "Tidak ada tier aktif. Silakan hubungi admin.",
        });
      }

      features = (userTier.tier.features as string[]) ?? [];
      await this.redis.set(cacheKey, features, 300);
    }

    if (!features.includes(feature)) {
      throw new ForbiddenException({
        code: ErrorCodes.FEATURE_NOT_AVAILABLE,
        message: `Fitur '${feature}' tidak tersedia di tier Anda.`,
      });
    }

    return true;
  }
}
