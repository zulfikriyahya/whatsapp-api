import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { getQueueToken } from "@nestjs/bullmq";
import { BroadcastService } from "../../../src/modules/broadcast/broadcast.service";
import { mockPrismaService } from "../../mocks/prisma.mock";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { QueueNames } from "../../../src/common/constants/queue-names.constant";

const mockBroadcastQueue = {
  add: jest.fn().mockResolvedValue({ id: "job-1" }),
  getJobs: jest.fn().mockResolvedValue([]),
};

describe("BroadcastService", () => {
  let service: BroadcastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: getQueueToken(QueueNames.BROADCAST),
          useValue: mockBroadcastQueue,
        },
      ],
    }).compile();
    service = module.get<BroadcastService>(BroadcastService);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates campaign and enqueues job", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([
        { id: "s1", status: "connected" },
      ]);
      mockPrismaService.campaign.create.mockResolvedValue({
        id: "c1",
        name: "Test",
        status: "pending",
      });

      const result = await service.create("u1", {
        name: "Test",
        message: "Hello",
        recipients: ["08123456789"],
      });
      expect(result.id).toBe("c1");
      expect(mockBroadcastQueue.add).toHaveBeenCalledWith(
        "send",
        expect.objectContaining({ campaignId: "c1" }),
      );
    });

    it("throws NO_SESSIONS when no connected sessions", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([]);
      await expect(
        service.create("u1", {
          name: "T",
          message: "H",
          recipients: ["08123456789"],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws NO_RECIPIENTS when recipient list is empty", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([
        { id: "s1" },
      ]);
      await expect(
        service.create("u1", { name: "T", message: "H", recipients: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it("deduplicates recipients", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([
        { id: "s1" },
      ]);
      mockPrismaService.campaign.create.mockResolvedValue({
        id: "c1",
        name: "T",
        totalRecipients: 1,
      });

      await service.create("u1", {
        name: "T",
        message: "H",
        recipients: ["08123456789", "08123456789", "628123456789"],
      });
      expect(mockPrismaService.campaign.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ totalRecipients: 1 }),
        }),
      );
    });
  });

  describe("cancel", () => {
    it("cancels pending campaign", async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue({
        id: "c1",
        status: "pending",
      });
      mockPrismaService.campaign.update.mockResolvedValue({
        id: "c1",
        status: "cancelled",
      });

      const result = await service.cancel("u1", "c1");
      expect(result.status).toBe("cancelled");
    });

    it("throws if campaign already completed", async () => {
      mockPrismaService.campaign.findFirst.mockResolvedValue({
        id: "c1",
        status: "completed",
      });
      await expect(service.cancel("u1", "c1")).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
