import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { MaintenanceMiddleware } from '../../../src/common/middlewares/maintenance.middleware';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('MaintenanceMiddleware', () => {
  let middleware: MaintenanceMiddleware;
  let next: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceMiddleware,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    middleware = module.get<MaintenanceMiddleware>(MaintenanceMiddleware);
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('calls next when maintenance mode is off', async () => {
    mockPrismaService.globalSetting.findUnique.mockResolvedValue({
      key: 'maintenanceMode',
      value: 'false',
    });
    await middleware.use({} as any, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next when no maintenance setting exists', async () => {
    mockPrismaService.globalSetting.findUnique.mockResolvedValue(null);
    await middleware.use({} as any, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('throws ServiceUnavailableException for regular users when maintenance is on', async () => {
    mockPrismaService.globalSetting.findUnique.mockResolvedValue({
      key: 'maintenanceMode',
      value: 'true',
    });
    const req = { user: { role: 'user' } } as any;
    await expect(middleware.use(req, {} as any, next)).rejects.toThrow(
      ServiceUnavailableException,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next for admin users even when maintenance is on', async () => {
    mockPrismaService.globalSetting.findUnique.mockResolvedValue({
      key: 'maintenanceMode',
      value: 'true',
    });
    const req = { user: { role: 'admin' } } as any;
    await middleware.use(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next for super_admin users even when maintenance is on', async () => {
    mockPrismaService.globalSetting.findUnique.mockResolvedValue({
      key: 'maintenanceMode',
      value: 'true',
    });
    const req = { user: { role: 'super_admin' } } as any;
    await middleware.use(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('throws for unauthenticated requests when maintenance is on', async () => {
    mockPrismaService.globalSetting.findUnique.mockResolvedValue({
      key: 'maintenanceMode',
      value: 'true',
    });
    const req = { user: undefined } as any;
    await expect(middleware.use(req, {} as any, next)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
