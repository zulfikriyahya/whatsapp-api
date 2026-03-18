import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { MessageMedia } from "whatsapp-web.js";

@Injectable()
export class StatusService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async setStatus(sessionId: string, status: string) {
    return (this.client(sessionId) as any).setStatus(status);
  }

  async sendTextStatus(sessionId: string, text: string) {
    return (
      (this.client(sessionId) as any).sendStatus?.(text) ?? {
        sent: false,
        reason: "Not supported",
      }
    );
  }

  async setPresence(sessionId: string, available: boolean) {
    if (available) return this.client(sessionId).sendPresenceAvailable();
    return this.client(sessionId).sendPresenceUnavailable?.();
  }
}
