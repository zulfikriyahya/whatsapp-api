import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';

@Injectable()
export class CustomerNoteService {
  constructor(private prisma: PrismaService) {}

  async getNote(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return { contactId, notes: contact.notes };
  }

  async upsertNote(userId: string, contactId: string, content: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const updated = await this.prisma.contact.update({
      where: { id: contactId },
      data: { notes: content },
    });
    return { contactId, notes: updated.notes };
  }

  async deleteNote(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await this.prisma.contact.update({
      where: { id: contactId },
      data: { notes: null },
    });
    return { deleted: true };
  }
}
