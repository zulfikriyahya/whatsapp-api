import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { RedisService } from "../../redis/redis.service";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { MatchType } from "@prisma/client";

// Jeda minimum antar auto-reply ke JID yang sama (detik)
const LOOP_PROTECTION_TTL = 30;

@Injectable()
export class AutoReplyEngine {
  private logger = new Logger("AutoReplyEngine");

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private redis: RedisService,
    @Inject(forwardRef(() => SessionManagerService))
    private manager: SessionManagerService,
  ) {}

  async process(userId: string, sessionId: string, from: string, text: string) {
    if (!text?.trim()) return;

    // FIX: Proteksi loop — skip jika kita baru saja membalas JID ini
    const loopKey = `autoreply:loop:${userId}:${from}`;
    const recentlyReplied = await this.redis.get<boolean>(loopKey);
    if (recentlyReplied) {
      this.logger.debug(`Loop protection: skip auto-reply to ${from}`);
      return;
    }

    // FIX: Skip pesan dari nomor yang sama dengan sesi aktif (fromMe via inbox)
    // whatsapp-web.js sudah filter fromMe=false di session-manager, tapi
    // ada kasus sesi kirim ke dirinya sendiri — cek phoneNumber sesi
    const session = await this.prisma.whatsappSession.findUnique({
      where: { id: sessionId },
    });
    if (session?.phoneNumber) {
      const fromNumber = from.split("@")[0];
      if (fromNumber === session.phoneNumber) {
        this.logger.debug(
          `Skip auto-reply: message from own number ${fromNumber}`,
        );
        return;
      }
    }

    const rules = await this.prisma.autoReply.findMany({
      where: { userId, isActive: true },
      orderBy: [{ priority: "asc" }],
    });

    for (const rule of rules) {
      const matched = this.matches(rule.matchType, rule.keyword, text);
      if (!matched) continue;

      let reply: string | null = null;

      if (rule.matchType === MatchType.ai_smart) {
        try {
          reply = await this.ai.getReply(userId, text, rule.response);
        } catch {
          continue; // skip rule ini jika AI tidak tersedia
        }
      } else {
        reply = rule.response;
      }

      if (!reply) continue;

      try {
        const jid = from.includes("@") ? from : toJid(from);
        await this.manager.sendMessage(sessionId, jid, reply);
        this.logger.debug(`Auto-reply sent to ${from} via rule ${rule.id}`);

        // FIX: Set loop protection — hindari balas lagi dalam 30 detik
        await this.redis.set(loopKey, true, LOOP_PROTECTION_TTL);
      } catch (e) {
        this.logger.error(`Auto-reply send failed: ${e.message}`);
      }
      break; // hanya satu rule yang dieksekusi
    }
  }

  private matches(type: MatchType, keyword: string, text: string): boolean {
    const t = text.toLowerCase().trim();
    const k = keyword.toLowerCase().trim();
    switch (type) {
      case MatchType.exact:
        return t === k;
      case MatchType.contains:
        return t.includes(k);
      case MatchType.regex:
        try {
          return new RegExp(keyword, "i").test(text);
        } catch {
          return false;
        }
      case MatchType.ai_smart:
        return true;
      default:
        return false;
    }
  }
}
