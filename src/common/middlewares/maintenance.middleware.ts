import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const row = await this.prisma.globalSetting.findUnique({
      where: { key: 'maintenanceMode' },
    });

    if (row?.value !== 'true') {
      return next();
    }

    const user = (req as any).user;
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    if (isAdmin) {
      return next();
    }

    throw new ServiceUnavailableException({
      status: false,
      error:
        'Server sedang dalam maintenance. Silakan coba beberapa saat lagi.',
      code: 'ERR_MAINTENANCE',
    });
  }
}
