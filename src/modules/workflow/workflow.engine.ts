// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "../../prisma/prisma.service";
// import { SessionManagerService } from "../sessions/session-manager.service";
// import { WorkflowService } from "./workflow.service";
// import { toJid } from "../../common/utils/phone-normalizer.util";

// type NodeType = "send_message" | "delay" | "add_tag";
// interface WorkflowNode {
//   id: string;
//   type: NodeType;
//   config: any;
// }

// @Injectable()
// export class WorkflowEngine {
//   private logger = new Logger("WorkflowEngine");

//   constructor(
//     private prisma: PrismaService,
//     private manager: SessionManagerService,
//     private workflowService: WorkflowService,
//   ) {}

//   async process(userId: string, sessionId: string, from: string, text: string) {
//     const workflows = await this.workflowService.getActive(userId);

//     for (const wf of workflows) {
//       const condition = wf.triggerCondition as any;
//       if (!this.matchesTrigger(condition, text)) continue;

//       const logs: string[] = [];
//       let status = "completed";
//       let errorMessage: string | null = null;

//       try {
//         const nodes = wf.nodes as WorkflowNode[];
//         for (const node of nodes) {
//           await this.executeNode(node, sessionId, userId, from, logs);
//         }
//       } catch (e) {
//         status = "failed";
//         errorMessage = e.message;
//         this.logger.error(`Workflow ${wf.id} failed: ${e.message}`);
//       }

//       await this.prisma.workflowLog.create({
//         data: {
//           workflowId: wf.id,
//           userId,
//           contactNumber: from,
//           status,
//           logs,
//           errorMessage,
//         },
//       });
//       await this.prisma.workflow.update({
//         where: { id: wf.id },
//         data: { executionCount: { increment: 1 } },
//       });
//       break; // One workflow per message
//     }
//   }

//   private async executeNode(
//     node: WorkflowNode,
//     sessionId: string,
//     userId: string,
//     from: string,
//     logs: string[],
//   ) {
//     const jid = from.includes("@") ? from : toJid(from);

//     switch (node.type) {
//       case "send_message":
//         await this.manager.sendMessage(sessionId, jid, node.config.message);
//         logs.push(`[send_message] Sent: "${node.config.message.slice(0, 50)}"`);
//         break;

//       case "delay":
//         const ms = (node.config.seconds || 1) * 1000;
//         await new Promise((r) => setTimeout(r, ms));
//         logs.push(`[delay] Waited ${node.config.seconds}s`);
//         break;

//       case "add_tag":
//         const phone = from.split("@")[0];
//         const contact = await this.prisma.contact.findFirst({
//           where: { userId, number: phone },
//         });
//         if (contact) {
//           await this.prisma.contact.update({
//             where: { id: contact.id },
//             data: { tag: node.config.tag },
//           });
//         } else {
//           await this.prisma.contact.create({
//             data: { userId, name: phone, number: phone, tag: node.config.tag },
//           });
//         }
//         logs.push(
//           `[add_tag] Tagged contact ${phone} with "${node.config.tag}"`,
//         );
//         break;

//       default:
//         throw new Error(`Unknown node type: ${(node as any).type}`);
//     }
//   }

//   private matchesTrigger(condition: any, text: string): boolean {
//     if (!condition?.keyword) return false;
//     const t = text.toLowerCase().trim();
//     const k = condition.keyword.toLowerCase().trim();
//     switch (condition.matchType) {
//       case "exact":
//         return t === k;
//       case "contains":
//         return t.includes(k);
//       case "regex":
//         try {
//           return new RegExp(condition.keyword, "i").test(text);
//         } catch {
//           return false;
//         }
//       default:
//         return false;
//     }
//   }
// }

import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { WorkflowService } from "./workflow.service";
import { toJid } from "../../common/utils/phone-normalizer.util";

type NodeType = "send_message" | "delay" | "add_tag";
interface WorkflowNode {
  id: string;
  type: NodeType;
  config: any;
}

@Injectable()
export class WorkflowEngine {
  private logger = new Logger("WorkflowEngine");

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SessionManagerService))
    private manager: SessionManagerService,
    private workflowService: WorkflowService,
  ) {}

  async process(userId: string, sessionId: string, from: string, text: string) {
    const workflows = await this.workflowService.getActive(userId);

    for (const wf of workflows) {
      const condition = wf.triggerCondition as any;
      if (!this.matchesTrigger(condition, text)) continue;

      const logs: string[] = [];
      let status = "completed";
      let errorMessage: string | null = null;

      try {
        const nodes = wf.nodes as WorkflowNode[];
        for (const node of nodes) {
          await this.executeNode(node, sessionId, userId, from, logs);
        }
      } catch (e) {
        status = "failed";
        errorMessage = e.message;
        this.logger.error(`Workflow ${wf.id} failed: ${e.message}`);
      }

      await this.prisma.workflowLog.create({
        data: {
          workflowId: wf.id,
          userId,
          contactNumber: from,
          status,
          logs,
          errorMessage,
        },
      });
      await this.prisma.workflow.update({
        where: { id: wf.id },
        data: { executionCount: { increment: 1 } },
      });
      break;
    }
  }

  private async executeNode(
    node: WorkflowNode,
    sessionId: string,
    userId: string,
    from: string,
    logs: string[],
  ) {
    const jid = from.includes("@") ? from : toJid(from);

    switch (node.type) {
      case "send_message":
        await this.manager.sendMessage(sessionId, jid, node.config.message);
        logs.push(`[send_message] Sent: "${node.config.message.slice(0, 50)}"`);
        break;
      case "delay":
        const ms = (node.config.seconds || 1) * 1000;
        await new Promise((r) => setTimeout(r, ms));
        logs.push(`[delay] Waited ${node.config.seconds}s`);
        break;
      case "add_tag":
        const phone = from.split("@")[0];
        const contact = await this.prisma.contact.findFirst({
          where: { userId, number: phone },
        });
        if (contact) {
          await this.prisma.contact.update({
            where: { id: contact.id },
            data: { tag: node.config.tag },
          });
        } else {
          await this.prisma.contact.create({
            data: { userId, name: phone, number: phone, tag: node.config.tag },
          });
        }
        logs.push(
          `[add_tag] Tagged contact ${phone} with "${node.config.tag}"`,
        );
        break;
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }

  private matchesTrigger(condition: any, text: string): boolean {
    if (!condition?.keyword) return false;
    const t = text.toLowerCase().trim();
    const k = condition.keyword.toLowerCase().trim();
    switch (condition.matchType) {
      case "exact":
        return t === k;
      case "contains":
        return t.includes(k);
      case "regex":
        try {
          return new RegExp(condition.keyword, "i").test(text);
        } catch {
          return false;
        }
      default:
        return false;
    }
  }
}
