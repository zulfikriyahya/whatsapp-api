import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { AuditService } from '../audit/audit.service';
import { CacheKeys } from '../../common/constants/cache-keys.constant';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { generateTempToken, generateHexToken } from '../../common/utils/token-generator.util';
import { sha256 } from '../../common/utils/hash.util';
import { AuditAction, Role } from '@prisma/client';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

const BACKUP_CODE_COUNT = 8;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private redis: RedisService,
    private audit: AuditService,
    private cfg: ConfigService,
  ) {}

  async validateGoogleUser(
    profile: { email: string; name: string; picture?: string },
    ip: string,
    ua: string,
  ) {
    const adminEmail = this.cfg.get<string>('app.adminEmail');
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      const role: Role = profile.email === adminEmail ? Role.admin : Role.user;
      user = await this.prisma.user.create({
        data: { email: profile.email, name: profile.name, picture: profile.picture, role },
      });
      await this.prisma.userQuota.create({ data: { userId: user.id } });
    } else if (user.role === Role.user && profile.email === adminEmail) {
      user = await this.prisma.user.update({ where: { id: user.id }, data: { role: Role.admin } });
    }

    if (!user.isActive) throw new ForbiddenException({ code: ErrorCodes.ACCOUNT_DISABLED });

    await this.audit.log({ userId: user.id, userEmail: user.email, action: AuditAction.LOGIN, ip, userAgent: ua });
    return user;
  }

  signJwt(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }

  async createTempToken(userId: string): Promise<string> {
    const token = generateTempToken();
    await this.redis.set(CacheKeys.twoFaTempToken(token), userId, 300);
    return token;
  }

  async verifyTempToken(token: string): Promise<string> {
    const userId = await this.redis.get<string>(CacheKeys.twoFaTempToken(token));
    if (!userId) throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_SESSION_EXPIRED });
    return userId;
  }

  async deleteTempToken(token: string) {
    await this.redis.del(CacheKeys.twoFaTempToken(token));
  }

  async verify2fa(tempToken: string, code: string, ip: string, ua: string) {
    const userId = await this.verifyTempToken(tempToken);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFaSecret) throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_NOT_ENABLED });

    const isTotp = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!isTotp) {
      const usedBackup = await this.verifyAndConsumeBackupCode(user.id, code);
      if (!usedBackup) throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_INVALID_CODE });
    }

    await this.deleteTempToken(tempToken);
    await this.audit.log({ userId: user.id, userEmail: user.email, action: AuditAction.LOGIN, ip, userAgent: ua });
    return user;
  }

  async setup2fa(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.twoFaEnabled) throw new BadRequestException({ code: ErrorCodes.TWO_FA_ALREADY_ENABLED });

    const secret = speakeasy.generateSecret({ name: `WA Gateway (${user.email})`, length: 20 });
    await this.redis.set(`2fa:setup:${userId}`, secret.base32, 600);

    const qr = await qrcode.toDataURL(secret.otpauth_url);
    return { qrCode: qr, secret: secret.base32 };
  }

  async enable2fa(userId: string, code: string, ip: string, ua: string) {
    const secret = await this.redis.get<string>(`2fa:setup:${userId}`);
    if (!secret) throw new BadRequestException({ code: ErrorCodes.TWO_FA_SESSION_EXPIRED });

    const valid = speakeasy.totp.verify({ secret, encoding: 'base32', token: code, window: 2 });
    if (!valid) throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_INVALID_CODE });

    const backupCodes = this.generateBackupCodes();
    const hashedCodes = backupCodes.map((c) => sha256(c));

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFaSecret: secret, twoFaEnabled: true },
    });
    await this.redis.set(`2fa:backup:${userId}`, hashedCodes, 0);
    await this.redis.del(`2fa:setup:${userId}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.audit.log({ userId, userEmail: user.email, action: AuditAction.ENABLE_2FA, ip, userAgent: ua });
    return { message: '2FA enabled', backupCodes };
  }

  async disable2fa(userId: string, code: string, ip: string, ua: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFaEnabled) throw new BadRequestException({ code: ErrorCodes.TWO_FA_NOT_ENABLED });

    const isTotp = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });
    if (!isTotp) {
      const usedBackup = await this.verifyAndConsumeBackupCode(user.id, code);
      if (!usedBackup) throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_INVALID_CODE });
    }

    await this.prisma.user.update({ where: { id: userId }, data: { twoFaSecret: null, twoFaEnabled: false } });
    await this.redis.del(`2fa:backup:${userId}`);
    await this.audit.log({ userId, userEmail: user.email, action: AuditAction.DISABLE_2FA, ip, userAgent: ua });
    return { message: '2FA disabled' };
  }

  async regenerateBackupCodes(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFaEnabled) throw new BadRequestException({ code: ErrorCodes.TWO_FA_NOT_ENABLED });

    const valid = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });
    if (!valid) throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_INVALID_CODE });

    const backupCodes = this.generateBackupCodes();
    const hashedCodes = backupCodes.map((c) => sha256(c));
    await this.redis.set(`2fa:backup:${userId}`, hashedCodes, 0);
    return { backupCodes };
  }

  async logout(userId: string, email: string, ip: string, ua: string) {
    await this.audit.log({ userId, userEmail: email, action: AuditAction.LOGOUT, ip, userAgent: ua });
  }

  private generateBackupCodes(): string[] {
    return Array.from({ length: BACKUP_CODE_COUNT }, () =>
      generateHexToken(5).toUpperCase().match(/.{1,5}/g)!.join('-'),
    );
  }

  private async verifyAndConsumeBackupCode(userId: string, code: string): Promise<boolean> {
    const stored = await this.redis.get<string[]>(`2fa:backup:${userId}`);
    if (!stored?.length) return false;
    const hashed = sha256(code.toUpperCase());
    const idx = stored.indexOf(hashed);
    if (idx === -1) return false;
    stored.splice(idx, 1);
    await this.redis.set(`2fa:backup:${userId}`, stored, 0);
    return true;
  }
}
