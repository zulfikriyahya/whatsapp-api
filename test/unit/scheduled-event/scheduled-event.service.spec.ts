import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ScheduledEventService } from '../../../src/modules/scheduled-event/scheduled-event.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import {
  mockSessionManagerService,
  mockWhatsappClient,
} from '../../mocks/whatsapp.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';
import { EventResponse } from '../../../src/modules/scheduled-event/dto/respond-event.dto';

describe('ScheduledEventService', () => {
  let service: ScheduledEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduledEventService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<ScheduledEventService>(ScheduledEventService);
    jest.clearAllMocks();
  });

  describe('send', () => {
    it('sends scheduled event message', async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue('s1');
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockWhatsappClient.sendMessage.mockResolvedValue({
        id: { _serialized: 'msg-1' },
      });

      const result = await service.send('u1', {
        to: '08123456789',
        title: 'Team Meeting',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        description: 'Weekly sync',
        sessionId: 'auto',
      });

      expect(result.messageId).toBe('msg-1');
    });

    it('throws if no session available', async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue(null);
      await expect(
        service.send('u1', {
          to: '08123456789',
          title: 'Meeting',
          startTime: new Date(Date.now() + 3600000).toISOString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('respond', () => {
    it('accepts scheduled event', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const mockMsg = {
        id: { _serialized: 'msg-1' },
        acceptScheduledEvent: jest.fn().mockResolvedValue(undefined),
        declineScheduledEvent: jest.fn().mockResolvedValue(undefined),
      };
      mockWhatsappClient.getMessageById.mockResolvedValue(mockMsg);

      const result = await service.respond('u1', {
        messageId: 'msg-1',
        sessionId: 's1',
        response: EventResponse.ACCEPT,
      });

      expect(result.responded).toBe(true);
      expect(result.response).toBe(EventResponse.ACCEPT);
      expect(mockMsg.acceptScheduledEvent).toHaveBeenCalled();
    });

    it('declines scheduled event', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const mockMsg = {
        id: { _serialized: 'msg-1' },
        acceptScheduledEvent: jest.fn().mockResolvedValue(undefined),
        declineScheduledEvent: jest.fn().mockResolvedValue(undefined),
      };
      mockWhatsappClient.getMessageById.mockResolvedValue(mockMsg);

      const result = await service.respond('u1', {
        messageId: 'msg-1',
        sessionId: 's1',
        response: EventResponse.DECLINE,
      });

      expect(mockMsg.declineScheduledEvent).toHaveBeenCalled();
      expect(result.response).toBe(EventResponse.DECLINE);
    });
  });
});
