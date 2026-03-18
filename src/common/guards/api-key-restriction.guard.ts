import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ErrorCodes } from "../constants/error-codes.constant";

export const ALLOW_API_KEY = "allowApiKey";
/**
 * Decorator untuk menandai endpoint yang BOLEH diakses via API Key.
 * Endpoint yang tidak diberi @AllowApiKey() akan otomatis memblokir
 * request dari API Key (external_client).
 */
export const AllowApiKey = () => Reflect.metadata(ALLOW_API_KEY, true);

/**
 * ApiKeyRestrictionGuard — implementasi permission matrix "external_client".
 *
 * Sesuai doc:
 *  External Client (API Key) hanya boleh:
 *   ✅ Kirim pesan teks/media/lokasi/poll/kontak
 *   ✅ Mode auto round-robin
 *   ✅ Health check
 *  Tidak boleh:
 *   ❌ Broadcast, Auto Reply, Workflow, Drip, dll
 *
 * Cara kerja:
 *  - Jika request dari API Key (req.user.keyId ada) DAN endpoint tidak
 *    memiliki @AllowApiKey() → tolak dengan ERR_FORBIDDEN
 */
@Injectable()
export class ApiKeyRestrictionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    // Hanya berlaku jika request menggunakan API Key
    if (!req.user?.keyId) return true;

    const isAllowed = this.reflector.getAllAndOverride<boolean>(ALLOW_API_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!isAllowed) {
      throw new ForbiddenException({
        code: ErrorCodes.FORBIDDEN,
        message: "Endpoint ini tidak dapat diakses via API Key.",
      });
    }

    return true;
  }
}
