import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CustomerNoteService } from '../../../src/modules/customer-note/customer-note.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('CustomerNoteService', () => {
  let service: CustomerNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerNoteService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<CustomerNoteService>(CustomerNoteService);
    jest.clearAllMocks();
  });

  describe('getNote', () => {
    it('returns notes for existing contact', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue({
        id: 'c1',
        userId: 'u1',
        notes: 'VIP customer',
      });
      const result = await service.getNote('u1', 'c1');
      expect(result.notes).toBe('VIP customer');
      expect(result.contactId).toBe('c1');
    });

    it('throws NotFoundException if contact not owned', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);
      await expect(service.getNote('u1', 'c1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('upsertNote', () => {
    it('updates note content', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue({
        id: 'c1',
        userId: 'u1',
        notes: '',
      });
      mockPrismaService.contact.update.mockResolvedValue({
        id: 'c1',
        notes: 'New note',
      });
      const result = await service.upsertNote('u1', 'c1', 'New note');
      expect(result.notes).toBe('New note');
    });

    it('throws NotFoundException if contact not owned', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);
      await expect(service.upsertNote('u1', 'c1', 'note')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteNote', () => {
    it('sets notes to null', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue({
        id: 'c1',
        userId: 'u1',
        notes: 'Old note',
      });
      mockPrismaService.contact.update.mockResolvedValue({
        id: 'c1',
        notes: null,
      });
      const result = await service.deleteNote('u1', 'c1');
      expect(result).toHaveProperty('deleted', true);
      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { notes: null },
      });
    });

    it('throws NotFoundException if contact not owned', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);
      await expect(service.deleteNote('u1', 'c1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
