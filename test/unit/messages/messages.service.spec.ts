import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MessagesService } from '../../../src/modules/messages/messages.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { mockRedisService } from '../../mocks/redis.mock';
import {
  mockSessionManagerService,
  mockWhatsappClient,
} from '../../mocks/whatsapp.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RedisService } from '../../../src/redis/redis.service';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';

jest.mock('../../../src/common/utils/mime-validator.util', () => ({
  validateMimeType: jest.fn().mockResolvedValue('image/jpeg'),
}));

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<MessagesService>(MessagesService);
    jest.clearAllMocks();
  });

  describe('send', () => {
    it('sends message using auto session', async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue('s1');
      mockSessionManagerService.sendMessage.mockResolvedValue({
        id: { _serialized: 'msg-1' },
      });
      mockPrismaService.messageLog.create.mockResolvedValue({});
      mockPrismaService.userQuota.updateMany.mockResolvedValue({});
      const result = await service.send('u1', {
        to: '08123456789',
        message: 'Hello',
        sessionId: 'auto',
      });
      expect(result.messageId).toBe('msg-1');
    });

    it('logs failed message on send error', async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue('s1');
      mockSessionManagerService.sendMessage.mockRejectedValue(
        new Error('Network error'),
      );
      mockPrismaService.messageLog.create.mockResolvedValue({});
      await expect(
        service.send('u1', {
          to: '08123456789',
          message: 'Hello',
          sessionId: 'auto',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.messageLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'failed' }),
        }),
      );
    });

    it('throws NO_SESSIONS when no healthy session', async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue(null);
      await expect(
        service.send('u1', { to: '08123456789', message: 'Hello' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('editMessage', () => {
    it('edits message successfully', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.editMessage(
        'u1',
        's1',
        'mock-msg-id',
        'Updated text',
      );
      expect(mockWhatsappClient.getMessageById).toHaveBeenCalledWith(
        'mock-msg-id',
      );
      expect(result).toHaveProperty('edited', true);
    });

    it('throws SESSION_NOT_CONNECTED if client not found', async () => {
      mockSessionManagerService.getClient.mockReturnValue(null);
      await expect(
        service.editMessage('u1', 's1', 'mock-msg-id', 'text'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NOT_FOUND if message not found', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockWhatsappClient.getMessageById.mockResolvedValueOnce(null);
      await expect(
        service.editMessage('u1', 's1', 'unknown-id', 'text'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('forwardMessage', () => {
    it('forwards message to another number', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.forwardMessage(
        'u1',
        's1',
        'mock-msg-id',
        '08123456789',
      );
      expect(mockWhatsappClient.getMessageById).toHaveBeenCalledWith(
        'mock-msg-id',
      );
      expect(result).toHaveProperty('forwarded', true);
    });
  });

  describe('pinMessage', () => {
    it('pins message successfully', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.pinMessage('u1', 's1', 'mock-msg-id', 3600);
      expect(result).toHaveProperty('pinned', true);
    });

    it('unpins message successfully', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.unpinMessage('u1', 's1', 'mock-msg-id');
      expect(result).toHaveProperty('unpinned', true);
    });
  });

  describe('downloadMedia', () => {
    it('downloads and saves media file', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.downloadMedia(
        'u1',
        's1',
        'mock-msg-id',
        '/tmp',
      );
      expect(result).toHaveProperty('mimetype', 'image/jpeg');
      expect(result).toHaveProperty('filename');
    });

    it('throws if message has no media', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockWhatsappClient.getMessageById.mockResolvedValueOnce({
        id: { _serialized: 'id' },
        hasMedia: false,
        delete: jest.fn(),
        react: jest.fn(),
      });
      await expect(
        service.downloadMedia('u1', 's1', 'mock-msg-id', '/tmp'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('reactMessage', () => {
    it('reacts to message with emoji', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.reactMessage('u1', 's1', 'mock-msg-id', '');
      expect(result).toHaveProperty('reacted', true);
    });
  });

  describe('deleteMessage', () => {
    it('deletes message for everyone by default', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.deleteMessage('u1', 's1', 'mock-msg-id');
      expect(mockWhatsappClient.getMessageById).toHaveBeenCalledWith(
        'mock-msg-id',
      );
      expect(result).toHaveProperty('deleted', true);
    });
  });

  describe('isRegisteredUser', () => {
    it('checks registered number', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockWhatsappClient.isRegisteredUser.mockResolvedValue(true);
      const result = await service.isRegisteredUser('u1', 's1', '08123456789');
      expect(result.isRegistered).toBe(true);
      expect(result.phone).toBe('6281234567890');
    });
  });

  describe('getLogs', () => {
    it('returns paginated message logs', async () => {
      mockPrismaService.messageLog.findMany.mockResolvedValue([
        { id: 1, target: '628123' },
      ]);
      mockPrismaService.messageLog.count.mockResolvedValue(1);
      const result = await service.getLogs('u1', { page: 1, limit: 10 } as any);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });
});
