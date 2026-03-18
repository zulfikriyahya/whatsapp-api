import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

/**
 * FIX: EmailService sebelumnya hanya stub kosong (// TODO).
 * Sekarang diimplementasi menggunakan Nodemailer dengan SMTP dari env.
 *
 * Env yang dibutuhkan (opsional — jika tidak ada, email di-skip dengan warning):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Install: npm install nodemailer @types/nodemailer
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private logger = new Logger("EmailService");
  private transporter: Transporter | null = null;
  private from: string;
  private enabled = false;

  constructor(private cfg: ConfigService) {}

  onModuleInit() {
    const host = this.cfg.get<string>("SMTP_HOST");
    const port = this.cfg.get<number>("SMTP_PORT") ?? 587;
    const user = this.cfg.get<string>("SMTP_USER");
    const pass = this.cfg.get<string>("SMTP_PASS");
    this.from = this.cfg.get<string>("SMTP_FROM") ?? "noreply@wagateway.app";

    if (!host || !user || !pass) {
      this.logger.warn(
        "EmailService: SMTP_HOST/SMTP_USER/SMTP_PASS tidak dikonfigurasi — notifikasi email dinonaktifkan.",
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    this.enabled = true;
    this.logger.log(`EmailService: SMTP terhubung ke ${host}:${port}`);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    if (!this.enabled || !this.transporter) {
      this.logger.debug(`[EMAIL SKIP] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html: this.wrapHtml(subject, body),
      });
      this.logger.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
    } catch (e) {
      this.logger.error(`[EMAIL FAILED] To: ${to} | ${e.message}`);
    }
  }

  private wrapHtml(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>${title}</title></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#075E54;padding:16px;border-radius:8px 8px 0 0;">
            <h2 style="color:#fff;margin:0;">WA Gateway</h2>
          </div>
          <div style="border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
            <h3>${title}</h3>
            <p style="color:#333;line-height:1.6;">${content}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="color:#999;font-size:12px;">
              Email ini dikirim otomatis oleh sistem WA Gateway. Jangan balas email ini.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
