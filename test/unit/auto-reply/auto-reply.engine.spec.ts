import { Test, TestingModule } from "@nestjs/testing";
import { AutoReplyEngine } from "../../../src/modules/auto-reply/auto-reply.engine";
import { mockPrismaService } from "../../mocks/prisma.mock";
import { mockSessionManagerService } from "../../mocks/whatsapp.mock";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { SessionManagerService } from "../../../src/modules/sessions/session-manager.service";
import { AiService } from "../../../src/modules/ai/ai.service";

const mockAiService = { getReply: jest.fn() };

describe("AutoReplyEngine", () => {
  let engine: AutoReplyEngine;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoReplyEngine,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    engine = module.get<AutoReplyEngine>(AutoReplyEngine);
    jest.clearAllMocks();
  });

  it("replies on exact keyword match", async () => {
    mockPrismaService.autoReply.findMany.mockResolvedValue([
      {
        id: "r1",
        keyword: "halo",
        response: "Halo juga!",
        matchType: "exact",
        isActive: true,
        priority: 0,
      },
    ]);

    await engine.process("u1", "s1", "628111@s.whatsapp.net", "halo");
    expect(mockSessionManagerService.sendMessage).toHaveBeenCalledWith(
      "s1",
      "628111@s.whatsapp.net",
      "Halo juga!",
    );
  });

  it("replies on contains keyword match", async () => {
    mockPrismaService.autoReply.findMany.mockResolvedValue([
      {
        id: "r1",
        keyword: "promo",
        response: "Cek promo kami!",
        matchType: "contains",
        isActive: true,
        priority: 0,
      },
    ]);

    await engine.process(
      "u1",
      "s1",
      "628111@s.whatsapp.net",
      "ada promo apa hari ini?",
    );
    expect(mockSessionManagerService.sendMessage).toHaveBeenCalled();
  });

  it("does not reply if no rule matches", async () => {
    mockPrismaService.autoReply.findMany.mockResolvedValue([
      {
        id: "r1",
        keyword: "halo",
        response: "Halo!",
        matchType: "exact",
        isActive: true,
        priority: 0,
      },
    ]);

    await engine.process("u1", "s1", "628111@s.whatsapp.net", "selamat pagi");
    expect(mockSessionManagerService.sendMessage).not.toHaveBeenCalled();
  });

  it("only fires first matching rule (by priority)", async () => {
    mockPrismaService.autoReply.findMany.mockResolvedValue([
      {
        id: "r1",
        keyword: "hi",
        response: "Rule 1",
        matchType: "exact",
        isActive: true,
        priority: 0,
      },
      {
        id: "r2",
        keyword: "hi",
        response: "Rule 2",
        matchType: "exact",
        isActive: true,
        priority: 1,
      },
    ]);

    await engine.process("u1", "s1", "628111@s.whatsapp.net", "hi");
    expect(mockSessionManagerService.sendMessage).toHaveBeenCalledTimes(1);
    expect(mockSessionManagerService.sendMessage).toHaveBeenCalledWith(
      "s1",
      "628111@s.whatsapp.net",
      "Rule 1",
    );
  });
});
