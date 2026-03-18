import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, of } from "rxjs";

/**
 * SandboxInterceptor — jika request menggunakan API Key dengan isSandbox: true,
 * endpoint kirim pesan akan mengembalikan response sukses palsu tanpa
 * benar-benar mengirim ke WhatsApp.
 *
 * Dipasang di MessagesController dan BroadcastController.
 */
@Injectable()
export class SandboxInterceptor implements NestInterceptor {
  private readonly SANDBOX_PATHS = [
    "/messages/send",
    "/messages/send-media",
    "/messages/send-location",
    "/messages/send-live-location",
    "/messages/send-poll",
    "/messages/send-contact",
    "/messages/send-voice-note",
    "/broadcast",
  ];

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();

    // Hanya berlaku untuk API Key dengan isSandbox: true
    if (!req.user?.isSandbox) return next.handle();

    const url: string = req.url ?? "";
    const isSendEndpoint = this.SANDBOX_PATHS.some((p) => url.includes(p));

    if (isSendEndpoint && req.method === "POST") {
      return of({
        status: true,
        data: {
          messageId: `sandbox_${Date.now()}`,
          sandbox: true,
          note: "Pesan tidak dikirim. Token dalam mode sandbox.",
        },
      });
    }

    return next.handle();
  }
}
