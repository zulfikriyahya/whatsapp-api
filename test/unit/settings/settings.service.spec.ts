import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../../../src/modules/settings/settings.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';

const mockAiService = { init: jest.fn() };
const mockGatewayService = { emitSystemAlert: jest.fn() };

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'AiService', useValue: mockAiService },
        { provide: 'GatewayService', useValue: mockGatewayService },
      ],
    })
      .overrideProvider('AiService')
      .useValue(mockAiService)
      .overrideProvider('GatewayService')
      .useValue(mockGatewayService)
      .compile();

    service = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
  });

  describe('getUserSettings', () => {
    it('masks gemini API key', async () => {
      mockPrismaService.userSetting.findUnique.mockResolvedValue({
        userId: 'u1',
        geminiApiKey: 'abcdefghijklmnop',
        geminiConfidenceThreshold: 0.6,
      });
      const result = await service.getUserSettings('u1');
      expect(result.geminiApiKey).toBe('****mnop');
    });

    it('returns null if no settings', async () => {
      mockPrismaService.userSetting.findUnique.mockResolvedValue(null);
      const result = await service.getUserSettings('u1');
      expect(result).toBeNull();
    });
  });

  describe('updateUserSettings', () => {
    it('calls ai.init when geminiApiKey is updated', async () => {
      mockPrismaService.userSetting.upsert.mockResolvedValue({
        userId: 'u1',
        geminiApiKey: 'new-key',
      });
      await service.updateUserSettings('u1', { geminiApiKey: 'new-key' });
      expect(mockAiService.init).toHaveBeenCalledWith('new-key');
    });
  });

  describe('getGlobalSettings', () => {
    it('returns settings as key-value object', async () => {
      mockPrismaService.globalSetting.findMany.mockResolvedValue([
        { key: 'maintenanceMode', value: 'false' },
        { key: 'defaultDailyMessageLimit', value: '1000' },
      ]);
      const result = await service.getGlobalSettings();
      expect(result.maintenanceMode).toBe('false');
      expect(result.defaultDailyMessageLimit).toBe('1000');
    });
  });

  describe('setMaintenanceMode', () => {
    it('sets maintenance mode to true', async () => {
      mockPrismaService.globalSetting.upsert.mockResolvedValue({});
      const result = await service.setMaintenanceMode(true);
      expect(result).toHaveProperty('maintenanceMode', true);
      expect(mockPrismaService.globalSetting.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { key: 'maintenanceMode' },
          update: { value: 'true' },
        }),
      );
    });
  });

  describe('isMaintenanceMode', () => {
    it('returns true when maintenance mode is active', async () => {
      mockPrismaService.globalSetting.findUnique.mockResolvedValue({
        key: 'maintenanceMode',
        value: 'true',
      });
      const result = await service.isMaintenanceMode();
      expect(result).toBe(true);
    });

    it('returns false when maintenance mode is inactive', async () => {
      mockPrismaService.globalSetting.findUnique.mockResolvedValue({
        key: 'maintenanceMode',
        value: 'false',
      });
      const result = await service.isMaintenanceMode();
      expect(result).toBe(false);
    });
  });

  describe('broadcastAnnouncement', () => {
    it('emits system alert to all active users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([
        { id: 'u1' },
        { id: 'u2' },
        { id: 'u3' },
      ]);
      const result = await service.broadcastAnnouncement(
        'Server maintenance tonight',
        'admin1',
      );
      expect(result.sent).toBe(3);
      expect(mockGatewayService.emitSystemAlert).toHaveBeenCalledTimes(3);
    });
  });
});
