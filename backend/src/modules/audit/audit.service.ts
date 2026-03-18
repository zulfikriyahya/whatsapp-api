import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generatePdf } from '../../common/utils/pdf-generator.util';
import { AuditAction } from '@prisma/client';

interface AuditLogInput {
  userId?: string;
  userEmail: string;
  action: AuditAction;
  details?: any;
  ip: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        userEmail: input.userEmail,
        action: input.action,
        details: input.details ?? {},
        ipAddress: input.ip,
        userAgent: input.userAgent,
      },
    });
  }

  async findAll(filters: {
    userId?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.from || filters.to) {
      where.timestamp = {};
      if (filters.from) where.timestamp.gte = filters.from;
      if (filters.to) where.timestamp.lte = filters.to;
    }
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportPdf(filters: {
    userId?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
  }): Promise<Buffer> {
    const result = await this.findAll({ ...filters, page: 1, limit: 1000 });
    const rows = result.data.map((r) => ({
      timestamp: new Date(r.timestamp).toLocaleString('id-ID'),
      email: r.userEmail,
      action: r.action,
      ip: r.ipAddress,
    }));
    return generatePdf('Audit Log', rows);
  }
}
