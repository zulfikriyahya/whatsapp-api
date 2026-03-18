import { Injectable } from "@nestjs/common";
import { GatewayService } from "../../gateway/gateway.service";
import { EmailService } from "./email.service";
import { AlertType } from "../../common/enums/status.enum";

@Injectable()
export class NotificationsService {
  constructor(
    private gateway: GatewayService,
    private email: EmailService,
  ) {}

  notifySessionDisconnected(
    userId: string,
    userEmail: string,
    sessionName: string,
  ) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.SESSION_DISCONNECTED,
      `Sesi '${sessionName}' terputus.`,
    );
    this.email.send(
      userEmail,
      "Sesi WhatsApp Terputus",
      `Sesi ${sessionName} terputus dari server.`,
    );
  }

  notifyQuotaWarning(
    userId: string,
    type: "daily" | "monthly",
    percent: number,
  ) {
    const msg =
      type === "daily"
        ? `Anda telah menggunakan ${percent}% kuota pesan harian`
        : `Anda telah menggunakan ${percent}% kuota broadcast bulanan`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_WARNING, msg);
  }

  notifyQuotaExceeded(userId: string, type: "daily" | "monthly") {
    const msg =
      type === "daily"
        ? "Kuota pesan harian habis."
        : "Kuota broadcast bulanan habis.";
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_EXCEEDED, msg);
  }

  notifyAiDisabled(userId: string, adminEmail: string) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.AI_DISABLED,
      "AI Smart Reply dinonaktifkan: API key tidak valid.",
    );
    this.email.send(
      adminEmail,
      "Gemini AI Disabled",
      "API key Gemini tidak valid, AI Smart Reply dinonaktifkan.",
    );
  }
}
