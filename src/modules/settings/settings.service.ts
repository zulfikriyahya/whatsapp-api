import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { UpdateGlobalSettingsDto } from "./dto/update-global-settings.dto";

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
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
}
