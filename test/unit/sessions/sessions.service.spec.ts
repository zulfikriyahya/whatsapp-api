import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { SessionsService } from "../../../src/modules/sessions/sessions.service";
import { mockPrismaService } from "../../mocks/prisma.mock";
import { mockSessionManagerService } from "../../mocks/whatsapp.mock";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { SessionManagerService } from "../../../src/modules/sessions/session-manager.service";
import { AuditService } from "../../../src/modules/audit/audit.service";
import { ConfigService } from "@nestjs/config";

const mockAuditService = { log: jest.fn().mockResolvedValue(undefined) };
const mockConfigService = {
  get: jest.fn().mockReturnValue("./storage/sessions"),
};

describe("SessionsService", () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<SessionsService>(SessionsService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns user sessions", async () => {
      mockPrismaService.whatsappSession.findMany.mockResolvedValue([
        { id: "s1", sessionName: "CS-1" },
      ]);
      const result = await service.findAll("u1");
      expect(result).toHaveLength(1);
      expect(mockPrismaService.whatsappSession.findMany).toHaveBeenCalledWith({
        where: { userId: "u1" },
        orderBy: { createdAt: "asc" },
      });
    });
  });

  describe("create", () => {
    it("creates session successfully", async () => {
      mockPrismaService.whatsappSession.findUnique.mockResolvedValue(null);
      mockPrismaService.whatsappSession.create.mockResolvedValue({
        id: "s1",
        sessionName: "CS-1",
      });

      const result = await service.create(
        "u1",
        "admin@test.com",
        { name: "CS-1" },
        "127.0.0.1",
        "jest",
      );
      expect(result.sessionName).toBe("CS-1");
      expect(mockSessionManagerService.initClient).toHaveBeenCalled();
    });

    it("throws ConflictException on duplicate session name", async () => {
      mockPrismaService.whatsappSession.findUnique.mockResolvedValue({
        id: "existing",
      });
      await expect(
        service.create(
          "u1",
          "admin@test.com",
          { name: "CS-1" },
          "127.0.0.1",
          "jest",
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("delete", () => {
    it("deletes session and cleans up", async () => {
      mockPrismaService.whatsappSession.findFirst.mockResolvedValue({
        id: "s1",
        authFolder: "session_u1_CS-1",
      });
      mockPrismaService.whatsappSession.delete.mockResolvedValue({});

      await service.delete("u1", "admin@test.com", "s1", "127.0.0.1", "jest");
      expect(mockPrismaService.whatsappSession.delete).toHaveBeenCalledWith({
        where: { id: "s1" },
      });
    });

    it("throws NotFoundException if session not owned", async () => {
      mockPrismaService.whatsappSession.findFirst.mockResolvedValue(null);
      await expect(
        service.delete("u1", "admin@test.com", "s999", "127.0.0.1", "jest"),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
