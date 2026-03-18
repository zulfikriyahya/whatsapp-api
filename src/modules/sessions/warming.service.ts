import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "./session-manager.service";
import { SessionStatus } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

/**
 * FIX: WarmingService kini menggunakan interval random dari config
 * (warmingIntervalMinMs – warmingIntervalMaxMs), sesuai doc 1 "tiap ~5–10 menit".
 *
 * Sebelumnya: @Cron("*\/7 * * * *") → hardcoded 7 menit, tidak random.
 * Sesudahnya : setInterval dinamis dengan jitter random per siklus.
 */
@Injectable()
export class WarmingService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("WarmingService");
  private timer: NodeJS.Timeout | null = null;
  private minMs: number;
  private maxMs: number;

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
    private cfg: ConfigService,
  ) {}

  onModuleInit() {
    this.minMs =
      this.cfg.get<number>("whatsapp.warmingIntervalMinMs") ?? 300_000; // 5 menit
    this.maxMs =
      this.cfg.get<number>("whatsapp.warmingIntervalMaxMs") ?? 600_000; // 10 menit
    this.scheduleNext();
  }

  onModuleDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  private scheduleNext() {
    // Pilih delay random antara min dan max
    const delay = this.minMs + Math.random() * (this.maxMs - this.minMs);
    this.timer = setTimeout(async () => {
      await this.warmSessions();
      this.scheduleNext(); // jadwalkan ulang setelah selesai
    }, delay);
  }

  private async warmSessions() {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { status: SessionStatus.connected },
    });

    for (const s of sessions) {
      const client = this.manager.getClient(s.id);
      if (!client) continue;
      try {
        await client.sendPresenceAvailable();
        this.logger.debug(`Warmed session ${s.id}`);
      } catch (e) {
        this.logger.warn(`Warming failed for session ${s.id}: ${e.message}`);
      }
    }
  }
}
