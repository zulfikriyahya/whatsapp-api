// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "../../prisma/prisma.service";
// import { AiService } from "../ai/ai.service";
// import { SessionManagerService } from "../sessions/session-manager.service";
// import { toJid } from "../../common/utils/phone-normalizer.util";
// import { MatchType } from "@prisma/client";

// @Injectable()
// export class AutoReplyEngine {
//   private logger = new Logger("AutoReplyEngine");

//   constructor(
//     private prisma: PrismaService,
//     private ai: AiService,
//     private manager: SessionManagerService,
//   ) {}

//   async process(userId: string, sessionId: string, from: string, text: string) {
//     if (!text?.trim()) return;

//     const rules = await this.prisma.autoReply.findMany({
//       where: { userId, isActive: true },
//       orderBy: [{ priority: "asc" }],
//     });

//     for (const rule of rules) {
//       const matched = this.matches(rule.matchType, rule.keyword, text);
//       if (!matched) continue;

//       let reply: string | null = null;

//       if (rule.matchType === MatchType.ai_smart) {
//         reply = await this.ai.getReply(userId, text, rule.response);
//       } else {
//         reply = rule.response;
//       }

//       if (!reply) continue;

//       try {
//         const jid = from.includes("@") ? from : toJid(from);
//         await this.manager.sendMessage(sessionId, jid, reply);
//         this.logger.debug(`Auto-reply sent to ${from} via rule ${rule.id}`);
//       } catch (e) {
//         this.logger.error(`Auto-reply send failed: ${e.message}`);
//       }
//       break; // Only one rule fires
//     }
//   }

//   private matches(type: MatchType, keyword: string, text: string): boolean {
//     const t = text.toLowerCase().trim();
//     const k = keyword.toLowerCase().trim();
//     switch (type) {
//       case MatchType.exact:
//         return t === k;
//       case MatchType.contains:
//         return t.includes(k);
//       case MatchType.regex:
//         try {
//           return new RegExp(keyword, "i").test(text);
//         } catch {
//           return false;
//         }
//       case MatchType.ai_smart:
//         return true; // Always try AI
//       default:
//         return false;
//     }
//   }
// }

import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { MatchType } from "@prisma/client";

@Injectable()
export class AutoReplyEngine {
  private logger = new Logger("AutoReplyEngine");

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    @Inject(forwardRef(() => SessionManagerService))
    private manager: SessionManagerService,
  ) {}

  async process(userId: string, sessionId: string, from: string, text: string) {
    if (!text?.trim()) return;

    const rules = await this.prisma.autoReply.findMany({
      where: { userId, isActive: true },
      orderBy: [{ priority: "asc" }],
    });

    for (const rule of rules) {
      const matched = this.matches(rule.matchType, rule.keyword, text);
      if (!matched) continue;

      let reply: string | null = null;

      if (rule.matchType === MatchType.ai_smart) {
        reply = await this.ai.getReply(userId, text, rule.response);
      } else {
        reply = rule.response;
      }

      if (!reply) continue;

      try {
        const jid = from.includes("@") ? from : toJid(from);
        await this.manager.sendMessage(sessionId, jid, reply);
        this.logger.debug(`Auto-reply sent to ${from} via rule ${rule.id}`);
      } catch (e) {
        this.logger.error(`Auto-reply send failed: ${e.message}`);
      }
      break;
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
