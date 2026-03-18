import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { sha256 } from "../utils/hash.util";
import { isIpAllowed } from "../utils/ip-validator.util";
import { CacheKeys } from "../constants/cache-keys.constant";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const rawKey = req.headers["x-api-key"] as string;
    if (!rawKey)
      throw new UnauthorizedException({ code: ErrorCodes.UNAUTHORIZED });

    const hash = sha256(rawKey);
    const cacheKey = CacheKeys.apiKey(hash);
    let apiKey = await this.redis.get<any>(cacheKey);

    if (!apiKey) {
      apiKey = await this.prisma.apiKey.findUnique({
        where: { keyHash: hash },
        include: { user: true },
      });
      if (!apiKey)
        throw new UnauthorizedException({ code: ErrorCodes.UNAUTHORIZED });
      await this.redis.set(cacheKey, apiKey, 300);
    }

    // FIX: Cek token expired
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      throw new UnauthorizedException({
        code: ErrorCodes.UNAUTHORIZED,
        message: "API key telah kadaluarsa.",
      });
    }

    if (!apiKey.user.isActive) {
      throw new ForbiddenException({ code: ErrorCodes.ACCOUNT_DISABLED });
    }

    const clientIp = req.ip || req.connection?.remoteAddress;
    if (apiKey.ipWhitelist && !isIpAllowed(clientIp, apiKey.ipWhitelist)) {
      throw new ForbiddenException({ code: ErrorCodes.IP_NOT_WHITELISTED });
    }

    // FIX: Tandai request sebagai sandbox jika token dalam mode sandbox
    req.user = {
      ...apiKey.user,
      keyId: apiKey.id,
      isSandbox: apiKey.isSandbox ?? false,
    };

    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
