import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { normalizePhone } from '../../common/utils/phone-normalizer.util';
import { parseCsvContacts } from '../../common/utils/csv-parser.util';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { QueryContactsDto } from './dto/query-contacts.dto';
import { BulkDeleteContactsDto } from './dto/bulk-delete-contacts.dto';
import axios from 'axios';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, dto: QueryContactsDto) {
    const where: any = { userId };
    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search } },
        { number: { contains: dto.search } },
        { tag: { contains: dto.search } },
      ];
    }
    if (dto.tag) where.tag = dto.tag;
    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.contact.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async create(userId: string, dto: CreateContactDto) {
    const number = normalizePhone(dto.number);
    const exists = await this.prisma.contact.findFirst({
      where: { userId, number },
    });
    if (exists)
      throw new ConflictException({ code: ErrorCodes.DUPLICATE_CONTACT });
    return this.prisma.contact.create({
      data: { userId, name: dto.name, number, tag: dto.tag },
    });
  }

  async update(userId: string, id: string, dto: UpdateContactDto) {
    await this.findOwned(userId, id);
    const data: any = { name: dto.name, tag: dto.tag };
    if (dto.number) {
      data.number = normalizePhone(dto.number);
      const exists = await this.prisma.contact.findFirst({
        where: { userId, number: data.number, NOT: { id } },
      });
      if (exists)
        throw new ConflictException({ code: ErrorCodes.DUPLICATE_CONTACT });
    }
    return this.prisma.contact.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.contact.delete({ where: { id } });
  }

  async bulkDelete(userId: string, dto: BulkDeleteContactsDto) {
    let where: any = { userId };
    if (dto.ids?.length) {
      where.id = { in: dto.ids };
    } else if (dto.selectAll) {
      if (dto.search)
        where.OR = [
          { name: { contains: dto.search } },
          { number: { contains: dto.search } },
        ];
      if (dto.filterTag) where.tag = dto.filterTag;
    }
    const { count } = await this.prisma.contact.deleteMany({ where });
    return { deleted: count };
  }

  async importCsv(userId: string, buffer: Buffer) {
    const rows = parseCsvContacts(buffer.toString('utf-8'));
    let imported = 0,
      skipped = 0;
    const errors: any[] = [];
    for (const row of rows) {
      try {
        const number = normalizePhone(row.number);
        await this.prisma.contact.upsert({
          where: { userId_number: { userId, number } },
          create: { userId, name: row.name, number, tag: row.tag },
          update: {},
        });
        imported++;
      } catch (e) {
        if (e.code === 'P2002') {
          skipped++;
        } else {
          errors.push({ number: row.number, reason: e.message });
        }
      }
    }
    return { imported, skipped, errors };
  }

  async importFromGoogleContacts(userId: string, accessToken: string) {
    let imported = 0,
      skipped = 0;
    const errors: any[] = [];
    let pageToken: string | undefined;

    do {
      const params: any = {
        personFields: 'names,phoneNumbers',
        pageSize: 100,
      };
      if (pageToken) params.pageToken = pageToken;

      const res = await axios
        .get('https://people.googleapis.com/v1/people/me/connections', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params,
        })
        .catch((e) => {
          throw new BadRequestException({
            code: ErrorCodes.INVALID_GOOGLE_TOKEN,
            message: e.message,
          });
        });

      const connections = res.data.connections ?? [];
      pageToken = res.data.nextPageToken;

      for (const person of connections) {
        const name = person.names?.[0]?.displayName ?? '';
        const phones = person.phoneNumbers ?? [];
        for (const phone of phones) {
          try {
            const number = normalizePhone(phone.value);
            await this.prisma.contact.upsert({
              where: { userId_number: { userId, number } },
              create: { userId, name, number },
              update: {},
            });
            imported++;
          } catch (e) {
            if (e.code === 'P2002') {
              skipped++;
            } else {
              errors.push({ name, phone: phone.value, reason: e.message });
            }
          }
        }
      }
    } while (pageToken);

    return { imported, skipped, errors };
  }

  async exportCsv(userId: string): Promise<string> {
    const contacts = await this.prisma.contact.findMany({ where: { userId } });
    const header = 'name,number,tag\n';
    const rows = contacts
      .map((c) => `"${c.name}","${c.number}","${c.tag ?? ''}"`)
      .join('\n');
    return header + rows;
  }

  private async findOwned(userId: string, id: string) {
    const c = await this.prisma.contact.findFirst({ where: { id, userId } });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return c;
  }
}
