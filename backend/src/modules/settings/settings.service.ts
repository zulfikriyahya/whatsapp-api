import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { GatewayService } from '../../gateway/gateway.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private gateway: GatewayService,
  ) {}

  async getUserSettings(userId: string) {
    const s = await this.prisma.userSetting.findUnique({ where: { userId } });
    return s
      ? {
          ...s,
          geminiApiKey: s.geminiApiKey
            ? `****${s.geminiApiKey.slice(-4)}`
            : null,
        }
      : null;
  }

  async updateUserSettings(userId: string, dto: UpdateSettingsDto) {
    const setting = await this.prisma.userSetting.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
    if (dto.geminiApiKey) this.ai.init(dto.geminiApiKey);
    return setting;
  }

  async getGlobalSettings() {
    const rows = await this.prisma.globalSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async updateGlobalSettings(dto: UpdateGlobalSettingsDto) {
    const entries = Object.entries(dto).filter(([_, v]) => v !== undefined);
    await Promise.all(
      entries.map(([key, value]) =>
        this.prisma.globalSetting.upsert({
          where: { key },
          create: { key, value: String(value) },
          update: { value: String(value) },
        }),
      ),
    );
    return this.getGlobalSettings();
  }

  async setMaintenanceMode(enabled: boolean) {
    await this.prisma.globalSetting.upsert({
      where: { key: 'maintenanceMode' },
      create: { key: 'maintenanceMode', value: String(enabled) },
      update: { value: String(enabled) },
    });
    return { maintenanceMode: enabled };
  }

  async isMaintenanceMode(): Promise<boolean> {
    const row = await this.prisma.globalSetting.findUnique({
      where: { key: 'maintenanceMode' },
    });
    return row?.value === 'true';
  }

  async broadcastAnnouncement(message: string, adminId: string) {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    for (const user of users) {
      this.gateway.emitSystemAlert(user.id, 'announcement', message);
    }
    return { sent: users.length };
  }
}
