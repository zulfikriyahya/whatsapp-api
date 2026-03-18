import { Test, TestingModule } from "@nestjs/testing";
import { SessionManagerService } from "../../../src/modules/sessions/session-manager.service";
import { mockPrismaService } from "../../mocks/prisma.mock";
import { mockRedisService } from "../../mocks/redis.mock";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { RedisService } from "../../../src/redis/redis.service";
import { GatewayService } from "../../../src/gateway/gateway.service";
import { NotificationsService } from "../../../src/modules/notifications/notifications.service";
import { InboxService } from "../../../src/modules/inbox/inbox.service";
import { AutoReplyEngine } from "../../../src/modules/auto-reply/auto-reply.engine";
import { WorkflowEngine } from "../../../src/modules/workflow/workflow.engine";
import { WebhookService } from "../../../src/modules/webhook/webhook.service";
import { ConfigService } from "@nestjs/config";

describe("SessionManagerService", () => {
  let service: SessionManagerService;

  const stubs = {
    gateway: {
      emit: jest.fn(),
      emitQr: jest.fn(),
      emitCode: jest.fn(),
      emitConnectionUpdate: jest.fn(),
      emitNewMessage: jest.fn(),
      emitBroadcastProgress: jest.fn(),
      emitBroadcastComplete: jest.fn(),
      emitSystemAlert: jest.fn(),
    },
    notifications: { notifySessionDisconnected: jest.fn() },
    inbox: { saveIncoming: jest.fn().mockResolvedValue(undefined) },
    autoReply: { process: jest.fn().mockResolvedValue(undefined) },
    workflow: { process: jest.fn().mockResolvedValue(undefined) },
    webhook: { dispatch: jest.fn().mockResolvedValue(undefined) },
    config: {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === "whatsapp.maxReconnectRetries") return 10;
        if (key === "whatsapp.authPath") return "./storage/sessions";
        if (key === "whatsapp.headless") return true;
        return null;
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionManagerService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: GatewayService, useValue: stubs.gateway },
        { provide: NotificationsService, useValue: stubs.notifications },
        { provide: InboxService, useValue: stubs.inbox },
        { provide: AutoReplyEngine, useValue: stubs.autoReply },
        { provide: WorkflowEngine, useValue: stubs.workflow },
        { provide: WebhookService, useValue: stubs.webhook },
        { provide: ConfigService, useValue: stubs.config },
      ],
    }).compile();
    service = module.get<SessionManagerService>(SessionManagerService);
    jest.clearAllMocks();
  });

  describe("getClient", () => {
    it("returns null for unknown sessionId", () => {
      expect(service.getClient("unknown")).toBeNull();
    });
  });

  describe("getHealthySession", () => {
    it("returns session id via round robin", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([
        { id: "s1" },
        { id: "s2" },
      ]);
      mockRedisService.get.mockResolvedValue(0);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.getHealthySession("u1");
      expect(result).toBe("s1");
    });

    it("returns null when no sessions connected", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([]);
      const result = await service.getHealthySession("u1");
      expect(result).toBeNull();
    });
  });
});
