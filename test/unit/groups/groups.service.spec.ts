import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { GroupsService } from '../../../src/modules/groups/groups.service';
import {
  mockSessionManagerService,
  mockWhatsappClient,
} from '../../mocks/whatsapp.mock';
import { SessionManagerService } from '../../../src/modules/sessions/session-manager.service';
import { MembershipRequestAction } from '../../../src/modules/groups/dto/membership-request.dto';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<GroupsService>(GroupsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates group successfully', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.create('s1', 'Test Group', [
        '628111@s.whatsapp.net',
      ]);
      expect(mockWhatsappClient.createGroup).toHaveBeenCalledWith(
        'Test Group',
        ['628111@s.whatsapp.net'],
      );
      expect(result).toHaveProperty('gid');
    });

    it('throws if session not connected', async () => {
      mockSessionManagerService.getClient.mockReturnValue(null);
      await expect(service.create('s1', 'Test', ['628111'])).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('addParticipants', () => {
    it('adds participants to group', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      await service.addParticipants('s1', 'group@g.us', [
        '628111@s.whatsapp.net',
      ]);
      const group = await mockWhatsappClient.getChatById('group@g.us');
      expect(group.addParticipants).toHaveBeenCalledWith([
        '628111@s.whatsapp.net',
      ]);
    });
  });

  describe('removeParticipants', () => {
    it('removes participants from group', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      await service.removeParticipants('s1', 'group@g.us', [
        '628111@s.whatsapp.net',
      ]);
      const group = await mockWhatsappClient.getChatById('group@g.us');
      expect(group.removeParticipants).toHaveBeenCalledWith([
        '628111@s.whatsapp.net',
      ]);
    });
  });

  describe('promoteParticipants', () => {
    it('promotes participants to admin', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      await service.promoteParticipants('s1', 'group@g.us', [
        '628111@s.whatsapp.net',
      ]);
      const group = await mockWhatsappClient.getChatById('group@g.us');
      expect(group.promoteParticipants).toHaveBeenCalledWith([
        '628111@s.whatsapp.net',
      ]);
    });
  });

  describe('demoteParticipants', () => {
    it('demotes admins to members', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      await service.demoteParticipants('s1', 'group@g.us', [
        '628111@s.whatsapp.net',
      ]);
      const group = await mockWhatsappClient.getChatById('group@g.us');
      expect(group.demoteParticipants).toHaveBeenCalledWith([
        '628111@s.whatsapp.net',
      ]);
    });
  });

  describe('getInviteCode', () => {
    it('returns invite link', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.getInviteCode('s1', 'group@g.us');
      expect(result.inviteLink).toBe('https://chat.whatsapp.com/abc123');
    });
  });

  describe('handleMembershipRequest', () => {
    it('approves join request', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      await service.handleMembershipRequest('s1', 'group@g.us', {
        requesterJid: '628111@s.whatsapp.net',
        action: MembershipRequestAction.APPROVE,
      });
      const group = await mockWhatsappClient.getChatById('group@g.us');
      expect(group.approveGroupMembershipRequests).toHaveBeenCalledWith([
        '628111@s.whatsapp.net',
      ]);
    });

    it('rejects join request', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      await service.handleMembershipRequest('s1', 'group@g.us', {
        requesterJid: '628111@s.whatsapp.net',
        action: MembershipRequestAction.REJECT,
      });
      const group = await mockWhatsappClient.getChatById('group@g.us');
      expect(group.rejectGroupMembershipRequests).toHaveBeenCalledWith([
        '628111@s.whatsapp.net',
      ]);
    });
  });

  describe('getMembershipRequests', () => {
    it('returns pending join requests', async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      const result = await service.getMembershipRequests('s1', 'group@g.us');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
