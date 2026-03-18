import { Test, TestingModule } from "@nestjs/testing";
import { WorkflowEngine } from "../../../src/modules/workflow/workflow.engine";
import { WorkflowService } from "../../../src/modules/workflow/workflow.service";
import { mockPrismaService } from "../../mocks/prisma.mock";
import { mockSessionManagerService } from "../../mocks/whatsapp.mock";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { SessionManagerService } from "../../../src/modules/sessions/session-manager.service";

const mockWorkflowService = { getActive: jest.fn() };

describe("WorkflowEngine", () => {
  let engine: WorkflowEngine;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowEngine,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SessionManagerService, useValue: mockSessionManagerService },
        { provide: WorkflowService, useValue: mockWorkflowService },
      ],
    }).compile();
    engine = module.get<WorkflowEngine>(WorkflowEngine);
    jest.clearAllMocks();
  });

  it("fires send_message node on exact match", async () => {
    mockWorkflowService.getActive.mockResolvedValue([
      {
        id: "wf1",
        triggerCondition: { keyword: "hello", matchType: "exact" },
        nodes: [
          { id: "n1", type: "send_message", config: { message: "Hi there!" } },
        ],
      },
    ]);
    mockPrismaService.workflowLog.create.mockResolvedValue({});
    mockPrismaService.workflow.update.mockResolvedValue({});

    await engine.process("u1", "s1", "628111@s.whatsapp.net", "hello");
    expect(mockSessionManagerService.sendMessage).toHaveBeenCalledWith(
      "s1",
      "628111@s.whatsapp.net",
      "Hi there!",
    );
  });

  it("skips workflow if trigger does not match", async () => {
    mockWorkflowService.getActive.mockResolvedValue([
      {
        id: "wf1",
        triggerCondition: { keyword: "start", matchType: "exact" },
        nodes: [
          { id: "n1", type: "send_message", config: { message: "Started!" } },
        ],
      },
    ]);

    await engine.process("u1", "s1", "628111@s.whatsapp.net", "hello");
    expect(mockSessionManagerService.sendMessage).not.toHaveBeenCalled();
  });

  it("fires add_tag node and creates contact if not exists", async () => {
    mockWorkflowService.getActive.mockResolvedValue([
      {
        id: "wf1",
        triggerCondition: { keyword: "join", matchType: "contains" },
        nodes: [{ id: "n1", type: "add_tag", config: { tag: "lead" } }],
      },
    ]);
    mockPrismaService.contact.findFirst.mockResolvedValue(null);
    mockPrismaService.contact.create.mockResolvedValue({});
    mockPrismaService.workflowLog.create.mockResolvedValue({});
    mockPrismaService.workflow.update.mockResolvedValue({});

    await engine.process("u1", "s1", "628111@s.whatsapp.net", "please join me");
    expect(mockPrismaService.contact.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tag: "lead" }),
      }),
    );
  });
});
