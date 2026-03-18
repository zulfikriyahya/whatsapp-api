import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';
import googleConfig from './config/google.config';
import geminiConfig from './config/gemini.config';
import whatsappConfig from './config/whatsapp.config';
import throttlerConfig, {
  throttlerAsyncOptions,
} from './config/throttler.config';

import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { GatewayModule } from './gateway/gateway.module';
import { QueueModule } from './queue/queue.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TiersModule } from './modules/tiers/tiers.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MessagesModule } from './modules/messages/messages.module';
import { BroadcastModule } from './modules/broadcast/broadcast.module';
import { InboxModule } from './modules/inbox/inbox.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ChatsModule } from './modules/chats/chats.module';
import { AutoReplyModule } from './modules/auto-reply/auto-reply.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { DripModule } from './modules/drip/drip.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { LabelsModule } from './modules/labels/labels.module';
import { StatusModule } from './modules/status/status.module';
import { CallsModule } from './modules/calls/calls.module';
import { AiModule } from './modules/ai/ai.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { CleanupModule } from './modules/cleanup/cleanup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        jwtConfig,
        googleConfig,
        geminiConfig,
        whatsappConfig,
        throttlerConfig,
      ],
    }),

    ThrottlerModule.forRootAsync(throttlerAsyncOptions),

    ScheduleModule.forRoot(),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          password: config.get('redis.password'),
          db: config.get('redis.db'),
        },
        prefix: config.get('redis.keyPrefix'),
      }),
    }),

    PrismaModule,
    RedisModule,
    GatewayModule,
    QueueModule,

    AuthModule,
    UsersModule,
    TiersModule,
    ApiKeysModule,
    SessionsModule,
    MessagesModule,
    BroadcastModule,
    InboxModule,
    GroupsModule,
    ChannelsModule,
    ContactsModule,
    ChatsModule,
    AutoReplyModule,
    WorkflowModule,
    DripModule,
    SchedulerModule,
    TemplatesModule,
    WebhookModule,
    LabelsModule,
    StatusModule,
    CallsModule,
    AiModule,
    SettingsModule,
    AuditModule,
    AnalyticsModule,
    HealthModule,
    NotificationsModule,
    WorkspaceModule,
    CleanupModule,
  ],
})
export class AppModule {}
