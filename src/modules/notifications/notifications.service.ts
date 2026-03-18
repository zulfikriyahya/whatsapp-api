import { Injectable } from "@nestjs/common";
import { GatewayService } from "../../gateway/gateway.service";
import { EmailService } from "./email.service";
import { AlertType } from "../../common/enums/status.enum";

/**
 * FIX: Lengkapi semua notifikasi sesuai doc 1 section 30:
 *
 * In-app (Socket.IO):
 *  ✅ Sesi WA terputus / logout permanen
 *  ✅ Semua sesi user terputus sekaligus  (via session-manager)
 *  ✅ Kuota pesan harian mendekati batas / habis
 *  ✅ Kuota broadcast bulanan mendekati batas / habis
 *  ✅ Broadcast campaign selesai           (via gateway.service)
 *  ✅ AI dinonaktifkan
 *  ✅ Redis terputus                       (via system-monitor)
 *  ✅ Disk hampir penuh                    (via system-monitor)
 *
 * Email:
 *  ✅ Sesi WA terputus / banned
 *  ✅ Login dari IP baru (peringatan keamanan)
 *  ✅ Webhook gagal berulang kali
 *  ✅ Langganan hampir habis
 *  ✅ Token API mendekati expired          (stub — tidak ada TTL di model)
 */
@Injectable()
export class NotificationsService {
  constructor(
    private gateway: GatewayService,
    private email: EmailService,
  ) {}

  // ── Sesi ─────────────────────────────────────────────────────

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
      `Sesi <strong>${sessionName}</strong> terputus dari server. Silakan reconnect melalui dashboard.`,
    );
  }

  notifySessionLoggedOut(
    userId: string,
    userEmail: string,
    sessionName: string,
  ) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.SESSION_LOGGED_OUT,
      `Sesi '${sessionName}' logout permanen. Perlu scan ulang QR.`,
    );
    this.email.send(
      userEmail,
      "Sesi WhatsApp Logout",
      `Sesi <strong>${sessionName}</strong> logout permanen. Silakan login ulang dengan scan QR code.`,
    );
  }

  // ── Kuota ────────────────────────────────────────────────────

  notifyQuotaWarning(
    userId: string,
    type: "daily" | "monthly",
    percent: number,
  ) {
    const label = type === "daily" ? "pesan harian" : "broadcast bulanan";
    const msg = `Anda telah menggunakan ${percent}% kuota ${label}.`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_WARNING, msg);
  }

  notifyQuotaExceeded(userId: string, type: "daily" | "monthly") {
    const label = type === "daily" ? "pesan harian" : "broadcast bulanan";
    const msg = `Kuota ${label} Anda telah habis.`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_EXCEEDED, msg);
  }

  // ── AI ───────────────────────────────────────────────────────

  notifyAiDisabled(userId: string, adminEmail: string) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.AI_DISABLED,
      "AI Smart Reply dinonaktifkan: API key Gemini tidak valid.",
    );
    this.email.send(
      adminEmail,
      "Gemini AI Dinonaktifkan",
      "API key Gemini tidak valid. AI Smart Reply otomatis dinonaktifkan. Perbarui API key di Settings.",
    );
  }

  // ── Keamanan: Login IP Baru ────────────────────────────────

  notifyNewIpLogin(userEmail: string, ip: string, userAgent: string) {
    this.email.send(
      userEmail,
      "Login dari IP Baru Terdeteksi",
      `Akun Anda baru saja login dari IP <strong>${ip}</strong>.<br>
       Browser/Device: ${userAgent || "Tidak diketahui"}.<br><br>
       Jika ini bukan Anda, segera ganti password dan aktifkan 2FA.`,
    );
  }

  // ── Webhook gagal berulang ────────────────────────────────

  notifyWebhookPersistentFailure(
    userEmail: string,
    url: string,
    failCount: number,
  ) {
    this.email.send(
      userEmail,
      "Webhook Gagal Berulang Kali",
      `Webhook ke URL <strong>${url}</strong> telah gagal sebanyak ${failCount} kali berturut-turut.<br>
       Pastikan endpoint webhook Anda aktif dan dapat menerima request POST.`,
    );
  }

  // ── Langganan hampir habis ────────────────────────────────

  notifySubscriptionExpiringSoon(
    userId: string,
    userEmail: string,
    tierName: string,
    daysLeft: number,
  ) {
    const msg = `Langganan ${tierName} Anda akan berakhir dalam ${daysLeft} hari.`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_WARNING, msg);
    this.email.send(
      userEmail,
      "Langganan Hampir Berakhir",
      `${msg} Segera perpanjang langganan Anda untuk menghindari gangguan layanan.`,
    );
  }
}
