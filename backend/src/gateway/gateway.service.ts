import { Injectable } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { SocketEvents } from "../common/constants/event-names.constant";

@Injectable()
export class GatewayService {
  constructor(private gateway: AppGateway) {}

  emit(userId: string, event: string, payload: any) {
    this.gateway.server.to(userId).emit(event, payload);
  }

  emitQr(userId: string, sessionId: string, qr: string) {
    this.emit(userId, SocketEvents.QR, { sessionId, qr });
  }

  emitCode(userId: string, sessionId: string, code: string) {
    this.emit(userId, SocketEvents.CODE, { sessionId, code });
  }

  emitConnectionUpdate(
    userId: string,
    sessionId: string,
    status: string,
    phoneNumber?: string,
  ) {
    this.emit(userId, SocketEvents.CONNECTION_UPDATE, {
      sessionId,
      status,
      phoneNumber,
    });
  }

  emitNewMessage(userId: string, message: any) {
    this.emit(userId, SocketEvents.NEW_MESSAGE, { message });
  }

  emitBroadcastProgress(
    userId: string,
    payload: {
      campaignId: string;
      current: number;
      total: number;
      percentage: number;
      successCount: number;
      failedCount: number;
    },
  ) {
    this.emit(userId, SocketEvents.BROADCAST_PROGRESS, payload);
  }

  emitBroadcastComplete(
    userId: string,
    campaignId: string,
    successCount: number,
    failedCount: number,
  ) {
    this.emit(userId, SocketEvents.BROADCAST_COMPLETE, {
      campaignId,
      successCount,
      failedCount,
    });
  }

  emitSystemAlert(userId: string, type: string, message: string, data?: any) {
    this.emit(userId, SocketEvents.SYSTEM_ALERT, { type, message, data });
  }
}
