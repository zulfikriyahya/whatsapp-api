import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class EmailService {
  private logger = new Logger("EmailService");

  async send(to: string, subject: string, body: string) {
    // TODO: Integrate with Nodemailer / SendGrid / Mailgun
    this.logger.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
  }
}
