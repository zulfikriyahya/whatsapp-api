import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContactsService } from '../../../src/modules/contacts/contacts.service';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';

jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<ContactsService>(ContactsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates contact with normalized number', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);
      mockPrismaService.contact.create.mockResolvedValue({
        id: 'c1',
        name: 'Budi',
        number: '6281234567890',
        userId: 'u1',
      });
      const result = await service.create('u1', {
        name: 'Budi',
        number: '081234567890',
      });
      expect(result.number).toBe('6281234567890');
    });

    it('throws ConflictException on duplicate number', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(
        service.create('u1', { name: 'Budi', number: '081234567890' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('updates contact successfully', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue({
        id: 'c1',
        userId: 'u1',
      });
      mockPrismaService.contact.update.mockResolvedValue({
        id: 'c1',
        name: 'Budi Updated',
      });
      const result = await service.update('u1', 'c1', { name: 'Budi Updated' });
      expect(result.name).toBe('Budi Updated');
    });

    it('throws NotFoundException if not owned', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);
      await expect(service.update('u1', 'c1', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deletes contact', async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue({
        id: 'c1',
        userId: 'u1',
      });
      mockPrismaService.contact.delete.mockResolvedValue({});
      await service.remove('u1', 'c1');
      expect(mockPrismaService.contact.delete).toHaveBeenCalledWith({
        where: { id: 'c1' },
      });
    });
  });

  describe('bulkDelete', () => {
    it('deletes contacts by ids', async () => {
      mockPrismaService.contact.deleteMany.mockResolvedValue({ count: 3 });
      const result = await service.bulkDelete('u1', {
        ids: ['c1', 'c2', 'c3'],
      });
      expect(result.deleted).toBe(3);
    });

    it('deletes all contacts when selectAll is true', async () => {
      mockPrismaService.contact.deleteMany.mockResolvedValue({ count: 10 });
      const result = await service.bulkDelete('u1', { selectAll: true });
      expect(result.deleted).toBe(10);
    });
  });

  describe('importCsv', () => {
    it('imports valid CSV rows', async () => {
      mockPrismaService.contact.upsert.mockResolvedValue({});
      const csv = 'name,number,tag\nBudi,081234567890,vip\nSiti,082345678901,';
      const result = await service.importCsv('u1', Buffer.from(csv));
      expect(result.imported).toBe(2);
      expect(result.skipped).toBe(0);
    });

    it('skips duplicate contacts', async () => {
      mockPrismaService.contact.upsert.mockRejectedValue({ code: 'P2002' });
      const csv = 'name,number,tag\nBudi,081234567890,';
      const result = await service.importCsv('u1', Buffer.from(csv));
      expect(result.skipped).toBe(1);
      expect(result.imported).toBe(0);
    });
  });

  describe('importFromGoogleContacts', () => {
    it('imports contacts from Google API response', async () => {
      mockedAxios.get = jest.fn().mockResolvedValue({
        data: {
          connections: [
            {
              names: [{ displayName: 'Budi' }],
              phoneNumbers: [{ value: '081234567890' }],
            },
          ],
          nextPageToken: undefined,
        },
      });
      mockPrismaService.contact.upsert.mockResolvedValue({});
      const result = await service.importFromGoogleContacts(
        'u1',
        'valid-token',
      );
      expect(result.imported).toBe(1);
    });

    it('throws BadRequestException on invalid token', async () => {
      mockedAxios.get = jest
        .fn()
        .mockRejectedValue(new Error('401 Unauthorized'));
      await expect(
        service.importFromGoogleContacts('u1', 'bad-token'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('exportCsv', () => {
    it('returns CSV string with headers', async () => {
      mockPrismaService.contact.findMany.mockResolvedValue([
        { name: 'Budi', number: '6281234567890', tag: 'vip' },
      ]);
      const csv = await service.exportCsv('u1');
      expect(csv).toContain('name,number,tag');
      expect(csv).toContain('Budi');
    });
  });
});
