import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { MessagesService } from "../../../src/modules/messages/messages.service";
import { mockPrismaService } from "../../mocks/prisma.mock";
import { mockRedisService } from "../../mocks/redis.mock";
import {
  mockSessionManagerService,
  mockWhatsappClient,
} from "../../mocks/whatsapp.mock";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { RedisService } from "../../../src/redis/redis.service";
import { SessionManagerService } from "../../../src/modules/sessions/session-manager.service";

describe("MessagesService", () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
      ],
    }).compile();
    service = module.get<MessagesService>(MessagesService);
    jest.clearAllMocks();
  });

  describe("send", () => {
    it("sends message using auto session", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([
        { id: "s1" },
      ]);
      mockRedisService.get.mockResolvedValue(0);
      mockRedisService.set.mockResolvedValue(undefined);
      mockSessionManagerService.getHealthySession.mockResolvedValue("s1");
      mockSessionManagerService.sendMessage.mockResolvedValue({
        id: { _serialized: "msg-1" },
      });
      mockPrismaService.messageLog.create.mockResolvedValue({});
      mockPrismaService.userQuota.updateMany.mockResolvedValue({});

      const result = await service.send("u1", {
        to: "08123456789",
        message: "Hello",
        sessionId: "auto",
      });
      expect(result.messageId).toBe("msg-1");
    });

    it("logs failed message on send error", async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue("s1");
      mockSessionManagerService.sendMessage.mockRejectedValue(
        new Error("Network error"),
      );
      mockPrismaService.messageLog.create.mockResolvedValue({});

      await expect(
        service.send("u1", {
          to: "08123456789",
          message: "Hello",
          sessionId: "auto",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws NO_SESSIONS when no healthy session", async () => {
      mockSessionManagerService.getHealthySession.mockResolvedValue(null);
      await expect(
        service.send("u1", { to: "08123456789", message: "Hello" }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("isRegisteredUser", () => {
    it("checks registered number", async () => {
      mockSessionManagerService.getClient.mockReturnValue(mockWhatsappClient);
      mockWhatsappClient.isRegisteredUser.mockResolvedValue(true);

      const result = await service.isRegisteredUser("u1", "s1", "08123456789");
      expect(result.isRegistered).toBe(true);
      expect(result.phone).toBe("628123456789");
    });
  });
});
