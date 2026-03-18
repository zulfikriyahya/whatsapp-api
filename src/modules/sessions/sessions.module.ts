// import { Module } from "@nestjs/common";
// import { SessionsController } from "./sessions.controller";
// import { SessionsService } from "./sessions.service";
// import { SessionManagerService } from "./session-manager.service";
// import { WarmingService } from "./warming.service";
// import { AuditModule } from "../audit/audit.module";
// import { GatewayModule } from "../../gateway/gateway.module";
// import { NotificationsModule } from "../notifications/notifications.module";
// import { InboxModule } from "../inbox/inbox.module";
// import { AutoReplyModule } from "../auto-reply/auto-reply.module";
// import { WorkflowModule } from "../workflow/workflow.module";
// import { WebhookModule } from "../webhook/webhook.module";

// @Module({
//   imports: [
//     AuditModule,
//     GatewayModule,
//     NotificationsModule,
//     InboxModule,
//     AutoReplyModule,
//     WorkflowModule,
//     WebhookModule,
//   ],
//   controllers: [SessionsController],
//   providers: [SessionsService, SessionManagerService, WarmingService],
//   exports: [SessionManagerService, SessionsService],
// })
// export class SessionsModule {}
import { Module, forwardRef } from "@nestjs/common";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";
import { SessionManagerService } from "./session-manager.service";
import { WarmingService } from "./warming.service";
import { AuditModule } from "../audit/audit.module";
import { GatewayModule } from "../../gateway/gateway.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { InboxModule } from "../inbox/inbox.module";
import { AutoReplyModule } from "../auto-reply/auto-reply.module";
import { WorkflowModule } from "../workflow/workflow.module";
import { WebhookModule } from "../webhook/webhook.module";

@Module({
  imports: [
    AuditModule,
    GatewayModule,
    NotificationsModule,
    InboxModule,
    forwardRef(() => AutoReplyModule),
    forwardRef(() => WorkflowModule),
    WebhookModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionManagerService, WarmingService],
  exports: [SessionManagerService, SessionsService],
})
export class SessionsModule {}
