import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProfileService } from '../../../src/modules/profile/profile.service';
import {
  mockSessionManagerService,
  mockWhatsappClient,
} from '../../mocks/whatsapp.mock';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';

jest.mock('../../../src/common/utils/mime-validator.util', () => ({
  validateMimeType: jest.fn().mockResolvedValue('image/jpeg'),
}));

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns session info', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.getProfile('s1');
      expect(result).toHaveProperty('pushname', 'Test Bot');
    });

    it('throws if session not connected', async () => {
      mockSessionManagerService.getClient.mockReturnValue(null);
      await expect(service.getProfile('s1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('setDisplayName', () => {
    it('sets display name', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.setDisplayName('s1', 'New Name');
      expect(result).toHaveProperty('updated', true);
    });
  });

  describe('setStatus', () => {
    it('sets status', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.setStatus('s1', 'Available');
      expect(result).toHaveProperty('updated', true);
    });
  });

  describe('setProfilePhoto', () => {
    it('uploads profile photo', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const file = {
        buffer: Buffer.from('fake'),
        originalname: 'pic.jpg',
      } as Express.Multer.File;
      const result = await service.setProfilePhoto('s1', file);
      expect(result).toHaveProperty('updated', true);
    });
  });

  describe('deleteProfilePhoto', () => {
    it('deletes profile photo', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.deleteProfilePhoto('s1');
      expect(result).toHaveProperty('deleted', true);
    });
  });

  describe('blockContact', () => {
    it('blocks a contact', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.blockContact('s1', '628123@s.whatsapp.net');
      expect(result).toHaveProperty('blocked', true);
    });
  });

  describe('unblockContact', () => {
    it('unblocks a contact', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.unblockContact(
        's1',
        '628123@s.whatsapp.net',
      );
      expect(result).toHaveProperty('unblocked', true);
    });
  });

  describe('getBlockedContacts', () => {
    it('returns list of blocked contacts', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.getBlockedContacts('s1');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getContactProfilePhoto', () => {
    it('returns photo URL', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.getContactProfilePhoto(
        's1',
        '628123@s.whatsapp.net',
      );
      expect(result).toHaveProperty('url');
    });
  });

  describe('getAllContacts', () => {
    it('returns contacts array', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.getAllContacts('s1');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
