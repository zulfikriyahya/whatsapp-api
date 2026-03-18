import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "./session-manager.service";
import { SessionStatus } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WarmingService {
  private logger = new Logger("WarmingService");

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
    private cfg: ConfigService,
  ) {}

  @Cron("*/7 * * * *")
  async warmSessions() {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { status: SessionStatus.connected },
    });
    for (const s of sessions) {
      const client = this.manager.getClient(s.id);
      if (!client) continue;
      try {
        await client.sendPresenceAvailable();
      } catch (e) {
        this.logger.warn(`Warming failed for session ${s.id}: ${e.message}`);
      }
    }
  }
}
