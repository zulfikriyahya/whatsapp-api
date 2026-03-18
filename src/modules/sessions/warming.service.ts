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
      this.cfg.get<number>("whatsapp.warmingIntervalMinMs") ?? 300_000;
    this.maxMs =
      this.cfg.get<number>("whatsapp.warmingIntervalMaxMs") ?? 600_000;
    this.scheduleNext();
    this.logger.log(
      `WarmingService started (${this.minMs / 1000}s – ${this.maxMs / 1000}s)`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  private scheduleNext() {
    const delay = this.minMs + Math.random() * (this.maxMs - this.minMs);
    this.timer = setTimeout(async () => {
      await this.warmSessions();
      this.scheduleNext();
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
        // FIX: optional chaining — sendPresenceAvailable mungkin tidak ada
        // di semua versi whatsapp-web.js
        if (typeof (client as any).sendPresenceAvailable === "function") {
          await (client as any).sendPresenceAvailable();
        } else {
          // Fallback: kirim typing indicator sebagai tanda aktif
          this.logger.debug(
            `Session ${s.id}: sendPresenceAvailable not available, skipping`,
          );
        }
      } catch (e) {
        this.logger.warn(`Warming failed for session ${s.id}: ${e.message}`);
      }
    }
  }
}
