import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastProcessor } from '../../../src/modules/broadcast/processors/broadcast.processor';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { mockSessionManagerService } from '../../mocks/whatsapp.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';
import { GatewayService } from '../../../src/gateway/gateway.service';

jest.mock('../../../src/common/utils/mime-validator.util', () => ({
  validateMimeType: jest.fn().mockResolvedValue('image/jpeg'),
}));

const mockGatewayService = {
  emitBroadcastProgress: jest.fn(),
  emitBroadcastComplete: jest.fn(),
};

describe('BroadcastProcessor', () => {
  let processor: BroadcastProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastProcessor,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
        { provide: GatewayService, useValue: mockGatewayService },
      ],
    }).compile();
    processor = module.get<BroadcastProcessor>(BroadcastProcessor);
    jest.clearAllMocks();
  });

  const makeJob = (overrides = {}) =>
    ({
      data: {
        campaignId: 'c1',
        userId: 'u1',
        recipients: ['6281234567890'],
        message: 'Hello',
        mediaPath: null,
        sessions: ['s1'],
        ...overrides,
      },
    }) as any;

  it('processes broadcast and marks campaign completed', async () => {
    mockPrismaService.campaign.update.mockResolvedValue({});
    mockPrismaService.messageLog.create.mockResolvedValue({});
    mockPrismaService.userQuota.updateMany.mockResolvedValue({});
    mockSessionManagerService.sendMessage.mockResolvedValue({
      id: { _serialized: 'msg-1' },
    });

    await processor.process(makeJob());

    expect(mockPrismaService.campaign.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'completed' }),
      }),
    );
    expect(mockGatewayService.emitBroadcastComplete).toHaveBeenCalledWith(
      'u1',
      'c1',
      1,
      0,
    );
  });

  it('falls over to next session if first session fails', async () => {
    mockPrismaService.campaign.update.mockResolvedValue({});
    mockPrismaService.messageLog.create.mockResolvedValue({});
    mockPrismaService.userQuota.updateMany.mockResolvedValue({});

    mockSessionManagerService.sendMessage
      .mockRejectedValueOnce(new Error('Session s1 failed'))
      .mockResolvedValueOnce({ id: { _serialized: 'msg-1' } });

    await processor.process(makeJob({ sessions: ['s1', 's2'] }));

    expect(mockSessionManagerService.sendMessage).toHaveBeenCalledTimes(2);
    expect(mockGatewayService.emitBroadcastComplete).toHaveBeenCalledWith(
      'u1',
      'c1',
      1,
      0,
    );
  });

  it('marks recipient as failed when all sessions fail', async () => {
    mockPrismaService.campaign.update.mockResolvedValue({});
    mockPrismaService.messageLog.create.mockResolvedValue({});
    mockPrismaService.userQuota.updateMany.mockResolvedValue({});
    mockSessionManagerService.sendMessage.mockRejectedValue(
      new Error('All failed'),
    );

    await processor.process(makeJob({ sessions: ['s1'] }));

    expect(mockGatewayService.emitBroadcastComplete).toHaveBeenCalledWith(
      'u1',
      'c1',
      0,
      1,
    );
    expect(mockPrismaService.messageLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'failed',
          errorMessage: 'All sessions failed',
        }),
      }),
    );
  });

  it('emits progress for each recipient', async () => {
    mockPrismaService.campaign.update.mockResolvedValue({});
    mockPrismaService.messageLog.create.mockResolvedValue({});
    mockPrismaService.userQuota.updateMany.mockResolvedValue({});
    mockSessionManagerService.sendMessage.mockResolvedValue({
      id: { _serialized: 'msg-1' },
    });

    await processor.process(makeJob({ recipients: ['628111', '628222'] }));

    expect(mockGatewayService.emitBroadcastProgress).toHaveBeenCalledTimes(2);
    expect(mockGatewayService.emitBroadcastProgress).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ current: 1, total: 2, percentage: 50 }),
    );
  });
});
