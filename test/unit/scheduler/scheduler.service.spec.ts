import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SchedulerService } from '../../../src/modules/scheduler/scheduler.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { mockSessionManagerService } from '../../mocks/whatsapp.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<SchedulerService>(SchedulerService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates scheduled message for future time', async () => {
      const future = new Date(Date.now() + 3600 * 1000).toISOString();
      mockPrismaService.whatsappSession.findFirst.mockResolvedValue({
        id: 's1',
        userId: 'u1',
      });
      mockPrismaService.scheduledMessage.create.mockResolvedValue({
        id: 'sm1',
        target: '628111',
        scheduledTime: new Date(future),
        status: 'pending',
      });
      const result = await service.create('u1', {
        target: '628111',
        message: 'Hi',
        sessionId: 's1',
        scheduledTime: future,
      });
      expect(result.status).toBe('pending');
    });

    it('throws BadRequestException for past time', async () => {
      const past = new Date(Date.now() - 3600 * 1000).toISOString();
      await expect(
        service.create('u1', {
          target: '628111',
          message: 'Hi',
          sessionId: 's1',
          scheduledTime: past,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException if session not owned', async () => {
      const future = new Date(Date.now() + 3600 * 1000).toISOString();
      mockPrismaService.whatsappSession.findFirst.mockResolvedValue(null);
      await expect(
        service.create('u1', {
          target: '628111',
          message: 'Hi',
          sessionId: 's999',
          scheduledTime: future,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('cancels pending message', async () => {
      mockPrismaService.scheduledMessage.findFirst.mockResolvedValue({
        id: 'sm1',
        userId: 'u1',
        status: 'pending',
      });
      mockPrismaService.scheduledMessage.update.mockResolvedValue({
        id: 'sm1',
        status: 'cancelled',
      });
      const result = await service.cancel('u1', 'sm1');
      expect(result.status).toBe('cancelled');
    });

    it('throws if message already sent', async () => {
      mockPrismaService.scheduledMessage.findFirst.mockResolvedValue({
        id: 'sm1',
        userId: 'u1',
        status: 'sent',
      });
      await expect(service.cancel('u1', 'sm1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('processScheduled', () => {
    it('sends due messages and marks as sent', async () => {
      mockPrismaService.scheduledMessage.findMany.mockResolvedValue([
        {
          id: 'sm1',
          userId: 'u1',
          sessionId: 's1',
          target: '628111',
          message: 'Hi',
          recurrenceType: 'none',
          scheduledTime: new Date(),
        },
      ]);
      mockPrismaService.scheduledMessage.update.mockResolvedValue({});
      mockSessionManagerService.getClient.mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({}),
      });
      mockSessionManagerService.sendMessage.mockResolvedValue({});

      await service.processScheduled();

      expect(mockPrismaService.scheduledMessage.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'sent' } }),
      );
    });

    it('skips message if session not connected', async () => {
      mockPrismaService.scheduledMessage.findMany.mockResolvedValue([
        {
          id: 'sm1',
          userId: 'u1',
          sessionId: 's1',
          target: '628111',
          message: 'Hi',
          recurrenceType: 'none',
          scheduledTime: new Date(),
        },
      ]);
      mockSessionManagerService.getClient.mockReturnValue(null);

      await service.processScheduled();

      expect(mockPrismaService.scheduledMessage.update).not.toHaveBeenCalled();
    });

    it('creates next recurrence after sending daily message', async () => {
      mockPrismaService.scheduledMessage.findMany.mockResolvedValue([
        {
          id: 'sm1',
          userId: 'u1',
          sessionId: 's1',
          target: '628111',
          message: 'Hi',
          recurrenceType: 'daily',
          scheduledTime: new Date(),
        },
      ]);
      mockPrismaService.scheduledMessage.update.mockResolvedValue({});
      mockPrismaService.scheduledMessage.create.mockResolvedValue({});
      mockSessionManagerService.getClient.mockReturnValue({});
      mockSessionManagerService.sendMessage.mockResolvedValue({});

      await service.processScheduled();

      expect(mockPrismaService.scheduledMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ recurrenceType: 'daily' }),
        }),
      );
    });

    it('marks as failed if send throws', async () => {
      mockPrismaService.scheduledMessage.findMany.mockResolvedValue([
        {
          id: 'sm1',
          userId: 'u1',
          sessionId: 's1',
          target: '628111',
          message: 'Hi',
          recurrenceType: 'none',
          scheduledTime: new Date(),
        },
      ]);
      mockSessionManagerService.getClient.mockReturnValue({});
      mockSessionManagerService.sendMessage.mockRejectedValue(
        new Error('Send error'),
      );
      mockPrismaService.scheduledMessage.update.mockResolvedValue({});

      await service.processScheduled();

      expect(mockPrismaService.scheduledMessage.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'failed' } }),
      );
    });
  });
});
