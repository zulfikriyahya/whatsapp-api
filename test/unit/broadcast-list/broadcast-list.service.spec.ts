import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BroadcastListService } from '../../../src/modules/broadcast-list/broadcast-list.service';
import {
  mockSessionManagerService,
  mockWhatsappClient,
} from '../../mocks/whatsapp.mock';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';

describe('BroadcastListService', () => {
  let service: BroadcastListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastListService,
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<BroadcastListService>(BroadcastListService);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns only broadcast list chats', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockWhatsappClient.getChats.mockResolvedValue([
        {
          isBroadcast: true,
          id: { server: 'broadcast', _serialized: 'bl1@broadcast' },
        },
        {
          isBroadcast: false,
          id: { server: 'g.us', _serialized: 'group@g.us' },
        },
        {
          isBroadcast: true,
          id: { server: 'broadcast', _serialized: 'bl2@broadcast' },
        },
      ]);
      const result = await service.getAll('s1');
      expect(result).toHaveLength(2);
    });

    it('throws if session not connected', async () => {
      mockSessionManagerService.getClient.mockReturnValue(null);
      await expect(service.getAll('s1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('send', () => {
    it('sends message to broadcast list', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockSessionManagerService.sendMessage.mockResolvedValue({
        id: { _serialized: 'msg-1' },
      });
      await service.send('s1', 'bl1@broadcast', 'Hello everyone');
      expect(mockSessionManagerService.sendMessage).toHaveBeenCalledWith(
        's1',
        'bl1@broadcast',
        'Hello everyone',
      );
    });
  });
});
