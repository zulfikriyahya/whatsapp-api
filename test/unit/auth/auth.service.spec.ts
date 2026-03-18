import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { mockRedisService } from '../../mocks/redis.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RedisService } from '../../../src/redis/redis.service';
import { AuditService } from '../../../src/modules/audit/audit.service';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn(),
};
const mockConfigService = { get: jest.fn().mockReturnValue('admin@test.com') };
const mockAuditService = { log: jest.fn().mockResolvedValue(undefined) };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('validateGoogleUser', () => {
    const profile = {
      email: 'user@test.com',
      name: 'Test User',
      picture: 'https://pic.com',
    };

    it('creates new user on first login', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'u1',
        ...profile,
        role: 'user',
        isActive: true,
        twoFaEnabled: false,
      });
      mockPrismaService.userQuota.create.mockResolvedValue({});
      const result = await service.validateGoogleUser(
        profile,
        '127.0.0.1',
        'jest',
      );
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result.email).toBe(profile.email);
    });

    it('returns existing user on subsequent login', async () => {
      const existing = {
        id: 'u1',
        ...profile,
        role: 'user',
        isActive: true,
        twoFaEnabled: false,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(existing);
      const result = await service.validateGoogleUser(
        profile,
        '127.0.0.1',
        'jest',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
      expect(result.id).toBe('u1');
    });

    it('throws ForbiddenException for inactive user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u1',
        ...profile,
        role: 'user',
        isActive: false,
        twoFaEnabled: false,
      });
      await expect(
        service.validateGoogleUser(profile, '127.0.0.1', 'jest'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('assigns admin role if email matches ADMIN_EMAIL', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'u-admin',
        email: 'admin@test.com',
        name: 'Admin',
        role: 'admin',
        isActive: true,
        twoFaEnabled: false,
      });
      mockPrismaService.userQuota.create.mockResolvedValue({});
      const result = await service.validateGoogleUser(
        { ...profile, email: 'admin@test.com' },
        '127.0.0.1',
        'jest',
      );
      expect(result.role).toBe('admin');
    });
  });

  describe('signJwt', () => {
    it('returns signed token', () => {
      const token = service.signJwt({
        id: 'u1',
        email: 'a@b.com',
        role: 'user',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'u1',
        email: 'a@b.com',
        role: 'user',
      });
      expect(token).toBe('mock.jwt.token');
    });
  });

  describe('createTempToken & verifyTempToken', () => {
    it('stores and retrieves temp token', async () => {
      mockRedisService.set.mockResolvedValue(undefined);
      const token = await service.createTempToken('u1');
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(typeof token).toBe('string');
      mockRedisService.get.mockResolvedValue('u1');
      const userId = await service.verifyTempToken(token);
      expect(userId).toBe('u1');
    });

    it('throws UnauthorizedException if temp token expired', async () => {
      mockRedisService.get.mockResolvedValue(null);
      await expect(service.verifyTempToken('invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('setup2fa', () => {
    it('returns qrCode and secret', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        twoFaEnabled: false,
      });
      mockRedisService.set.mockResolvedValue(undefined);
      const result = await service.setup2fa('u1');
      expect(result).toHaveProperty('qrCode');
      expect(result).toHaveProperty('secret');
    });

    it('throws if 2FA already enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        twoFaEnabled: true,
      });
      await expect(service.setup2fa('u1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('regenerateBackupCodes', () => {
    it('throws if 2FA not enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        twoFaEnabled: false,
        twoFaSecret: null,
      });
      await expect(
        service.regenerateBackupCodes('u1', '123456'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('logs audit on logout', async () => {
      await service.logout('u1', 'a@b.com', '127.0.0.1', 'jest');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGOUT' }),
      );
    });
  });
});
