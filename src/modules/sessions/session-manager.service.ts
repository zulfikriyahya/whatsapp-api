import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { GatewayService } from "../../gateway/gateway.service";
import { NotificationsService } from "../notifications/notifications.service";
import { InboxService } from "../inbox/inbox.service";
import { AutoReplyEngine } from "../auto-reply/auto-reply.engine";
import { WorkflowEngine } from "../workflow/workflow.engine";
import { WebhookService } from "../webhook/webhook.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { SessionStatus } from "@prisma/client";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { Client, LocalAuth, Message, MessageMedia } from "whatsapp-web.js";
import * as path from "path";

@Injectable()
export class SessionManagerService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("SessionManagerService");
  private clients = new Map<string, Client>();
  private reconnectTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private gateway: GatewayService,
    private notifications: NotificationsService,
    private inbox: InboxService,
    private autoReply: AutoReplyEngine,
    private workflow: WorkflowEngine,
    private webhook: WebhookService,
    private cfg: ConfigService,
  ) {}

  async onModuleInit() {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { status: { not: SessionStatus.logged_out } },
    });
    for (const s of sessions) {
      await this.initClient(s.id, s.userId, s.authFolder).catch((e) =>
        this.logger.error(`Failed to restore session ${s.id}: ${e.message}`),
      );
    }
  }

  async onModuleDestroy() {
    for (const [id, client] of this.clients) {
      await client.destroy().catch(() => {});
    }
  }

  getClient(sessionId: string): Client | null {
    return this.clients.get(sessionId) ?? null;
  }

  async initClient(
    sessionId: string,
    userId: string,
    authFolder: string,
    usePairingCode = false,
    phoneNumber?: string,
  ) {
    if (this.clients.has(sessionId)) await this.destroyClient(sessionId);

    const authPath = this.cfg.get<string>("whatsapp.authPath");
    const headless = this.cfg.get<boolean>("whatsapp.headless");

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: sessionId, dataPath: authPath }),
      puppeteer: {
        headless,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    });

    this.clients.set(sessionId, client);
    this.setupClientEvents(client, sessionId, userId);

    await client.initialize();

    if (usePairingCode && phoneNumber) {
      const code = await client.requestPairingCode(phoneNumber);
      this.gateway.emitCode(userId, sessionId, code);
    }
  }

  private setupClientEvents(client: Client, sessionId: string, userId: string) {
    client.on("qr", (qr) => {
      this.gateway.emitQr(userId, sessionId, qr);
      this.updateStatus(sessionId, SessionStatus.authenticating);
    });

    client.on("ready", async () => {
      const info = client.info;
      const phone = info?.wid?.user;
      await this.prisma.whatsappSession.update({
        where: { id: sessionId },
        data: { status: SessionStatus.connected, phoneNumber: phone },
      });
      await this.redis.set(
        CacheKeys.sessionStatus(sessionId),
        SessionStatus.connected,
        3600,
      );
      this.gateway.emitConnectionUpdate(userId, sessionId, "connected", phone);
      this.clearReconnectTimer(sessionId);
      this.logger.log(`Session ${sessionId} connected (${phone})`);
    });

    client.on("authenticated", () => {
      this.updateStatus(sessionId, SessionStatus.authenticating);
      this.gateway.emitConnectionUpdate(userId, sessionId, "authenticating");
    });

    client.on("auth_failure", async () => {
      await this.updateStatus(sessionId, SessionStatus.logged_out);
      this.gateway.emitConnectionUpdate(userId, sessionId, "logged_out");
      this.clients.delete(sessionId);
    });

    client.on("disconnected", async (reason) => {
      this.logger.warn(`Session ${sessionId} disconnected: ${reason}`);
      await this.updateStatus(sessionId, SessionStatus.disconnected);
      this.gateway.emitConnectionUpdate(userId, sessionId, "disconnected");

      const session = await this.prisma.whatsappSession.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });
      if (session)
        this.notifications.notifySessionDisconnected(
          userId,
          session.user.email,
          session.sessionName,
        );

      if (reason === "LOGOUT") {
        await this.updateStatus(sessionId, SessionStatus.logged_out);
        this.clients.delete(sessionId);
        return;
      }

      this.scheduleReconnect(
        sessionId,
        userId,
        client["options"]?.authStrategy?.dataPath ?? "",
        0,
      );
    });

    client.on("message", async (msg: Message) => {
      if (msg.fromMe) return;
      await this.handleIncomingMessage(msg, sessionId, userId);
    });

    client.on("message_ack", (msg, ack) => {
      const readStatus = ack === 2 ? "delivered" : ack === 3 ? "read" : "sent";
      this.gateway.emit(userId, "message_ack", {
        sessionId,
        msgId: msg.id._serialized,
        ack: readStatus,
      });
    });

    client.on("group_join", (n) =>
      this.gateway.emit(userId, "group_join", { sessionId, notification: n }),
    );
    client.on("group_leave", (n) =>
      this.gateway.emit(userId, "group_leave", { sessionId, notification: n }),
    );
    client.on("call", (call) =>
      this.gateway.emit(userId, "incoming_call", { sessionId, call }),
    );
  }

  private async handleIncomingMessage(
    msg: Message,
    sessionId: string,
    userId: string,
  ) {
    const text = msg.body ?? "";
    const from = msg.from;

    await this.inbox.saveIncoming({
      id: msg.id._serialized,
      userId,
      sessionId,
      remoteJid: from,
      pushName: msg["_data"]?.notifyName ?? "",
      messageContent: text,
      messageType: msg.type,
    });

    this.gateway.emitNewMessage(userId, {
      id: msg.id._serialized,
      from,
      body: text,
      type: msg.type,
      sessionId,
    });

    await this.webhook.dispatch(userId, "new_message", {
      session: sessionId,
      from,
      text,
      type: msg.type,
      timestamp: msg.timestamp,
    });

    if (text) {
      await this.autoReply
        .process(userId, sessionId, from, text)
        .catch(() => {});
      await this.workflow
        .process(userId, sessionId, from, text)
        .catch(() => {});
    }
  }

  private scheduleReconnect(
    sessionId: string,
    userId: string,
    authFolder: string,
    attempt: number,
  ) {
    const maxRetries = this.cfg.get<number>("whatsapp.maxReconnectRetries");
    if (attempt >= maxRetries) {
      this.logger.warn(`Session ${sessionId} max reconnect attempts reached`);
      return;
    }
    const delay = Math.min(1000 * Math.pow(2, attempt), 60000);
    const timer = setTimeout(async () => {
      this.logger.log(
        `Reconnecting session ${sessionId} (attempt ${attempt + 1})`,
      );
      await this.initClient(sessionId, userId, authFolder).catch(() => {
        this.scheduleReconnect(sessionId, userId, authFolder, attempt + 1);
      });
    }, delay);
    this.reconnectTimers.set(sessionId, timer);
  }

  private clearReconnectTimer(sessionId: string) {
    const t = this.reconnectTimers.get(sessionId);
    if (t) {
      clearTimeout(t);
      this.reconnectTimers.delete(sessionId);
    }
  }

  private async destroyClient(sessionId: string) {
    const client = this.clients.get(sessionId);
    if (client) {
      await client.destroy().catch(() => {});
      this.clients.delete(sessionId);
    }
    this.clearReconnectTimer(sessionId);
  }

  private async updateStatus(sessionId: string, status: SessionStatus) {
    await this.prisma.whatsappSession
      .update({ where: { id: sessionId }, data: { status } })
      .catch(() => {});
    await this.redis.set(CacheKeys.sessionStatus(sessionId), status, 3600);
  }

  async sendMessage(
    sessionId: string,
    jid: string,
    content: string,
    options?: any,
  ): Promise<any> {
    const client = this.clients.get(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return client.sendMessage(jid, content, options);
  }

  async sendMedia(
    sessionId: string,
    jid: string,
    media: MessageMedia,
    caption?: string,
  ): Promise<any> {
    const client = this.clients.get(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return client.sendMessage(jid, media, { caption });
  }

  async getHealthySession(userId: string): Promise<string | null> {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { userId, status: SessionStatus.connected },
    });
    if (!sessions.length) return null;

    const rrKey = CacheKeys.roundRobin(userId);
    let idx = (await this.redis.get<number>(rrKey)) ?? 0;
    const session = sessions[idx % sessions.length];
    await this.redis.set(rrKey, (idx + 1) % sessions.length, 86400);
    return session.id;
  }

  getConnectedSessions(userId: string): string[] {
    return [...this.clients.entries()]
      .filter(([id]) =>
        this.prisma.whatsappSession.findFirst({
          where: { id, userId, status: SessionStatus.connected },
        }),
      )
      .map(([id]) => id);
  }
}
