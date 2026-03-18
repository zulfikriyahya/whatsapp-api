import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { WorkspaceService } from '../../../src/modules/workspace/workspace.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuditService } from '../../../src/modules/audit/audit.service';

const mockAuditService = { log: jest.fn().mockResolvedValue(undefined) };

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();
    service = module.get<WorkspaceService>(WorkspaceService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates workspace with owner as member', async () => {
      mockPrismaService.workspace.create.mockResolvedValue({
        id: 'ws1',
        name: 'My Workspace',
        ownerId: 'u1',
        members: [{ userId: 'u1', role: 'owner' }],
      });
      const result = await service.create(
        'u1',
        'u1@test.com',
        'My Workspace',
        '127.0.0.1',
        'jest',
      );
      expect(result.name).toBe('My Workspace');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE_WORKSPACE' }),
      );
    });
  });

  describe('findAll', () => {
    it('returns workspaces the user belongs to', async () => {
      mockPrismaService.workspace.findMany.mockResolvedValue([
        { id: 'ws1', name: 'Team', members: [] },
      ]);
      const result = await service.findAll('u1');
      expect(result).toHaveLength(1);
    });
  });

  describe('invite', () => {
    it('invites user to workspace', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue({
        id: 'ws1',
        ownerId: 'u1',
      });
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u2',
        email: 'u2@test.com',
      });
      mockPrismaService.workspaceMember.upsert.mockResolvedValue({
        id: 'wm1',
        userId: 'u2',
        role: 'member',
      });
      const result = await service.invite(
        'u1',
        'u1@test.com',
        'ws1',
        'u2@test.com',
        '127.0.0.1',
        'jest',
      );
      expect(result.role).toBe('member');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'INVITE_MEMBER' }),
      );
    });

    it('throws NotFoundException if workspace not owned', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue(null);
      await expect(
        service.invite(
          'u1',
          'u1@test.com',
          'ws1',
          'u2@test.com',
          '127.0.0.1',
          'jest',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException if invited user does not exist', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue({
        id: 'ws1',
        ownerId: 'u1',
      });
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        service.invite(
          'u1',
          'u1@test.com',
          'ws1',
          'nobody@test.com',
          '127.0.0.1',
          'jest',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMemberPermission', () => {
    it('updates member role', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue({
        id: 'ws1',
        ownerId: 'u1',
      });
      mockPrismaService.workspaceMember.updateMany.mockResolvedValue({
        count: 1,
      });
      const result = await service.updateMemberPermission('u1', 'ws1', 'u2', {
        role: 'admin' as any,
      });
      expect(result.count).toBe(1);
    });

    it('throws ForbiddenException if trying to change own role', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue({
        id: 'ws1',
        ownerId: 'u1',
      });
      await expect(
        service.updateMemberPermission('u1', 'ws1', 'u1', {
          role: 'member' as any,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException if workspace not owned', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue(null);
      await expect(
        service.updateMemberPermission('u1', 'ws1', 'u2', {
          role: 'member' as any,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeMember', () => {
    it('removes member from workspace', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue({
        id: 'ws1',
        ownerId: 'u1',
      });
      mockPrismaService.workspaceMember.deleteMany.mockResolvedValue({
        count: 1,
      });
      await service.removeMember(
        'u1',
        'u1@test.com',
        'ws1',
        'u2',
        '127.0.0.1',
        'jest',
      );
      expect(mockPrismaService.workspaceMember.deleteMany).toHaveBeenCalledWith(
        {
          where: { workspaceId: 'ws1', userId: 'u2' },
        },
      );
    });

    it('throws ForbiddenException when removing self', async () => {
      mockPrismaService.workspace.findFirst.mockResolvedValue({
        id: 'ws1',
        ownerId: 'u1',
      });
      await expect(
        service.removeMember(
          'u1',
          'u1@test.com',
          'ws1',
          'u1',
          '127.0.0.1',
          'jest',
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
