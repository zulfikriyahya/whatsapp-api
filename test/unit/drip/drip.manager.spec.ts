import { Test, TestingModule } from '@nestjs/testing';
import { DripManager } from '../../../src/modules/drip/drip.manager';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { mockSessionManagerService } from '../../mocks/whatsapp.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';

describe('DripManager', () => {
  let manager: DripManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DripManager,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    manager = module.get<DripManager>(DripManager);
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('runs without error when no campaigns exist', async () => {
      mockPrismaService.dripCampaign.findMany.mockResolvedValue([]);
      mockPrismaService.dripSubscription.findMany.mockResolvedValue([]);
      await expect(manager.run()).resolves.not.toThrow();
    });

    it('auto-enrolls contacts with matching tag', async () => {
      mockPrismaService.dripCampaign.findMany.mockResolvedValue([
        { id: 'd1', userId: 'u1', triggerTag: 'vip', isActive: true },
      ]);
      mockPrismaService.contact.findMany.mockResolvedValue([
        { id: 'c1', userId: 'u1', number: '628111', name: 'Budi', tag: 'vip' },
      ]);
      mockPrismaService.dripSubscription.upsert.mockResolvedValue({});
      mockPrismaService.dripSubscription.findMany.mockResolvedValue([]);

      await manager.run();

      expect(mockPrismaService.dripSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dripId_contactId: { dripId: 'd1', contactId: 'c1' } },
        }),
      );
    });

    it('sends due drip step and updates subscription', async () => {
      mockPrismaService.dripCampaign.findMany.mockResolvedValue([]);

      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1);

      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMin = now.getMinutes().toString().padStart(2, '0');
      const timeAt = `${currentHour}:${currentMin}`;

      mockPrismaService.dripSubscription.findMany.mockResolvedValue([
        {
          id: 'sub1',
          status: 'active',
          startDate,
          lastStepDay: 0,
          drip: {
            id: 'd1',
            userId: 'u1',
            sessionId: 's1',
            steps: [
              { id: 'step1', dayOffset: 1, timeAt, message: 'Hello {name}' },
            ],
          },
          contact: { id: 'c1', number: '628111', name: 'Budi' },
        },
      ]);
      mockPrismaService.dripSubscription.update.mockResolvedValue({});
      mockSessionManagerService.sendMessage.mockResolvedValue({});

      await manager.run();

      expect(mockSessionManagerService.sendMessage).toHaveBeenCalledWith(
        's1',
        expect.stringContaining('@s.whatsapp.net'),
        'Hello Budi',
      );
      expect(mockPrismaService.dripSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            lastStepDay: 1,
            status: 'completed',
          }),
        }),
      );
    });
  });
});
