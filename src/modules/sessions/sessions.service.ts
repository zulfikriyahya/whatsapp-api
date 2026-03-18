import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { SessionManagerService } from "./session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { AuditAction, SessionStatus } from "@prisma/client";
import { CreateSessionDto } from "./dto/create-session.dto";
import * as path from "path";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
    private audit: AuditService,
    private cfg: ConfigService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.whatsappSession.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(
    userId: string,
    email: string,
    dto: CreateSessionDto,
    ip: string,
    ua: string,
  ) {
    const existing = await this.prisma.whatsappSession.findUnique({
      where: { userId_sessionName: { userId, sessionName: dto.name } },
    });
    if (existing)
      throw new ConflictException({ code: ErrorCodes.DUPLICATE_SESSION_NAME });

    const authFolder = `session_${userId}_${dto.name}`;
    const session = await this.prisma.whatsappSession.create({
      data: {
        userId,
        sessionName: dto.name,
        authFolder,
        status: SessionStatus.disconnected,
      },
    });

    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.CREATE_SESSION,
      details: { sessionId: session.id },
      ip,
      userAgent: ua,
    });

    await this.manager.initClient(
      session.id,
      userId,
      authFolder,
      dto.usePairingCode,
      dto.phoneNumber,
    );
    return session;
  }

  async reconnect(userId: string, sessionId: string, ip: string, ua: string) {
    const session = await this.findOwned(userId, sessionId);
    if (session.status === SessionStatus.logged_out)
      throw new BadRequestException({ code: ErrorCodes.SESSION_LOGGED_OUT });
    await this.manager.initClient(session.id, userId, session.authFolder);
    await this.audit.log({
      userId,
      userEmail: "",
      action: AuditAction.RECONNECT_SESSION,
      details: { sessionId },
      ip,
      userAgent: ua,
    });
    return { message: "Reconnecting..." };
  }

  async delete(
    userId: string,
    email: string,
    sessionId: string,
    ip: string,
    ua: string,
  ) {
    const session = await this.findOwned(userId, sessionId);
    const client = this.manager.getClient(sessionId);
    if (client) await client.destroy().catch(() => {});

    const authPath = this.cfg.get<string>("whatsapp.authPath");
    const folder = path.join(authPath, session.authFolder);
    if (fs.existsSync(folder))
      fs.rmSync(folder, { recursive: true, force: true });

    await this.prisma.whatsappSession.delete({ where: { id: sessionId } });
    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.DELETE_SESSION,
      details: { sessionId },
      ip,
      userAgent: ua,
    });
  }

  async setDefault(userId: string, sessionId: string) {
    await this.findOwned(userId, sessionId);
    await this.prisma.whatsappSession.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    return this.prisma.whatsappSession.update({
      where: { id: sessionId },
      data: { isDefault: true },
    });
  }

  async getInfo(userId: string, sessionId: string) {
    await this.findOwned(userId, sessionId);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const [state, version] = await Promise.all([
      client.getState(),
      client.getWWebVersion(),
    ]);
    return { state, version, info: client.info };
  }

  private async findOwned(userId: string, sessionId: string) {
    const s = await this.prisma.whatsappSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!s) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return s;
  }
}
