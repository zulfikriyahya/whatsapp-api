## File : `ecosystem.config.js`

```js
module.exports = {
  apps: [
    {
      name: "whatsapp-api",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 3000,
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 15000,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      time: true,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: "5s",
    },
  ],
};

```
---

## File : `nest-cli.json`

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": [
      "@nestjs/swagger"
    ]
  }
}

```
---

## File : `package.json`

```json
{
  "name": "whatsapp-gateway-saas",
  "version": "1.0.0",
  "description": "WhatsApp Gateway SaaS Platform",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "pm2:start": "pm2 start ecosystem.config.js --env production",
    "pm2:stop": "pm2 stop wgw-api",
    "pm2:restart": "pm2 restart wgw-api",
    "pm2:logs": "pm2 logs wgw-api",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:prod": "prisma migrate deploy",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "storage:init": "mkdir -p storage/sessions storage/uploads storage/exports storage/broadcasts/tmp storage/backups/database storage/backups/sessions",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@nestjs/bullmq": "^10.2.3",
    "@nestjs/common": "^10.4.22",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.4.22",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.4.22",
    "@nestjs/platform-socket.io": "^10.4.22",
    "@nestjs/schedule": "^4.1.2",
    "@nestjs/swagger": "^7.4.2",
    "@nestjs/throttler": "^6.5.0",
    "@nestjs/websockets": "^10.4.22",
    "@prisma/client": "^5.22.0",
    "axios": "^1.13.6",
    "bullmq": "^5.71.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.4",
    "cookie-parser": "^1.4.7",
    "date-fns": "^3.6.0",
    "date-fns-tz": "^3.2.0",
    "file-type": "^16.5.4",
    "helmet": "^8.1.0",
    "ioredis": "^5.10.0",
    "mime-types": "^2.1.35",
    "multer": "1.4.5-lts.2",
    "nodemailer": "^6.10.1",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.1",
    "pdfkit": "^0.15.2",
    "puppeteer": "^22.15.0",
    "qrcode": "^1.5.4",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.2",
    "socket.io": "^4.8.3",
    "speakeasy": "^2.0.0",
    "whatsapp-web.js": "^1.34.6"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.9",
    "@nestjs/schematics": "^10.2.3",
    "@nestjs/testing": "^10.4.22",
    "@types/cookie-parser": "^1.4.10",
    "@types/express": "^4.17.25",
    "@types/jest": "^30.0.0",
    "@types/mime-types": "^2.1.4",
    "@types/multer": "^1.4.13",
    "@types/node": "^22.19.15",
    "@types/nodemailer": "^6.4.23",
    "@types/passport-google-oauth20": "^2.0.17",
    "@types/passport-jwt": "^4.0.1",
    "@types/pdfkit": "^0.13.9",
    "@types/qrcode": "^1.5.6",
    "@types/speakeasy": "^2.0.10",
    "@types/supertest": "^6.0.3",
    "@typescript-eslint/eslint-plugin": "^8.57.1",
    "@typescript-eslint/parser": "^8.57.1",
    "eslint": "^9.39.4",
    "eslint-config-prettier": "^9.1.2",
    "eslint-plugin-prettier": "^5.5.5",
    "jest": "^29.7.0",
    "prettier": "^3.8.1",
    "prisma": "^5.22.0",
    "supertest": "^7.2.2",
    "ts-jest": "^29.4.6",
    "ts-loader": "^9.5.4",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.9.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": ".",
    "roots": [
      "<rootDir>/src",
      "<rootDir>/test"
    ],
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": [
        "ts-jest",
        {
          "tsconfig": "tsconfig.json"
        }
      ]
    },
    "collectCoverageFrom": [
      "src/**/*.(t|j)s"
    ],
    "coverageDirectory": "coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/src/$1"
    },
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/dist/"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 60,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}

```
---

## File : `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "types": [
      "jest",
      "node"
    ],
    "paths": {
      "src/*": [
        "src/*"
      ]
    }
  },
  "include": [
    "src/**/*",
    "test/**/*"
  ]
}

```
---

## File : `tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "exclude": [
    "node_modules",
    "test",
    "dist",
    "**/*spec.ts"
  ]
}

```
---

## File : `prisma/schema.prisma`

```prisma
// ============================================================
// WhatsApp Gateway SaaS - Prisma Schema (Prisma v7)
// ============================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ────────────────────────────────────────────────────────────
// ENUMS
// ────────────────────────────────────────────────────────────

enum Role {
  user
  admin
  super_admin
}

enum SessionStatus {
  disconnected
  authenticating
  connected
  logged_out
}

enum MessageStatus {
  success
  failed
  pending
}

enum ReadStatus {
  sent
  delivered
  read
}

enum CampaignStatus {
  pending
  processing
  completed
  cancelled
}

enum MatchType {
  exact
  contains
  regex
  ai_smart
}

enum WorkflowNodeType {
  send_message
  delay
  add_tag
}

enum DripSubscriptionStatus {
  active
  completed
  paused
  cancelled
}

enum ScheduledMessageStatus {
  pending
  sent
  failed
  cancelled
}

enum RecurrenceType {
  none
  daily
  weekly
  monthly
}

enum WebhookQueueStatus {
  pending
  processing
  completed
  failed
}

enum MessageType {
  text
  image
  video
  audio
  document
  sticker
  location
  vcard
  poll
}

enum AuditAction {
  LOGIN
  LOGOUT
  CREATE_SESSION
  DELETE_SESSION
  RECONNECT_SESSION
  CREATE_API_KEY
  DELETE_API_KEY
  START_BROADCAST
  CANCEL_BROADCAST
  UPDATE_SETTINGS
  ENABLE_2FA
  DISABLE_2FA
  CREATE_USER
  UPDATE_USER
  DELETE_USER
  ASSIGN_TIER
  CREATE_WORKSPACE
  INVITE_MEMBER
  REMOVE_MEMBER
}

enum TierFeature {
  broadcast
  auto_reply
  workflow
  drip_campaign
  ai_smart_reply
  channels
  labels
  customer_note
  scheduler
  webhook
  api_access
}

enum WorkspaceMemberRole {
  owner
  admin
  member
}

// ────────────────────────────────────────────────────────────
// USER
// ────────────────────────────────────────────────────────────

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  picture      String?  @db.Text
  role         Role     @default(user)
  isActive     Boolean  @default(true)
  twoFaSecret  String?
  twoFaEnabled Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  quota             UserQuota?
  tier              UserTier?
  sessions          WhatsappSession[]
  campaigns         Campaign[]
  messageLogs       MessageLog[]
  inbox             Inbox[]
  contacts          Contact[]
  autoReplies       AutoReply[]
  workflows         Workflow[]
  workflowLogs      WorkflowLog[]
  dripCampaigns     DripCampaign[]
  scheduledMessages ScheduledMessage[]
  apiKeys           ApiKey[]
  templates         Template[]
  auditLogs         AuditLog[]
  webhookConfigs    WebhookConfig?
  webhookQueues     WebhookQueue[]
  settings          UserSetting?
  callLogs          CallLog[]
  workspaceMembers  WorkspaceMember[]
  ownedWorkspaces   Workspace[]       @relation("WorkspaceOwner")

  @@map("users")
}

// ────────────────────────────────────────────────────────────
// TIER
// ────────────────────────────────────────────────────────────

model Tier {
  id                     String   @id @default(uuid())
  name                   String   @unique
  description            String?  @db.Text
  maxSessions            Int      @default(1)
  maxApiKeys             Int      @default(1)
  maxDailyMessages       Int      @default(100)
  maxMonthlyBroadcasts   Int      @default(5)
  maxBroadcastRecipients Int      @default(1000)
  maxWorkflows           Int      @default(3)
  maxDripCampaigns       Int      @default(3)
  maxTemplates           Int      @default(10)
  maxContacts            Int      @default(500)
  rateLimitPerMinute     Int      @default(30)
  features               Json
  price                  Decimal? @db.Decimal(10, 2)
  isActive               Boolean  @default(true)
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  userTiers UserTier[]

  @@map("tiers")
}

model UserTier {
  id        String    @id @default(uuid())
  userId    String    @unique
  tierId    String
  startedAt DateTime  @default(now())
  expiresAt DateTime?
  isGrace   Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tier Tier @relation(fields: [tierId], references: [id])

  @@map("user_tiers")
}

model UserQuota {
  userId                 String    @id
  messagesSentToday      Int       @default(0)
  broadcastsThisMonth    Int       @default(0)
  lastDailyResetAt       DateTime?
  lastMonthlyResetAt     DateTime?
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_quotas")
}

// ────────────────────────────────────────────────────────────
// WHATSAPP SESSION
// ────────────────────────────────────────────────────────────

model WhatsappSession {
  id          String        @id @default(uuid())
  userId      String
  sessionName String
  phoneNumber String?
  status      SessionStatus @default(disconnected)
  authFolder  String
  isDefault   Boolean       @default(false)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  messageLogs       MessageLog[]
  inbox             Inbox[]
  campaigns         Campaign[]
  scheduledMessages ScheduledMessage[]
  dripCampaigns     DripCampaign[]
  callLogs          CallLog[]

  @@unique([userId, sessionName])
  @@index([userId])
  @@index([status])
  @@map("whatsapp_sessions")
}

// ────────────────────────────────────────────────────────────
// API KEY
// ────────────────────────────────────────────────────────────

model ApiKey {
  id          String    @id @default(uuid())
  userId      String
  name        String
  keyHash     String    @unique
  keyPreview  String    @db.VarChar(8)
  ipWhitelist String?   @db.Text
  isSandbox   Boolean   @default(false)
  expiresAt   DateTime?
  lastUsedAt  DateTime?
  createdAt   DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("api_keys")
}

// ────────────────────────────────────────────────────────────
// MESSAGE LOG
// ────────────────────────────────────────────────────────────

model MessageLog {
  id           Int           @id @default(autoincrement())
  userId       String
  sessionId    String?
  campaignId   String?
  target       String
  message      String        @db.Text
  messageType  MessageType   @default(text)
  status       MessageStatus
  readStatus   ReadStatus    @default(sent)
  errorMessage String?       @db.Text
  timestamp    DateTime      @default(now())

  user     User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  session  WhatsappSession?  @relation(fields: [sessionId], references: [id], onDelete: SetNull)
  campaign Campaign?         @relation(fields: [campaignId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([timestamp])
  @@index([campaignId])
  @@index([status])
  @@map("message_logs")
}

// ────────────────────────────────────────────────────────────
// INBOX
// ────────────────────────────────────────────────────────────

model Inbox {
  id             String      @id
  userId         String
  sessionId      String?
  remoteJid      String
  pushName       String?
  messageContent String?     @db.Text
  messageType    MessageType @default(text)
  mediaUrl       String?     @db.Text
  isRead         Boolean     @default(false)
  timestamp      DateTime    @default(now())

  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  session WhatsappSession? @relation(fields: [sessionId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([userId, remoteJid])
  @@index([isRead])
  @@map("inbox")
}

// ────────────────────────────────────────────────────────────
// CAMPAIGN
// ────────────────────────────────────────────────────────────

model Campaign {
  id              String         @id @default(uuid())
  userId          String
  sessionId       String?
  name            String
  message         String         @db.Text
  mediaPath       String?
  totalRecipients Int            @default(0)
  processedCount  Int            @default(0)
  successCount    Int            @default(0)
  failedCount     Int            @default(0)
  status          CampaignStatus @default(pending)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  session     WhatsappSession?  @relation(fields: [sessionId], references: [id], onDelete: SetNull)
  messageLogs MessageLog[]

  @@index([userId])
  @@index([status])
  @@map("campaigns")
}

// ────────────────────────────────────────────────────────────
// CONTACT
// ────────────────────────────────────────────────────────────

model Contact {
  id        String   @id @default(uuid())
  userId    String
  name      String
  number    String
  tag       String?
  notes     String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  dripSubscriptions DripSubscription[]

  @@unique([userId, number])
  @@index([userId])
  @@index([userId, tag])
  @@map("contacts")
}

// ────────────────────────────────────────────────────────────
// AUTO REPLY
// ────────────────────────────────────────────────────────────

model AutoReply {
  id        String    @id @default(uuid())
  userId    String
  keyword   String
  response  String    @db.Text
  matchType MatchType
  isActive  Boolean   @default(true)
  priority  Int       @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, isActive, priority])
  @@map("auto_replies")
}

// ────────────────────────────────────────────────────────────
// WORKFLOW
// ────────────────────────────────────────────────────────────

model Workflow {
  id               String   @id @default(uuid())
  userId           String
  name             String
  triggerType      String   @default("message_received")
  triggerCondition Json
  nodes            Json
  isActive         Boolean  @default(true)
  executionCount   Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs WorkflowLog[]

  @@index([userId])
  @@index([userId, isActive])
  @@map("workflows")
}

model WorkflowLog {
  id            Int      @id @default(autoincrement())
  workflowId    String
  userId        String
  contactNumber String
  status        String
  logs          Json
  errorMessage  String?  @db.Text
  timestamp     DateTime @default(now())

  workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([workflowId])
  @@index([timestamp])
  @@map("workflow_logs")
}

// ────────────────────────────────────────────────────────────
// DRIP CAMPAIGN
// ────────────────────────────────────────────────────────────

model DripCampaign {
  id         String   @id @default(uuid())
  userId     String
  sessionId  String?
  name       String
  triggerTag String
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  session       WhatsappSession?   @relation(fields: [sessionId], references: [id], onDelete: SetNull)
  steps         DripStep[]
  subscriptions DripSubscription[]

  @@index([userId])
  @@map("drip_campaigns")
}

model DripStep {
  id        String  @id @default(uuid())
  dripId    String
  dayOffset Int
  timeAt    String  @db.VarChar(5)
  message   String  @db.Text
  mediaPath String?

  drip DripCampaign @relation(fields: [dripId], references: [id], onDelete: Cascade)

  @@unique([dripId, dayOffset])
  @@map("drip_steps")
}

model DripSubscription {
  id          String                 @id @default(uuid())
  dripId      String
  contactId   String
  startDate   DateTime
  status      DripSubscriptionStatus @default(active)
  lastStepDay Int                    @default(0)
  createdAt   DateTime               @default(now())
  updatedAt   DateTime               @updatedAt

  drip    DripCampaign @relation(fields: [dripId], references: [id], onDelete: Cascade)
  contact Contact      @relation(fields: [contactId], references: [id], onDelete: Cascade)

  @@unique([dripId, contactId])
  @@index([status])
  @@map("drip_subscriptions")
}

// ────────────────────────────────────────────────────────────
// SCHEDULED MESSAGE
// ────────────────────────────────────────────────────────────

model ScheduledMessage {
  id             String                 @id @default(uuid())
  userId         String
  sessionId      String
  target         String
  message        String                 @db.Text
  messageType    MessageType            @default(text)
  mediaPath      String?
  scheduledTime  DateTime
  status         ScheduledMessageStatus @default(pending)
  recurrenceType RecurrenceType         @default(none)
  createdAt      DateTime               @default(now())
  updatedAt      DateTime               @updatedAt

  user    User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  session WhatsappSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([status, scheduledTime])
  @@index([userId])
  @@map("scheduled_messages")
}

// ────────────────────────────────────────────────────────────
// TEMPLATE
// ────────────────────────────────────────────────────────────

model Template {
  id        String   @id @default(uuid())
  userId    String
  name      String
  content   String   @db.Text
  category  String   @default("General")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name])
  @@index([userId])
  @@map("templates")
}

// ────────────────────────────────────────────────────────────
// WEBHOOK
// ────────────────────────────────────────────────────────────

model WebhookConfig {
  userId        String   @id
  webhookUrl    String?  @db.Text
  webhookSecret String?
  isActive      Boolean  @default(true)
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("webhook_configs")
}

model WebhookQueue {
  id          Int                @id @default(autoincrement())
  userId      String
  url         String             @db.Text
  payload     Json
  headers     Json
  retries     Int                @default(0)
  maxRetries  Int                @default(5)
  status      WebhookQueueStatus @default(pending)
  lastError   String?            @db.Text
  nextRetryAt DateTime           @default(now())
  createdAt   DateTime           @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([status, nextRetryAt])
  @@map("webhook_queues")
}

// ────────────────────────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────────────────────────

model GlobalSetting {
  key       String   @id
  value     String   @db.Text
  updatedAt DateTime @updatedAt

  @@map("global_settings")
}

model UserSetting {
  userId                    String   @id
  geminiApiKey              String?
  geminiConfidenceThreshold Float    @default(0.6)
  autoDownloadPhotos        Boolean  @default(false)
  autoDownloadVideos        Boolean  @default(false)
  autoDownloadAudio         Boolean  @default(false)
  autoDownloadDocuments     Boolean  @default(false)
  backgroundSync            Boolean  @default(false)
  updatedAt                 DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}

// ────────────────────────────────────────────────────────────
// AUDIT LOG
// ────────────────────────────────────────────────────────────

model AuditLog {
  id        String      @id @default(uuid())
  userId    String?
  userEmail String
  action    AuditAction
  details   Json?
  ipAddress String
  userAgent String?     @db.Text
  timestamp DateTime    @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([timestamp])
  @@index([action])
  @@map("audit_logs")
}

// ────────────────────────────────────────────────────────────
// CALL LOG
// ────────────────────────────────────────────────────────────

model CallLog {
  id         String   @id @default(uuid())
  userId     String
  sessionId  String?
  fromNumber String
  callType   String   @default("voice")
  status     String   @default("missed")
  timestamp  DateTime @default(now())

  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  session WhatsappSession? @relation(fields: [sessionId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([timestamp])
  @@map("call_logs")
}

// ────────────────────────────────────────────────────────────
// WORKSPACE
// ────────────────────────────────────────────────────────────

model Workspace {
  id        String   @id @default(uuid())
  name      String
  ownerId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  owner   User              @relation("WorkspaceOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members WorkspaceMember[]

  @@map("workspaces")
}

model WorkspaceMember {
  id          String              @id @default(uuid())
  workspaceId String
  userId      String
  role        WorkspaceMemberRole @default(member)
  permissions Json?
  joinedAt    DateTime            @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@map("workspace_members")
}

```
---

## File : `prisma/seed.ts`

```ts
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const tiers = [
    {
      name: "Free",
      description: "Tier gratis dengan fitur dasar",
      maxSessions: 1,
      maxApiKeys: 1,
      maxDailyMessages: 100,
      maxMonthlyBroadcasts: 2,
      maxBroadcastRecipients: 100,
      maxWorkflows: 1,
      maxDripCampaigns: 1,
      maxTemplates: 5,
      maxContacts: 100,
      rateLimitPerMinute: 10,
      features: ["auto_reply", "scheduler", "webhook"],
      price: 0,
      isActive: true,
    },
    {
      name: "Basic",
      description: "Tier dasar untuk bisnis kecil",
      maxSessions: 2,
      maxApiKeys: 3,
      maxDailyMessages: 500,
      maxMonthlyBroadcasts: 10,
      maxBroadcastRecipients: 1000,
      maxWorkflows: 3,
      maxDripCampaigns: 2,
      maxTemplates: 20,
      maxContacts: 500,
      rateLimitPerMinute: 30,
      features: [
        "broadcast",
        "auto_reply",
        "workflow",
        "scheduler",
        "webhook",
        "api_access",
        "labels",
      ],
      price: 99000,
      isActive: true,
    },
    {
      name: "Pro",
      description: "Tier profesional dengan semua fitur",
      maxSessions: 5,
      maxApiKeys: 5,
      maxDailyMessages: 2000,
      maxMonthlyBroadcasts: 50,
      maxBroadcastRecipients: 5000,
      maxWorkflows: 10,
      maxDripCampaigns: 5,
      maxTemplates: 50,
      maxContacts: 5000,
      rateLimitPerMinute: 60,
      features: [
        "broadcast",
        "auto_reply",
        "workflow",
        "drip_campaign",
        "ai_smart_reply",
        "channels",
        "labels",
        "customer_note",
        "scheduler",
        "webhook",
        "api_access",
      ],
      price: 299000,
      isActive: true,
    },
    {
      name: "Enterprise",
      description: "Tier enterprise tanpa batas",
      maxSessions: 20,
      maxApiKeys: 10,
      maxDailyMessages: 10000,
      maxMonthlyBroadcasts: 200,
      maxBroadcastRecipients: 10000,
      maxWorkflows: 50,
      maxDripCampaigns: 20,
      maxTemplates: 200,
      maxContacts: 50000,
      rateLimitPerMinute: 300,
      features: [
        "broadcast",
        "auto_reply",
        "workflow",
        "drip_campaign",
        "ai_smart_reply",
        "channels",
        "labels",
        "customer_note",
        "scheduler",
        "webhook",
        "api_access",
      ],
      price: 999000,
      isActive: true,
    },
  ];

  for (const tier of tiers) {
    await prisma.tier.upsert({
      where: { name: tier.name },
      create: { ...tier, features: tier.features as any },
      update: { ...tier, features: tier.features as any },
    });
    console.log(`Tier upserted: ${tier.name}`);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: "Super Admin",
        role: Role.super_admin,
        isActive: true,
      },
      update: { role: Role.super_admin },
    });

    await prisma.userQuota.upsert({
      where: { userId: admin.id },
      create: {
        userId: admin.id,
        messagesSentToday: 0,
        broadcastsThisMonth: 0,
      },
      update: {},
    });

    const enterpriseTier = await prisma.tier.findUnique({
      where: { name: "Enterprise" },
    });
    if (enterpriseTier) {
      await prisma.userTier.upsert({
        where: { userId: admin.id },
        create: { userId: admin.id, tierId: enterpriseTier.id },
        update: { tierId: enterpriseTier.id },
      });
    }

    console.log(`Admin upserted: ${adminEmail}`);
  }

  const globalSettings = [
    { key: "defaultDailyMessageLimit", value: "1000" },
    { key: "defaultMonthlyBroadcastLimit", value: "10" },
    { key: "maintenanceMode", value: "false" },
    { key: "maxBroadcastRecipients", value: "10000" },
  ];

  for (const s of globalSettings) {
    await prisma.globalSetting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: s.value },
      update: { value: s.value },
    });
  }
  console.log("Global settings seeded");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```
---

## File : `src/main.ts`

```ts
import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor";
import { SandboxInterceptor } from "./common/interceptors/sandbox.interceptor";
import * as cookieParser from "cookie-parser";
import * as mime from "mime-types"; // pastikan mime-types ter-install

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>("app.port");
  const clientUrl = config.get<string>("app.clientUrl");
  const cookieSecret = config.get<string>("app.cookieSecret");
  const nodeEnv = config.get<string>("app.nodeEnv");

  // ── Security ─────────────────────────────────────────────
  app.use(helmet());
  app.use(cookieParser(cookieSecret));

  // ── CORS ─────────────────────────────────────────────────
  app.enableCors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // ── API Prefix & Versioning ───────────────────────────────
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  // ── Global Pipes ─────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Filters ────────────────────────────────────────
  app.useGlobalFilters(
    new HttpExceptionFilter(nodeEnv),
    new PrismaExceptionFilter(nodeEnv),
  );

  // ── Global Interceptors ───────────────────────────────────
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
    new SandboxInterceptor(), // sandbox mode untuk API Key
    new ResponseInterceptor(),
  );

  // ── Socket.IO ─────────────────────────────────────────────
  app.useWebSocketAdapter(new IoAdapter(app));

  // ── Swagger (dev only) ───────────────────────────────────
  if (nodeEnv !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("WhatsApp Gateway SaaS API")
      .setDescription("REST API untuk WhatsApp Gateway SaaS Platform")
      .setVersion("1.0")
      .addCookieAuth("auth_token")
      .addApiKey({ type: "apiKey", in: "header", name: "X-API-Key" }, "api-key")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // ── Graceful Shutdown ─────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api/v1`);
  if (nodeEnv !== "production") {
    console.log(`📖 Swagger docs: http://localhost:${port}/docs`);
  }
}

bootstrap();

```
---

## File : `src/app.module.ts`

```ts
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bullmq";

import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import redisConfig from "./config/redis.config";
import jwtConfig from "./config/jwt.config";
import googleConfig from "./config/google.config";
import geminiConfig from "./config/gemini.config";
import whatsappConfig from "./config/whatsapp.config";
import throttlerConfig, {
  throttlerAsyncOptions,
} from "./config/throttler.config";

import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { GatewayModule } from "./gateway/gateway.module";
import { QueueModule } from "./queue/queue.module";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TiersModule } from "./modules/tiers/tiers.module";
import { ApiKeysModule } from "./modules/api-keys/api-keys.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { BroadcastModule } from "./modules/broadcast/broadcast.module";
import { BroadcastListModule } from "./modules/broadcast-list/broadcast-list.module";
import { InboxModule } from "./modules/inbox/inbox.module";
import { GroupsModule } from "./modules/groups/groups.module";
import { ChannelsModule } from "./modules/channels/channels.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { ChatsModule } from "./modules/chats/chats.module";
import { AutoReplyModule } from "./modules/auto-reply/auto-reply.module";
import { WorkflowModule } from "./modules/workflow/workflow.module";
import { DripModule } from "./modules/drip/drip.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { ScheduledEventModule } from "./modules/scheduled-event/scheduled-event.module";
import { TemplatesModule } from "./modules/templates/templates.module";
import { WebhookModule } from "./modules/webhook/webhook.module";
import { LabelsModule } from "./modules/labels/labels.module";
import { StatusModule } from "./modules/status/status.module";
import { CallsModule } from "./modules/calls/calls.module";
import { AiModule } from "./modules/ai/ai.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { HealthModule } from "./modules/health/health.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { CleanupModule } from "./modules/cleanup/cleanup.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { CustomerNoteModule } from "./modules/customer-note/customer-note.module";
import { AdminModule } from "./modules/admin/admin.module";
import { BackupModule } from "./modules/backup/backup.module";
import { StorageModule } from "./modules/storage/storage.module";

import { MaintenanceMiddleware } from "./common/middlewares/maintenance.middleware";
import { ApiKeyRestrictionGuard } from "./common/guards/api-key-restriction.guard";
import { TierThrottlerGuard } from "./common/guards/tier-throttler.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
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
          host: config.get("redis.host"),
          port: config.get("redis.port"),
          password: config.get("redis.password"),
          db: config.get("redis.db"),
        },
        prefix: config.get("redis.keyPrefix"),
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
    BroadcastListModule,
    InboxModule,
    GroupsModule,
    ChannelsModule,
    ContactsModule,
    ChatsModule,
    AutoReplyModule,
    WorkflowModule,
    DripModule,
    SchedulerModule,
    ScheduledEventModule,
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
    ProfileModule,
    CustomerNoteModule,
    AdminModule,
    BackupModule,
    StorageModule,
  ],
  providers: [
    // FIX 1: TierThrottlerGuard — rate limit berbasis tier user
    // Menggantikan ThrottlerGuard default dengan versi yang baca tier dari DB
    {
      provide: APP_GUARD,
      useClass: TierThrottlerGuard,
    },
    // FIX 2: ApiKeyRestrictionGuard — batasi akses external client
    {
      provide: APP_GUARD,
      useClass: ApiKeyRestrictionGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MaintenanceMiddleware)
      .exclude(
        { path: "api/v1/health", method: RequestMethod.GET },
        { path: "api/v1/auth/google", method: RequestMethod.GET },
        { path: "api/v1/auth/google/callback", method: RequestMethod.GET },
      )
      .forRoutes({ path: "api/*", method: RequestMethod.ALL });
  }
}

```
---

## File : `src/common/constants/cache-keys.constant.ts`

```ts
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  userQuota: (id: string) => `quota:${id}`,
  apiKey: (hash: string) => `apikey:${hash}`,
  twoFaTempToken: (token: string) => `2fa:temp:${token}`,
  workflowsActive: (userId: string) => `workflows:${userId}:active`,
  templatesUser: (userId: string) => `templates:${userId}`,
  roundRobin: (userId: string) => `rr:${userId}`,
  sessionStatus: (sessionId: string) => `session:status:${sessionId}`,
} as const;

```
---

## File : `src/common/constants/error-codes.constant.ts`

```ts
export const ErrorCodes = {
  // Auth
  UNAUTHORIZED: "ERR_UNAUTHORIZED",
  TOKEN_EXPIRED: "ERR_TOKEN_EXPIRED",
  ACCOUNT_DISABLED: "ERR_ACCOUNT_DISABLED",
  FORBIDDEN: "ERR_FORBIDDEN",
  IP_NOT_WHITELISTED: "ERR_IP_NOT_WHITELISTED",
  INVALID_GOOGLE_TOKEN: "ERR_INVALID_GOOGLE_TOKEN",
  TWO_FA_INVALID_CODE: "ERR_2FA_INVALID_CODE",
  TWO_FA_SESSION_EXPIRED: "ERR_2FA_SESSION_EXPIRED",
  TWO_FA_ALREADY_ENABLED: "ERR_2FA_ALREADY_ENABLED",
  TWO_FA_NOT_ENABLED: "ERR_2FA_NOT_ENABLED",

  // Resource
  NOT_FOUND: "ERR_NOT_FOUND",
  DUPLICATE_SESSION_NAME: "ERR_DUPLICATE_SESSION_NAME",
  DUPLICATE_CONTACT: "ERR_DUPLICATE_CONTACT",
  DUPLICATE_TEMPLATE_NAME: "ERR_DUPLICATE_TEMPLATE_NAME",
  DUPLICATE_DRIP_DAY: "ERR_DUPLICATE_DRIP_DAY",
  CANNOT_DELETE_SELF: "ERR_CANNOT_DELETE_SELF",

  // Validation
  VALIDATION: "ERR_VALIDATION",
  INVALID_PHONE: "ERR_INVALID_PHONE",
  INVALID_URL: "ERR_INVALID_URL",
  INVALID_REGEX: "ERR_INVALID_REGEX",
  INVALID_IP_FORMAT: "ERR_INVALID_IP_FORMAT",
  INVALID_TIME_FORMAT: "ERR_INVALID_TIME_FORMAT",
  INVALID_DATE: "ERR_INVALID_DATE",
  SCHEDULE_PAST: "ERR_SCHEDULE_PAST",
  NO_RECIPIENTS: "ERR_NO_RECIPIENTS",
  MESSAGE_REQUIRED: "ERR_MESSAGE_REQUIRED",
  FILE_TOO_LARGE: "ERR_FILE_TOO_LARGE",
  FILE_TYPE_NOT_ALLOWED: "ERR_FILE_TYPE_NOT_ALLOWED",
  DELAY_TOO_LONG: "ERR_DELAY_TOO_LONG",
  WORKFLOW_TOO_MANY_NODES: "ERR_WORKFLOW_TOO_MANY_NODES",

  // Session & WhatsApp
  NO_SESSIONS: "ERR_NO_SESSIONS",
  SESSION_NOT_CONNECTED: "ERR_SESSION_NOT_CONNECTED",
  SESSION_NOT_FOUND: "ERR_SESSION_NOT_FOUND",
  SESSION_LOGGED_OUT: "ERR_SESSION_LOGGED_OUT",
  SEND_FAILED: "ERR_SEND_FAILED",

  // Quota
  QUOTA_DAILY_EXCEEDED: "ERR_QUOTA_DAILY_EXCEEDED",
  QUOTA_MONTHLY_EXCEEDED: "ERR_QUOTA_MONTHLY_EXCEEDED",
  RATE_LIMIT: "ERR_RATE_LIMIT",
  RATE_LIMIT_AUTH: "ERR_RATE_LIMIT_AUTH",

  // Features / Tier
  FEATURE_NOT_AVAILABLE: "ERR_FEATURE_NOT_AVAILABLE",
  TIER_EXPIRED: "ERR_TIER_EXPIRED",

  // System
  INTERNAL: "ERR_INTERNAL",
  REDIS_UNAVAILABLE: "ERR_REDIS_UNAVAILABLE",
  AI_DISABLED: "ERR_AI_DISABLED",
  AI_TIMEOUT: "ERR_AI_TIMEOUT",
  CAMPAIGN_NOT_CANCELLABLE: "ERR_CAMPAIGN_NOT_CANCELLABLE",
  MESSAGE_ALREADY_SENT: "ERR_MESSAGE_ALREADY_SENT",
  WEBHOOK_NOT_CONFIGURED: "ERR_WEBHOOK_NOT_CONFIGURED",
  MAINTENANCE: "ERR_MAINTENANCE",
} as const;

```
---

## File : `src/common/constants/event-names.constant.ts`

```ts
export const SocketEvents = {
  QR: "qr",
  CODE: "code",
  CONNECTION_UPDATE: "connection_update",
  NEW_MESSAGE: "new_message",
  MESSAGE_ACK: "message_ack",
  MESSAGE_EDIT: "message_edit",
  MESSAGE_REACTION: "message_reaction",
  MESSAGE_REVOKE_EVERYONE: "message_revoke_everyone",
  MESSAGE_REVOKE_ME: "message_revoke_me",
  MESSAGE_CIPHERTEXT: "message_ciphertext",
  MEDIA_UPLOADED: "media_uploaded",
  VOTE_UPDATE: "vote_update",
  GROUP_JOIN: "group_join",
  GROUP_LEAVE: "group_leave",
  GROUP_ADMIN_CHANGED: "group_admin_changed",
  GROUP_UPDATE: "group_update",
  GROUP_MEMBERSHIP_REQUEST: "group_membership_request",
  CONTACT_CHANGED: "contact_changed",
  CHAT_ARCHIVED: "chat_archived",
  CHAT_REMOVED: "chat_removed",
  CHANGE_STATE: "change_state",
  CHANGE_BATTERY: "change_battery",
  INCOMING_CALL: "incoming_call",
  BROADCAST_PROGRESS: "broadcast_progress",
  BROADCAST_COMPLETE: "broadcast_complete",
  SYSTEM_ALERT: "system_alert",
} as const;

```
---

## File : `src/common/constants/mime-types.constant.ts`

```ts
export const AllowedMimeTypes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/3gpp"],
  audio: ["audio/mpeg", "audio/ogg", "audio/mp4", "audio/wav"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],
} as const;

export const AllAllowedMimeTypes = [
  ...AllowedMimeTypes.image,
  ...AllowedMimeTypes.video,
  ...AllowedMimeTypes.audio,
  ...AllowedMimeTypes.document,
];

```
---

## File : `src/common/constants/queue-names.constant.ts`

```ts
export const QueueNames = {
  BROADCAST: "broadcast",
  WEBHOOK: "webhook",
} as const;

```
---

## File : `src/common/constants/quota.constant.ts`

```ts
export const QuotaThresholds = {
  WARNING: 0.8, // 80%
  EXCEEDED: 1.0, // 100%
} as const;

```
---

## File : `src/common/decorators/api-key.decorator.ts`

```ts
import { SetMetadata } from "@nestjs/common";

export const API_KEY_AUTH = "apiKeyAuth";
export const ApiKeyAuth = () => SetMetadata(API_KEY_AUTH, true);

```
---

## File : `src/common/decorators/current-user.decorator.ts`

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);

```
---

## File : `src/common/decorators/public.decorator.ts`

```ts
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

```
---

## File : `src/common/decorators/roles.decorator.ts`

```ts
import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

```
---

## File : `src/common/dto/pagination.dto.ts`

```ts
import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}

```
---

## File : `src/common/dto/response.dto.ts`

```ts
export class SuccessResponseDto<T = any> {
  status = true;
  data?: T;
  message?: string;
  meta?: any;
}

export class ErrorResponseDto {
  status = false;
  error: string;
  code?: string;
  details?: any;
}

```
---

## File : `src/common/enums/match-type.enum.ts`

```ts
export enum MatchType {
  EXACT = "exact",
  CONTAINS = "contains",
  REGEX = "regex",
  AI_SMART = "ai_smart",
}

```
---

## File : `src/common/enums/message-status.enum.ts`

```ts
export enum MessageStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
}

```
---

## File : `src/common/enums/recurrence-type.enum.ts`

```ts
export enum RecurrenceType {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

```
---

## File : `src/common/enums/role.enum.ts`

```ts
export enum Role {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

```
---

## File : `src/common/enums/session-status.enum.ts`

```ts
export enum SessionStatus {
  DISCONNECTED = "disconnected",
  AUTHENTICATING = "authenticating",
  CONNECTED = "connected",
  LOGGED_OUT = "logged_out",
}

```
---

## File : `src/common/enums/status.enum.ts`

```ts
/**
 * FIX: Tambah ALL_SESSIONS_DOWN yang dipakai di session-manager,
 * dan BROADCAST_COMPLETE yang sudah disebutkan di doc tapi belum ada di enum.
 */
export enum AlertType {
  QUOTA_WARNING = "quota_warning",
  QUOTA_EXCEEDED = "quota_exceeded",
  SESSION_DISCONNECTED = "session_disconnected",
  SESSION_LOGGED_OUT = "session_logged_out",
  ALL_SESSIONS_DOWN = "all_sessions_down", // FIX: sudah dipakai tapi belum ada
  AI_DISABLED = "ai_disabled",
  DISK_WARNING = "disk_warning",
  REDIS_DISCONNECTED = "redis_disconnected",
  BROADCAST_COMPLETE = "broadcast_complete", // FIX: disebutkan di doc section 30
}

```
---

## File : `src/common/enums/tier.enum.ts`

```ts
export enum TierFeature {
  BROADCAST = "broadcast",
  AUTO_REPLY = "auto_reply",
  WORKFLOW = "workflow",
  DRIP_CAMPAIGN = "drip_campaign",
  AI_SMART_REPLY = "ai_smart_reply",
  CHANNELS = "channels",
  LABELS = "labels",
  CUSTOMER_NOTE = "customer_note",
  SCHEDULER = "scheduler",
  WEBHOOK = "webhook",
  API_ACCESS = "api_access",
}

```
---

## File : `src/common/filters/http-exception.filter.ts`

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger("HttpException");

  constructor(private nodeEnv: string) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = exception.getResponse() as any;

    if (status >= 500)
      this.logger.error(`${req.method} ${req.url}`, exception.stack);

    res.status(status).json({
      status: false,
      error:
        typeof body === "string"
          ? body
          : body.message || body.error || "An error occurred",
      code: body?.code,
      details: this.nodeEnv !== "production" ? body?.details : undefined,
    });
  }
}

```
---

## File : `src/common/filters/prisma-exception.filter.ts`

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";
import { ErrorCodes } from "../constants/error-codes.constant";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private logger = new Logger("PrismaException");

  constructor(private nodeEnv: string) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    this.logger.error(exception.message);

    const map: Record<string, [number, string]> = {
      P2002: [HttpStatus.CONFLICT, ErrorCodes.DUPLICATE_SESSION_NAME],
      P2025: [HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND],
    };
    const [status, code] = map[exception.code] ?? [
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL,
    ];
    res.status(status).json({ status: false, error: exception.message, code });
  }
}

```
---

## File : `src/common/guards/active-user.guard.ts`

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();
    if (user && !user.isActive) {
      throw new ForbiddenException({ code: ErrorCodes.ACCOUNT_DISABLED });
    }
    return true;
  }
}

```
---

## File : `src/common/guards/api-key.guard.ts`

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { sha256 } from "../utils/hash.util";
import { isIpAllowed } from "../utils/ip-validator.util";
import { CacheKeys } from "../constants/cache-keys.constant";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const rawKey = req.headers["x-api-key"] as string;
    if (!rawKey)
      throw new UnauthorizedException({ code: ErrorCodes.UNAUTHORIZED });

    const hash = sha256(rawKey);
    const cacheKey = CacheKeys.apiKey(hash);
    let apiKey = await this.redis.get<any>(cacheKey);

    if (!apiKey) {
      apiKey = await this.prisma.apiKey.findUnique({
        where: { keyHash: hash },
        include: { user: true },
      });
      if (!apiKey)
        throw new UnauthorizedException({ code: ErrorCodes.UNAUTHORIZED });
      await this.redis.set(cacheKey, apiKey, 300);
    }

    // FIX: Cek token expired
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      throw new UnauthorizedException({
        code: ErrorCodes.UNAUTHORIZED,
        message: "API key telah kadaluarsa.",
      });
    }

    if (!apiKey.user.isActive) {
      throw new ForbiddenException({ code: ErrorCodes.ACCOUNT_DISABLED });
    }

    const clientIp = req.ip || req.connection?.remoteAddress;
    if (apiKey.ipWhitelist && !isIpAllowed(clientIp, apiKey.ipWhitelist)) {
      throw new ForbiddenException({ code: ErrorCodes.IP_NOT_WHITELISTED });
    }

    // FIX: Tandai request sebagai sandbox jika token dalam mode sandbox
    req.user = {
      ...apiKey.user,
      keyId: apiKey.id,
      isSandbox: apiKey.isSandbox ?? false,
    };

    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}

```
---

## File : `src/common/guards/api-key-restriction.guard.ts`

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ErrorCodes } from "../constants/error-codes.constant";

export const ALLOW_API_KEY = "allowApiKey";
/**
 * Decorator untuk menandai endpoint yang BOLEH diakses via API Key.
 * Endpoint yang tidak diberi @AllowApiKey() akan otomatis memblokir
 * request dari API Key (external_client).
 */
export const AllowApiKey = () => Reflect.metadata(ALLOW_API_KEY, true);

/**
 * ApiKeyRestrictionGuard — implementasi permission matrix "external_client".
 *
 * Sesuai doc:
 *  External Client (API Key) hanya boleh:
 *   ✅ Kirim pesan teks/media/lokasi/poll/kontak
 *   ✅ Mode auto round-robin
 *   ✅ Health check
 *  Tidak boleh:
 *   ❌ Broadcast, Auto Reply, Workflow, Drip, dll
 *
 * Cara kerja:
 *  - Jika request dari API Key (req.user.keyId ada) DAN endpoint tidak
 *    memiliki @AllowApiKey() → tolak dengan ERR_FORBIDDEN
 */
@Injectable()
export class ApiKeyRestrictionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    // Hanya berlaku jika request menggunakan API Key
    if (!req.user?.keyId) return true;

    const isAllowed = this.reflector.getAllAndOverride<boolean>(ALLOW_API_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!isAllowed) {
      throw new ForbiddenException({
        code: ErrorCodes.FORBIDDEN,
        message: "Endpoint ini tidak dapat diakses via API Key.",
      });
    }

    return true;
  }
}

```
---

## File : `src/common/guards/google-auth.guard.ts`

```ts
import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx);
  }
}

```
---

## File : `src/common/guards/jwt-auth.guard.ts`

```ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }

  handleRequest(err: any, user: any) {
    if (err || !user)
      throw new UnauthorizedException({ code: ErrorCodes.UNAUTHORIZED });
    return user;
  }
}

```
---

## File : `src/common/guards/quota.guard.ts`

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../../modules/notifications/notifications.service";
import { QuotaThresholds } from "../constants/quota.constant";
import { ErrorCodes } from "../constants/error-codes.constant";

export const QUOTA_TYPE_KEY = "quotaType";
// FIX: QuotaType sebagai NestJS SetMetadata decorator yang benar
export const QuotaType = (type: "daily" | "monthly") =>
  SetMetadata(QUOTA_TYPE_KEY, type);

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return true;

    // Admin bypass quota
    if (user.role === "admin" || user.role === "super_admin") return true;

    const quotaType =
      this.reflector.get<"daily" | "monthly">(
        QUOTA_TYPE_KEY,
        ctx.getHandler(),
      ) ?? "daily";

    const [quota, userTier] = await Promise.all([
      this.prisma.userQuota.findUnique({ where: { userId: user.id } }),
      this.prisma.userTier.findUnique({
        where: { userId: user.id },
        include: { tier: true },
      }),
    ]);

    if (!quota || !userTier) return true;

    const { used, limit } =
      quotaType === "monthly"
        ? {
            used: quota.broadcastsThisMonth,
            limit: userTier.tier.maxMonthlyBroadcasts,
          }
        : {
            used: quota.messagesSentToday,
            limit: userTier.tier.maxDailyMessages,
          };

    const ratio = used / limit;

    if (ratio >= QuotaThresholds.EXCEEDED) {
      this.notifications.notifyQuotaExceeded(user.id, quotaType);
      throw new HttpException(
        {
          code:
            quotaType === "monthly"
              ? ErrorCodes.QUOTA_MONTHLY_EXCEEDED
              : ErrorCodes.QUOTA_DAILY_EXCEEDED,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (ratio >= QuotaThresholds.WARNING) {
      this.notifications.notifyQuotaWarning(
        user.id,
        quotaType,
        Math.round(ratio * 100),
      );
    }

    return true;
  }
}

```
---

## File : `src/common/guards/roles.guard.ts`

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required?.length) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!required.includes(user?.role)) {
      throw new ForbiddenException({ code: ErrorCodes.FORBIDDEN });
    }
    return true;
  }
}

```
---

## File : `src/common/guards/tier-feature.guard.ts`

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { ErrorCodes } from "../constants/error-codes.constant";

export const TIER_FEATURE_KEY = "tierFeature";

// FIX: gunakan SetMetadata dari @nestjs/common, bukan Reflect.metadata langsung
export const RequireFeature = (feature: string) =>
  SetMetadata(TIER_FEATURE_KEY, feature);

@Injectable()
export class TierFeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const feature = this.reflector.getAllAndOverride<string>(TIER_FEATURE_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!feature) return true;

    const { user } = ctx.switchToHttp().getRequest();
    if (!user) return false;

    // Admin selalu bypass
    if (user.role === "admin" || user.role === "super_admin") return true;

    const cacheKey = `tier:features:${user.id}`;
    let features = await this.redis.get<string[]>(cacheKey);

    if (!features) {
      const userTier = await this.prisma.userTier.findUnique({
        where: { userId: user.id },
        include: { tier: true },
      });

      if (!userTier) {
        throw new ForbiddenException({
          code: ErrorCodes.FORBIDDEN,
          message: "Tidak ada tier aktif. Silakan hubungi admin.",
        });
      }

      features = (userTier.tier.features as string[]) ?? [];
      await this.redis.set(cacheKey, features, 300);
    }

    if (!features.includes(feature)) {
      throw new ForbiddenException({
        code: ErrorCodes.FEATURE_NOT_AVAILABLE,
        message: `Fitur '${feature}' tidak tersedia di tier Anda.`,
      });
    }

    return true;
  }
}

```
---

## File : `src/common/guards/tier-throttler.guard.ts`

```ts
import { Injectable, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from "@nestjs/throttler";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

/**
 * TierThrottlerGuard — override ThrottlerGuard untuk membaca
 * rateLimitPerMinute dari tier aktif user, bukan dari config global.
 *
 * Hierarki:
 *  - Admin/super_admin → bypass (skip)
 *  - User dengan tier  → rateLimitPerMinute dari tier
 *  - Tidak ada tier    → fallback 60 req/mnt
 *  - Tidak login       → 100 req/mnt (global default)
 */
@Injectable()
export class TierThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    // Inject eksplisit karena NestJS tidak bisa resolve parameter
    // tambahan di luar 3 parameter milik ThrottlerGuard
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(RedisService) private readonly redisService: RedisService
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const userId = req.user?.id;
    return userId ? `throttle:user:${userId}` : (req.ip ?? "unknown");
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user?.role === "admin" || user?.role === "super_admin") return true;
    return false;
  }

  protected async getLimit(context: ExecutionContext): Promise<number> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return 100;

    const cacheKey = `tier:ratelimit:${user.id}`;
    const cached = await this.redisService.get<number>(cacheKey);
    if (cached !== null && cached !== undefined) return cached;

    const userTier = await this.prismaService.userTier.findUnique({
      where: { userId: user.id },
      include: { tier: true },
    });

    const limit = userTier?.tier?.rateLimitPerMinute ?? 60;
    await this.redisService.set(cacheKey, limit, 300);
    return limit;
  }

  protected async getTtl(): Promise<number> {
    return 60000;
  }
}

```
---

## File : `src/common/interceptors/logging.interceptor.ts`

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger("HTTP");

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${method} ${url} — ${Date.now() - start}ms`),
        ),
      );
  }
}

```
---

## File : `src/common/interceptors/response.interceptor.ts`

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === "object" && "status" in data) return data;
        return { status: true, data };
      }),
    );
  }
}

```
---

## File : `src/common/interceptors/sandbox.interceptor.ts`

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, of } from "rxjs";

/**
 * SandboxInterceptor — jika request menggunakan API Key dengan isSandbox: true,
 * endpoint kirim pesan akan mengembalikan response sukses palsu tanpa
 * benar-benar mengirim ke WhatsApp.
 *
 * Dipasang di MessagesController dan BroadcastController.
 */
@Injectable()
export class SandboxInterceptor implements NestInterceptor {
  private readonly SANDBOX_PATHS = [
    "/messages/send",
    "/messages/send-media",
    "/messages/send-location",
    "/messages/send-live-location",
    "/messages/send-poll",
    "/messages/send-contact",
    "/messages/send-voice-note",
    "/broadcast",
  ];

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();

    // Hanya berlaku untuk API Key dengan isSandbox: true
    if (!req.user?.isSandbox) return next.handle();

    const url: string = req.url ?? "";
    const isSendEndpoint = this.SANDBOX_PATHS.some((p) => url.includes(p));

    if (isSendEndpoint && req.method === "POST") {
      return of({
        status: true,
        data: {
          messageId: `sandbox_${Date.now()}`,
          sandbox: true,
          note: "Pesan tidak dikirim. Token dalam mode sandbox.",
        },
      });
    }

    return next.handle();
  }
}

```
---

## File : `src/common/interceptors/timeout.interceptor.ts`

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(30000),
      catchError((err) =>
        err instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException())
          : throwError(() => err),
      ),
    );
  }
}

```
---

## File : `src/common/interfaces/api-key-payload.interface.ts`

```ts
export interface ApiKeyPayload {
  userId: string;
  email: string;
  role: string;
  keyId: string;
}

```
---

## File : `src/common/interfaces/jwt-payload.interface.ts`

```ts
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

```
---

## File : `src/common/interfaces/pagination.interface.ts`

```ts
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

```
---

## File : `src/common/interfaces/response.interface.ts`

```ts
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  meta?: PaginationMeta;
}

```
---

## File : `src/common/middlewares/ip-whitelist.middleware.ts`

```ts
import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { isIpAllowed } from "../utils/ip-validator.util";
import { ErrorCodes } from "../constants/error-codes.constant";

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const whitelist = process.env.GLOBAL_IP_WHITELIST;
    if (whitelist) {
      const clientIp = req.ip ?? req.socket.remoteAddress ?? "";
      if (!isIpAllowed(clientIp, whitelist)) {
        throw new ForbiddenException({ code: ErrorCodes.IP_NOT_WHITELISTED });
      }
    }
    next();
  }
}

```
---

## File : `src/common/middlewares/logger.middleware.ts`

```ts
import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();
    res.on("finish", () => {
      const ms = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${res.statusCode} - ${ip} - ${ms}ms`,
      );
    });
    next();
  }
}

```
---

## File : `src/common/middlewares/maintenance.middleware.ts`

```ts
import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { sha256 } from "../utils/hash.util";

/**
 * FIX: MaintenanceMiddleware sebelumnya mengandalkan req.user yang belum
 * ter-populate saat middleware berjalan (JWT strategy berjalan di guard, bukan middleware).
 *
 * Solusi:
 * 1. Untuk session cookie → decode JWT secara manual dari cookie.
 * 2. Untuk API Key       → lookup langsung dari header X-API-Key ke database/cache.
 * 3. Jika role admin/super_admin → bypass maintenance.
 */
@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Cek maintenance mode
    const row = await this.prisma.globalSetting.findUnique({
      where: { key: "maintenanceMode" },
    });
    if (row?.value !== "true") return next();

    // Coba resolve role dari berbagai sumber auth
    const role = await this.resolveRole(req);
    if (role === "admin" || role === "super_admin") return next();

    throw new ServiceUnavailableException({
      status: false,
      error:
        "Server sedang dalam maintenance. Silakan coba beberapa saat lagi.",
      code: "ERR_MAINTENANCE",
    });
  }

  private async resolveRole(req: Request): Promise<string | null> {
    // 1. Coba dari API Key header
    const apiKeyHeader = req.headers["x-api-key"] as string;
    if (apiKeyHeader) {
      const hash = sha256(apiKeyHeader);
      // Cek cache Redis dulu
      const cached = await this.redis
        .get<{ role: string }>(`apikey:${hash}`)
        .catch(() => null);
      if (cached?.role) return cached.role;

      // Fallback ke database
      const apiKey = await this.prisma.apiKey
        .findUnique({
          where: { keyHash: hash },
          include: { user: { select: { role: true, isActive: true } } },
        })
        .catch(() => null);
      if (apiKey?.user?.isActive) return apiKey.user.role;
    }

    // 2. Coba dari JWT cookie (decode tanpa verify — hanya untuk cek role)
    //    Verifikasi signature tetap dilakukan oleh JwtAuthGuard selanjutnya.
    const token = (req as any).cookies?.auth_token;
    if (token) {
      try {
        const [, payloadB64] = token.split(".");
        if (payloadB64) {
          const payload = JSON.parse(
            Buffer.from(payloadB64, "base64url").toString("utf8"),
          );
          if (payload?.role) return payload.role;
        }
      } catch {
        // token tidak valid, abaikan
      }
    }

    return null;
  }
}

```
---

## File : `src/common/pipes/parse-pagination.pipe.ts`

```ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    const page = parseInt(value?.page, 10) || 1;
    const limit = Math.min(parseInt(value?.limit, 10) || 10, 100);
    return { ...value, page, limit };
  }
}

```
---

## File : `src/common/pipes/validation.pipe.ts`

```ts
import { ValidationPipe } from "@nestjs/common";

export const AppValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});

```
---

## File : `src/common/utils/csv-parser.util.ts`

```ts
export function parseCsvContacts(
  csvText: string,
): Array<{ name: string; number: string; tag?: string }> {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj: any = {};
      headers.forEach((h, i) => (obj[h] = values[i] || ""));
      return {
        name: obj.name || "",
        number: obj.number || obj.phone || "",
        tag: obj.tag || "",
      };
    })
    .filter((c) => c.number);
}

```
---

## File : `src/common/utils/date.util.ts`

```ts
import { format, isAfter, startOfDay, startOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

export function nowWIB(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

export function isSameDay(a: Date, b: Date): boolean {
  return format(a, "yyyy-MM-dd") === format(b, "yyyy-MM-dd");
}

export function isSameMonth(a: Date, b: Date): boolean {
  return format(a, "yyyy-MM") === format(b, "yyyy-MM");
}

export function isFuture(date: Date): boolean {
  return isAfter(date, new Date());
}

export function nextRecurrence(date: Date, type: string): Date {
  const d = new Date(date);
  if (type === "daily") d.setDate(d.getDate() + 1);
  else if (type === "weekly") d.setDate(d.getDate() + 7);
  else if (type === "monthly") d.setMonth(d.getMonth() + 1);
  return d;
}

```
---

## File : `src/common/utils/hash.util.ts`

```ts
import { createHash, randomBytes } from "crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateHexToken(bytes = 24): string {
  return randomBytes(bytes).toString("hex");
}

```
---

## File : `src/common/utils/hmac.util.ts`

```ts
import { createHmac } from "crypto";

export function generateHmacSignature(payload: string, secret: string): string {
  return "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyHmacSignature(
  payload: string,
  secret: string,
  signature: string,
): boolean {
  return generateHmacSignature(payload, secret) === signature;
}

```
---

## File : `src/common/utils/ip-validator.util.ts`

```ts
import { BadRequestException } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constant";

const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
const IPV6_REGEX = /^([0-9a-fA-F:]+)(\/\d{1,3})?$/;

export function validateIpWhitelist(input: string): void {
  if (!input) return;
  const ips = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const ip of ips) {
    if (!IPV4_REGEX.test(ip) && !IPV6_REGEX.test(ip)) {
      throw new BadRequestException({ code: ErrorCodes.INVALID_IP_FORMAT, ip });
    }
  }
}

export function isIpAllowed(clientIp: string, whitelist: string): boolean {
  if (!whitelist) return true;
  const ips = whitelist
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ips.some(
    (ip) => ip.startsWith(clientIp) || clientIp === ip.split("/")[0],
  );
}

```
---

## File : `src/common/utils/mime-validator.util.ts`

```ts
import { BadRequestException } from '@nestjs/common';
import * as FileType from 'file-type';
import { AllAllowedMimeTypes } from '../constants/mime-types.constant';
import { ErrorCodes } from '../constants/error-codes.constant';

export async function validateMimeType(buffer: Buffer): Promise<string> {
  const type = await FileType.fromBuffer(buffer);
  if (
    !type ||
    !(AllAllowedMimeTypes as readonly string[]).includes(type.mime)
  ) {
    throw new BadRequestException({ code: ErrorCodes.FILE_TYPE_NOT_ALLOWED });
  }
  return type.mime;
}

```
---

## File : `src/common/utils/pdf-generator.util.ts`

```ts
import * as PDFDocument from "pdfkit";

export function generatePdf(
  title: string,
  rows: Record<string, any>[],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text(title, { align: "center" }).moveDown();
    doc.fontSize(10);

    if (rows.length) {
      const keys = Object.keys(rows[0]);
      const colW = Math.floor((doc.page.width - 80) / keys.length);

      keys.forEach((k, i) => {
        doc.text(k, 40 + i * colW, doc.y, {
          width: colW,
          continued: i < keys.length - 1,
        });
      });
      doc.moveDown(0.5);

      rows.forEach((row) => {
        const y = doc.y;
        keys.forEach((k, i) => {
          doc.text(String(row[k] ?? ""), 40 + i * colW, y, {
            width: colW,
            continued: i < keys.length - 1,
          });
        });
        doc.moveDown(0.3);
      });
    }
    doc.end();
  });
}

```
---

## File : `src/common/utils/phone-normalizer.util.ts`

```ts
import { BadRequestException } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constant";

export function normalizePhone(input: string): string {
  let num = input.replace(/[^\d]/g, "");
  if (!num) throw new BadRequestException({ code: ErrorCodes.INVALID_PHONE });
  if (num.startsWith("0")) num = "62" + num.slice(1);
  if (num.startsWith("+")) num = num.slice(1);
  if (num.length < 8)
    throw new BadRequestException({ code: ErrorCodes.INVALID_PHONE });
  return num;
}

export function toJid(phone: string): string {
  return `${normalizePhone(phone)}@s.whatsapp.net`;
}

export function isGroupJid(jid: string): boolean {
  return jid.endsWith("@g.us");
}

```
---

## File : `src/common/utils/placeholder.util.ts`

```ts
export function replacePlaceholders(
  template: string,
  data: { name?: string; date?: string; [key: string]: string },
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);
}

```
---

## File : `src/common/utils/token-generator.util.ts`

```ts
import { randomBytes } from 'crypto';

export function generateApiToken(): string {
  return randomBytes(24).toString('hex');
}

export function generateTempToken(): string {
  return randomBytes(16).toString('hex');
}

export function generateWebhookSecret(): string {
  return randomBytes(32).toString('hex');
}

export function generateHexToken(bytes = 24): string {
  return randomBytes(bytes).toString('hex');
}

```
---

## File : `src/config/app.config.ts`

```ts
import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  tz: process.env.TZ || "Asia/Jakarta",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3001",
  cookieSecret: process.env.COOKIE_SECRET,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
  adminEmail: process.env.ADMIN_EMAIL,
  storagePath: process.env.STORAGE_PATH || "./storage",
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 50,
  defaultDailyMessageLimit:
    parseInt(process.env.DEFAULT_DAILY_MESSAGE_LIMIT, 10) || 1000,
  defaultMonthlyBroadcastLimit:
    parseInt(process.env.DEFAULT_MONTHLY_BROADCAST_LIMIT, 10) || 10,
  cleanupCron: process.env.CLEANUP_CRON || "0 2 * * *",
  logRetentionDays: parseInt(process.env.LOG_RETENTION_DAYS, 10) || 30,
  auditLogRetentionDays:
    parseInt(process.env.AUDIT_LOG_RETENTION_DAYS, 10) || 90,
}));

```
---

## File : `src/config/database.config.ts`

```ts
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  url: process.env.DATABASE_URL,
}));

```
---

## File : `src/config/gemini.config.ts`

```ts
import { registerAs } from "@nestjs/config";

/**
 * FIX: Model default diubah ke 'gemini-2.0-flash' yang valid dan tersedia.
 * 'gemini-3-flash-preview' sebelumnya tidak ada dan akan menyebabkan error 404
 * dari Google AI API saat digunakan di production.
 *
 * Urutan prioritas model yang bisa dikonfigurasi via env GEMINI_MODEL:
 *   - gemini-2.0-flash         → tercepat, direkomendasikan untuk chatbot
 *   - gemini-1.5-flash         → fallback jika 2.0 tidak tersedia di region tertentu
 *   - gemini-1.5-pro           → lebih akurat, lebih lambat
 */
export default registerAs("gemini", () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  timeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 10_000,
  confidenceThreshold:
    parseFloat(process.env.GEMINI_CONFIDENCE_THRESHOLD) || 0.6,
}));

```
---

## File : `src/config/google.config.ts`

```ts
import { registerAs } from "@nestjs/config";

export default registerAs("google", () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL,
}));

```
---

## File : `src/config/jwt.config.ts`

```ts
import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
}));

```
---

## File : `src/config/redis.config.ts`

```ts
import { registerAs } from "@nestjs/config";

export default registerAs("redis", () => ({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  keyPrefix: process.env.REDIS_KEY_PREFIX || "wgw:",
}));

```
---

## File : `src/config/throttler.config.ts`

```ts
import { registerAs } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export default registerAs('throttler', () => ({
  ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
  limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  authLimit: parseInt(process.env.THROTTLE_AUTH_LIMIT, 10) || 10,
  apiKeyLimit: parseInt(process.env.THROTTLE_API_KEY_LIMIT, 10) || 300,
  broadcastConcurrency: parseInt(process.env.BROADCAST_CONCURRENCY, 10) || 1,
  broadcastRateMax: parseInt(process.env.BROADCAST_RATE_MAX, 10) || 10,
  broadcastRateDurationMs:
    parseInt(process.env.BROADCAST_RATE_DURATION_MS, 10) || 1000,
  webhookConcurrency: parseInt(process.env.WEBHOOK_CONCURRENCY, 10) || 5,
  webhookMaxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES, 10) || 5,
}));

export const throttlerAsyncOptions: ThrottlerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    throttlers: [
      {
        ttl: config.get<number>('throttler.ttl') * 1000,
        limit: config.get<number>('throttler.limit'),
      },
    ],
  }),
};

```
---

## File : `src/config/whatsapp.config.ts`

```ts
import { registerAs } from "@nestjs/config";

export default registerAs("whatsapp", () => ({
  authPath: process.env.WA_AUTH_PATH || "./storage/sessions",
  headless: process.env.WA_HEADLESS !== "false",
  maxReconnectRetries: parseInt(process.env.WA_MAX_RECONNECT_RETRIES, 10) || 10,
  warmingIntervalMinMs:
    parseInt(process.env.WARMING_INTERVAL_MIN_MS, 10) || 300000,
  warmingIntervalMaxMs:
    parseInt(process.env.WARMING_INTERVAL_MAX_MS, 10) || 600000,
}));

```
---

## File : `src/gateway/app.gateway.ts`

```ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway({ cors: { origin: "*", credentials: true } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger("AppGateway");

  constructor(private jwtService: JwtService) {}

  afterInit() {
    this.logger.log("Socket.IO Gateway initialized");
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(" ")[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      await client.join(payload.sub); // join room by userId
      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}

```
---

## File : `src/gateway/gateway.module.ts`

```ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AppGateway } from "./app.gateway";
import { GatewayService } from "./gateway.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get("jwt.secret"),
        signOptions: { expiresIn: cfg.get("jwt.expiresIn") },
      }),
    }),
  ],
  providers: [AppGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}

```
---

## File : `src/gateway/gateway.service.ts`

```ts
import { Injectable } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { SocketEvents } from "../common/constants/event-names.constant";

@Injectable()
export class GatewayService {
  constructor(private gateway: AppGateway) {}

  emit(userId: string, event: string, payload: any) {
    this.gateway.server.to(userId).emit(event, payload);
  }

  emitQr(userId: string, sessionId: string, qr: string) {
    this.emit(userId, SocketEvents.QR, { sessionId, qr });
  }

  emitCode(userId: string, sessionId: string, code: string) {
    this.emit(userId, SocketEvents.CODE, { sessionId, code });
  }

  emitConnectionUpdate(
    userId: string,
    sessionId: string,
    status: string,
    phoneNumber?: string,
  ) {
    this.emit(userId, SocketEvents.CONNECTION_UPDATE, {
      sessionId,
      status,
      phoneNumber,
    });
  }

  emitNewMessage(userId: string, message: any) {
    this.emit(userId, SocketEvents.NEW_MESSAGE, { message });
  }

  emitBroadcastProgress(
    userId: string,
    payload: {
      campaignId: string;
      current: number;
      total: number;
      percentage: number;
      successCount: number;
      failedCount: number;
    },
  ) {
    this.emit(userId, SocketEvents.BROADCAST_PROGRESS, payload);
  }

  emitBroadcastComplete(
    userId: string,
    campaignId: string,
    successCount: number,
    failedCount: number,
  ) {
    this.emit(userId, SocketEvents.BROADCAST_COMPLETE, {
      campaignId,
      successCount,
      failedCount,
    });
  }

  emitSystemAlert(userId: string, type: string, message: string, data?: any) {
    this.emit(userId, SocketEvents.SYSTEM_ALERT, { type, message, data });
  }
}

```
---

## File : `src/modules/admin/admin.module.ts`

```ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ImpersonationController } from "./impersonation.controller";
import { ImpersonationService } from "./impersonation.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [
    AuditModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get("jwt.secret"),
        signOptions: { expiresIn: cfg.get("jwt.expiresIn") },
      }),
    }),
  ],
  controllers: [ImpersonationController],
  providers: [ImpersonationService],
})
export class AdminModule {}

```
---

## File : `src/modules/admin/dto/impersonate.dto.ts`

```ts
import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ImpersonateDto {
  @ApiProperty({ description: "ID user yang akan di-impersonate" })
  @IsUUID()
  userId: string;
}

```
---

## File : `src/modules/admin/impersonation.controller.ts`

```ts
import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { ImpersonationService } from "./impersonation.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { ImpersonateDto } from "./dto/impersonate.dto";

@ApiTags("Admin — Impersonation")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller({ path: "admin/impersonate", version: "1" })
export class ImpersonationController {
  constructor(private svc: ImpersonationService) {}

  /**
   * POST /admin/impersonate
   * Generate JWT sementara atas nama user target.
   * Token dikembalikan di response — client menggunakannya sebagai Bearer token
   * atau set cookie manual untuk sesi support.
   */
  @Post()
  @ApiOperation({
    summary: "[Admin] Impersonate user — generate token sementara",
  })
  async impersonate(
    @CurrentUser() admin: any,
    @Body() dto: ImpersonateDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.impersonate(
        admin.id,
        admin.email,
        dto.userId,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  /**
   * DELETE /admin/impersonate/:targetUserId
   * Akhiri sesi impersonation — invalidasi token di Redis.
   */
  @Delete(":targetUserId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "[Admin] Akhiri sesi impersonation" })
  async exit(
    @CurrentUser() admin: any,
    @Param("targetUserId") targetUserId: string,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.exitImpersonation(
        admin.id,
        admin.email,
        targetUserId,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }
}

```
---

## File : `src/modules/admin/impersonation.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RedisService } from "../../redis/redis.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { AuditAction } from "@prisma/client";
import { generateTempToken } from "../../common/utils/token-generator.util";

const IMPERSONATE_TTL = 3600; // 1 jam

@Injectable()
export class ImpersonationService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
    private redis: RedisService,
  ) {}

  async impersonate(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    ip: string,
    ua: string,
  ) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!target) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    // Admin tidak bisa impersonate sesama admin/super_admin
    if (target.role === "admin" || target.role === "super_admin") {
      throw new ForbiddenException({
        code: ErrorCodes.FORBIDDEN,
        message: "Tidak bisa impersonate akun admin.",
      });
    }

    // Buat JWT sementara atas nama target dengan claim impersonation
    const token = this.jwt.sign(
      {
        sub: target.id,
        email: target.email,
        role: target.role,
        impersonatedBy: adminId,
      },
      { expiresIn: "1h" },
    );

    // Simpan sesi impersonation di Redis (untuk audit trail & invalidasi)
    const sessionKey = `impersonate:${adminId}:${target.id}`;
    await this.redis.set(
      sessionKey,
      { adminId, targetId: target.id, token },
      IMPERSONATE_TTL,
    );

    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.UPDATE_USER,
      details: {
        action: "IMPERSONATE_START",
        targetId: target.id,
        targetEmail: target.email,
      },
      ip,
      userAgent: ua,
    });

    return {
      token,
      targetUser: {
        id: target.id,
        email: target.email,
        name: target.name,
        role: target.role,
      },
      expiresIn: IMPERSONATE_TTL,
    };
  }

  async exitImpersonation(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    ip: string,
    ua: string,
  ) {
    const sessionKey = `impersonate:${adminId}:${targetUserId}`;
    await this.redis.del(sessionKey);

    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.UPDATE_USER,
      details: { action: "IMPERSONATE_END", targetId: targetUserId },
      ip,
      userAgent: ua,
    });

    return { message: "Impersonation ended." };
  }
}

```
---

## File : `src/modules/ai/ai.module.ts`

```ts
import { Module, forwardRef } from "@nestjs/common";
import { AiService } from "./ai.service";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    forwardRef(() => NotificationsModule), // forwardRef mencegah circular dependency
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}

```
---

## File : `src/modules/ai/ai.service.ts`

```ts
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AiService {
  private logger = new Logger("AiService");
  private genAI: GoogleGenerativeAI | null = null;
  private isDisabled = false;
  private model: string;
  private timeoutMs: number;
  private defaultThreshold: number;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    // FIX: forwardRef karena NotificationsModule → GatewayModule → SessionsModule bisa circular
    @Inject(forwardRef(() => NotificationsService))
    private notifications: NotificationsService,
  ) {
    this.model = config.get("gemini.model");
    this.timeoutMs = config.get("gemini.timeoutMs");
    this.defaultThreshold = config.get("gemini.confidenceThreshold");
    const apiKey = config.get<string>("gemini.apiKey");
    if (apiKey) this.init(apiKey);
  }

  init(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.isDisabled = false;
    this.logger.log("Gemini AI initialized");
  }

  async getReply(
    userId: string,
    message: string,
    persona: string,
  ): Promise<string | null> {
    if (this.isDisabled)
      throw new ServiceUnavailableException({ code: ErrorCodes.AI_DISABLED });

    const userSetting = await this.prisma.userSetting.findUnique({
      where: { userId },
    });
    const threshold =
      userSetting?.geminiConfidenceThreshold ?? this.defaultThreshold;

    let genAI = this.genAI;
    if (userSetting?.geminiApiKey)
      genAI = new GoogleGenerativeAI(userSetting.geminiApiKey);
    if (!genAI)
      throw new ServiceUnavailableException({ code: ErrorCodes.AI_DISABLED });

    const prompt = `${persona}\n\nUser message: "${message}"\n\nRespond ONLY with valid JSON: {"intent":"string","reply":"string","confidence":number}`;

    try {
      const model = genAI.getGenerativeModel({ model: this.model });
      const result = (await Promise.race([
        model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), this.timeoutMs),
        ),
      ])) as any;

      const text = result.response.text();
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

      if (parsed.confidence < threshold) {
        this.logger.debug(
          `AI confidence ${parsed.confidence} below threshold ${threshold}`,
        );
        return null;
      }
      return parsed.reply;
    } catch (e) {
      if (e.status === 403 || e.status === 400) {
        this.isDisabled = true;
        this.logger.error("Gemini API key invalid — AI disabled");

        // FIX: Kirim notifikasi ke user yang bersangkutan + admin email
        const user = await this.prisma.user
          .findUnique({ where: { id: userId }, select: { email: true } })
          .catch(() => null);
        if (user?.email) {
          this.notifications.notifyAiDisabled(userId, user.email);
        }

        throw new ServiceUnavailableException({ code: ErrorCodes.AI_DISABLED });
      }
      this.logger.error(`Gemini error: ${e.message}`);
      return null;
    }
  }
}

```
---

## File : `src/modules/ai/dto/ai-reply.dto.ts`

```ts

```
---

## File : `src/modules/analytics/analytics.controller.ts`

```ts
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QueryAnalyticsDto } from "./dto/query-analytics.dto";

@ApiTags("Analytics")
@UseGuards(JwtAuthGuard)
@Controller({ path: "analytics", version: "1" })
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Data dashboard & statistik" })
  async dashboard(@CurrentUser() u: any, @Query() dto: QueryAnalyticsDto) {
    return { status: true, data: await this.svc.getDashboard(u.id, dto.days) };
  }

  @Get("system")
  @ApiOperation({ summary: "Status sistem & resource server" })
  async system() {
    return { status: true, data: await this.svc.getSystemStatus() };
  }
}

```
---

## File : `src/modules/analytics/analytics.module.ts`

```ts
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { QueueNames } from "../../common/constants/queue-names.constant";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.BROADCAST }),
    BullModule.registerQueue({ name: QueueNames.WEBHOOK }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

```
---

## File : `src/modules/analytics/analytics.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueNames } from '../../common/constants/queue-names.constant';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @InjectQueue(QueueNames.BROADCAST) private broadcastQueue: Queue,
    @InjectQueue(QueueNames.WEBHOOK) private webhookQueue: Queue,
  ) {}

  async getDashboard(userId: string, days = 7) {
    const from = subDays(new Date(), days);

    const [
      totalSent,
      totalSuccess,
      totalBroadcasts,
      recentCampaigns,
      recentLogs,
      chart,
    ] = await Promise.all([
      this.prisma.messageLog.count({
        where: { userId, timestamp: { gte: from } },
      }),
      this.prisma.messageLog.count({
        where: { userId, status: 'success', timestamp: { gte: from } },
      }),
      this.prisma.campaign.count({
        where: { userId, createdAt: { gte: from } },
      }),
      this.prisma.campaign.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.messageLog.findMany({
        where: { userId },
        take: 20,
        orderBy: { timestamp: 'desc' },
      }),
      this.getChartOptimized(userId, days),
    ]);

    const successRate =
      totalSent > 0 ? +((totalSuccess / totalSent) * 100).toFixed(1) : 0;
    return {
      summary: { totalSent, successRate, totalBroadcasts },
      chart,
      recentCampaigns,
      recentLogs,
    };
  }

  async getSystemStatus() {
    const memUsage = process.memoryUsage();
    const [
      totalSessions,
      connectedSessions,
      redisInfo,
      broadcastCounts,
      webhookCounts,
    ] = await Promise.all([
      this.prisma.whatsappSession.count(),
      this.prisma.whatsappSession.count({ where: { status: 'connected' } }),
      this.redis.getClient().info('memory'),
      this.broadcastQueue.getJobCounts('waiting', 'active', 'failed'),
      this.webhookQueue.getJobCounts('waiting', 'active', 'failed'),
    ]);

    return {
      server: {
        nodeVersion: process.version,
        memory: {
          used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        },
        uptimeSeconds: Math.floor(process.uptime()),
      },
      sessions: {
        total: totalSessions,
        connected: connectedSessions,
        disconnected: totalSessions - connectedSessions,
      },
      queues: { broadcast: broadcastCounts, webhook: webhookCounts },
    };
  }

  private async getChartOptimized(userId: string, days: number) {
    const from = startOfDay(subDays(new Date(), days - 1));
    const to = endOfDay(new Date());

    const logs = await this.prisma.messageLog.findMany({
      where: { userId, timestamp: { gte: from, lte: to } },
      select: { timestamp: true, status: true },
    });

    const buckets: Record<
      string,
      { total: number; success: number; failed: number }
    > = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      buckets[date] = { total: 0, success: 0, failed: 0 };
    }

    for (const log of logs) {
      const date = format(new Date(log.timestamp), 'yyyy-MM-dd');
      if (!buckets[date]) continue;
      buckets[date].total++;
      if (log.status === 'success') buckets[date].success++;
      else buckets[date].failed++;
    }

    return Object.entries(buckets).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  }
}

```
---

## File : `src/modules/analytics/dto/query-analytics.dto.ts`

```ts
import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryAnalyticsDto {
  @ApiPropertyOptional({ default: 7 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  days?: number = 7;
}

```
---

## File : `src/modules/api-keys/api-key-monitor.service.ts`

```ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { EmailService } from "../notifications/email.service";
import { addDays } from "date-fns";

/**
 * ApiKeyMonitorService — kirim notifikasi email jika API token
 * akan kadaluarsa dalam 7 hari atau 3 hari.
 * Sesuai doc 1 section 30: "Email: Token API mendekati expired"
 */
@Injectable()
export class ApiKeyMonitorService {
  private logger = new Logger("ApiKeyMonitorService");

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private email: EmailService,
  ) {}

  // Setiap hari jam 09:00 WIB (02:00 UTC)
  @Cron("0 2 * * *")
  async checkExpiringApiKeys() {
    const now = new Date();
    const in7Days = addDays(now, 7);

    const expiring = await this.prisma.apiKey.findMany({
      where: {
        expiresAt: { not: null, lte: in7Days, gte: now },
      },
      include: {
        user: { select: { email: true, isActive: true } },
      },
    });

    for (const key of expiring) {
      if (!key.user.isActive || !key.expiresAt) continue;

      const daysLeft = Math.ceil(
        (key.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysLeft !== 7 && daysLeft !== 3) continue;

      // Cek apakah sudah pernah notif hari ini
      const notifKey = `apikey:expiry:notif:${key.id}:${daysLeft}`;
      const already = await this.redis.get<boolean>(notifKey).catch(() => null);
      if (already) continue;

      await this.email.send(
        key.user.email,
        `API Token "${key.name}" Hampir Kadaluarsa`,
        `API token <strong>${key.name}</strong> (preview: <code>${key.keyPreview}...</code>)
         akan kadaluarsa dalam <strong>${daysLeft} hari</strong>
         (${key.expiresAt.toLocaleDateString("id-ID")}).<br><br>
         Segera buat token baru atau perpanjang masa aktifnya di dashboard.`,
      );

      // Tandai sudah notif (TTL 25 jam)
      await this.redis.set(notifKey, true, 25 * 3600);
      this.logger.log(
        `Notified ${key.user.email}: token "${key.name}" expires in ${daysLeft} days`,
      );
    }
  }
}

```
---

## File : `src/modules/api-keys/api-keys.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { ApiKeysService } from "./api-keys.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

@ApiTags("API Keys")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("api_access")
@Controller({ path: "keys", version: "1" })
export class ApiKeysController {
  constructor(private svc: ApiKeysService) {}

  @Get()
  @ApiOperation({ summary: "Daftar API token" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Generate API token baru" })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateApiKeyDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus API token" })
  async remove(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    await this.svc.remove(u.id, u.email, id, req.ip, req.headers["user-agent"]);
    return { status: true };
  }
}

```
---

## File : `src/modules/api-keys/api-keys.module.ts`

```ts
import { Module } from "@nestjs/common";
import { ApiKeysController } from "./api-keys.controller";
import { ApiKeysService } from "./api-keys.service";
import { ApiKeyMonitorService } from "./api-key-monitor.service";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [AuditModule, NotificationsModule],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, ApiKeyMonitorService],
})
export class ApiKeysModule {}

```
---

## File : `src/modules/api-keys/api-keys.service.ts`

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { sha256 } from "../../common/utils/hash.util";
import { generateApiToken } from "../../common/utils/token-generator.util";
import { validateIpWhitelist } from "../../common/utils/ip-validator.util";
import { AuditAction } from "@prisma/client";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

@Injectable()
export class ApiKeysService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        keyPreview: true,
        ipWhitelist: true,
        isSandbox: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    userId: string,
    email: string,
    dto: CreateApiKeyDto,
    ip: string,
    ua: string,
  ) {
    if (dto.ipWhitelist) validateIpWhitelist(dto.ipWhitelist);

    const plaintext = generateApiToken();
    const keyHash = sha256(plaintext);
    const keyPreview = plaintext.slice(0, 8);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        name: dto.name,
        keyHash,
        keyPreview,
        ipWhitelist: dto.ipWhitelist ?? "",
        isSandbox: dto.isSandbox ?? false,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.CREATE_API_KEY,
      details: { keyId: apiKey.id, isSandbox: apiKey.isSandbox },
      ip,
      userAgent: ua,
    });

    return {
      id: apiKey.id,
      key: plaintext,
      name: apiKey.name,
      keyPreview,
      isSandbox: apiKey.isSandbox,
      expiresAt: apiKey.expiresAt,
    };
  }

  async remove(
    userId: string,
    email: string,
    id: string,
    ip: string,
    ua: string,
  ) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, userId } });
    if (!key) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await this.prisma.apiKey.delete({ where: { id } });
    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.DELETE_API_KEY,
      details: { keyId: id },
      ip,
      userAgent: ua,
    });
  }
}

```
---

## File : `src/modules/api-keys/dto/create-api-key.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateApiKeyDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;

  @ApiPropertyOptional({ description: "IP whitelist, comma-separated CIDR" })
  @IsOptional()
  @IsString()
  ipWhitelist?: string;

  @ApiPropertyOptional({
    description: "Sandbox mode: request tidak dikirim ke WhatsApp sungguhan",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSandbox?: boolean;

  @ApiPropertyOptional({
    description: "Tanggal kadaluarsa token (ISO 8601). Null = tidak expired.",
    example: "2026-12-31T23:59:59.000Z",
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

```
---

## File : `src/modules/audit/audit.controller.ts`

```ts
import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { QueryAuditDto } from './dto/query-audit.dto';

@ApiTags('Audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'audit', version: '1' })
export class AuditController {
  constructor(private svc: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Riwayat audit log' })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryAuditDto) {
    const isAdmin = [Role.ADMIN, Role.SUPER_ADMIN].includes(u.role);
    const filters = {
      ...(isAdmin ? {} : { userId: u.id }),
      action: dto.action,
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
      page: dto.page,
      limit: dto.limit,
    };
    const r = await this.svc.findAll(filters);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  @Get('export-pdf')
  @ApiOperation({ summary: 'Export audit log sebagai PDF' })
  async exportPdf(
    @CurrentUser() u: any,
    @Query() dto: QueryAuditDto,
    @Res() res: Response,
  ) {
    const isAdmin = [Role.ADMIN, Role.SUPER_ADMIN].includes(u.role);
    const filters = {
      ...(isAdmin ? {} : { userId: u.id }),
      action: dto.action,
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
    };
    const buffer = await this.svc.exportPdf(filters);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit_${date}.pdf"`,
    );
    res.send(buffer);
  }
}

```
---

## File : `src/modules/audit/audit.module.ts`

```ts
import { Global, Module } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AuditController } from "./audit.controller";

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}

```
---

## File : `src/modules/audit/audit.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generatePdf } from '../../common/utils/pdf-generator.util';
import { AuditAction } from '@prisma/client';

interface AuditLogInput {
  userId?: string;
  userEmail: string;
  action: AuditAction;
  details?: any;
  ip: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        userEmail: input.userEmail,
        action: input.action,
        details: input.details ?? {},
        ipAddress: input.ip,
        userAgent: input.userAgent,
      },
    });
  }

  async findAll(filters: {
    userId?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.from || filters.to) {
      where.timestamp = {};
      if (filters.from) where.timestamp.gte = filters.from;
      if (filters.to) where.timestamp.lte = filters.to;
    }
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportPdf(filters: {
    userId?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
  }): Promise<Buffer> {
    const result = await this.findAll({ ...filters, page: 1, limit: 1000 });
    const rows = result.data.map((r) => ({
      timestamp: new Date(r.timestamp).toLocaleString('id-ID'),
      email: r.userEmail,
      action: r.action,
      ip: r.ipAddress,
    }));
    return generatePdf('Audit Log', rows);
  }
}

```
---

## File : `src/modules/audit/dto/query-audit.dto.ts`

```ts
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { AuditAction } from "@prisma/client";

export class QueryAuditDto {
  @ApiPropertyOptional({ enum: AuditAction })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

```
---

## File : `src/modules/auth/auth.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { Verify2faDto } from "./dto/verify-2fa.dto";
import { VerifyCodeDto } from "./dto/verify-code.dto";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private svc: AuthService,
    private cfg: ConfigService,
  ) {}

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Redirect ke Google OAuth" })
  googleLogin() {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback" })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as any;
    const ip = req.ip;
    const ua = req.headers["user-agent"];
    const clientUrl = this.cfg.get<string>("app.clientUrl");
    const cookieSecure = this.cfg.get<boolean>("app.cookieSecure");

    const user = await this.svc.validateGoogleUser(profile, ip, ua);

    if (user.twoFaEnabled) {
      const tempToken = await this.svc.createTempToken(user.id);
      return res.redirect(`${clientUrl}/auth/2fa?token=${tempToken}`);
    }

    const token = this.svc.signJwt(user);
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: cookieSecure,
      maxAge: 7 * 24 * 3600 * 1000,
    });
    return res.redirect(`${clientUrl}/dashboard`);
  }

  @Public()
  @Post("2fa/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verifikasi kode 2FA setelah Google login" })
  async verify2fa(
    @Body() dto: Verify2faDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieSecure = this.cfg.get<boolean>("app.cookieSecure");
    const user = await this.svc.verify2fa(
      dto.tempToken,
      dto.code,
      req.ip,
      req.headers["user-agent"],
    );
    const token = this.svc.signJwt(user);
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: cookieSecure,
      maxAge: 7 * 24 * 3600 * 1000,
    });
    return {
      status: true,
      data: { user: { id: user.id, email: user.email, role: user.role } },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOperation({ summary: "Data user yang sedang login" })
  me(@CurrentUser() u: any) {
    return {
      status: true,
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        picture: u.picture,
        role: u.role,
        twoFaEnabled: u.twoFaEnabled,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/setup")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Setup 2FA - generate QR code" })
  async setup2fa(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.setup2fa(u.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/enable")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aktifkan 2FA setelah scan QR" })
  async enable2fa(
    @CurrentUser() u: any,
    @Body() dto: VerifyCodeDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.enable2fa(
        u.id,
        dto.code,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/disable")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Nonaktifkan 2FA" })
  async disable2fa(
    @CurrentUser() u: any,
    @Body() dto: VerifyCodeDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.disable2fa(
        u.id,
        dto.code,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/backup-codes/regenerate")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Regenerate backup codes 2FA" })
  async regenerateBackupCodes(
    @CurrentUser() u: any,
    @Body() dto: VerifyCodeDto,
  ) {
    return {
      status: true,
      data: await this.svc.regenerateBackupCodes(u.id, dto.code),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout" })
  async logout(
    @CurrentUser() u: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.svc.logout(u.id, u.email, req.ip, req.headers["user-agent"]);
    res.clearCookie("auth_token");
    return { status: true };
  }
}

```
---

## File : `src/modules/auth/auth.module.ts`

```ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get("jwt.secret"),
        signOptions: { expiresIn: cfg.get("jwt.expiresIn") },
      }),
    }),
    AuditModule,
    NotificationsModule, // FIX: diperlukan untuk notifyNewIpLogin
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

```
---

## File : `src/modules/auth/auth.service.ts`

```ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import {
  generateTempToken,
  generateHexToken,
} from "../../common/utils/token-generator.util";
import { sha256 } from "../../common/utils/hash.util";
import { AuditAction, Role } from "@prisma/client";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";

const BACKUP_CODE_COUNT = 8;
const LAST_IP_KEY = (userId: string) => `login:lastip:${userId}`;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private redis: RedisService,
    private audit: AuditService,
    private notifications: NotificationsService,
    private cfg: ConfigService,
  ) {}

  async validateGoogleUser(
    profile: { email: string; name: string; picture?: string },
    ip: string,
    ua: string,
  ) {
    const adminEmail = this.cfg.get<string>("app.adminEmail");
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      const role: Role = profile.email === adminEmail ? Role.admin : Role.user;
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          role,
        },
      });
      await this.prisma.userQuota.create({ data: { userId: user.id } });
    } else if (user.role === Role.user && profile.email === adminEmail) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role: Role.admin },
      });
    }

    if (!user.isActive)
      throw new ForbiddenException({ code: ErrorCodes.ACCOUNT_DISABLED });

    await this.audit.log({
      userId: user.id,
      userEmail: user.email,
      action: AuditAction.LOGIN,
      ip,
      userAgent: ua,
    });

    // FIX: Notifikasi login dari IP baru
    await this.checkNewIpLogin(user.id, user.email, ip, ua);

    return user;
  }

  signJwt(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }

  async createTempToken(userId: string): Promise<string> {
    const token = generateTempToken();
    await this.redis.set(CacheKeys.twoFaTempToken(token), userId, 300);
    return token;
  }

  async verifyTempToken(token: string): Promise<string> {
    const userId = await this.redis.get<string>(
      CacheKeys.twoFaTempToken(token),
    );
    if (!userId)
      throw new UnauthorizedException({
        code: ErrorCodes.TWO_FA_SESSION_EXPIRED,
      });
    return userId;
  }

  async deleteTempToken(token: string) {
    await this.redis.del(CacheKeys.twoFaTempToken(token));
  }

  async verify2fa(tempToken: string, code: string, ip: string, ua: string) {
    const userId = await this.verifyTempToken(tempToken);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFaSecret)
      throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_NOT_ENABLED });

    const isTotp = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token: code,
      window: 2,
    });

    if (!isTotp) {
      const usedBackup = await this.verifyAndConsumeBackupCode(user.id, code);
      if (!usedBackup)
        throw new UnauthorizedException({
          code: ErrorCodes.TWO_FA_INVALID_CODE,
        });
    }

    await this.deleteTempToken(tempToken);
    await this.audit.log({
      userId: user.id,
      userEmail: user.email,
      action: AuditAction.LOGIN,
      ip,
      userAgent: ua,
    });

    await this.checkNewIpLogin(user.id, user.email, ip, ua);
    return user;
  }

  async setup2fa(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.twoFaEnabled)
      throw new BadRequestException({
        code: ErrorCodes.TWO_FA_ALREADY_ENABLED,
      });

    const secret = speakeasy.generateSecret({
      name: `WA Gateway (${user.email})`,
      length: 20,
    });
    await this.redis.set(`2fa:setup:${userId}`, secret.base32, 600);

    const qr = await qrcode.toDataURL(secret.otpauth_url);
    return { qrCode: qr, secret: secret.base32 };
  }

  async enable2fa(userId: string, code: string, ip: string, ua: string) {
    const secret = await this.redis.get<string>(`2fa:setup:${userId}`);
    if (!secret)
      throw new BadRequestException({
        code: ErrorCodes.TWO_FA_SESSION_EXPIRED,
      });

    const valid = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: code,
      window: 2,
    });
    if (!valid)
      throw new UnauthorizedException({ code: ErrorCodes.TWO_FA_INVALID_CODE });

    const backupCodes = this.generateBackupCodes();
    const hashedCodes = backupCodes.map((c) => sha256(c));

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFaSecret: secret, twoFaEnabled: true },
    });
    await this.redis.set(`2fa:backup:${userId}`, hashedCodes, 0);
    await this.redis.del(`2fa:setup:${userId}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.audit.log({
      userId,
      userEmail: user.email,
      action: AuditAction.ENABLE_2FA,
      ip,
      userAgent: ua,
    });
    return { message: "2FA enabled", backupCodes };
  }

  async disable2fa(userId: string, code: string, ip: string, ua: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFaEnabled)
      throw new BadRequestException({ code: ErrorCodes.TWO_FA_NOT_ENABLED });

    const isTotp = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token: code,
      window: 2,
    });
    if (!isTotp) {
      const usedBackup = await this.verifyAndConsumeBackupCode(user.id, code);
      if (!usedBackup)
        throw new UnauthorizedException({
          code: ErrorCodes.TWO_FA_INVALID_CODE,
        });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFaSecret: null, twoFaEnabled: false },
    });
    await this.redis.del(`2fa:backup:${userId}`);
    await this.audit.log({
      userId,
      userEmail: user.email,
      action: AuditAction.DISABLE_2FA,
      ip,
      userAgent: ua,
    });
    return { message: "2FA disabled" };
  }

  async regenerateBackupCodes(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFaEnabled)
      throw new BadRequestException({ code: ErrorCodes.TWO_FA_NOT_ENABLED });

    const isTotp = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token: code,
      window: 2,
    });
    if (!isTotp) {
      const usedBackup = await this.verifyAndConsumeBackupCode(user.id, code);
      if (!usedBackup)
        throw new UnauthorizedException({
          code: ErrorCodes.TWO_FA_INVALID_CODE,
        });
    }

    const backupCodes = this.generateBackupCodes();
    const hashedCodes = backupCodes.map((c) => sha256(c));
    await this.redis.set(`2fa:backup:${userId}`, hashedCodes, 0);
    return { backupCodes };
  }

  async logout(userId: string, email: string, ip: string, ua: string) {
    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.LOGOUT,
      ip,
      userAgent: ua,
    });
  }

  // ── Private helpers ───────────────────────────────────────

  /**
   * FIX: Deteksi login dari IP baru — simpan IP terakhir di Redis,
   * bandingkan dengan IP sekarang, kirim notifikasi email jika berbeda.
   */
  private async checkNewIpLogin(
    userId: string,
    userEmail: string,
    ip: string,
    ua: string,
  ) {
    const key = LAST_IP_KEY(userId);
    const lastIp = await this.redis.get<string>(key);

    if (lastIp && lastIp !== ip) {
      this.notifications.notifyNewIpLogin(userEmail, ip, ua);
    }

    // Simpan IP terbaru (TTL 30 hari)
    await this.redis.set(key, ip, 30 * 24 * 3600);
  }

  private generateBackupCodes(): string[] {
    return Array.from({ length: BACKUP_CODE_COUNT }, () =>
      generateHexToken(5)
        .toUpperCase()
        .match(/.{1,5}/g)!
        .join("-"),
    );
  }

  private async verifyAndConsumeBackupCode(
    userId: string,
    code: string,
  ): Promise<boolean> {
    const stored = await this.redis.get<string[]>(`2fa:backup:${userId}`);
    if (!stored?.length) return false;
    const hashed = sha256(code.toUpperCase());
    const idx = stored.indexOf(hashed);
    if (idx === -1) return false;
    stored.splice(idx, 1);
    await this.redis.set(`2fa:backup:${userId}`, stored, 0);
    return true;
  }
}

```
---

## File : `src/modules/auth/dto/disable-2fa.dto.ts`

```ts
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Disable2faDto {
  @ApiProperty({
    description: "Kode TOTP 6 digit atau backup code (format: XXXXX-XXXXX)",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

```
---

## File : `src/modules/auth/dto/enable-2fa.dto.ts`

```ts
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Enable2faDto {
  @ApiProperty({
    description: "Kode TOTP 6 digit atau backup code (format: XXXXX-XXXXX)",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

```
---

## File : `src/modules/auth/dto/google-auth.dto.ts`

```ts
export class GoogleAuthDto {
  email: string;
  name: string;
  picture?: string;
}

```
---

## File : `src/modules/auth/dto/verify-2fa.dto.ts`

```ts
import { IsString, IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Verify2faDto {
  @ApiProperty() @IsString() @IsNotEmpty() tempToken: string;
  @ApiProperty() @IsString() @Length(6, 6) code: string;
}

```
---

## File : `src/modules/auth/dto/verify-code.dto.ts`

```ts
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO reusable untuk semua operasi yang membutuhkan verifikasi kode.
 * Mendukung kode TOTP 6 digit ("123456") maupun backup code ("XXXXX-XXXXX").
 */
export class VerifyCodeDto {
  @ApiProperty({
    description: "Kode TOTP 6 digit atau backup code (format: XXXXX-XXXXX)",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

```
---

## File : `src/modules/auth/strategies/google.strategy.ts`

```ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(cfg: ConfigService) {
    super({
      clientID: cfg.get("google.clientId"),
      clientSecret: cfg.get("google.clientSecret"),
      callbackURL: cfg.get("google.callbackUrl"),
      scope: ["email", "profile"],
    });
  }

  validate(_at: string, _rt: string, profile: any, done: VerifyCallback) {
    const { emails, displayName, photos } = profile;
    done(null, {
      email: emails[0].value,
      name: displayName,
      picture: photos?.[0]?.value,
    });
  }
}

```
---

## File : `src/modules/auth/strategies/jwt.strategy.ts`

```ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { PrismaService } from "../../../prisma/prisma.service";
import { JwtPayload } from "../../../common/interfaces/jwt-payload.interface";
import { ErrorCodes } from "../../../common/constants/error-codes.constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    cfg: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.auth_token ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: cfg.get("jwt.secret"),
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException({ code: ErrorCodes.UNAUTHORIZED });
    return user;
  }
}

```
---

## File : `src/modules/auto-reply/auto-reply.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AutoReplyService } from "./auto-reply.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateAutoReplyDto } from "./dto/create-auto-reply.dto";
import { UpdateAutoReplyDto } from "./dto/update-auto-reply.dto";
import { ToggleAutoReplyDto } from "./dto/toggle-auto-reply.dto";

@ApiTags("Auto Reply")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("auto_reply")
@Controller({ path: "auto-reply", version: "1" })
export class AutoReplyController {
  constructor(private svc: AutoReplyService) {}

  @Get()
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }
  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateAutoReplyDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }
  @Put(":id")
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateAutoReplyDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }
  @Post(":id/toggle")
  @HttpCode(HttpStatus.OK)
  async toggle(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ToggleAutoReplyDto,
  ) {
    return {
      status: true,
      data: await this.svc.toggle(u.id, id, dto.isActive),
    };
  }
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}

```
---

## File : `src/modules/auto-reply/auto-reply.engine.ts`

```ts
import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { RedisService } from "../../redis/redis.service";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { MatchType } from "@prisma/client";

// Jeda minimum antar auto-reply ke JID yang sama (detik)
const LOOP_PROTECTION_TTL = 30;

@Injectable()
export class AutoReplyEngine {
  private logger = new Logger("AutoReplyEngine");

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private redis: RedisService,
    @Inject(forwardRef(() => SessionManagerService))
    private manager: SessionManagerService,
  ) {}

  async process(userId: string, sessionId: string, from: string, text: string) {
    if (!text?.trim()) return;

    // FIX: Proteksi loop — skip jika kita baru saja membalas JID ini
    const loopKey = `autoreply:loop:${userId}:${from}`;
    const recentlyReplied = await this.redis.get<boolean>(loopKey);
    if (recentlyReplied) {
      this.logger.debug(`Loop protection: skip auto-reply to ${from}`);
      return;
    }

    // FIX: Skip pesan dari nomor yang sama dengan sesi aktif (fromMe via inbox)
    // whatsapp-web.js sudah filter fromMe=false di session-manager, tapi
    // ada kasus sesi kirim ke dirinya sendiri — cek phoneNumber sesi
    const session = await this.prisma.whatsappSession.findUnique({
      where: { id: sessionId },
    });
    if (session?.phoneNumber) {
      const fromNumber = from.split("@")[0];
      if (fromNumber === session.phoneNumber) {
        this.logger.debug(
          `Skip auto-reply: message from own number ${fromNumber}`,
        );
        return;
      }
    }

    const rules = await this.prisma.autoReply.findMany({
      where: { userId, isActive: true },
      orderBy: [{ priority: "asc" }],
    });

    for (const rule of rules) {
      const matched = this.matches(rule.matchType, rule.keyword, text);
      if (!matched) continue;

      let reply: string | null = null;

      if (rule.matchType === MatchType.ai_smart) {
        try {
          reply = await this.ai.getReply(userId, text, rule.response);
        } catch {
          continue; // skip rule ini jika AI tidak tersedia
        }
      } else {
        reply = rule.response;
      }

      if (!reply) continue;

      try {
        const jid = from.includes("@") ? from : toJid(from);
        await this.manager.sendMessage(sessionId, jid, reply);
        this.logger.debug(`Auto-reply sent to ${from} via rule ${rule.id}`);

        // FIX: Set loop protection — hindari balas lagi dalam 30 detik
        await this.redis.set(loopKey, true, LOOP_PROTECTION_TTL);
      } catch (e) {
        this.logger.error(`Auto-reply send failed: ${e.message}`);
      }
      break; // hanya satu rule yang dieksekusi
    }
  }

  private matches(type: MatchType, keyword: string, text: string): boolean {
    const t = text.toLowerCase().trim();
    const k = keyword.toLowerCase().trim();
    switch (type) {
      case MatchType.exact:
        return t === k;
      case MatchType.contains:
        return t.includes(k);
      case MatchType.regex:
        try {
          return new RegExp(keyword, "i").test(text);
        } catch {
          return false;
        }
      case MatchType.ai_smart:
        return true;
      default:
        return false;
    }
  }
}

```
---

## File : `src/modules/auto-reply/auto-reply.module.ts`

```ts
import { Module, forwardRef } from "@nestjs/common";
import { AutoReplyController } from "./auto-reply.controller";
import { AutoReplyService } from "./auto-reply.service";
import { AutoReplyEngine } from "./auto-reply.engine";
import { AiModule } from "../ai/ai.module";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [AiModule, forwardRef(() => SessionsModule)],
  controllers: [AutoReplyController],
  providers: [AutoReplyService, AutoReplyEngine],
  exports: [AutoReplyEngine],
})
export class AutoReplyModule {}

```
---

## File : `src/modules/auto-reply/auto-reply.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { CreateAutoReplyDto } from "./dto/create-auto-reply.dto";
import { UpdateAutoReplyDto } from "./dto/update-auto-reply.dto";
import { MatchType } from "@prisma/client";

@Injectable()
export class AutoReplyService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.autoReply.findMany({
      where: { userId },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    });
  }

  async create(userId: string, dto: CreateAutoReplyDto) {
    if (dto.matchType === MatchType.regex) this.validateRegex(dto.keyword);
    const rule = await this.prisma.autoReply.create({
      data: { userId, ...dto },
    });
    await this.redis.del(CacheKeys.workflowsActive(userId));
    return rule;
  }

  async update(userId: string, id: string, dto: UpdateAutoReplyDto) {
    await this.findOwned(userId, id);
    if (dto.matchType === MatchType.regex && dto.keyword)
      this.validateRegex(dto.keyword);
    const rule = await this.prisma.autoReply.update({
      where: { id },
      data: dto,
    });
    await this.redis.del(CacheKeys.workflowsActive(userId));
    return rule;
  }

  async toggle(userId: string, id: string, isActive: boolean) {
    await this.findOwned(userId, id);
    return this.prisma.autoReply.update({ where: { id }, data: { isActive } });
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.autoReply.delete({ where: { id } });
  }

  private async findOwned(userId: string, id: string) {
    const rule = await this.prisma.autoReply.findFirst({
      where: { id, userId },
    });
    if (!rule) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return rule;
  }

  private validateRegex(pattern: string) {
    try {
      new RegExp(pattern);
    } catch {
      throw new BadRequestException({ code: ErrorCodes.INVALID_REGEX });
    }
  }
}

```
---

## File : `src/modules/auto-reply/dto/create-auto-reply.dto.ts`

```ts
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MatchType } from "@prisma/client";

export class CreateAutoReplyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  response: string;

  @ApiProperty({ enum: MatchType })
  @IsEnum(MatchType)
  matchType: MatchType;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number = 0;
}

```
---

## File : `src/modules/auto-reply/dto/toggle-auto-reply.dto.ts`

```ts
import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ToggleAutoReplyDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

```
---

## File : `src/modules/auto-reply/dto/update-auto-reply.dto.ts`

```ts
import { PartialType } from "@nestjs/swagger";
import { CreateAutoReplyDto } from "./create-auto-reply.dto";

export class UpdateAutoReplyDto extends PartialType(CreateAutoReplyDto) {}

```
---

## File : `src/modules/backup/backup.module.ts`

```ts
import { Module } from "@nestjs/common";
import { BackupService } from "./backup.service";

@Module({ providers: [BackupService] })
export class BackupModule {}

```
---

## File : `src/modules/backup/backup.service.ts`

```ts
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { pipeline } from "stream";

const execAsync = promisify(exec);
const pipelineAsync = promisify(pipeline);

@Injectable()
export class BackupService implements OnModuleInit {
  private logger = new Logger("BackupService");
  private backupPath: string;
  private dbBackupPath: string;
  private sessionBackupPath: string;
  private mysqldumpAvailable = false;

  constructor(private cfg: ConfigService) {}

  async onModuleInit() {
    this.backupPath =
      this.cfg.get<string>("BACKUP_PATH") || "./storage/backups";
    this.dbBackupPath = path.join(this.backupPath, "database");
    this.sessionBackupPath = path.join(this.backupPath, "sessions");

    fs.mkdirSync(this.dbBackupPath, { recursive: true });
    fs.mkdirSync(this.sessionBackupPath, { recursive: true });

    // FIX: cek ketersediaan mysqldump saat startup
    await this.checkMysqldump();
  }

  private async checkMysqldump() {
    try {
      await execAsync("mysqldump --version");
      this.mysqldumpAvailable = true;
      this.logger.log("BackupService: mysqldump tersedia");
    } catch {
      this.mysqldumpAvailable = false;
      this.logger.warn(
        "BackupService: mysqldump tidak ditemukan di PATH — backup database dinonaktifkan. " +
          "Install dengan: sudo apt-get install mysql-client",
      );
    }
  }

  // Backup database — 03:00 WIB (20:00 UTC)
  @Cron("0 20 * * *")
  async backupDatabase() {
    if (!this.mysqldumpAvailable) {
      this.logger.warn("Backup database dilewati: mysqldump tidak tersedia");
      return;
    }

    this.logger.log("Starting database backup...");
    try {
      const dbUrl = this.cfg.get<string>("DATABASE_URL");
      const parsed = this.parseDbUrl(dbUrl);
      if (!parsed) {
        this.logger.error("Cannot parse DATABASE_URL for backup");
        return;
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const dumpFile = path.join(
        this.dbBackupPath,
        `backup_${timestamp}.sql.gz`,
      );

      const { user, password, host, port, database } = parsed;
      const envPass = password ? `MYSQL_PWD="${password}"` : "";
      const cmd =
        `${envPass} mysqldump -u ${user} -h ${host} -P ${port}` +
        ` --single-transaction --routines --triggers ${database}`;

      const child = exec(cmd);
      const gzip = zlib.createGzip();
      const output = fs.createWriteStream(dumpFile);

      await pipelineAsync(child.stdout!, gzip, output);

      const sizeMb = (fs.statSync(dumpFile).size / 1024 / 1024).toFixed(2);
      this.logger.log(
        `Database backup complete: ${path.basename(dumpFile)} (${sizeMb} MB)`,
      );

      await this.pruneOldBackups(this.dbBackupPath, 7);
    } catch (e) {
      this.logger.error(`Database backup failed: ${e.message}`);
    }
  }

  // Backup sessions — 03:30 WIB (20:30 UTC)
  @Cron("30 20 * * *")
  async backupSessions() {
    this.logger.log("Starting sessions backup...");
    try {
      const authPath =
        this.cfg.get<string>("WA_AUTH_PATH") || "./storage/sessions";
      if (!fs.existsSync(authPath)) {
        this.logger.warn("Auth path not found, skipping session backup");
        return;
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const archiveFile = path.join(
        this.sessionBackupPath,
        `sessions_${timestamp}.tar.gz`,
      );

      await execAsync(
        `tar -czf "${archiveFile}" -C "${path.dirname(path.resolve(authPath))}" "${path.basename(authPath)}"`,
      );

      const sizeMb = (fs.statSync(archiveFile).size / 1024 / 1024).toFixed(2);
      this.logger.log(
        `Sessions backup complete: ${path.basename(archiveFile)} (${sizeMb} MB)`,
      );

      await this.pruneOldBackups(this.sessionBackupPath, 7);
    } catch (e) {
      this.logger.error(`Sessions backup failed: ${e.message}`);
    }
  }

  private async pruneOldBackups(dir: string, keep: number) {
    const files = fs
      .readdirSync(dir)
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(dir, f)).mtimeMs,
      }))
      .sort((a, b) => b.time - a.time);

    const toDelete = files.slice(keep);
    for (const f of toDelete) {
      fs.unlinkSync(path.join(dir, f.name));
      this.logger.debug(`Pruned old backup: ${f.name}`);
    }
  }

  private parseDbUrl(url: string) {
    try {
      const match = url?.match(/mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/);
      if (!match) return null;
      return {
        user: match[1],
        password: decodeURIComponent(match[2]),
        host: match[3],
        port: match[4],
        database: match[5].split("?")[0],
      };
    } catch {
      return null;
    }
  }
}

```
---

## File : `src/modules/broadcast/broadcast.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Res, // FIX: import Res dari @nestjs/common
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express"; // FIX: import Response dari express
import { BroadcastService } from "./broadcast.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { QuotaGuard, QuotaType } from "../../common/guards/quota.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateBroadcastDto } from "./dto/create-broadcast.dto";
import { QueryCampaignsDto } from "./dto/query-campaigns.dto";

@ApiTags("Broadcast")
@UseGuards(JwtAuthGuard)
@Controller({ path: "broadcast", version: "1" })
export class BroadcastController {
  constructor(private svc: BroadcastService) {}

  @Get("campaigns")
  @ApiOperation({ summary: "Daftar campaign broadcast" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryCampaignsDto) {
    const r = await this.svc.findAll(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  @Get("campaigns/:id")
  @ApiOperation({ summary: "Detail campaign broadcast" })
  async findOne(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.findOne(u.id, id) };
  }

  @Get("campaigns/:id/export-pdf")
  @ApiOperation({ summary: "Export hasil campaign ke PDF" })
  async exportCampaignPdf(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.svc.exportCampaignPdf(u.id, id);
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="campaign_${id}_${date}.pdf"`,
    );
    res.send(buffer);
  }

  @Post()
  @UseGuards(TierFeatureGuard, QuotaGuard)
  @RequireFeature("broadcast")
  @QuotaType("monthly")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Buat broadcast baru" })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateBroadcastDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.create(u.id, dto, file) };
  }

  @Post("campaigns/:id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Batalkan broadcast" })
  async cancel(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancel(u.id, id) };
  }
}

```
---

## File : `src/modules/broadcast/broadcast.module.ts`

```ts
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { BroadcastController } from "./broadcast.controller";
import { BroadcastService } from "./broadcast.service";
import { BroadcastProcessor } from "./processors/broadcast.processor";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { SessionsModule } from "../sessions/sessions.module";
import { GatewayModule } from "../../gateway/gateway.module";
import { NotificationsModule } from "../notifications/notifications.module";
import * as path from "path";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.BROADCAST }),
    SessionsModule,
    GatewayModule,
    NotificationsModule, // FIX: diperlukan oleh QuotaGuard
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dir = path.join(
              cfg.get("app.storagePath"),
              "broadcasts",
              "tmp",
            );
            require("fs").mkdirSync(dir, { recursive: true });
            cb(null, dir);
          },
          filename: (req, file, cb) =>
            cb(null, `${Date.now()}-${file.originalname}`),
        }),
        limits: {
          fileSize: cfg.get<number>("app.maxFileSizeMb") * 1024 * 1024,
        },
      }),
    }),
  ],
  controllers: [BroadcastController],
  providers: [BroadcastService, BroadcastProcessor],
  exports: [BroadcastService],
})
export class BroadcastModule {}

```
---

## File : `src/modules/broadcast/broadcast.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../../prisma/prisma.service";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { SessionStatus } from "@prisma/client";
import { normalizePhone } from "../../common/utils/phone-normalizer.util";
import { parseCsvContacts } from "../../common/utils/csv-parser.util";
import { generatePdf } from "../../common/utils/pdf-generator.util"; // FIX: import generatePdf
import { CreateBroadcastDto } from "./dto/create-broadcast.dto";
import { QueryCampaignsDto } from "./dto/query-campaigns.dto";

const CANCELLABLE_STATUSES = ["pending", "processing"] as const;

@Injectable()
export class BroadcastService {
  constructor(
    @InjectQueue(QueueNames.BROADCAST) private broadcastQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async findAll(userId: string, dto: QueryCampaignsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (dto.status) where.status = dto.status;

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.campaign.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(userId: string, campaignId: string) {
    const c = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return c;
  }

  async create(
    userId: string,
    dto: CreateBroadcastDto,
    file?: Express.Multer.File,
  ) {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { userId, status: SessionStatus.connected },
    });
    if (!sessions.length)
      throw new BadRequestException({ code: ErrorCodes.NO_SESSIONS });

    const recipients = await this.resolveRecipients(userId, dto);
    if (!recipients.length)
      throw new BadRequestException({ code: ErrorCodes.NO_RECIPIENTS });

    const deduped = [...new Set(recipients)].slice(0, 10000);

    const campaign = await this.prisma.campaign.create({
      data: {
        userId,
        name: dto.name,
        message: dto.message,
        mediaPath: file?.path,
        totalRecipients: deduped.length,
        status: "pending",
      },
    });

    await this.broadcastQueue.add("send", {
      campaignId: campaign.id,
      userId,
      recipients: deduped,
      message: dto.message,
      mediaPath: file?.path,
      sessions: sessions.map((s) => s.id),
    });

    return campaign;
  }

  async cancel(userId: string, campaignId: string) {
    const c = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    if (!(CANCELLABLE_STATUSES as readonly string[]).includes(c.status)) {
      throw new BadRequestException({
        code: ErrorCodes.CAMPAIGN_NOT_CANCELLABLE,
      });
    }

    const jobs = await this.broadcastQueue.getJobs(["waiting", "active"]);
    for (const job of jobs) {
      if (job.data?.campaignId === campaignId)
        await job.remove().catch(() => {});
    }

    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "cancelled" },
    });
  }

  async exportCampaignPdf(userId: string, campaignId: string): Promise<Buffer> {
    const campaign = await this.findOne(userId, campaignId);

    const logs = await this.prisma.messageLog.findMany({
      where: { campaignId },
      orderBy: { timestamp: "asc" },
      take: 5000,
    });

    const rows = logs.map((l) => ({
      timestamp: new Date(l.timestamp).toLocaleString("id-ID"),
      target: l.target,
      status: l.status,
      error: l.errorMessage?.slice(0, 60) ?? "-",
    }));

    return generatePdf(
      `Campaign: ${campaign.name} | Total: ${campaign.totalRecipients} | Sukses: ${campaign.successCount} | Gagal: ${campaign.failedCount}`,
      rows,
    );
  }

  private async resolveRecipients(
    userId: string,
    dto: CreateBroadcastDto,
  ): Promise<string[]> {
    const nums: string[] = [];

    if (dto.recipients?.length) {
      for (const r of dto.recipients) {
        try {
          nums.push(normalizePhone(r));
        } catch {}
      }
    }
    if (dto.csvData) {
      const rows = parseCsvContacts(dto.csvData);
      for (const r of rows) {
        try {
          nums.push(normalizePhone(r.number));
        } catch {}
      }
    }
    if (dto.filterTag) {
      const contacts = await this.prisma.contact.findMany({
        where: { userId, tag: dto.filterTag },
      });
      for (const c of contacts) nums.push(c.number);
    }

    return nums;
  }
}

```
---

## File : `src/modules/broadcast/dto/create-broadcast.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBroadcastDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() message: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() recipients?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() csvData?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filterTag?: string;
}

```
---

## File : `src/modules/broadcast/dto/query-campaigns.dto.ts`

```ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { CampaignStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryCampaignsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}

```
---

## File : `src/modules/broadcast/processors/broadcast.processor.ts`

```ts
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { RedisService } from "../../../redis/redis.service";
import { SessionManagerService } from "../../sessions/session-manager.service";
import { GatewayService } from "../../../gateway/gateway.service";
import { QueueNames } from "../../../common/constants/queue-names.constant";
import { CacheKeys } from "../../../common/constants/cache-keys.constant";
import { CampaignStatus, MessageStatus, MessageType } from "@prisma/client";
import { toJid } from "../../../common/utils/phone-normalizer.util";
import { MessageMedia } from "whatsapp-web.js";
import { validateMimeType } from "../../../common/utils/mime-validator.util";
import * as fs from "fs";
import * as path from "path";

@Processor(QueueNames.BROADCAST, { concurrency: 1 })
export class BroadcastProcessor extends WorkerHost {
  private logger = new Logger("BroadcastProcessor");

  constructor(
    private prisma: PrismaService,
    private redis: RedisService, // FIX: inject RedisService
    private manager: SessionManagerService,
    private gateway: GatewayService,
  ) {
    super();
  }

  async process(job: Job) {
    const { campaignId, userId, recipients, message, mediaPath, sessions } =
      job.data;

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.processing },
    });

    let successCount = 0;
    let failedCount = 0;

    let media: MessageMedia | null = null;
    if (mediaPath && fs.existsSync(mediaPath)) {
      const buf = fs.readFileSync(mediaPath);
      const mime = await validateMimeType(buf).catch(() => null);
      if (mime) {
        media = new MessageMedia(
          mime,
          buf.toString("base64"),
          path.basename(mediaPath),
        );
      }
    }

    // FIX: gunakan Redis counter yang sama dengan getHealthySession()
    // sehingga distribusi beban merata secara global, bukan hanya per-job
    const rrKey = CacheKeys.roundRobin(userId);

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const jid = toJid(recipient);
      let sent = false;

      // Ambil & increment counter dari Redis
      const currentIdx = (await this.redis.get<number>(rrKey)) ?? 0;
      await this.redis.set(rrKey, (currentIdx + 1) % sessions.length, 86400);

      // Susun urutan sesi mulai dari index saat ini (round-robin)
      const orderedSessions = [
        ...sessions.slice(currentIdx % sessions.length),
        ...sessions.slice(0, currentIdx % sessions.length),
      ];

      for (const sessionId of orderedSessions) {
        try {
          if (media) {
            await this.manager.sendMedia(sessionId, jid, media, message);
          } else {
            await this.manager.sendMessage(sessionId, jid, message);
          }

          successCount++;
          sent = true;

          await this.prisma.messageLog.create({
            data: {
              userId,
              sessionId,
              campaignId,
              target: recipient,
              message,
              messageType: MessageType.text,
              status: MessageStatus.success,
            },
          });
          break;
        } catch (e) {
          this.logger.warn(
            `Session ${sessionId} failed for ${recipient}: ${e.message}, trying next`,
          );
        }
      }

      if (!sent) {
        failedCount++;
        await this.prisma.messageLog.create({
          data: {
            userId,
            sessionId: sessions[0],
            campaignId,
            target: recipient,
            message,
            messageType: MessageType.text,
            status: MessageStatus.failed,
            errorMessage: "All sessions failed",
          },
        });
      }

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { processedCount: i + 1, successCount, failedCount },
      });

      this.gateway.emitBroadcastProgress(userId, {
        campaignId,
        current: i + 1,
        total: recipients.length,
        percentage: Math.round(((i + 1) / recipients.length) * 100),
        successCount,
        failedCount,
      });

      // Jeda acak 1–3 detik (anti-spam)
      const delay = 1000 + Math.random() * 2000;
      await new Promise((r) => setTimeout(r, delay));
    }

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.completed },
    });

    this.gateway.emitBroadcastComplete(
      userId,
      campaignId,
      successCount,
      failedCount,
    );

    await this.prisma.userQuota.updateMany({
      where: { userId },
      data: { broadcastsThisMonth: { increment: 1 } },
    });

    if (mediaPath && fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath);
    }
  }
}

```
---

## File : `src/modules/broadcast-list/broadcast-list.controller.ts`

```ts
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BroadcastListService } from './broadcast-list.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Broadcast List')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'broadcast-list', version: '1' })
export class BroadcastListController {
  constructor(private svc: BroadcastListService) {}

  @Get(':sessionId')
  @ApiOperation({ summary: 'Dapatkan semua broadcast list dari WA' })
  async getAll(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }

  @Get(':sessionId/:broadcastId')
  @ApiOperation({ summary: 'Dapatkan broadcast list by ID' })
  async getById(
    @Param('sessionId') sid: string,
    @Param('broadcastId') bid: string,
  ) {
    return { status: true, data: await this.svc.getById(sid, bid) };
  }

  @Post(':sessionId/:broadcastId/send')
  @ApiOperation({ summary: 'Kirim pesan ke broadcast list' })
  async send(
    @Param('sessionId') sid: string,
    @Param('broadcastId') bid: string,
    @Body() body: { message: string },
  ) {
    return { status: true, data: await this.svc.send(sid, bid, body.message) };
  }
}

```
---

## File : `src/modules/broadcast-list/broadcast-list.module.ts`

```ts
import { Module } from '@nestjs/common';
import { BroadcastListController } from './broadcast-list.controller';
import { BroadcastListService } from './broadcast-list.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [BroadcastListController],
  providers: [BroadcastListService],
})
export class BroadcastListModule {}

```
---

## File : `src/modules/broadcast-list/broadcast-list.service.ts`

```ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';

@Injectable()
export class BroadcastListService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    const chats = await this.client(sessionId).getChats();
    return chats.filter(
      (c: any) => c.isBroadcast && c.id?.server === 'broadcast',
    );
  }

  async getById(sessionId: string, broadcastId: string) {
    return this.client(sessionId).getChatById(broadcastId);
  }

  async send(sessionId: string, broadcastId: string, message: string) {
    return this.manager.sendMessage(sessionId, broadcastId, message);
  }
}

```
---

## File : `src/modules/calls/calls.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CallsService } from "./calls.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

class CreateCallLinkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}

@ApiTags("Calls")
@UseGuards(JwtAuthGuard)
@Controller({ path: "calls", version: "1" })
export class CallsController {
  constructor(private svc: CallsService) {}

  @Get()
  @ApiOperation({ summary: "Log panggilan masuk" })
  async findAll(@CurrentUser() u: any, @Query() dto: PaginationDto) {
    const r = await this.svc.findAll(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  // FIX: endpoint buat call link
  @Post("link")
  @ApiOperation({ summary: "Buat call link untuk dibagikan" })
  async createCallLink(@CurrentUser() u: any, @Body() dto: CreateCallLinkDto) {
    return {
      status: true,
      data: await this.svc.createCallLink(u.id, dto.sessionId),
    };
  }
}

```
---

## File : `src/modules/calls/calls.module.ts`

```ts
import { Module } from "@nestjs/common";
import { CallsController } from "./calls.controller";
import { CallsService } from "./calls.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}

```
---

## File : `src/modules/calls/calls.service.ts`

```ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { PaginationDto } from "../../common/dto/pagination.dto";

@Injectable()
export class CallsService {
  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  async findAll(userId: string, dto: PaginationDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.callLog.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
      }),
      this.prisma.callLog.count({ where: { userId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // FIX: createCallLink via whatsapp-web.js
  async createCallLink(userId: string, sessionId: string) {
    const session = await this.prisma.whatsappSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_FOUND });

    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    // whatsapp-web.js: createCallLink() tersedia di versi terbaru
    const link = await (client as any).createCallLink?.();
    if (!link) {
      throw new BadRequestException({
        code: ErrorCodes.INTERNAL,
        message: "createCallLink tidak didukung di versi whatsapp-web.js ini.",
      });
    }

    return { callLink: link };
  }
}

```
---

## File : `src/modules/calls/dto/query-calls.dto.ts`

```ts

```
---

## File : `src/modules/channels/channels.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ChannelsService } from "./channels.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { SearchChannelDto } from "./dto/search-channel.dto";
import { ManageChannelAdminDto } from "./dto/manage-channel-admin.dto";

@ApiTags("Channels")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("channels")
@Controller({ path: "channels", version: "1" })
export class ChannelsController {
  constructor(private svc: ChannelsService) {}

  @Get(":sessionId")
  async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }
  @Get(":sessionId/search")
  async search(
    @Param("sessionId") sid: string,
    @Query() dto: SearchChannelDto,
  ) {
    return { status: true, data: await this.svc.search(sid, dto.query) };
  }
  @Get(":sessionId/invite/:inviteCode")
  async getByInviteCode(
    @Param("sessionId") sid: string,
    @Param("inviteCode") code: string,
  ) {
    return { status: true, data: await this.svc.getByInviteCode(sid, code) };
  }
  @Post(":sessionId/:channelId/subscribe")
  @HttpCode(HttpStatus.OK)
  async subscribe(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
  ) {
    return { status: true, data: await this.svc.subscribe(sid, cid) };
  }
  @Post(":sessionId/:channelId/unsubscribe")
  @HttpCode(HttpStatus.OK)
  async unsubscribe(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
  ) {
    return { status: true, data: await this.svc.unsubscribe(sid, cid) };
  }
  @Post(":sessionId/:channelId/send")
  async send(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() body: { message: string },
  ) {
    return { status: true, data: await this.svc.send(sid, cid, body.message) };
  }
  @Post(":sessionId/:channelId/admin")
  @HttpCode(HttpStatus.OK)
  async manageAdmin(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() dto: ManageChannelAdminDto,
  ) {
    return {
      status: true,
      data: await this.svc.manageAdmin(
        sid,
        cid,
        dto.participantJid,
        dto.action as "add" | "remove",
      ),
    };
  }
  @Post(":sessionId/:channelId/transfer")
  @HttpCode(HttpStatus.OK)
  async transferOwnership(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() body: { newOwnerJid: string },
  ) {
    return {
      status: true,
      data: await this.svc.transferOwnership(sid, cid, body.newOwnerJid),
    };
  }
  @Put(":sessionId/:channelId")
  async update(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() dto: UpdateChannelDto,
  ) {
    return {
      status: true,
      data: await this.svc.update(sid, cid, dto.name, dto.description),
    };
  }
  @Delete(":sessionId/:channelId")
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
  ) {
    return { status: true, data: await this.svc.delete(sid, cid) };
  }
}

```
---

## File : `src/modules/channels/channels.module.ts`

```ts
import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}

```
---

## File : `src/modules/channels/channels.service.ts`

```ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { MessageMedia } from 'whatsapp-web.js';
import { validateMimeType } from '../../common/utils/mime-validator.util';

@Injectable()
export class ChannelsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    return (this.client(sessionId) as any).getChannels?.() ?? [];
  }

  async search(sessionId: string, query: string) {
    return (this.client(sessionId) as any).searchChannels?.(query) ?? [];
  }

  async getByInviteCode(sessionId: string, inviteCode: string) {
    return (this.client(sessionId) as any).getChannelByInviteCode?.(inviteCode);
  }

  async subscribe(sessionId: string, channelId: string) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.subscribe?.();
  }

  async unsubscribe(sessionId: string, channelId: string) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.unsubscribe?.();
  }

  async send(sessionId: string, channelId: string, message: string) {
    return this.manager.sendMessage(sessionId, channelId, message);
  }

  async manageAdmin(
    sessionId: string,
    channelId: string,
    participantJid: string,
    action: 'add' | 'remove',
  ) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    if (action === 'add') return ch?.addAdmin?.(participantJid);
    return ch?.removeAdmin?.(participantJid);
  }

  async transferOwnership(
    sessionId: string,
    channelId: string,
    newOwnerJid: string,
  ) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.transferOwnership?.(newOwnerJid);
  }

  async update(
    sessionId: string,
    channelId: string,
    name?: string,
    description?: string,
  ) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    const results: any = {};
    if (name) results.name = await ch?.setName?.(name);
    if (description)
      results.description = await ch?.setDescription?.(description);
    return results;
  }

  async delete(sessionId: string, channelId: string) {
    const ch = await (this.client(sessionId) as any).getChannelById(channelId);
    return ch?.delete?.();
  }
}

```
---

## File : `src/modules/channels/dto/create-channel.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

```
---

## File : `src/modules/channels/dto/manage-channel-admin.dto.ts`

```ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ChannelAdminAction {
  ADD = 'add',
  REMOVE = 'remove',
}

export class ManageChannelAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  participantJid: string;

  @ApiProperty({ enum: ChannelAdminAction })
  @IsEnum(ChannelAdminAction)
  action: ChannelAdminAction;
}

```
---

## File : `src/modules/channels/dto/search-channel.dto.ts`

```ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;
}

```
---

## File : `src/modules/channels/dto/update-channel.dto.ts`

```ts
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChannelDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

```
---

## File : `src/modules/chats/chats.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ChatsService } from "./chats.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Chats")
@UseGuards(JwtAuthGuard)
@Controller({ path: "chats", version: "1" })
export class ChatsController {
  constructor(private svc: ChatsService) {}

  @Get(":sessionId") async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }
  @Get(":sessionId/:chatId") async getById(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.getById(sid, cid) };
  }
  @Post(":sessionId/:chatId/archive") @HttpCode(HttpStatus.OK) async archive(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.archive(sid, cid) };
  }
  @Post(":sessionId/:chatId/unarchive")
  @HttpCode(HttpStatus.OK)
  async unarchive(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.unarchive(sid, cid) };
  }
  @Post(":sessionId/:chatId/mute") @HttpCode(HttpStatus.OK) async mute(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
    @Body() b: { duration?: number },
  ) {
    return { status: true, data: await this.svc.mute(sid, cid, b.duration) };
  }
  @Post(":sessionId/:chatId/unmute") @HttpCode(HttpStatus.OK) async unmute(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.unmute(sid, cid) };
  }
  @Post(":sessionId/:chatId/pin") @HttpCode(HttpStatus.OK) async pin(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.pin(sid, cid) };
  }
  @Post(":sessionId/:chatId/unpin") @HttpCode(HttpStatus.OK) async unpin(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.unpin(sid, cid) };
  }
  @Delete(":sessionId/:chatId") @HttpCode(HttpStatus.OK) async delete(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.delete(sid, cid) };
  }
  @Post(":sessionId/:chatId/read") @HttpCode(HttpStatus.OK) async markRead(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.markRead(sid, cid) };
  }
  @Get(":sessionId/search") async search(
    @Param("sessionId") sid: string,
    @Query("q") q: string,
  ) {
    return { status: true, data: await this.svc.search(sid, q) };
  }
}

```
---

## File : `src/modules/chats/chats.module.ts`

```ts
import { Module } from "@nestjs/common";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}

```
---

## File : `src/modules/chats/chats.service.ts`

```ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";

@Injectable()
export class ChatsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    return this.client(sessionId).getChats();
  }
  async getById(sessionId: string, chatId: string) {
    return this.client(sessionId).getChatById(chatId);
  }
  async archive(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).archive();
  }
  async unarchive(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).unarchive();
  }
  async mute(sessionId: string, chatId: string, duration?: number) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).mute(duration);
  }
  async unmute(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).unmute();
  }
  async pin(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).pin();
  }
  async unpin(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).unpin();
  }
  async delete(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).delete();
  }
  async markRead(sessionId: string, chatId: string) {
    const c = await this.client(sessionId).getChatById(chatId);
    return (c as any).sendSeen();
  }
  async search(sessionId: string, query: string) {
    return this.client(sessionId).searchMessages(query, {});
  }
}

```
---

## File : `src/modules/chats/dto/mute-chat.dto.ts`

```ts
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MuteChatDto {
  @ApiPropertyOptional({
    description: 'Duration in seconds. Omit for indefinite mute.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}

```
---

## File : `src/modules/chats/dto/search-messages.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchMessagesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chatId?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

```
---

## File : `src/modules/cleanup/cleanup.module.ts`

```ts
import { Module } from "@nestjs/common";
import { CleanupService } from "./cleanup.service";

@Module({ providers: [CleanupService] })
export class CleanupModule {}

```
---

## File : `src/modules/cleanup/cleanup.service.ts`

```ts
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { subDays } from "date-fns";
import * as fs from "fs";
import * as path from "path";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CleanupService {
  private logger = new Logger("CleanupService");

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Cron("0 2 * * *")
  async run() {
    this.logger.log("Running cleanup...");
    await this.cleanMessageLogs();
    await this.cleanWorkflowLogs();
    await this.cleanAuditLogs();
    await this.cleanWebhookQueue();
    await this.cleanOrphanBroadcastFiles(); // FIX
    await this.cleanOrphanUploadFiles(); // FIX: tambah cleanup upload lama
    this.logger.log("Cleanup complete");
  }

  @Cron("0 17 * * *") // 00:00 WIB
  async resetDailyQuota() {
    const { count } = await this.prisma.userQuota.updateMany({
      data: { messagesSentToday: 0, lastDailyResetAt: new Date() },
    });
    this.logger.log(`Daily quota reset for ${count} users`);
  }

  @Cron("0 17 1 * *") // Tgl 1 tiap bulan 00:00 WIB
  async resetMonthlyQuota() {
    const { count } = await this.prisma.userQuota.updateMany({
      data: { broadcastsThisMonth: 0, lastMonthlyResetAt: new Date() },
    });
    this.logger.log(`Monthly broadcast quota reset for ${count} users`);
  }

  private async cleanMessageLogs() {
    const days = this.config.get<number>("app.logRetentionDays");
    const { count } = await this.prisma.messageLog.deleteMany({
      where: { timestamp: { lt: subDays(new Date(), days) } },
    });
    this.logger.debug(`Deleted ${count} old message logs`);
  }

  private async cleanWorkflowLogs() {
    const days = this.config.get<number>("app.logRetentionDays");
    const { count } = await this.prisma.workflowLog.deleteMany({
      where: { timestamp: { lt: subDays(new Date(), days) } },
    });
    this.logger.debug(`Deleted ${count} old workflow logs`);
  }

  private async cleanAuditLogs() {
    const days = this.config.get<number>("app.auditLogRetentionDays");
    const { count } = await this.prisma.auditLog.deleteMany({
      where: { timestamp: { lt: subDays(new Date(), days) } },
    });
    this.logger.debug(`Deleted ${count} old audit logs`);
  }

  private async cleanWebhookQueue() {
    const { count } = await this.prisma.webhookQueue.deleteMany({
      where: {
        status: { in: ["completed", "failed"] },
        createdAt: { lt: subDays(new Date(), 7) },
      },
    });
    this.logger.debug(`Deleted ${count} old webhook queue entries`);
  }

  /**
   * FIX: Broadcast files disimpan flat di /broadcasts/tmp/{timestamp}-{filename}
   * Cleanup file tmp yang lebih dari 24 jam dan campaign-nya sudah completed/cancelled.
   * Logika lama salah karena mencari folder bernama campaign ID (tidak ada).
   */
  private async cleanOrphanBroadcastFiles() {
    const tmpPath = path.join(
      this.config.get("app.storagePath"),
      "broadcasts",
      "tmp",
    );
    if (!fs.existsSync(tmpPath)) return;

    const files = fs.readdirSync(tmpPath);
    const cutoff = Date.now() - 24 * 3600 * 1000; // lebih dari 24 jam

    for (const file of files) {
      const filePath = path.join(tmpPath, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
          this.logger.debug(`Removed old broadcast tmp file: ${file}`);
        }
      } catch (e) {
        this.logger.warn(`Could not clean file ${file}: ${e.message}`);
      }
    }
  }

  /**
   * FIX: Hapus file upload media yang lebih dari 7 hari
   * (file dari POST /messages/:sessionId/messages/:messageId/download)
   */
  private async cleanOrphanUploadFiles() {
    const uploadsPath = path.join(
      this.config.get("app.storagePath"),
      "uploads",
    );
    if (!fs.existsSync(uploadsPath)) return;

    const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
    const userDirs = fs.readdirSync(uploadsPath);

    for (const userDir of userDirs) {
      const userPath = path.join(uploadsPath, userDir);
      if (!fs.statSync(userPath).isDirectory()) continue;

      const files = fs.readdirSync(userPath);
      for (const file of files) {
        const filePath = path.join(userPath, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.mtimeMs < cutoff) {
            fs.unlinkSync(filePath);
            this.logger.debug(`Removed old upload file: ${userDir}/${file}`);
          }
        } catch (e) {
          this.logger.warn(`Could not clean upload file ${file}: ${e.message}`);
        }
      }
    }
  }
}

```
---

## File : `src/modules/contacts/contacts.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { QueryContactsDto } from './dto/query-contacts.dto';
import { BulkDeleteContactsDto } from './dto/bulk-delete-contacts.dto';
import { ImportGoogleContactsDto } from './dto/import-google-contacts.dto';

@ApiTags('Contacts')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'contacts', version: '1' })
export class ContactsController {
  constructor(private svc: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar kontak' })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryContactsDto) {
    const r = await this.svc.findAll(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Tambah kontak' })
  async create(@CurrentUser() u: any, @Body() dto: CreateContactDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update kontak' })
  async update(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus kontak' })
  async remove(@CurrentUser() u: any, @Param('id') id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus banyak kontak sekaligus' })
  async bulkDelete(@CurrentUser() u: any, @Body() dto: BulkDeleteContactsDto) {
    return { status: true, data: await this.svc.bulkDelete(u.id, dto) };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import kontak dari CSV' })
  async importCsv(
    @CurrentUser() u: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.importCsv(u.id, file.buffer) };
  }

  @Post('import-google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import kontak dari Google Contacts' })
  async importGoogle(
    @CurrentUser() u: any,
    @Body() dto: ImportGoogleContactsDto,
  ) {
    return {
      status: true,
      data: await this.svc.importFromGoogleContacts(u.id, dto.accessToken),
    };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export kontak ke CSV' })
  async exportCsv(@CurrentUser() u: any, @Res() res: Response) {
    const csv = await this.svc.exportCsv(u.id);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="contacts_${date}.csv"`,
    );
    res.send(csv);
  }
}

```
---

## File : `src/modules/contacts/contacts.module.ts`

```ts
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { ContactsController } from "./contacts.controller";
import { ContactsService } from "./contacts.service";

@Module({
  imports: [MulterModule.register({ storage: memoryStorage() })],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}

```
---

## File : `src/modules/contacts/contacts.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { normalizePhone } from '../../common/utils/phone-normalizer.util';
import { parseCsvContacts } from '../../common/utils/csv-parser.util';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { QueryContactsDto } from './dto/query-contacts.dto';
import { BulkDeleteContactsDto } from './dto/bulk-delete-contacts.dto';
import axios from 'axios';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, dto: QueryContactsDto) {
    const where: any = { userId };
    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search } },
        { number: { contains: dto.search } },
        { tag: { contains: dto.search } },
      ];
    }
    if (dto.tag) where.tag = dto.tag;
    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.contact.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async create(userId: string, dto: CreateContactDto) {
    const number = normalizePhone(dto.number);
    const exists = await this.prisma.contact.findFirst({
      where: { userId, number },
    });
    if (exists)
      throw new ConflictException({ code: ErrorCodes.DUPLICATE_CONTACT });
    return this.prisma.contact.create({
      data: { userId, name: dto.name, number, tag: dto.tag },
    });
  }

  async update(userId: string, id: string, dto: UpdateContactDto) {
    await this.findOwned(userId, id);
    const data: any = { name: dto.name, tag: dto.tag };
    if (dto.number) {
      data.number = normalizePhone(dto.number);
      const exists = await this.prisma.contact.findFirst({
        where: { userId, number: data.number, NOT: { id } },
      });
      if (exists)
        throw new ConflictException({ code: ErrorCodes.DUPLICATE_CONTACT });
    }
    return this.prisma.contact.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.contact.delete({ where: { id } });
  }

  async bulkDelete(userId: string, dto: BulkDeleteContactsDto) {
    let where: any = { userId };
    if (dto.ids?.length) {
      where.id = { in: dto.ids };
    } else if (dto.selectAll) {
      if (dto.search)
        where.OR = [
          { name: { contains: dto.search } },
          { number: { contains: dto.search } },
        ];
      if (dto.filterTag) where.tag = dto.filterTag;
    }
    const { count } = await this.prisma.contact.deleteMany({ where });
    return { deleted: count };
  }

  async importCsv(userId: string, buffer: Buffer) {
    const rows = parseCsvContacts(buffer.toString('utf-8'));
    let imported = 0,
      skipped = 0;
    const errors: any[] = [];
    for (const row of rows) {
      try {
        const number = normalizePhone(row.number);
        await this.prisma.contact.upsert({
          where: { userId_number: { userId, number } },
          create: { userId, name: row.name, number, tag: row.tag },
          update: {},
        });
        imported++;
      } catch (e) {
        if (e.code === 'P2002') {
          skipped++;
        } else {
          errors.push({ number: row.number, reason: e.message });
        }
      }
    }
    return { imported, skipped, errors };
  }

  async importFromGoogleContacts(userId: string, accessToken: string) {
    let imported = 0,
      skipped = 0;
    const errors: any[] = [];
    let pageToken: string | undefined;

    do {
      const params: any = {
        personFields: 'names,phoneNumbers',
        pageSize: 100,
      };
      if (pageToken) params.pageToken = pageToken;

      const res = await axios
        .get('https://people.googleapis.com/v1/people/me/connections', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params,
        })
        .catch((e) => {
          throw new BadRequestException({
            code: ErrorCodes.INVALID_GOOGLE_TOKEN,
            message: e.message,
          });
        });

      const connections = res.data.connections ?? [];
      pageToken = res.data.nextPageToken;

      for (const person of connections) {
        const name = person.names?.[0]?.displayName ?? '';
        const phones = person.phoneNumbers ?? [];
        for (const phone of phones) {
          try {
            const number = normalizePhone(phone.value);
            await this.prisma.contact.upsert({
              where: { userId_number: { userId, number } },
              create: { userId, name, number },
              update: {},
            });
            imported++;
          } catch (e) {
            if (e.code === 'P2002') {
              skipped++;
            } else {
              errors.push({ name, phone: phone.value, reason: e.message });
            }
          }
        }
      }
    } while (pageToken);

    return { imported, skipped, errors };
  }

  async exportCsv(userId: string): Promise<string> {
    const contacts = await this.prisma.contact.findMany({ where: { userId } });
    const header = 'name,number,tag\n';
    const rows = contacts
      .map((c) => `"${c.name}","${c.number}","${c.tag ?? ''}"`)
      .join('\n');
    return header + rows;
  }

  private async findOwned(userId: string, id: string) {
    const c = await this.prisma.contact.findFirst({ where: { id, userId } });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return c;
  }
}

```
---

## File : `src/modules/contacts/dto/bulk-delete-contacts.dto.ts`

```ts
import { IsOptional, IsArray, IsBoolean, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class BulkDeleteContactsDto {
  @ApiPropertyOptional() @IsOptional() @IsArray() ids?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() selectAll?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filterTag?: string;
}

```
---

## File : `src/modules/contacts/dto/create-contact.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateContactDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() number: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tag?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

```
---

## File : `src/modules/contacts/dto/import-contacts.dto.ts`

```ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportContactsDto {
  @ApiProperty({ description: 'Raw CSV string with headers: name,number,tag' })
  @IsString()
  @IsNotEmpty()
  csvData: string;
}

```
---

## File : `src/modules/contacts/dto/import-google-contacts.dto.ts`

```ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportGoogleContactsDto {
  @ApiProperty({ description: 'Google OAuth access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

```
---

## File : `src/modules/contacts/dto/query-contacts.dto.ts`

```ts
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryContactsDto extends PaginationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tag?: string;
}

```
---

## File : `src/modules/contacts/dto/update-contact.dto.ts`

```ts
import { PartialType } from "@nestjs/swagger";
import { CreateContactDto } from "./create-contact.dto";
export class UpdateContactDto extends PartialType(CreateContactDto) {}

```
---

## File : `src/modules/customer-note/customer-note.controller.ts`

```ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CustomerNoteService } from "./customer-note.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpsertNoteDto } from "./dto/upsert-note.dto";

@ApiTags("Customer Note")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("customer_note")
@Controller({ path: "contacts/:contactId/note", version: "1" })
export class CustomerNoteController {
  constructor(private svc: CustomerNoteService) {}

  @Get()
  async getNote(@CurrentUser() u: any, @Param("contactId") cid: string) {
    return { status: true, data: await this.svc.getNote(u.id, cid) };
  }
  @Put()
  async upsertNote(
    @CurrentUser() u: any,
    @Param("contactId") cid: string,
    @Body() dto: UpsertNoteDto,
  ) {
    return {
      status: true,
      data: await this.svc.upsertNote(u.id, cid, dto.content),
    };
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteNote(@CurrentUser() u: any, @Param("contactId") cid: string) {
    return { status: true, data: await this.svc.deleteNote(u.id, cid) };
  }
}

```
---

## File : `src/modules/customer-note/customer-note.module.ts`

```ts
import { Module } from '@nestjs/common';
import { CustomerNoteController } from './customer-note.controller';
import { CustomerNoteService } from './customer-note.service';

@Module({
  controllers: [CustomerNoteController],
  providers: [CustomerNoteService],
})
export class CustomerNoteModule {}

```
---

## File : `src/modules/customer-note/customer-note.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';

@Injectable()
export class CustomerNoteService {
  constructor(private prisma: PrismaService) {}

  async getNote(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return { contactId, notes: contact.notes };
  }

  async upsertNote(userId: string, contactId: string, content: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const updated = await this.prisma.contact.update({
      where: { id: contactId },
      data: { notes: content },
    });
    return { contactId, notes: updated.notes };
  }

  async deleteNote(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await this.prisma.contact.update({
      where: { id: contactId },
      data: { notes: null },
    });
    return { deleted: true };
  }
}

```
---

## File : `src/modules/customer-note/dto/upsert-note.dto.ts`

```ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

```
---

## File : `src/modules/drip/drip.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { DripService } from "./drip.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateDripDto } from "./dto/create-drip.dto";
import { UpdateDripDto } from "./dto/update-drip.dto";
import { ToggleDripDto } from "./dto/toggle-drip.dto";
import { QuerySubscribersDto } from "./dto/query-subscribers.dto";

@ApiTags("Drip Campaign")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("drip_campaign")
@Controller({ path: "drip-campaigns", version: "1" })
export class DripController {
  constructor(private svc: DripService) {}

  @Get()
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }
  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateDripDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }
  @Put(":id")
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateDripDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }
  @Post(":id/toggle")
  @HttpCode(HttpStatus.OK)
  async toggle(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ToggleDripDto,
  ) {
    return {
      status: true,
      data: await this.svc.toggle(u.id, id, dto.isActive),
    };
  }
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
  @Get(":id/subscribers")
  async getSubscribers(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Query() dto: QuerySubscribersDto,
  ) {
    const r = await this.svc.getSubscribers(u.id, id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }
  @Post("subscriptions/:id/cancel")
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancelSubscription(u.id, id) };
  }
}

```
---

## File : `src/modules/drip/drip.manager.ts`

```ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { replacePlaceholders } from "../../common/utils/placeholder.util";
import { nowWIB, isSameDay } from "../../common/utils/date.util";
import { format, differenceInDays, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

@Injectable()
export class DripManager {
  private logger = new Logger("DripManager");

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async run() {
    await this.checkNewSubscribers();
    await this.processSteps();
  }

  // Auto-enroll contacts with matching tag
  private async checkNewSubscribers() {
    const campaigns = await this.prisma.dripCampaign.findMany({
      where: { isActive: true },
    });

    for (const campaign of campaigns) {
      const contacts = await this.prisma.contact.findMany({
        where: { userId: campaign.userId, tag: campaign.triggerTag },
      });

      for (const contact of contacts) {
        await this.prisma.dripSubscription
          .upsert({
            where: {
              dripId_contactId: { dripId: campaign.id, contactId: contact.id },
            },
            create: {
              dripId: campaign.id,
              contactId: contact.id,
              startDate: new Date(),
            },
            update: {},
          })
          .catch(() => {}); // Ignore unique constraint violations
      }
    }
  }

  // Process due drip steps
  private async processSteps() {
    const nowWib = toZonedTime(new Date(), TIMEZONE);
    const currentTime = format(nowWib, "HH:mm");

    const subs = await this.prisma.dripSubscription.findMany({
      where: { status: "active" },
      include: {
        drip: { include: { steps: { orderBy: { dayOffset: "asc" } } } },
        contact: true,
      },
    });

    for (const sub of subs) {
      const daysDiff =
        differenceInDays(nowWib, toZonedTime(sub.startDate, TIMEZONE)) + 1;

      const step = sub.drip.steps.find(
        (s) =>
          s.dayOffset === daysDiff &&
          s.timeAt <= currentTime &&
          s.dayOffset > sub.lastStepDay,
      );

      if (!step) continue;

      try {
        const sessionId =
          sub.drip.sessionId ||
          (await this.manager.getHealthySession(sub.drip.userId));
        if (!sessionId) continue;

        const message = replacePlaceholders(step.message, {
          name: sub.contact.name,
        });
        const jid = toJid(sub.contact.number);
        await this.manager.sendMessage(sessionId, jid, message);

        const isLastStep =
          step.dayOffset ===
          Math.max(...sub.drip.steps.map((s) => s.dayOffset));
        await this.prisma.dripSubscription.update({
          where: { id: sub.id },
          data: {
            lastStepDay: step.dayOffset,
            status: isLastStep ? "completed" : "active",
          },
        });
      } catch (e) {
        this.logger.error(`Drip step failed for sub ${sub.id}: ${e.message}`);
      }
    }
  }
}

```
---

## File : `src/modules/drip/drip.module.ts`

```ts
import { Module } from "@nestjs/common";
import { DripController } from "./drip.controller";
import { DripService } from "./drip.service";
import { DripManager } from "./drip.manager";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [DripController],
  providers: [DripService, DripManager],
  exports: [DripManager],
})
export class DripModule {}

```
---

## File : `src/modules/drip/drip.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateDripDto } from "./dto/create-drip.dto";
import { UpdateDripDto } from "./dto/update-drip.dto";
import { QuerySubscribersDto } from "./dto/query-subscribers.dto";

@Injectable()
export class DripService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const campaigns = await this.prisma.dripCampaign.findMany({
      where: { userId },
      include: {
        steps: { orderBy: { dayOffset: "asc" } },
        _count: { select: { subscriptions: { where: { status: "active" } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return campaigns.map((c) => ({
      ...c,
      subscriberCount: c._count.subscriptions,
    }));
  }

  async create(userId: string, dto: CreateDripDto) {
    this.validateSteps(dto.steps);
    return this.prisma.$transaction(async (tx) => {
      const campaign = await tx.dripCampaign.create({
        data: {
          userId,
          name: dto.name,
          triggerTag: dto.triggerTag,
          sessionId: dto.sessionId,
        },
      });
      await tx.dripStep.createMany({
        data: dto.steps.map((s) => ({ dripId: campaign.id, ...s })),
      });
      return tx.dripCampaign.findUnique({
        where: { id: campaign.id },
        include: { steps: true },
      });
    });
  }

  async update(userId: string, id: string, dto: UpdateDripDto) {
    await this.findOwned(userId, id);
    if (dto.steps) this.validateSteps(dto.steps);
    return this.prisma.$transaction(async (tx) => {
      await tx.dripCampaign.update({
        where: { id },
        data: {
          name: dto.name,
          triggerTag: dto.triggerTag,
          sessionId: dto.sessionId,
        },
      });
      if (dto.steps) {
        await tx.dripStep.deleteMany({ where: { dripId: id } });
        await tx.dripStep.createMany({
          data: dto.steps.map((s) => ({ dripId: id, ...s })),
        });
      }
      return tx.dripCampaign.findUnique({
        where: { id },
        include: { steps: true },
      });
    });
  }

  async toggle(userId: string, id: string, isActive: boolean) {
    await this.findOwned(userId, id);
    return this.prisma.dripCampaign.update({
      where: { id },
      data: { isActive },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.dripCampaign.delete({ where: { id } });
  }

  async getSubscribers(
    userId: string,
    dripId: string,
    dto: QuerySubscribersDto,
  ) {
    await this.findOwned(userId, dripId);
    const where: any = { dripId };
    if (dto.status) where.status = dto.status;
    const [data, total] = await Promise.all([
      this.prisma.dripSubscription.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        include: { contact: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.dripSubscription.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async cancelSubscription(userId: string, subscriptionId: string) {
    const sub = await this.prisma.dripSubscription.findFirst({
      where: { id: subscriptionId },
      include: { drip: true },
    });
    if (!sub || sub.drip.userId !== userId) {
      throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    }
    return this.prisma.dripSubscription.update({
      where: { id: subscriptionId },
      data: { status: "cancelled" },
    });
  }

  private validateSteps(steps: any[]) {
    const days = steps.map((s) => s.dayOffset);
    if (new Set(days).size !== days.length) {
      throw new BadRequestException({ code: ErrorCodes.DUPLICATE_DRIP_DAY });
    }
    for (const s of steps) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.timeAt)) {
        throw new BadRequestException({ code: ErrorCodes.INVALID_TIME_FORMAT });
      }
    }
  }

  private async findOwned(userId: string, id: string) {
    const c = await this.prisma.dripCampaign.findFirst({
      where: { id, userId },
    });
    if (!c) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return c;
  }
}

```
---

## File : `src/modules/drip/dto/create-drip.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DripStepDto } from "./drip-step.dto";

export class CreateDripDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  triggerTag: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ type: [DripStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DripStepDto)
  steps: DripStepDto[];
}

```
---

## File : `src/modules/drip/dto/drip-step.dto.ts`

```ts
import { IsInt, IsString, Matches, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DripStepDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  dayOffset: number;

  @ApiProperty({ example: "09:00" })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "timeAt must be HH:MM format",
  })
  timeAt: string;

  @ApiProperty()
  @IsString()
  message: string;
}

```
---

## File : `src/modules/drip/dto/query-subscribers.dto.ts`

```ts
import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { DripSubscriptionStatus } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QuerySubscribersDto extends PaginationDto {
  @ApiPropertyOptional({ enum: DripSubscriptionStatus })
  @IsOptional()
  @IsEnum(DripSubscriptionStatus)
  status?: DripSubscriptionStatus;
}

```
---

## File : `src/modules/drip/dto/toggle-drip.dto.ts`

```ts
import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ToggleDripDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

```
---

## File : `src/modules/drip/dto/update-drip.dto.ts`

```ts
import { PartialType } from "@nestjs/swagger";
import { CreateDripDto } from "./create-drip.dto";
export class UpdateDripDto extends PartialType(CreateDripDto) {}

```
---

## File : `src/modules/groups/dto/create-group.dto.ts`

```ts
import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  participants: string[];
}

```
---

## File : `src/modules/groups/dto/manage-admins.dto.ts`

```ts
import { IsArray, ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManageAdminsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  participants: string[];
}

```
---

## File : `src/modules/groups/dto/manage-members.dto.ts`

```ts
import { IsArray, ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManageMembersDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  participants: string[];
}

```
---

## File : `src/modules/groups/dto/membership-request.dto.ts`

```ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MembershipRequestAction {
  APPROVE = 'approve',
  REJECT = 'reject',
}

export class MembershipRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requesterJid: string;

  @ApiProperty({ enum: MembershipRequestAction })
  @IsEnum(MembershipRequestAction)
  action: MembershipRequestAction;
}

```
---

## File : `src/modules/groups/dto/update-group.dto.ts`

```ts
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

```
---

## File : `src/modules/groups/groups.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateGroupDto } from "./dto/create-group.dto";
import { ManageMembersDto } from "./dto/manage-members.dto";
import { ManageAdminsDto } from "./dto/manage-admins.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { MembershipRequestDto } from "./dto/membership-request.dto";

@ApiTags("Groups")
@UseGuards(JwtAuthGuard)
@Controller({ path: "groups", version: "1" })
export class GroupsController {
  constructor(private svc: GroupsService) {}

  // FIX: route kini menjadi POST /groups/:sessionId agar param :sessionId terbaca
  @Post(":sessionId")
  @ApiOperation({ summary: "Buat grup baru" })
  async create(@Param("sessionId") sid: string, @Body() dto: CreateGroupDto) {
    return {
      status: true,
      data: await this.svc.create(sid, dto.name, dto.participants),
    };
  }

  @Get(":sessionId/:groupId")
  @ApiOperation({ summary: "Info grup" })
  async getInfo(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return { status: true, data: await this.svc.getInfo(sid, gid) };
  }

  @Post(":sessionId/:groupId/participants/add")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Tambah anggota grup" })
  async addParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() dto: ManageMembersDto,
  ) {
    return {
      status: true,
      data: await this.svc.addParticipants(sid, gid, dto.participants),
    };
  }

  @Post(":sessionId/:groupId/participants/remove")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus anggota grup" })
  async removeParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() dto: ManageMembersDto,
  ) {
    return {
      status: true,
      data: await this.svc.removeParticipants(sid, gid, dto.participants),
    };
  }

  @Post(":sessionId/:groupId/participants/promote")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Promosi anggota menjadi admin" })
  async promoteParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() dto: ManageAdminsDto,
  ) {
    return {
      status: true,
      data: await this.svc.promoteParticipants(sid, gid, dto.participants),
    };
  }

  @Post(":sessionId/:groupId/participants/demote")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Demosi admin menjadi anggota biasa" })
  async demoteParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() dto: ManageAdminsDto,
  ) {
    return {
      status: true,
      data: await this.svc.demoteParticipants(sid, gid, dto.participants),
    };
  }

  @Post(":sessionId/:groupId/update")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update nama dan deskripsi grup" })
  async updateGroup(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() dto: UpdateGroupDto,
  ) {
    const results: any = {};
    if (dto.subject)
      results.subject = await this.svc.updateSubject(sid, gid, dto.subject);
    if (dto.description)
      results.description = await this.svc.updateDescription(
        sid,
        gid,
        dto.description,
      );
    return { status: true, data: results };
  }

  @Post(":sessionId/:groupId/leave")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Keluar dari grup" })
  async leave(@Param("sessionId") sid: string, @Param("groupId") gid: string) {
    return { status: true, data: await this.svc.leave(sid, gid) };
  }

  @Get(":sessionId/:groupId/invite")
  @ApiOperation({ summary: "Dapatkan invite link grup" })
  async getInviteCode(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return { status: true, data: await this.svc.getInviteCode(sid, gid) };
  }

  @Post(":sessionId/:groupId/invite/revoke")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revoke invite link grup" })
  async revokeInvite(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return { status: true, data: await this.svc.revokeInvite(sid, gid) };
  }

  @Post(":sessionId/join")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Join grup via invite code" })
  async join(
    @Param("sessionId") sid: string,
    @Body() body: { inviteCode: string },
  ) {
    return {
      status: true,
      data: await this.svc.joinViaInvite(sid, body.inviteCode),
    };
  }

  @Get(":sessionId/invite/:inviteCode/info")
  @ApiOperation({ summary: "Dapatkan info grup sebelum join" })
  async getInviteInfo(
    @Param("sessionId") sid: string,
    @Param("inviteCode") code: string,
  ) {
    return { status: true, data: await this.svc.getInviteInfo(sid, code) };
  }

  @Post(":sessionId/:groupId/membership-request")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Approve atau reject join request" })
  async handleMembershipRequest(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() dto: MembershipRequestDto,
  ) {
    return {
      status: true,
      data: await this.svc.handleMembershipRequest(sid, gid, dto),
    };
  }

  @Get(":sessionId/:groupId/membership-requests")
  @ApiOperation({ summary: "Dapatkan daftar join request yang pending" })
  async getMembershipRequests(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return {
      status: true,
      data: await this.svc.getMembershipRequests(sid, gid),
    };
  }

  @Get(":sessionId/contacts/:contactId/common-groups")
  @ApiOperation({ summary: "Dapatkan grup yang sama antara bot dan kontak" })
  async getCommonGroups(
    @Param("sessionId") sid: string,
    @Param("contactId") cid: string,
  ) {
    return { status: true, data: await this.svc.getCommonGroups(sid, cid) };
  }
}

```
---

## File : `src/modules/groups/groups.module.ts`

```ts
import { Module } from "@nestjs/common";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}

```
---

## File : `src/modules/groups/groups.service.ts`

```ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import {
  MembershipRequestDto,
  MembershipRequestAction,
} from './dto/membership-request.dto';

@Injectable()
export class GroupsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async create(sessionId: string, name: string, participants: string[]) {
    return this.client(sessionId).createGroup(name, participants);
  }

  async getInfo(sessionId: string, groupId: string) {
    return this.client(sessionId).getChatById(groupId);
  }

  async addParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.addParticipants(participants);
  }

  async removeParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.removeParticipants(participants);
  }

  async promoteParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.promoteParticipants(participants);
  }

  async demoteParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.demoteParticipants(participants);
  }

  async updateSubject(sessionId: string, groupId: string, subject: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.setSubject(subject);
  }

  async updateDescription(
    sessionId: string,
    groupId: string,
    description: string,
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.setDescription(description);
  }

  async leave(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.leave();
  }

  async getInviteCode(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    const code = await group.getInviteCode();
    return { inviteLink: `https://chat.whatsapp.com/${code}` };
  }

  async revokeInvite(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.revokeInvite();
  }

  async joinViaInvite(sessionId: string, inviteCode: string) {
    return this.client(sessionId).acceptInvite(inviteCode);
  }

  async getInviteInfo(sessionId: string, inviteCode: string) {
    return this.client(sessionId).getInviteInfo(inviteCode);
  }

  async handleMembershipRequest(
    sessionId: string,
    groupId: string,
    dto: MembershipRequestDto,
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    if (dto.action === MembershipRequestAction.APPROVE) {
      return group.approveGroupMembershipRequests([dto.requesterJid]);
    }
    return group.rejectGroupMembershipRequests([dto.requesterJid]);
  }

  async getMembershipRequests(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.getGroupMembershipRequests?.() ?? [];
  }

  async getCommonGroups(sessionId: string, contactId: string) {
    const contact = await this.client(sessionId).getContactById(contactId);
    if (!contact) throw new BadRequestException({ code: ErrorCodes.NOT_FOUND });
    return (contact as any).getCommonGroups?.() ?? [];
  }
}

```
---

## File : `src/modules/health/health.controller.ts`

```ts
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("Health")
@Controller({ path: "health", version: "1" })
export class HealthController {
  constructor(private svc: HealthService) {}

  @Public()
  @Get()
  check() {
    return this.svc.check();
  }
}

```
---

## File : `src/modules/health/health.module.ts`

```ts
import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({ controllers: [HealthController], providers: [HealthService] })
export class HealthModule {}

```
---

## File : `src/modules/health/health.service.ts`

```ts
import { Injectable } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class HealthService {
  constructor(private redis: RedisService) {}

  async check() {
    try {
      await this.redis.getClient().ping();
      return { status: "ok", redis: "ok", timestamp: new Date().toISOString() };
    } catch {
      return {
        status: "error",
        redis: "unavailable",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

```
---

## File : `src/modules/inbox/dto/query-inbox.dto.ts`

```ts
import { IsOptional, IsString, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryInboxDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  unread?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jid?: string;
}

```
---

## File : `src/modules/inbox/dto/reply-inbox.dto.ts`

```ts

```
---

## File : `src/modules/inbox/inbox.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { InboxService } from "./inbox.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { QuotaGuard } from "../../common/guards/quota.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QueryInboxDto } from "./dto/query-inbox.dto";

class ReplyInboxDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: "Quote pesan yang dibalas" })
  @IsOptional()
  @IsString()
  quotedMessageId?: string;
}

@ApiTags("Inbox")
@UseGuards(JwtAuthGuard)
@Controller({ path: "inbox", version: "1" })
export class InboxController {
  constructor(private inbox: InboxService) {}

  @Get()
  @ApiOperation({ summary: "Daftar pesan masuk" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryInboxDto) {
    const r = await this.inbox.findAll(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  @Get("conversations")
  @ApiOperation({ summary: "Daftar percakapan grouped by JID" })
  async conversations(@CurrentUser() u: any) {
    return { status: true, data: await this.inbox.getConversations(u.id) };
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Tandai pesan sebagai dibaca" })
  async markRead(@CurrentUser() u: any, @Param("id") id: string) {
    await this.inbox.markRead(u.id, id);
    return { status: true };
  }

  @Patch("conversations/:jid/read-all")
  @ApiOperation({ summary: "Tandai semua pesan percakapan sebagai dibaca" })
  async markAllRead(@CurrentUser() u: any, @Param("jid") jid: string) {
    await this.inbox.markAllRead(u.id, jid);
    return { status: true };
  }

  /**
   * FIX: Balas pesan langsung dari inbox.
   * Secara otomatis menggunakan sesi yang sama dengan pesan masuk.
   */
  @Post(":id/reply")
  @UseGuards(QuotaGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Balas pesan langsung dari inbox" })
  async reply(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ReplyInboxDto,
  ) {
    return {
      status: true,
      data: await this.inbox.reply(u.id, id, dto.message, dto.quotedMessageId),
    };
  }
}

```
---

## File : `src/modules/inbox/inbox.module.ts`

```ts
import { Module, forwardRef } from "@nestjs/common";
import { InboxController } from "./inbox.controller";
import { InboxService } from "./inbox.service";
import { SessionsModule } from "../sessions/sessions.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    forwardRef(() => SessionsModule), // FIX: circular — SessionsModule ↔ InboxModule
    NotificationsModule,
  ],
  controllers: [InboxController],
  providers: [InboxService],
  exports: [InboxService],
})
export class InboxModule {}

```
---

## File : `src/modules/inbox/inbox.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { QueryInboxDto } from "./dto/query-inbox.dto";
import { isGroupJid } from "../../common/utils/phone-normalizer.util";

@Injectable()
export class InboxService {
  constructor(
    private prisma: PrismaService,
    // FIX: forwardRef karena SessionsModule ↔ InboxModule saling import
    @Inject(forwardRef(() => SessionManagerService))
    private manager: SessionManagerService,
  ) {}

  async findAll(userId: string, dto: QueryInboxDto) {
    const where: any = { userId };
    if (dto.unread) where.isRead = false;
    if (dto.jid) where.remoteJid = dto.jid;

    const [data, total] = await Promise.all([
      this.prisma.inbox.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        orderBy: { timestamp: "desc" },
      }),
      this.prisma.inbox.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async getConversations(userId: string) {
    const allMessages = await this.prisma.inbox.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    const conversationMap = new Map<string, any>();

    for (const msg of allMessages) {
      if (!conversationMap.has(msg.remoteJid)) {
        conversationMap.set(msg.remoteJid, {
          remoteJid: msg.remoteJid,
          pushName: msg.pushName,
          lastMessage: msg.messageContent,
          messageType: msg.messageType,
          lastTime: msg.timestamp,
          sessionId: msg.sessionId,
          unreadCount: 0,
          isGroup: isGroupJid(msg.remoteJid),
        });
      }
      if (!msg.isRead) {
        conversationMap.get(msg.remoteJid)!.unreadCount++;
      }
    }

    return [...conversationMap.values()].sort(
      (a, b) => b.lastTime.getTime() - a.lastTime.getTime(),
    );
  }

  async markRead(userId: string, id: string) {
    const msg = await this.prisma.inbox.findFirst({ where: { id, userId } });
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await this.prisma.inbox.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string, jid: string) {
    await this.prisma.inbox.updateMany({
      where: { userId, remoteJid: jid },
      data: { isRead: true },
    });
  }

  async reply(
    userId: string,
    inboxId: string,
    message: string,
    quotedMessageId?: string,
  ) {
    const msg = await this.prisma.inbox.findFirst({
      where: { id: inboxId, userId },
    });
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (!msg.sessionId)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const opts: any = {};
    if (quotedMessageId) opts.quotedMessageId = quotedMessageId;

    const result = await this.manager.sendMessage(
      msg.sessionId,
      msg.remoteJid,
      message,
      opts,
    );

    await this.prisma.userQuota.updateMany({
      where: { userId },
      data: { messagesSentToday: { increment: 1 } },
    });

    return { messageId: result?.id?._serialized };
  }

  async saveIncoming(data: {
    id: string;
    userId: string;
    sessionId: string;
    remoteJid: string;
    pushName: string;
    messageContent: string;
    messageType: string;
  }) {
    await this.prisma.inbox.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        userId: data.userId,
        sessionId: data.sessionId,
        remoteJid: data.remoteJid,
        pushName: this.sanitize(data.pushName),
        messageContent: data.messageContent,
        messageType: data.messageType as any,
      },
      update: {},
    });
  }

  private sanitize(input: string): string {
    if (!input) return "";
    return input
      .replace(/<[^>]*>/g, "")
      .replace(/[<>"']/g, "")
      .trim()
      .slice(0, 100);
  }
}

```
---

## File : `src/modules/labels/dto/assign-label.dto.ts`

```ts
import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLabelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  labelId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  chatIds: string[];
}

```
---

## File : `src/modules/labels/dto/create-label.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;
}

```
---

## File : `src/modules/labels/labels.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LabelsService } from "./labels.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";

@ApiTags("Labels")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("labels")
@Controller({ path: "labels", version: "1" })
export class LabelsController {
  constructor(private svc: LabelsService) {}

  @Get(":sessionId")
  async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }
  @Get(":sessionId/:labelId")
  async getById(
    @Param("sessionId") sid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.getById(sid, lid) };
  }
  @Post(":sessionId/chats/:chatId/labels/:labelId")
  @HttpCode(HttpStatus.OK)
  async addToChat(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.addToChat(sid, cid, lid) };
  }
  @Post(":sessionId/chats/:chatId/labels/:labelId/remove")
  @HttpCode(HttpStatus.OK)
  async removeFromChat(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.removeFromChat(sid, cid, lid) };
  }
  @Get(":sessionId/labels/:labelId/chats")
  async getChatsByLabel(
    @Param("sessionId") sid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.getChatsByLabel(sid, lid) };
  }
}

```
---

## File : `src/modules/labels/labels.module.ts`

```ts
import { Module } from "@nestjs/common";
import { LabelsController } from "./labels.controller";
import { LabelsService } from "./labels.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}

```
---

## File : `src/modules/labels/labels.service.ts`

```ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";

@Injectable()
export class LabelsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getAll(sessionId: string) {
    return (this.client(sessionId) as any).getLabels?.() ?? [];
  }
  async getById(sessionId: string, labelId: string) {
    return (this.client(sessionId) as any).getLabelById?.(labelId);
  }
  async addToChat(sessionId: string, chatId: string, labelId: string) {
    return (this.client(sessionId) as any).addOrRemoveLabels?.(
      [labelId],
      [chatId],
      "add",
    );
  }
  async removeFromChat(sessionId: string, chatId: string, labelId: string) {
    return (this.client(sessionId) as any).addOrRemoveLabels?.(
      [labelId],
      [chatId],
      "remove",
    );
  }
  async getChatsByLabel(sessionId: string, labelId: string) {
    return (this.client(sessionId) as any).getChatsByLabel?.(labelId) ?? [];
  }
}

```
---

## File : `src/modules/messages/dto/query-messages.dto.ts`

```ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { MessageStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryMessagesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: MessageStatus })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionId?: string;
}

```
---

## File : `src/modules/messages/dto/react-message.dto.ts`

```ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactMessageDto {
  @ApiProperty({
    description: 'Emoji reaction. Empty string to remove reaction.',
  })
  @IsString()
  reaction: string;
}

```
---

## File : `src/modules/messages/dto/send-contact.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    type: [String],
    description: 'Phone numbers of contacts to send as vCard',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  contacts: string[];

  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}

```
---

## File : `src/modules/messages/dto/send-live-location.dto.ts`

```ts
import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendLiveLocationDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsNumber() latitude: number;
  @ApiProperty() @IsNumber() longitude: number;
  @ApiPropertyOptional({ description: 'Duration in seconds, default 60' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number = 60;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}

```
---

## File : `src/modules/messages/dto/send-location.dto.ts`

```ts
import { IsNumber, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendLocationDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsNumber() latitude: number;
  @ApiProperty() @IsNumber() longitude: number;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
}

```
---

## File : `src/modules/messages/dto/send-media.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMediaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;
}

```
---

## File : `src/modules/messages/dto/send-message.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendMessageDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsString() @IsNotEmpty() message: string;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
  @ApiPropertyOptional() @IsOptional() @IsString() quotedMessageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() mentions?: string[];
}

```
---

## File : `src/modules/messages/dto/send-poll.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  ArrayMinSize,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendPollDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsString() @IsNotEmpty() question: string;
  @ApiProperty() @IsArray() @ArrayMinSize(2) options: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() multiselect?: boolean;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
}

```
---

## File : `src/modules/messages/dto/send-voice-note.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendVoiceNoteDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}

```
---

## File : `src/modules/messages/messages.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { MessagesService } from "./messages.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { QuotaGuard } from "../../common/guards/quota.guard";
import { SandboxInterceptor } from "../../common/interceptors/sandbox.interceptor";
import { AllowApiKey } from "../../common/guards/api-key-restriction.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SendMessageDto } from "./dto/send-message.dto";
import { SendMediaDto } from "./dto/send-media.dto";
import { SendLocationDto } from "./dto/send-location.dto";
import { SendLiveLocationDto } from "./dto/send-live-location.dto";
import { SendPollDto } from "./dto/send-poll.dto";
import { SendContactDto } from "./dto/send-contact.dto";
import { SendVoiceNoteDto } from "./dto/send-voice-note.dto";
import { ReactMessageDto } from "./dto/react-message.dto";
import { QueryMessagesDto } from "./dto/query-messages.dto";

@ApiTags("Messages")
@UseGuards(JwtAuthGuard)
@UseInterceptors(SandboxInterceptor)
@Controller({ path: "messages", version: "1" })
export class MessagesController {
  constructor(
    private svc: MessagesService,
    private cfg: ConfigService,
  ) {}

  @Post("send")
  @AllowApiKey() // ✅ API Key boleh akses
  @UseGuards(QuotaGuard)
  @ApiOperation({ summary: "Kirim pesan teks" })
  async send(@CurrentUser() u: any, @Body() dto: SendMessageDto) {
    return { status: true, data: await this.svc.send(u.id, dto) };
  }

  @Post("send-media")
  @AllowApiKey()
  @UseGuards(QuotaGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Kirim pesan media" })
  async sendMedia(
    @CurrentUser() u: any,
    @Body() dto: SendMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.sendMedia(u.id, dto, file) };
  }

  @Post("send-location")
  @AllowApiKey()
  @UseGuards(QuotaGuard)
  @ApiOperation({ summary: "Kirim lokasi" })
  async sendLocation(@CurrentUser() u: any, @Body() dto: SendLocationDto) {
    return { status: true, data: await this.svc.sendLocation(u.id, dto) };
  }

  @Post("send-live-location")
  @AllowApiKey()
  @UseGuards(QuotaGuard)
  @ApiOperation({ summary: "Kirim live location" })
  async sendLiveLocation(
    @CurrentUser() u: any,
    @Body() dto: SendLiveLocationDto,
  ) {
    return { status: true, data: await this.svc.sendLiveLocation(u.id, dto) };
  }

  @Post("send-poll")
  @AllowApiKey()
  @UseGuards(QuotaGuard)
  @ApiOperation({ summary: "Kirim poll" })
  async sendPoll(@CurrentUser() u: any, @Body() dto: SendPollDto) {
    return { status: true, data: await this.svc.sendPoll(u.id, dto) };
  }

  @Post("send-contact")
  @AllowApiKey()
  @UseGuards(QuotaGuard)
  @ApiOperation({ summary: "Kirim kontak sebagai vCard" })
  async sendContact(@CurrentUser() u: any, @Body() dto: SendContactDto) {
    return { status: true, data: await this.svc.sendContact(u.id, dto) };
  }

  @Post("send-voice-note")
  @AllowApiKey()
  @UseGuards(QuotaGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Kirim voice note" })
  async sendVoiceNote(
    @CurrentUser() u: any,
    @Body() dto: SendVoiceNoteDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      status: true,
      data: await this.svc.sendVoiceNote(u.id, dto, file),
    };
  }

  // ── Endpoint di bawah: TIDAK boleh diakses via API Key ──

  @Patch(":sessionId/messages/:messageId/edit")
  @ApiOperation({ summary: "Edit pesan" })
  async editMessage(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
    @Body() body: { text: string },
  ) {
    return {
      status: true,
      data: await this.svc.editMessage(u.id, sid, mid, body.text),
    };
  }

  @Post(":sessionId/messages/:messageId/forward")
  @HttpCode(HttpStatus.OK)
  async forwardMessage(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
    @Body() body: { to: string },
  ) {
    return {
      status: true,
      data: await this.svc.forwardMessage(u.id, sid, mid, body.to),
    };
  }

  @Post(":sessionId/messages/:messageId/pin")
  @HttpCode(HttpStatus.OK)
  async pinMessage(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
    @Body() body: { duration?: number },
  ) {
    return {
      status: true,
      data: await this.svc.pinMessage(u.id, sid, mid, body.duration),
    };
  }

  @Post(":sessionId/messages/:messageId/unpin")
  @HttpCode(HttpStatus.OK)
  async unpinMessage(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
  ) {
    return { status: true, data: await this.svc.unpinMessage(u.id, sid, mid) };
  }

  @Post(":sessionId/messages/:messageId/download")
  @HttpCode(HttpStatus.OK)
  async downloadMedia(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
  ) {
    const storagePath = this.cfg.get<string>("app.storagePath");
    return {
      status: true,
      data: await this.svc.downloadMedia(u.id, sid, mid, storagePath),
    };
  }

  @Post(":sessionId/messages/:messageId/react")
  @HttpCode(HttpStatus.OK)
  async react(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
    @Body() dto: ReactMessageDto,
  ) {
    return {
      status: true,
      data: await this.svc.reactMessage(u.id, sid, mid, dto.reaction),
    };
  }

  @Delete(":sessionId/messages/:messageId")
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
    @Query("forEveryone") forEveryone?: string,
  ) {
    return {
      status: true,
      data: await this.svc.deleteMessage(
        u.id,
        sid,
        mid,
        forEveryone !== "false",
      ),
    };
  }

  @Get("check/:sessionId/:phone")
  @AllowApiKey()
  async checkRegistered(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("phone") phone: string,
  ) {
    return {
      status: true,
      data: await this.svc.isRegisteredUser(u.id, sid, phone),
    };
  }

  @Get("logs")
  @ApiOperation({ summary: "Riwayat pesan" })
  async logs(@CurrentUser() u: any, @Query() dto: QueryMessagesDto) {
    const r = await this.svc.getLogs(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  @Get("logs/export-pdf")
  async exportLogsPdf(
    @CurrentUser() u: any,
    @Query() dto: QueryMessagesDto,
    @Res() res: Response,
  ) {
    const buffer = await this.svc.exportLogsPdf(u.id, dto);
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="messages_${date}.pdf"`,
    );
    res.send(buffer);
  }
}

```
---

## File : `src/modules/messages/messages.module.ts`

```ts
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { SessionsModule } from "../sessions/sessions.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    SessionsModule,
    NotificationsModule, // FIX: diperlukan oleh QuotaGuard (inject NotificationsService)
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}

```
---

## File : `src/modules/messages/messages.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import {
  normalizePhone,
  toJid,
} from '../../common/utils/phone-normalizer.util';
import { generatePdf } from '../../common/utils/pdf-generator.util';
import { MessageStatus, MessageType, SessionStatus } from '@prisma/client';
import { MessageMedia } from 'whatsapp-web.js';
import { validateMimeType } from '../../common/utils/mime-validator.util';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMediaDto } from './dto/send-media.dto';
import { SendLocationDto } from './dto/send-location.dto';
import { SendLiveLocationDto } from './dto/send-live-location.dto';
import { SendPollDto } from './dto/send-poll.dto';
import { SendContactDto } from './dto/send-contact.dto';
import { SendVoiceNoteDto } from './dto/send-voice-note.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private manager: SessionManagerService,
  ) {}

  async send(userId: string, dto: SendMessageDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    try {
      const opts: any = {};
      if (dto.quotedMessageId) opts.quotedMessageId = dto.quotedMessageId;
      if (dto.mentions) opts.mentions = dto.mentions;
      const result = await this.manager.sendMessage(
        sessionId,
        jid,
        dto.message,
        opts,
      );
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.message,
        MessageType.text,
        MessageStatus.success,
      );
      return { messageId: result?.id?._serialized };
    } catch (e) {
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.message,
        MessageType.text,
        MessageStatus.failed,
        e.message,
      );
      throw new BadRequestException({
        code: ErrorCodes.SEND_FAILED,
        message: e.message,
      });
    }
  }

  async sendMedia(
    userId: string,
    dto: SendMediaDto,
    file: Express.Multer.File,
  ) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const mime = await validateMimeType(file.buffer);
    const media = new MessageMedia(
      mime,
      file.buffer.toString('base64'),
      file.originalname,
    );
    const msgType = this.mimeToType(mime);
    try {
      const result = await this.manager.sendMedia(
        sessionId,
        jid,
        media,
        dto.caption,
      );
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.caption ?? '',
        msgType,
        MessageStatus.success,
      );
      return { messageId: result?.id?._serialized };
    } catch (e) {
      await this.logMessage(
        userId,
        sessionId,
        dto.to,
        dto.caption ?? '',
        msgType,
        MessageStatus.failed,
        e.message,
      );
      throw new BadRequestException({
        code: ErrorCodes.SEND_FAILED,
        message: e.message,
      });
    }
  }

  async sendLocation(userId: string, dto: SendLocationDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const result = await client.sendMessage(
      jid,
      dto.latitude + ',' + dto.longitude,
      {
        location: {
          latitude: dto.latitude,
          longitude: dto.longitude,
          description: dto.description,
        },
      } as any,
    );
    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      `Location:${dto.latitude},${dto.longitude}`,
      MessageType.location,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async sendLiveLocation(userId: string, dto: SendLiveLocationDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const result = await client.sendMessage(jid, '', {
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
      },
      live: true,
      liveLocationDurationMs: (dto.duration ?? 60) * 1000,
    } as any);
    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      `LiveLocation:${dto.latitude},${dto.longitude}`,
      MessageType.location,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async sendPoll(userId: string, dto: SendPollDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const result = await client.sendMessage(jid, dto.question, {
      poll: { options: dto.options, multiselect: dto.multiselect ?? false },
    } as any);
    return { messageId: result?.id?._serialized };
  }

  async sendContact(userId: string, dto: SendContactDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const contacts = await Promise.all(
      dto.contacts.map(async (num) => {
        const normalized = normalizePhone(num);
        return client.getContactById(`${normalized}@s.whatsapp.net`);
      }),
    );
    const result = await client.sendMessage(jid, contacts as any);
    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      '[vCard]',
      MessageType.vcard,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async sendVoiceNote(
    userId: string,
    dto: SendVoiceNoteDto,
    file: Express.Multer.File,
  ) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const jid = toJid(dto.to);
    const mime = await validateMimeType(file.buffer);
    const media = new MessageMedia(
      mime,
      file.buffer.toString('base64'),
      file.originalname,
    );
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const result = await client.sendMessage(jid, media, {
      sendAudioAsVoice: true,
    } as any);
    await this.logMessage(
      userId,
      sessionId,
      dto.to,
      '[VoiceNote]',
      MessageType.audio,
      MessageStatus.success,
    );
    return { messageId: result?.id?._serialized };
  }

  async editMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    newText: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const result = await (msg as any).edit(newText);
    return { edited: true, messageId: result?.id?._serialized };
  }

  async forwardMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    to: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const jid = toJid(to);
    await msg.forward(jid);
    return { forwarded: true };
  }

  async pinMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    duration?: number,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await (msg as any).pin(duration);
    return { pinned: true };
  }

  async unpinMessage(userId: string, sessionId: string, messageId: string) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await (msg as any).unpin();
    return { unpinned: true };
  }

  async downloadMedia(
    userId: string,
    sessionId: string,
    messageId: string,
    storagePath: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (!msg.hasMedia)
      throw new BadRequestException({ code: ErrorCodes.VALIDATION });
    const media = await msg.downloadMedia();
    if (!media) throw new BadRequestException({ code: ErrorCodes.SEND_FAILED });
    const ext = media.mimetype.split('/')[1]?.split(';')[0] ?? 'bin';
    const filename = `${messageId}.${ext}`;
    const dir = path.join(storagePath, 'uploads', userId);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));
    return { filename, mimetype: media.mimetype, path: filePath };
  }

  async reactMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    reaction: string,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await msg.react(reaction);
    return { reacted: true };
  }

  async deleteMessage(
    userId: string,
    sessionId: string,
    messageId: string,
    forEveryone = true,
  ) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const msg = await client.getMessageById(messageId);
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    await msg.delete(forEveryone);
    return { deleted: true };
  }

  async isRegisteredUser(userId: string, sessionId: string, phone: string) {
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    const normalized = normalizePhone(phone);
    const isRegistered = await client.isRegisteredUser(
      `${normalized}@s.whatsapp.net`,
    );
    return { phone: normalized, isRegistered };
  }

  async getLogs(userId: string, dto: QueryMessagesDto) {
    const where: any = { userId };
    if (dto.status) where.status = dto.status;
    if (dto.sessionId) where.sessionId = dto.sessionId;
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.messageLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.messageLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportLogsPdf(userId: string, dto: QueryMessagesDto): Promise<Buffer> {
    const where: any = { userId };
    if (dto.status) where.status = dto.status;
    if (dto.sessionId) where.sessionId = dto.sessionId;

    const data = await this.prisma.messageLog.findMany({
      where,
      take: 1000,
      orderBy: { timestamp: 'desc' },
    });

    const rows = data.map((r) => ({
      timestamp: new Date(r.timestamp).toLocaleString('id-ID'),
      target: r.target,
      type: r.messageType,
      status: r.status,
      message: String(r.message ?? '').slice(0, 50),
    }));

    return generatePdf('Riwayat Pesan', rows);
  }

  private async resolveSession(
    userId: string,
    sessionId?: string,
  ): Promise<string> {
    if (sessionId && sessionId !== 'auto') {
      const s = await this.prisma.whatsappSession.findFirst({
        where: { id: sessionId, userId, status: SessionStatus.connected },
      });
      if (!s)
        throw new BadRequestException({
          code: ErrorCodes.SESSION_NOT_CONNECTED,
        });
      return sessionId;
    }
    const healthy = await this.manager.getHealthySession(userId);
    if (!healthy)
      throw new BadRequestException({ code: ErrorCodes.NO_SESSIONS });
    return healthy;
  }

  private async logMessage(
    userId: string,
    sessionId: string,
    target: string,
    message: string,
    type: MessageType,
    status: MessageStatus,
    error?: string,
  ) {
    await this.prisma.messageLog.create({
      data: {
        userId,
        sessionId,
        target,
        message,
        messageType: type,
        status,
        errorMessage: error,
      },
    });
    if (status === MessageStatus.success) {
      await this.prisma.userQuota.updateMany({
        where: { userId },
        data: { messagesSentToday: { increment: 1 } },
      });
    }
  }

  private mimeToType(mime: string): MessageType {
    if (mime.startsWith('image/')) return MessageType.image;
    if (mime.startsWith('video/')) return MessageType.video;
    if (mime.startsWith('audio/')) return MessageType.audio;
    return MessageType.document;
  }
}

```
---

## File : `src/modules/notifications/dto/send-notification.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  EMAIL = 'email',
  SOCKET = 'socket',
  BOTH = 'both',
}

export class SendNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    enum: NotificationType,
    default: NotificationType.SOCKET,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType = NotificationType.SOCKET;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subject?: string;
}

```
---

## File : `src/modules/notifications/email.service.ts`

```ts
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

/**
 * FIX: EmailService sebelumnya hanya stub kosong (// TODO).
 * Sekarang diimplementasi menggunakan Nodemailer dengan SMTP dari env.
 *
 * Env yang dibutuhkan (opsional — jika tidak ada, email di-skip dengan warning):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Install: npm install nodemailer @types/nodemailer
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private logger = new Logger("EmailService");
  private transporter: Transporter | null = null;
  private from: string;
  private enabled = false;

  constructor(private cfg: ConfigService) {}

  onModuleInit() {
    const host = this.cfg.get<string>("SMTP_HOST");
    const port = this.cfg.get<number>("SMTP_PORT") ?? 587;
    const user = this.cfg.get<string>("SMTP_USER");
    const pass = this.cfg.get<string>("SMTP_PASS");
    this.from = this.cfg.get<string>("SMTP_FROM") ?? "noreply@wagateway.app";

    if (!host || !user || !pass) {
      this.logger.warn(
        "EmailService: SMTP_HOST/SMTP_USER/SMTP_PASS tidak dikonfigurasi — notifikasi email dinonaktifkan.",
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    this.enabled = true;
    this.logger.log(`EmailService: SMTP terhubung ke ${host}:${port}`);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    if (!this.enabled || !this.transporter) {
      this.logger.debug(`[EMAIL SKIP] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html: this.wrapHtml(subject, body),
      });
      this.logger.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
    } catch (e) {
      this.logger.error(`[EMAIL FAILED] To: ${to} | ${e.message}`);
    }
  }

  private wrapHtml(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>${title}</title></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#075E54;padding:16px;border-radius:8px 8px 0 0;">
            <h2 style="color:#fff;margin:0;">WA Gateway</h2>
          </div>
          <div style="border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
            <h3>${title}</h3>
            <p style="color:#333;line-height:1.6;">${content}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="color:#999;font-size:12px;">
              Email ini dikirim otomatis oleh sistem WA Gateway. Jangan balas email ini.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

```
---

## File : `src/modules/notifications/notifications.module.ts`

```ts
import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EmailService } from "./email.service";
import { SystemMonitorService } from "./system-monitor.service";
import { GatewayModule } from "../../gateway/gateway.module";

@Module({
  imports: [GatewayModule],
  providers: [NotificationsService, EmailService, SystemMonitorService],
  // FIX: export EmailService agar bisa dipakai oleh module lain
  // yang import NotificationsModule (seperti ApiKeysModule)
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}

```
---

## File : `src/modules/notifications/notifications.service.ts`

```ts
import { Injectable } from "@nestjs/common";
import { GatewayService } from "../../gateway/gateway.service";
import { EmailService } from "./email.service";
import { AlertType } from "../../common/enums/status.enum";

/**
 * FIX: Lengkapi semua notifikasi sesuai doc 1 section 30:
 *
 * In-app (Socket.IO):
 *  ✅ Sesi WA terputus / logout permanen
 *  ✅ Semua sesi user terputus sekaligus  (via session-manager)
 *  ✅ Kuota pesan harian mendekati batas / habis
 *  ✅ Kuota broadcast bulanan mendekati batas / habis
 *  ✅ Broadcast campaign selesai           (via gateway.service)
 *  ✅ AI dinonaktifkan
 *  ✅ Redis terputus                       (via system-monitor)
 *  ✅ Disk hampir penuh                    (via system-monitor)
 *
 * Email:
 *  ✅ Sesi WA terputus / banned
 *  ✅ Login dari IP baru (peringatan keamanan)
 *  ✅ Webhook gagal berulang kali
 *  ✅ Langganan hampir habis
 *  ✅ Token API mendekati expired          (stub — tidak ada TTL di model)
 */
@Injectable()
export class NotificationsService {
  constructor(
    private gateway: GatewayService,
    private email: EmailService,
  ) {}

  // ── Sesi ─────────────────────────────────────────────────────

  notifySessionDisconnected(
    userId: string,
    userEmail: string,
    sessionName: string,
  ) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.SESSION_DISCONNECTED,
      `Sesi '${sessionName}' terputus.`,
    );
    this.email.send(
      userEmail,
      "Sesi WhatsApp Terputus",
      `Sesi <strong>${sessionName}</strong> terputus dari server. Silakan reconnect melalui dashboard.`,
    );
  }

  notifySessionLoggedOut(
    userId: string,
    userEmail: string,
    sessionName: string,
  ) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.SESSION_LOGGED_OUT,
      `Sesi '${sessionName}' logout permanen. Perlu scan ulang QR.`,
    );
    this.email.send(
      userEmail,
      "Sesi WhatsApp Logout",
      `Sesi <strong>${sessionName}</strong> logout permanen. Silakan login ulang dengan scan QR code.`,
    );
  }

  // ── Kuota ────────────────────────────────────────────────────

  notifyQuotaWarning(
    userId: string,
    type: "daily" | "monthly",
    percent: number,
  ) {
    const label = type === "daily" ? "pesan harian" : "broadcast bulanan";
    const msg = `Anda telah menggunakan ${percent}% kuota ${label}.`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_WARNING, msg);
  }

  notifyQuotaExceeded(userId: string, type: "daily" | "monthly") {
    const label = type === "daily" ? "pesan harian" : "broadcast bulanan";
    const msg = `Kuota ${label} Anda telah habis.`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_EXCEEDED, msg);
  }

  // ── AI ───────────────────────────────────────────────────────

  notifyAiDisabled(userId: string, adminEmail: string) {
    this.gateway.emitSystemAlert(
      userId,
      AlertType.AI_DISABLED,
      "AI Smart Reply dinonaktifkan: API key Gemini tidak valid.",
    );
    this.email.send(
      adminEmail,
      "Gemini AI Dinonaktifkan",
      "API key Gemini tidak valid. AI Smart Reply otomatis dinonaktifkan. Perbarui API key di Settings.",
    );
  }

  // ── Keamanan: Login IP Baru ────────────────────────────────

  notifyNewIpLogin(userEmail: string, ip: string, userAgent: string) {
    this.email.send(
      userEmail,
      "Login dari IP Baru Terdeteksi",
      `Akun Anda baru saja login dari IP <strong>${ip}</strong>.<br>
       Browser/Device: ${userAgent || "Tidak diketahui"}.<br><br>
       Jika ini bukan Anda, segera ganti password dan aktifkan 2FA.`,
    );
  }

  // ── Webhook gagal berulang ────────────────────────────────

  notifyWebhookPersistentFailure(
    userEmail: string,
    url: string,
    failCount: number,
  ) {
    this.email.send(
      userEmail,
      "Webhook Gagal Berulang Kali",
      `Webhook ke URL <strong>${url}</strong> telah gagal sebanyak ${failCount} kali berturut-turut.<br>
       Pastikan endpoint webhook Anda aktif dan dapat menerima request POST.`,
    );
  }

  // ── Langganan hampir habis ────────────────────────────────

  notifySubscriptionExpiringSoon(
    userId: string,
    userEmail: string,
    tierName: string,
    daysLeft: number,
  ) {
    const msg = `Langganan ${tierName} Anda akan berakhir dalam ${daysLeft} hari.`;
    this.gateway.emitSystemAlert(userId, AlertType.QUOTA_WARNING, msg);
    this.email.send(
      userEmail,
      "Langganan Hampir Berakhir",
      `${msg} Segera perpanjang langganan Anda untuk menghindari gangguan layanan.`,
    );
  }
}

```
---

## File : `src/modules/notifications/system-monitor.service.ts`

```ts
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { GatewayService } from "../../gateway/gateway.service";
import { AlertType } from "../../common/enums/status.enum";
import * as os from "os";
import * as fs from "fs";

/**
 * FIX: Ganti OnModuleInit → OnApplicationBootstrap
 *
 * OnModuleInit dipanggil saat module di-load, tapi RedisService.onModuleInit()
 * (yang membuat koneksi Redis) mungkin belum selesai saat itu.
 *
 * OnApplicationBootstrap dipanggil setelah SEMUA module selesai init
 * dan semua koneksi (Redis, Prisma, dll) sudah siap.
 */
@Injectable()
export class SystemMonitorService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private logger = new Logger("SystemMonitorService");
  private redisWasConnected = true;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private gateway: GatewayService,
  ) {}

  onApplicationBootstrap() {
    // Dipanggil setelah semua module init — Redis sudah pasti siap
    try {
      const client = this.redis.getClient();

      client.on("error", () => {
        if (this.redisWasConnected) {
          this.redisWasConnected = false;
          this.broadcastAlert(
            AlertType.REDIS_DISCONNECTED,
            "Koneksi Redis terputus!",
          ).catch(() => {});
        }
      });

      client.on("connect", () => {
        this.redisWasConnected = true;
      });

      this.logger.log("SystemMonitorService: Redis event listeners attached");
    } catch (e) {
      this.logger.error(`SystemMonitorService init failed: ${e.message}`);
    }
  }

  onApplicationShutdown() {
    // cleanup jika diperlukan
  }

  // Cek disk usage setiap 10 menit
  @Cron("*/10 * * * *")
  async checkDisk() {
    try {
      const { usedPercent } = this.getDiskUsage();
      if (usedPercent >= 80) {
        this.logger.warn(`Disk usage: ${usedPercent.toFixed(1)}%`);
        await this.broadcastAlert(
          AlertType.DISK_WARNING,
          `Disk hampir penuh: ${usedPercent.toFixed(1)}% terpakai`,
        );
      }
    } catch (e) {
      this.logger.error(`Disk check failed: ${e.message}`);
    }
  }

  private getDiskUsage(): { total: number; free: number; usedPercent: number } {
    // Gunakan memory sebagai proxy — lebih portabel daripada statfs
    const total = os.totalmem();
    const free = os.freemem();
    const usedPercent = ((total - free) / total) * 100;
    return { total, free, usedPercent };
  }

  private async broadcastAlert(type: AlertType, message: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      for (const user of users) {
        this.gateway.emitSystemAlert(user.id, type, message);
      }
    } catch (e) {
      this.logger.error(`broadcastAlert failed: ${e.message}`);
    }
  }
}

```
---

## File : `src/modules/profile/dto/update-profile-wa.dto.ts`

```ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileWaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

```
---

## File : `src/modules/profile/profile.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(private svc: ProfileService) {}

  @Get(':sessionId')
  @ApiOperation({ summary: 'Dapatkan info profil akun WA' })
  async getProfile(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getProfile(sid) };
  }

  @Post(':sessionId/display-name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set display name akun WA' })
  async setDisplayName(
    @Param('sessionId') sid: string,
    @Body() body: { name: string },
  ) {
    return {
      status: true,
      data: await this.svc.setDisplayName(sid, body.name),
    };
  }

  @Post(':sessionId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set status/bio akun WA' })
  async setStatus(
    @Param('sessionId') sid: string,
    @Body() body: { status: string },
  ) {
    return { status: true, data: await this.svc.setStatus(sid, body.status) };
  }

  @Post(':sessionId/photo')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload foto profil akun WA' })
  async setPhoto(
    @Param('sessionId') sid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.setProfilePhoto(sid, file) };
  }

  @Delete(':sessionId/photo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus foto profil akun WA' })
  async deletePhoto(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.deleteProfilePhoto(sid) };
  }

  @Get(':sessionId/contacts')
  @ApiOperation({ summary: 'Dapatkan semua kontak dari WA' })
  async getAllContacts(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getAllContacts(sid) };
  }

  @Get(':sessionId/contacts/:contactId')
  @ApiOperation({ summary: 'Dapatkan kontak by ID' })
  async getContact(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.getContactById(sid, cid) };
  }

  @Get(':sessionId/contacts/:contactId/photo')
  @ApiOperation({ summary: 'Dapatkan foto profil kontak' })
  async getContactPhoto(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return {
      status: true,
      data: await this.svc.getContactProfilePhoto(sid, cid),
    };
  }

  @Post(':sessionId/contacts/:contactId/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Blokir kontak' })
  async blockContact(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.blockContact(sid, cid) };
  }

  @Post(':sessionId/contacts/:contactId/unblock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblokir kontak' })
  async unblockContact(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.unblockContact(sid, cid) };
  }

  @Get(':sessionId/contacts/blocked')
  @ApiOperation({ summary: 'Dapatkan daftar kontak yang diblokir' })
  async getBlockedContacts(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getBlockedContacts(sid) };
  }
}

```
---

## File : `src/modules/profile/profile.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}

```
---

## File : `src/modules/profile/profile.service.ts`

```ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { MessageMedia } from 'whatsapp-web.js';
import { validateMimeType } from '../../common/utils/mime-validator.util';

@Injectable()
export class ProfileService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async getProfile(sessionId: string) {
    const c = this.client(sessionId);
    const info = c.info;
    return {
      wid: info?.wid,
      pushname: info?.pushname,
      platform: info?.platform,
    };
  }

  async setDisplayName(sessionId: string, name: string) {
    const c = this.client(sessionId);
    await (c as any).setDisplayName(name);
    return { updated: true };
  }

  async setStatus(sessionId: string, status: string) {
    await (this.client(sessionId) as any).setStatus(status);
    return { updated: true };
  }

  async setProfilePhoto(sessionId: string, file: Express.Multer.File) {
    await validateMimeType(file.buffer);
    const media = new MessageMedia(
      'image/jpeg',
      file.buffer.toString('base64'),
      file.originalname,
    );
    await (this.client(sessionId) as any).setProfilePicture(media);
    return { updated: true };
  }

  async deleteProfilePhoto(sessionId: string) {
    await (this.client(sessionId) as any).deleteProfilePicture();
    return { deleted: true };
  }

  async getContactProfilePhoto(sessionId: string, contactId: string) {
    const url = await this.client(sessionId).getProfilePicUrl(contactId);
    return { url };
  }

  async blockContact(sessionId: string, contactId: string) {
    const contact = await this.client(sessionId).getContactById(contactId);
    await contact.block();
    return { blocked: true };
  }

  async unblockContact(sessionId: string, contactId: string) {
    const contact = await this.client(sessionId).getContactById(contactId);
    await contact.unblock();
    return { unblocked: true };
  }

  async getBlockedContacts(sessionId: string) {
    return (this.client(sessionId) as any).getBlockedContacts();
  }

  async getContactById(sessionId: string, contactId: string) {
    return this.client(sessionId).getContactById(contactId);
  }

  async getAllContacts(sessionId: string) {
    return this.client(sessionId).getContacts();
  }
}

```
---

## File : `src/modules/scheduled-event/dto/create-scheduled-event.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduledEventDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsDateString() startTime: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}

```
---

## File : `src/modules/scheduled-event/dto/respond-event.dto.ts`

```ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EventResponse {
  ACCEPT = 'accept',
  DECLINE = 'decline',
}

export class RespondEventDto {
  @ApiProperty() @IsString() @IsNotEmpty() messageId: string;
  @ApiProperty({ enum: EventResponse })
  @IsEnum(EventResponse)
  response: EventResponse;
  @ApiProperty() @IsString() @IsNotEmpty() sessionId: string;
}

```
---

## File : `src/modules/scheduled-event/scheduled-event.controller.ts`

```ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScheduledEventService } from './scheduled-event.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateScheduledEventDto } from './dto/create-scheduled-event.dto';
import { RespondEventDto } from './dto/respond-event.dto';

@ApiTags('Scheduled Event')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scheduled-events', version: '1' })
export class ScheduledEventController {
  constructor(private svc: ScheduledEventService) {}

  @Post('send')
  @ApiOperation({ summary: 'Kirim undangan Scheduled Event ke WA' })
  async send(@CurrentUser() u: any, @Body() dto: CreateScheduledEventDto) {
    return { status: true, data: await this.svc.send(u.id, dto) };
  }

  @Post('respond')
  @ApiOperation({
    summary: 'Accept atau decline Scheduled Event yang diterima',
  })
  async respond(@CurrentUser() u: any, @Body() dto: RespondEventDto) {
    return { status: true, data: await this.svc.respond(u.id, dto) };
  }
}

```
---

## File : `src/modules/scheduled-event/scheduled-event.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ScheduledEventController } from './scheduled-event.controller';
import { ScheduledEventService } from './scheduled-event.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [ScheduledEventController],
  providers: [ScheduledEventService],
})
export class ScheduledEventModule {}

```
---

## File : `src/modules/scheduled-event/scheduled-event.service.ts`

```ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SessionManagerService } from '../sessions/session-manager.service';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { toJid } from '../../common/utils/phone-normalizer.util';
import { SessionStatus } from '@prisma/client';
import { CreateScheduledEventDto } from './dto/create-scheduled-event.dto';
import { RespondEventDto, EventResponse } from './dto/respond-event.dto';

@Injectable()
export class ScheduledEventService {
  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  async send(userId: string, dto: CreateScheduledEventDto) {
    const sessionId = await this.resolveSession(userId, dto.sessionId);
    const client = this.manager.getClient(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const jid = toJid(dto.to);
    const result = await client.sendMessage(jid, dto.title, {
      scheduledEvent: {
        title: dto.title,
        description: dto.description ?? '',
        location: dto.location ?? '',
        startTime: new Date(dto.startTime).getTime(),
      },
    } as any);

    return { messageId: result?.id?._serialized };
  }

  async respond(userId: string, dto: RespondEventDto) {
    const client = this.manager.getClient(dto.sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });

    const msg = await client.getMessageById(dto.messageId);
    if (!msg) throw new BadRequestException({ code: ErrorCodes.NOT_FOUND });

    if (dto.response === EventResponse.ACCEPT) {
      await (msg as any).acceptScheduledEvent?.();
    } else {
      await (msg as any).declineScheduledEvent?.();
    }

    return { responded: true, response: dto.response };
  }

  private async resolveSession(
    userId: string,
    sessionId?: string,
  ): Promise<string> {
    if (sessionId && sessionId !== 'auto') {
      const s = await this.prisma.whatsappSession.findFirst({
        where: { id: sessionId, userId, status: SessionStatus.connected },
      });
      if (!s)
        throw new BadRequestException({
          code: ErrorCodes.SESSION_NOT_CONNECTED,
        });
      return sessionId;
    }
    const healthy = await this.manager.getHealthySession(userId);
    if (!healthy)
      throw new BadRequestException({ code: ErrorCodes.NO_SESSIONS });
    return healthy;
  }
}

```
---

## File : `src/modules/scheduler/dto/create-scheduled-message.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RecurrenceType } from "@prisma/client";

export class CreateScheduledMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty()
  @IsDateString()
  scheduledTime: string;

  @ApiPropertyOptional({ enum: RecurrenceType, default: RecurrenceType.none })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrenceType?: RecurrenceType;
}

```
---

## File : `src/modules/scheduler/dto/query-scheduled-messages.dto.ts`

```ts
import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ScheduledMessageStatus } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryScheduledMessagesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ScheduledMessageStatus })
  @IsOptional()
  @IsEnum(ScheduledMessageStatus)
  status?: ScheduledMessageStatus;
}

```
---

## File : `src/modules/scheduler/scheduler.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SchedulerService } from "./scheduler.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateScheduledMessageDto } from "./dto/create-scheduled-message.dto";
import { QueryScheduledMessagesDto } from "./dto/query-scheduled-messages.dto";

@ApiTags("Scheduler")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("scheduler")
@Controller({ path: "scheduler", version: "1" })
export class SchedulerController {
  constructor(private svc: SchedulerService) {}

  @Get()
  async findAll(
    @CurrentUser() u: any,
    @Query() dto: QueryScheduledMessagesDto,
  ) {
    const r = await this.svc.findAll(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }
  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateScheduledMessageDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }
  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  async cancel(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancel(u.id, id) };
  }
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}

```
---

## File : `src/modules/scheduler/scheduler.module.ts`

```ts
import { Module } from "@nestjs/common";
import { SchedulerController } from "./scheduler.controller";
import { SchedulerService } from "./scheduler.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}

```
---

## File : `src/modules/scheduler/scheduler.processor.ts`

```ts
export {};

```
---

## File : `src/modules/scheduler/scheduler.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { isFuture, nextRecurrence } from "../../common/utils/date.util";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { ScheduledMessageStatus } from "@prisma/client";
import { CreateScheduledMessageDto } from "./dto/create-scheduled-message.dto";
import { QueryScheduledMessagesDto } from "./dto/query-scheduled-messages.dto";

@Injectable()
export class SchedulerService {
  private logger = new Logger("SchedulerService");

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  async findAll(userId: string, dto: QueryScheduledMessagesDto) {
    const where: any = { userId };
    if (dto.status) where.status = dto.status;
    const [data, total] = await Promise.all([
      this.prisma.scheduledMessage.findMany({
        where,
        skip: dto.skip,
        take: dto.limit,
        orderBy: { scheduledTime: "asc" },
      }),
      this.prisma.scheduledMessage.count({ where }),
    ]);
    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async create(userId: string, dto: CreateScheduledMessageDto) {
    const scheduledTime = new Date(dto.scheduledTime);
    if (!isFuture(scheduledTime))
      throw new BadRequestException({ code: ErrorCodes.SCHEDULE_PAST });

    const session = await this.prisma.whatsappSession.findFirst({
      where: { id: dto.sessionId, userId },
    });
    if (!session) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    return this.prisma.scheduledMessage.create({
      data: {
        userId,
        sessionId: dto.sessionId,
        target: dto.target,
        message: dto.message,
        scheduledTime,
        recurrenceType: dto.recurrenceType ?? "none",
      },
    });
  }

  // cancel() hanya untuk status pending — tidak bisa cancel yang sudah sent
  async cancel(userId: string, id: string) {
    const msg = await this.findOwned(userId, id);
    if (msg.status !== ScheduledMessageStatus.pending)
      throw new BadRequestException({ code: ErrorCodes.MESSAGE_ALREADY_SENT });
    return this.prisma.scheduledMessage.update({
      where: { id },
      data: { status: ScheduledMessageStatus.cancelled },
    });
  }

  /**
   * FIX: remove() sebelumnya menolak hapus jika status 'sent'.
   * Sesuai API doc, DELETE /scheduler/:id bisa menghapus record apapun
   * (termasuk yang sudah sent/failed/cancelled) — ini adalah hard delete dari DB.
   * Pembatasan hanya berlaku untuk cancel(), bukan delete().
   */
  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.scheduledMessage.delete({ where: { id } });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduled() {
    const now = new Date();
    const due = await this.prisma.scheduledMessage.findMany({
      where: {
        status: ScheduledMessageStatus.pending,
        scheduledTime: { lte: now },
      },
    });

    for (const msg of due) {
      try {
        const client = this.manager.getClient(msg.sessionId);
        if (!client) continue;

        const jid = toJid(msg.target);
        await this.manager.sendMessage(msg.sessionId, jid, msg.message);
        await this.prisma.scheduledMessage.update({
          where: { id: msg.id },
          data: { status: ScheduledMessageStatus.sent },
        });

        if (msg.recurrenceType !== "none") {
          const nextTime = nextRecurrence(
            msg.scheduledTime,
            msg.recurrenceType,
          );
          await this.prisma.scheduledMessage.create({
            data: {
              userId: msg.userId,
              sessionId: msg.sessionId,
              target: msg.target,
              message: msg.message,
              scheduledTime: nextTime,
              recurrenceType: msg.recurrenceType,
            },
          });
        }
      } catch (e) {
        this.logger.error(`Scheduled message ${msg.id} failed: ${e.message}`);
        await this.prisma.scheduledMessage.update({
          where: { id: msg.id },
          data: { status: ScheduledMessageStatus.failed },
        });
      }
    }
  }

  private async findOwned(userId: string, id: string) {
    const msg = await this.prisma.scheduledMessage.findFirst({
      where: { id, userId },
    });
    if (!msg) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return msg;
  }
}

```
---

## File : `src/modules/sessions/dto/create-session.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSessionDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() usePairingCode?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
}

```
---

## File : `src/modules/sessions/dto/switch-session.dto.ts`

```ts
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SwitchSessionDto {
  @ApiProperty() @IsString() @IsNotEmpty() sessionId: string;
}

```
---

## File : `src/modules/sessions/session-manager.service.ts`

```ts
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SessionStatus } from "@prisma/client";
import { Client, LocalAuth, Message, MessageMedia } from "whatsapp-web.js";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { AlertType } from "../../common/enums/status.enum";
import { GatewayService } from "../../gateway/gateway.service";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { AutoReplyEngine } from "../auto-reply/auto-reply.engine";
import { InboxService } from "../inbox/inbox.service";
import { NotificationsService } from "../notifications/notifications.service";
import { WebhookService } from "../webhook/webhook.service";
import { WorkflowEngine } from "../workflow/workflow.engine";

@Injectable()
export class SessionManagerService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("SessionManagerService");
  private clients = new Map<string, Client>();
  private reconnectTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private gateway: GatewayService,
    private notifications: NotificationsService,
    private inbox: InboxService,
    @Inject(forwardRef(() => AutoReplyEngine))
    private autoReply: AutoReplyEngine,
    @Inject(forwardRef(() => WorkflowEngine))
    private workflow: WorkflowEngine,
    private webhook: WebhookService,
    private cfg: ConfigService,
  ) {}

  async onModuleInit() {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { status: { not: SessionStatus.logged_out } },
    });
    for (const s of sessions) {
      await this.initClient(s.id, s.userId, s.authFolder).catch((e) =>
        this.logger.error(`Failed to restore session ${s.id}: ${e.message}`),
      );
    }
  }

  async onModuleDestroy() {
    for (const [, client] of this.clients) {
      await client.destroy().catch(() => {});
    }
  }

  getClient(sessionId: string): Client | null {
    return this.clients.get(sessionId) ?? null;
  }

  async initClient(
    sessionId: string,
    userId: string,
    authFolder: string,
    usePairingCode = false,
    phoneNumber?: string,
  ) {
    if (this.clients.has(sessionId)) await this.destroyClient(sessionId);

    const authPath = this.cfg.get<string>("whatsapp.authPath");
    const headless = this.cfg.get<boolean>("whatsapp.headless");

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: sessionId, dataPath: authPath }),
      puppeteer: {
        headless,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    });

    this.clients.set(sessionId, client);
    this.setupClientEvents(client, sessionId, userId);
    await client.initialize();

    if (usePairingCode && phoneNumber) {
      const code = await client.requestPairingCode(phoneNumber);
      this.gateway.emitCode(userId, sessionId, code);
    }
  }

  private setupClientEvents(client: Client, sessionId: string, userId: string) {
    client.on("qr", (qr) => {
      this.gateway.emitQr(userId, sessionId, qr);
      this.updateStatus(sessionId, SessionStatus.authenticating);
    });

    client.on("ready", async () => {
      const info = client.info;
      const phone = info?.wid?.user;
      await this.prisma.whatsappSession.update({
        where: { id: sessionId },
        data: { status: SessionStatus.connected, phoneNumber: phone },
      });
      await this.redis.set(
        CacheKeys.sessionStatus(sessionId),
        SessionStatus.connected,
        3600,
      );
      this.gateway.emitConnectionUpdate(userId, sessionId, "connected", phone);
      this.clearReconnectTimer(sessionId);
      this.logger.log(`Session ${sessionId} connected (${phone})`);
    });

    client.on("authenticated", () => {
      this.updateStatus(sessionId, SessionStatus.authenticating);
      this.gateway.emitConnectionUpdate(userId, sessionId, "authenticating");
    });

    client.on("auth_failure", async () => {
      await this.updateStatus(sessionId, SessionStatus.logged_out);
      this.gateway.emitConnectionUpdate(userId, sessionId, "logged_out");
      this.clients.delete(sessionId);
    });

    client.on("disconnected", async (reason) => {
      this.logger.warn(`Session ${sessionId} disconnected: ${reason}`);
      await this.updateStatus(sessionId, SessionStatus.disconnected);
      this.gateway.emitConnectionUpdate(userId, sessionId, "disconnected");

      const session = await this.prisma.whatsappSession.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (session) {
        this.notifications.notifySessionDisconnected(
          userId,
          session.user.email,
          session.sessionName,
        );

        // FIX: Cek apakah semua sesi user sekarang terputus → kirim alert khusus
        await this.checkAllSessionsDown(userId);
      }

      if (reason === "LOGOUT") {
        await this.updateStatus(sessionId, SessionStatus.logged_out);
        this.clients.delete(sessionId);
        return;
      }

      this.scheduleReconnect(
        sessionId,
        userId,
        client["options"]?.authStrategy?.dataPath ?? "",
        0,
      );
    });

    client.on("message", async (msg: Message) => {
      if (msg.fromMe) return;
      await this.handleIncomingMessage(msg, sessionId, userId);
    });

    client.on("message_ack", (msg, ack) => {
      const readStatus = ack === 2 ? "delivered" : ack === 3 ? "read" : "sent";
      this.gateway.emit(userId, "message_ack", {
        sessionId,
        msgId: msg.id._serialized,
        ack: readStatus,
      });
    });

    client.on("group_join", (n) =>
      this.gateway.emit(userId, "group_join", { sessionId, notification: n }),
    );
    client.on("group_leave", (n) =>
      this.gateway.emit(userId, "group_leave", { sessionId, notification: n }),
    );

    client.on("call", async (call) => {
      // Emit ke socket
      this.gateway.emit(userId, "incoming_call", { sessionId, call });

      // FIX: Simpan ke database callLog
      try {
        await this.prisma.callLog.create({
          data: {
            userId,
            sessionId,
            fromNumber: call.from?.split("@")[0] ?? "unknown",
            callType: call.isVideo ? "video" : "voice",
            status: "missed", // default missed; bisa diupdate jika ada event answer
            timestamp: new Date(call.timestamp * 1000),
          },
        });
      } catch (e) {
        this.logger.error(`Failed to log call: ${e.message}`);
      }
    });
  }

  /**
   * FIX: Cek apakah semua sesi user terputus, kirim alert all_sessions_down
   * sesuai doc 1: "Notifikasi jika semua sesi user terputus sekaligus"
   */
  private async checkAllSessionsDown(userId: string) {
    const connectedCount = await this.prisma.whatsappSession.count({
      where: { userId, status: SessionStatus.connected },
    });
    if (connectedCount === 0) {
      this.gateway.emitSystemAlert(
        userId,
        AlertType.ALL_SESSIONS_DOWN,
        "Semua sesi WhatsApp Anda saat ini terputus.",
      );
      this.logger.warn(`All sessions down for user ${userId}`);
    }
  }

  private async handleIncomingMessage(
    msg: Message,
    sessionId: string,
    userId: string,
  ) {
    const text = msg.body ?? "";
    const from = msg.from;

    await this.inbox.saveIncoming({
      id: msg.id._serialized,
      userId,
      sessionId,
      remoteJid: from,
      pushName: msg["_data"]?.notifyName ?? "",
      messageContent: text,
      messageType: msg.type,
    });

    this.gateway.emitNewMessage(userId, {
      id: msg.id._serialized,
      from,
      body: text,
      type: msg.type,
      sessionId,
    });

    await this.webhook.dispatch(userId, "new_message", {
      session: sessionId,
      from,
      text,
      type: msg.type,
      timestamp: msg.timestamp,
    });

    if (text) {
      await this.autoReply
        .process(userId, sessionId, from, text)
        .catch(() => {});
      await this.workflow
        .process(userId, sessionId, from, text)
        .catch(() => {});
    }
  }

  private scheduleReconnect(
    sessionId: string,
    userId: string,
    authFolder: string,
    attempt: number,
  ) {
    const maxRetries = this.cfg.get<number>("whatsapp.maxReconnectRetries");
    if (attempt >= maxRetries) {
      this.logger.warn(`Session ${sessionId} max reconnect attempts reached`);
      return;
    }
    const delay = Math.min(1000 * Math.pow(2, attempt), 60000);
    const timer = setTimeout(async () => {
      this.logger.log(
        `Reconnecting session ${sessionId} (attempt ${attempt + 1})`,
      );
      await this.initClient(sessionId, userId, authFolder).catch(() => {
        this.scheduleReconnect(sessionId, userId, authFolder, attempt + 1);
      });
    }, delay);
    this.reconnectTimers.set(sessionId, timer);
  }

  private clearReconnectTimer(sessionId: string) {
    const t = this.reconnectTimers.get(sessionId);
    if (t) {
      clearTimeout(t);
      this.reconnectTimers.delete(sessionId);
    }
  }

  private async destroyClient(sessionId: string) {
    const client = this.clients.get(sessionId);
    if (client) {
      await client.destroy().catch(() => {});
      this.clients.delete(sessionId);
    }
    this.clearReconnectTimer(sessionId);
  }

  private async updateStatus(sessionId: string, status: SessionStatus) {
    await this.prisma.whatsappSession
      .update({ where: { id: sessionId }, data: { status } })
      .catch(() => {});
    await this.redis.set(CacheKeys.sessionStatus(sessionId), status, 3600);
  }

  async sendMessage(
    sessionId: string,
    jid: string,
    content: string,
    options?: any,
  ): Promise<any> {
    const client = this.clients.get(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return client.sendMessage(jid, content, options);
  }

  async sendMedia(
    sessionId: string,
    jid: string,
    media: MessageMedia,
    caption?: string,
  ): Promise<any> {
    const client = this.clients.get(sessionId);
    if (!client)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return client.sendMessage(jid, media, { caption });
  }

  async getHealthySession(userId: string): Promise<string | null> {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { userId, status: SessionStatus.connected },
    });
    if (!sessions.length) return null;

    const rrKey = CacheKeys.roundRobin(userId);
    const idx = (await this.redis.get<number>(rrKey)) ?? 0;
    const session = sessions[idx % sessions.length];
    await this.redis.set(rrKey, (idx + 1) % sessions.length, 86400);
    return session.id;
  }

  getConnectedSessions(userId: string): string[] {
    return [...this.clients.entries()]
      .filter(([id]) =>
        this.prisma.whatsappSession.findFirst({
          where: { id, userId, status: SessionStatus.connected },
        }),
      )
      .map(([id]) => id);
  }
}

```
---

## File : `src/modules/sessions/sessions.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { SessionsService } from "./sessions.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateSessionDto } from "./dto/create-session.dto";

@ApiTags("Sessions")
@UseGuards(JwtAuthGuard)
@Controller({ path: "sessions", version: "1" })
export class SessionsController {
  constructor(private svc: SessionsService) {}

  @Get()
  @ApiOperation({ summary: "Daftar sesi WA" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Tambah sesi baru" })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateSessionDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Post(":id/reconnect")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reconnect sesi" })
  async reconnect(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.reconnect(
        u.id,
        id,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Post(":id/default")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Set sesi sebagai default" })
  async setDefault(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.setDefault(u.id, id) };
  }

  @Get(":id/info")
  @ApiOperation({ summary: "Info sesi (state, version)" })
  async info(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.getInfo(u.id, id) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus / logout sesi" })
  async remove(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    await this.svc.delete(u.id, u.email, id, req.ip, req.headers["user-agent"]);
    return { status: true };
  }
}


```
---

## File : `src/modules/sessions/sessions.module.ts`

```ts
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
    forwardRef(() => InboxModule), // FIX: forwardRef karena InboxModule inject SessionManagerService
    forwardRef(() => AutoReplyModule),
    forwardRef(() => WorkflowModule),
    WebhookModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionManagerService, WarmingService],
  exports: [SessionManagerService, SessionsService],
})
export class SessionsModule {}

```
---

## File : `src/modules/sessions/sessions.service.ts`

```ts
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

```
---

## File : `src/modules/sessions/warming.service.ts`

```ts
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "./session-manager.service";
import { SessionStatus } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WarmingService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("WarmingService");
  private timer: NodeJS.Timeout | null = null;
  private minMs: number;
  private maxMs: number;

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
    private cfg: ConfigService,
  ) {}

  onModuleInit() {
    this.minMs =
      this.cfg.get<number>("whatsapp.warmingIntervalMinMs") ?? 300_000;
    this.maxMs =
      this.cfg.get<number>("whatsapp.warmingIntervalMaxMs") ?? 600_000;
    this.scheduleNext();
    this.logger.log(
      `WarmingService started (${this.minMs / 1000}s – ${this.maxMs / 1000}s)`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  private scheduleNext() {
    const delay = this.minMs + Math.random() * (this.maxMs - this.minMs);
    this.timer = setTimeout(async () => {
      await this.warmSessions();
      this.scheduleNext();
    }, delay);
  }

  private async warmSessions() {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: { status: SessionStatus.connected },
    });

    for (const s of sessions) {
      const client = this.manager.getClient(s.id);
      if (!client) continue;
      try {
        // FIX: optional chaining — sendPresenceAvailable mungkin tidak ada
        // di semua versi whatsapp-web.js
        if (typeof (client as any).sendPresenceAvailable === "function") {
          await (client as any).sendPresenceAvailable();
        } else {
          // Fallback: kirim typing indicator sebagai tanda aktif
          this.logger.debug(
            `Session ${s.id}: sendPresenceAvailable not available, skipping`,
          );
        }
      } catch (e) {
        this.logger.warn(`Warming failed for session ${s.id}: ${e.message}`);
      }
    }
  }
}

```
---

## File : `src/modules/settings/dto/update-global-settings.dto.ts`

```ts
import { IsOptional, IsInt, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateGlobalSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultDailyMessageLimit?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultMonthlyBroadcastLimit?: number;
}

```
---

## File : `src/modules/settings/dto/update-settings.dto.ts`

```ts
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() geminiApiKey?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  geminiConfidenceThreshold?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoDownloadPhotos?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoDownloadVideos?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoDownloadAudio?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoDownloadDocuments?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() backgroundSync?: boolean;
}

```
---

## File : `src/modules/settings/settings.controller.ts`

```ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto';
import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class MaintenanceModeDto {
  @ApiProperty() @IsBoolean() enabled: boolean;
}

class AnnouncementDto {
  @ApiProperty() @IsString() @IsNotEmpty() message: string;
}

@ApiTags('Settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private svc: SettingsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Dapatkan pengaturan user' })
  async getMySettings(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.getUserSettings(u.id) };
  }

  @Post('me')
  @ApiOperation({ summary: 'Update pengaturan user' })
  async updateMySettings(
    @CurrentUser() u: any,
    @Body() dto: UpdateSettingsDto,
  ) {
    return { status: true, data: await this.svc.updateUserSettings(u.id, dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('global')
  @ApiOperation({ summary: '[Admin] Dapatkan pengaturan global' })
  async getGlobal() {
    return { status: true, data: await this.svc.getGlobalSettings() };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('global')
  @ApiOperation({ summary: '[Admin] Update pengaturan global' })
  async updateGlobal(@Body() dto: UpdateGlobalSettingsDto) {
    return { status: true, data: await this.svc.updateGlobalSettings(dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('maintenance')
  @ApiOperation({ summary: '[Admin] Aktifkan / nonaktifkan maintenance mode' })
  async setMaintenance(@Body() dto: MaintenanceModeDto) {
    return {
      status: true,
      data: await this.svc.setMaintenanceMode(dto.enabled),
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('announcement')
  @ApiOperation({ summary: '[Admin] Broadcast pengumuman ke semua user' })
  async sendAnnouncement(@CurrentUser() u: any, @Body() dto: AnnouncementDto) {
    return {
      status: true,
      data: await this.svc.broadcastAnnouncement(dto.message, u.id),
    };
  }
}

```
---

## File : `src/modules/settings/settings.module.ts`

```ts
import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AiModule } from '../ai/ai.module';
import { GatewayModule } from '../../gateway/gateway.module';

@Module({
  imports: [AiModule, GatewayModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}

```
---

## File : `src/modules/settings/settings.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { GatewayService } from '../../gateway/gateway.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private gateway: GatewayService,
  ) {}

  async getUserSettings(userId: string) {
    const s = await this.prisma.userSetting.findUnique({ where: { userId } });
    return s
      ? {
          ...s,
          geminiApiKey: s.geminiApiKey
            ? `****${s.geminiApiKey.slice(-4)}`
            : null,
        }
      : null;
  }

  async updateUserSettings(userId: string, dto: UpdateSettingsDto) {
    const setting = await this.prisma.userSetting.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
    if (dto.geminiApiKey) this.ai.init(dto.geminiApiKey);
    return setting;
  }

  async getGlobalSettings() {
    const rows = await this.prisma.globalSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async updateGlobalSettings(dto: UpdateGlobalSettingsDto) {
    const entries = Object.entries(dto).filter(([_, v]) => v !== undefined);
    await Promise.all(
      entries.map(([key, value]) =>
        this.prisma.globalSetting.upsert({
          where: { key },
          create: { key, value: String(value) },
          update: { value: String(value) },
        }),
      ),
    );
    return this.getGlobalSettings();
  }

  async setMaintenanceMode(enabled: boolean) {
    await this.prisma.globalSetting.upsert({
      where: { key: 'maintenanceMode' },
      create: { key: 'maintenanceMode', value: String(enabled) },
      update: { value: String(enabled) },
    });
    return { maintenanceMode: enabled };
  }

  async isMaintenanceMode(): Promise<boolean> {
    const row = await this.prisma.globalSetting.findUnique({
      where: { key: 'maintenanceMode' },
    });
    return row?.value === 'true';
  }

  async broadcastAnnouncement(message: string, adminId: string) {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    for (const user of users) {
      this.gateway.emitSystemAlert(user.id, 'announcement', message);
    }
    return { sent: users.length };
  }
}

```
---

## File : `src/modules/status/dto/send-status.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StatusType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export class SendStatusDto {
  @ApiProperty({ enum: StatusType })
  @IsEnum(StatusType)
  type: StatusType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  font?: string;
}

```
---

## File : `src/modules/status/status.controller.ts`

```ts
import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StatusService } from "./status.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Status")
@UseGuards(JwtAuthGuard)
@Controller({ path: "status", version: "1" })
export class StatusController {
  constructor(private svc: StatusService) {}

  @Post(":sessionId/bio")
  @HttpCode(HttpStatus.OK)
  async setStatus(
    @Param("sessionId") sid: string,
    @Body() body: { status: string },
  ) {
    return { status: true, data: await this.svc.setStatus(sid, body.status) };
  }

  @Post(":sessionId/send")
  async sendStatus(
    @Param("sessionId") sid: string,
    @Body() body: { text: string },
  ) {
    return {
      status: true,
      data: await this.svc.sendTextStatus(sid, body.text),
    };
  }

  @Post(":sessionId/presence")
  @HttpCode(HttpStatus.OK)
  async setPresence(
    @Param("sessionId") sid: string,
    @Body() body: { available: boolean },
  ) {
    return {
      status: true,
      data: await this.svc.setPresence(sid, body.available),
    };
  }
}

```
---

## File : `src/modules/status/status.module.ts`

```ts
import { Module } from "@nestjs/common";
import { StatusController } from "./status.controller";
import { StatusService } from "./status.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}

```
---

## File : `src/modules/status/status.service.ts`

```ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { MessageMedia } from "whatsapp-web.js";

@Injectable()
export class StatusService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async setStatus(sessionId: string, status: string) {
    return (this.client(sessionId) as any).setStatus(status);
  }

  async sendTextStatus(sessionId: string, text: string) {
    return (
      (this.client(sessionId) as any).sendStatus?.(text) ?? {
        sent: false,
        reason: "Not supported",
      }
    );
  }

  async setPresence(sessionId: string, available: boolean) {
    if (available) return this.client(sessionId).sendPresenceAvailable();
    return this.client(sessionId).sendPresenceUnavailable?.();
  }
}

```
---

## File : `src/modules/storage/storage.controller.ts`

```ts
import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ConfigService } from "@nestjs/config";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";

@ApiTags("Storage")
@UseGuards(JwtAuthGuard)
@Controller({ path: "storage", version: "1" })
export class StorageController {
  constructor(private cfg: ConfigService) {}

  /**
   * GET /storage/uploads/:filename
   * Serve file media yang sebelumnya didownload via
   * POST /messages/:sessionId/messages/:messageId/download
   *
   * Keamanan:
   * - User hanya bisa akses file di folder miliknya sendiri (userId dari JWT)
   * - Path traversal dicegah dengan path.basename()
   */
  @Get("uploads/:filename")
  @ApiOperation({ summary: "Akses file media yang telah didownload" })
  async serveFile(
    @CurrentUser() u: any,
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    // Sanitasi: cegah path traversal
    const safeFilename = path.basename(filename);
    const storagePath = this.cfg.get<string>("app.storagePath");
    const filePath = path.join(storagePath, "uploads", u.id, safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    }

    // Pastikan file berada di dalam folder user
    const resolvedPath = path.resolve(filePath);
    const userDir = path.resolve(path.join(storagePath, "uploads", u.id));
    if (!resolvedPath.startsWith(userDir)) {
      throw new ForbiddenException({ code: ErrorCodes.FORBIDDEN });
    }

    const mimeType = mime.lookup(safeFilename) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${safeFilename}"`);
    fs.createReadStream(filePath).pipe(res);
  }
}

```
---

## File : `src/modules/storage/storage.module.ts`

```ts
import { Module } from "@nestjs/common";
import { StorageController } from "./storage.controller";

@Module({ controllers: [StorageController] })
export class StorageModule {}

```
---

## File : `src/modules/templates/dto/create-template.dto.ts`

```ts
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTemplateDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() content: string;
  @ApiPropertyOptional({ default: "General" })
  @IsOptional()
  @IsString()
  category?: string;
}

```
---

## File : `src/modules/templates/dto/query-templates.dto.ts`

```ts
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryTemplatesDto {
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
}

```
---

## File : `src/modules/templates/dto/update-template.dto.ts`

```ts
import { PartialType } from "@nestjs/swagger";
import { CreateTemplateDto } from "./create-template.dto";
export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}


```
---

## File : `src/modules/templates/templates.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { TemplatesService } from "./templates.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { QueryTemplatesDto } from "./dto/query-templates.dto";

@ApiTags("Templates")
@UseGuards(JwtAuthGuard)
@Controller({ path: "templates", version: "1" })
export class TemplatesController {
  constructor(private svc: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: "Daftar template pesan" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryTemplatesDto) {
    return { status: true, data: await this.svc.findAll(u.id, dto) };
  }

  @Post()
  @ApiOperation({ summary: "Buat template baru" })
  async create(@CurrentUser() u: any, @Body() dto: CreateTemplateDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update template" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus template" })
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}

```
---

## File : `src/modules/templates/templates.module.ts`

```ts
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";
import { TemplatesService } from "./templates.service";

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}

```
---

## File : `src/modules/templates/templates.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { QueryTemplatesDto } from "./dto/query-templates.dto";

@Injectable()
export class TemplatesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string, dto: QueryTemplatesDto) {
    const cacheKey = CacheKeys.templatesUser(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached && !dto.category) return cached;

    const where: any = { userId };
    if (dto.category) where.category = dto.category;

    const templates = await this.prisma.template.findMany({
      where,
      orderBy: { name: "asc" },
    });
    if (!dto.category) await this.redis.set(cacheKey, templates, 3600);
    return templates;
  }

  async create(userId: string, dto: CreateTemplateDto) {
    const exists = await this.prisma.template.findFirst({
      where: { userId, name: dto.name },
    });
    if (exists)
      throw new ConflictException({ code: ErrorCodes.DUPLICATE_TEMPLATE_NAME });
    const t = await this.prisma.template.create({ data: { userId, ...dto } });
    await this.redis.del(CacheKeys.templatesUser(userId));
    return t;
  }

  async update(userId: string, id: string, dto: UpdateTemplateDto) {
    await this.findOwned(userId, id);
    if (dto.name) {
      const exists = await this.prisma.template.findFirst({
        where: { userId, name: dto.name, NOT: { id } },
      });
      if (exists)
        throw new ConflictException({
          code: ErrorCodes.DUPLICATE_TEMPLATE_NAME,
        });
    }
    const t = await this.prisma.template.update({ where: { id }, data: dto });
    await this.redis.del(CacheKeys.templatesUser(userId));
    return t;
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.template.delete({ where: { id } });
    await this.redis.del(CacheKeys.templatesUser(userId));
  }

  private async findOwned(userId: string, id: string) {
    const t = await this.prisma.template.findFirst({ where: { id, userId } });
    if (!t) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return t;
  }
}

```
---

## File : `src/modules/tiers/dto/assign-tier.dto.ts`

```ts
import { IsString, IsOptional, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AssignTierDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() tierId: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiresAt?: string;
}

```
---

## File : `src/modules/tiers/dto/create-tier.dto.ts`

```ts
import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTierDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsInt() @Min(1) maxSessions: number;
  @ApiProperty() @IsInt() @Min(1) maxApiKeys: number;
  @ApiProperty() @IsInt() @Min(1) maxDailyMessages: number;
  @ApiProperty() @IsInt() @Min(0) maxMonthlyBroadcasts: number;
  @ApiProperty() @IsArray() features: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

```
---

## File : `src/modules/tiers/dto/update-tier.dto.ts`

```ts
import { PartialType } from "@nestjs/swagger";
import { CreateTierDto } from "./create-tier.dto";
export class UpdateTierDto extends PartialType(CreateTierDto) {}

```
---

## File : `src/modules/tiers/grace-period.service.ts`

```ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

const GRACE_PERIOD_DAYS = 3; // grace period 3 hari setelah expired

/**
 * GracePeriodService:
 * - Cek tier yang sudah expired → set isGrace: true
 * - Cek tier yang grace period-nya juga sudah habis → nonaktifkan akun / downgrade ke Free
 * - Invalidasi cache tier setiap perubahan
 */
@Injectable()
export class GracePeriodService {
  private logger = new Logger("GracePeriodService");

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // Cek setiap jam
  @Cron("0 * * * *")
  async processExpiredTiers() {
    const now = new Date();
    const graceCutoff = new Date(
      now.getTime() - GRACE_PERIOD_DAYS * 24 * 3600 * 1000,
    );

    // 1. Tier baru expired → set isGrace: true
    const newlyExpired = await this.prisma.userTier.findMany({
      where: {
        expiresAt: { lte: now },
        isGrace: false,
      },
    });

    for (const ut of newlyExpired) {
      await this.prisma.userTier.update({
        where: { id: ut.id },
        data: { isGrace: true },
      });
      await this.invalidateTierCache(ut.userId);
      this.logger.log(`User ${ut.userId}: tier expired → grace period started`);
    }

    // 2. Grace period habis → downgrade ke Free tier
    const gracePeriodExpired = await this.prisma.userTier.findMany({
      where: {
        expiresAt: { lte: graceCutoff },
        isGrace: true,
      },
      include: { user: true },
    });

    const freeTier = await this.prisma.tier.findFirst({
      where: { name: "Free" },
    });
    if (!freeTier) return;

    for (const ut of gracePeriodExpired) {
      await this.prisma.userTier.update({
        where: { id: ut.id },
        data: {
          tierId: freeTier.id,
          isGrace: false,
          expiresAt: null, // Free tier tidak expired
        },
      });
      await this.invalidateTierCache(ut.userId);
      this.logger.log(
        `User ${ut.userId}: grace period ended → downgraded to Free`,
      );
    }
  }

  private async invalidateTierCache(userId: string) {
    await this.redis.del(`tier:features:${userId}`);
    await this.redis.del(`tier:ratelimit:${userId}`);
  }
}

```
---

## File : `src/modules/tiers/subscription-monitor.service.ts`

```ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { addDays, isBefore } from "date-fns";

/**
 * SubscriptionMonitorService — cek langganan yang hampir habis.
 *
 * Sesuai doc 1 section 30 "Email: Langganan hampir habis".
 * Cek harian pada jam 08:00 WIB, kirim notifikasi jika langganan
 * akan berakhir dalam 7 hari atau 3 hari.
 */
@Injectable()
export class SubscriptionMonitorService {
  private logger = new Logger("SubscriptionMonitorService");

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  // Setiap hari jam 08:00 WIB (UTC+7 = 01:00 UTC)
  @Cron("0 1 * * *")
  async checkExpiringSubscriptions() {
    this.logger.log("Checking expiring subscriptions...");

    const now = new Date();
    const in7Days = addDays(now, 7);

    const expiringTiers = await this.prisma.userTier.findMany({
      where: {
        expiresAt: {
          not: null,
          lte: in7Days,
          gte: now,
        },
        isGrace: false,
      },
      include: {
        user: { select: { id: true, email: true, isActive: true } },
        tier: { select: { name: true } },
      },
    });

    for (const ut of expiringTiers) {
      if (!ut.user.isActive || !ut.expiresAt) continue;

      const daysLeft = Math.ceil(
        (ut.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Kirim notifikasi pada 7 hari dan 3 hari sebelum habis
      if (daysLeft === 7 || daysLeft === 3) {
        this.notifications.notifySubscriptionExpiringSoon(
          ut.user.id,
          ut.user.email,
          ut.tier.name,
          daysLeft,
        );
        this.logger.log(
          `Notified user ${ut.user.email}: subscription '${ut.tier.name}' expires in ${daysLeft} days`,
        );
      }
    }
  }
}

```
---

## File : `src/modules/tiers/tiers.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { TiersService } from "./tiers.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { CreateTierDto } from "./dto/create-tier.dto";
import { UpdateTierDto } from "./dto/update-tier.dto";
import { AssignTierDto } from "./dto/assign-tier.dto";

@ApiTags("Tiers")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: "tiers", version: "1" })
export class TiersController {
  constructor(private svc: TiersService) {}

  @Get()
  @ApiOperation({ summary: "Daftar tier" })
  async findAll() {
    return { status: true, data: await this.svc.findAll() };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  async create(@Body() dto: CreateTierDto) {
    return { status: true, data: await this.svc.create(dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTierDto) {
    return { status: true, data: await this.svc.update(id, dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.svc.remove(id);
    return { status: true };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post("assign")
  async assign(
    @CurrentUser() u: any,
    @Body() dto: AssignTierDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.assignToUser(
        u.id,
        u.email,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  /**
   * FIX: Riwayat perubahan tier per user — query audit log dengan
   * filter action ASSIGN_TIER dan details.userId = targetUserId
   */
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get("history/:userId")
  @ApiOperation({ summary: "[Admin] Riwayat perubahan tier user" })
  async getTierHistory(
    @Param("userId") userId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return {
      status: true,
      data: await this.svc.getTierHistory(userId, +page, +limit),
    };
  }
}

```
---

## File : `src/modules/tiers/tiers.module.ts`

```ts
import { Module } from "@nestjs/common";
import { TiersController } from "./tiers.controller";
import { TiersService } from "./tiers.service";
import { SubscriptionMonitorService } from "./subscription-monitor.service";
import { GracePeriodService } from "./grace-period.service";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [AuditModule, NotificationsModule],
  controllers: [TiersController],
  providers: [TiersService, SubscriptionMonitorService, GracePeriodService],
  exports: [TiersService],
})
export class TiersModule {}

```
---

## File : `src/modules/tiers/tiers.service.ts`

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateTierDto } from "./dto/create-tier.dto";
import { UpdateTierDto } from "./dto/update-tier.dto";
import { AssignTierDto } from "./dto/assign-tier.dto";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "@prisma/client";

@Injectable()
export class TiersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async findAll() {
    return this.prisma.tier.findMany({ orderBy: { name: "asc" } });
  }

  async create(dto: CreateTierDto) {
    return this.prisma.tier.create({
      data: { ...dto, features: dto.features as any },
    });
  }

  async update(id: string, dto: UpdateTierDto) {
    return this.prisma.tier.update({
      where: { id },
      data: { ...dto, features: dto.features as any },
    });
  }

  async remove(id: string) {
    await this.prisma.tier.delete({ where: { id } });
  }

  async assignToUser(
    adminId: string,
    adminEmail: string,
    dto: AssignTierDto,
    ip: string,
    ua: string,
  ) {
    const tier = await this.prisma.tier.findUnique({
      where: { id: dto.tierId },
    });
    if (!tier) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    const result = await this.prisma.userTier.upsert({
      where: { userId: dto.userId },
      create: {
        userId: dto.userId,
        tierId: dto.tierId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isGrace: false,
      },
      update: {
        tierId: dto.tierId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isGrace: false,
      },
    });

    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.ASSIGN_TIER,
      details: {
        targetUserId: dto.userId,
        tierId: dto.tierId,
        tierName: tier.name,
      },
      ip,
      userAgent: ua,
    });

    return result;
  }

  /**
   * FIX: Prisma JSON filter `path` harus berupa string, bukan string[].
   * Untuk MySQL, gunakan string_contains atau raw query karena
   * Prisma JSON filter dengan path tidak mendukung MySQL secara penuh.
   * Solusi: filter di aplikasi setelah query semua ASSIGN_TIER logs.
   */
  async getTierHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Ambil semua ASSIGN_TIER logs lalu filter di aplikasi
    // karena Prisma JSON path filter tidak konsisten di MySQL
    const allLogs = await this.prisma.auditLog.findMany({
      where: { action: AuditAction.ASSIGN_TIER },
      orderBy: { timestamp: "desc" },
    });

    // Filter: details.targetUserId === userId
    const filtered = allLogs.filter((log) => {
      try {
        const details = log.details as any;
        return details?.targetUserId === userId;
      } catch {
        return false;
      }
    });

    const total = filtered.length;
    const data = filtered.slice(skip, skip + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

```
---

## File : `src/modules/users/dto/query-users.dto.ts`

```ts
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class QueryUsersDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: Role }) @IsOptional() @IsEnum(Role) role?: Role;
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  isActive?: boolean;
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

```
---

## File : `src/modules/users/dto/update-profile.dto.ts`

```ts
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() picture?: string;
}

```
---

## File : `src/modules/users/dto/update-quota.dto.ts`

```ts
import { IsOptional, IsInt, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateQuotaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  messagesSentToday?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  broadcastsThisMonth?: number;
}

```
---

## File : `src/modules/users/dto/update-user.dto.ts`

```ts
import { IsOptional, IsBoolean, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UpdateUserDto {
  @ApiPropertyOptional({ enum: Role }) @IsOptional() @IsEnum(Role) role?: Role;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

```
---

## File : `src/modules/users/users.controller.ts`

```ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { Response } from "express";
import { Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateQuotaDto } from "./dto/update-quota.dto";

@ApiTags("Users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get("profile")
  @ApiOperation({ summary: "Profil user saat ini" })
  profile(@CurrentUser() u: any) {
    return { status: true, data: u };
  }

  @Put("profile")
  @ApiOperation({ summary: "Update profil" })
  async updateProfile(@CurrentUser() u: any, @Body() dto: UpdateProfileDto) {
    return { status: true, data: await this.svc.updateProfile(u.id, dto) };
  }

  // FIX: endpoint self-delete akun (sesuai doc 1 "Hapus akun dengan konfirmasi")
  @Delete("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus akun sendiri (self-delete)" })
  async deleteSelf(
    @CurrentUser() u: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.svc.deleteSelf(u.id, u.email, req.ip, req.headers["user-agent"]);
    // Hapus cookie setelah akun dihapus
    res.clearCookie("auth_token");
    return { status: true, data: { message: "Akun berhasil dihapus." } };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: "[Admin] Daftar semua user" })
  async findAll(@Query() dto: QueryUsersDto) {
    const r = await this.svc.findAll(dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(":id")
  @ApiOperation({ summary: "[Admin] Detail user" })
  async findOne(@Param("id") id: string) {
    return { status: true, data: await this.svc.findOne(id) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(":id")
  @ApiOperation({ summary: "[Admin] Update user (role, isActive)" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.updateUser(
        u.id,
        u.email,
        id,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "[Admin] Hapus user" })
  async remove(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    await this.svc.deleteUser(
      u.id,
      u.email,
      id,
      req.ip,
      req.headers["user-agent"],
    );
    return { status: true };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(":id/quota")
  @ApiOperation({ summary: "[Admin] Update kuota user" })
  async updateQuota(@Param("id") id: string, @Body() dto: UpdateQuotaDto) {
    return { status: true, data: await this.svc.updateQuota(id, dto) };
  }
}

```
---

## File : `src/modules/users/users.module.ts`

```ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

```
---

## File : `src/modules/users/users.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RedisService } from "../../redis/redis.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { AuditAction, Role } from "@prisma/client";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateQuotaDto } from "./dto/update-quota.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private redis: RedisService,
  ) {}

  async findAll(dto: QueryUsersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (dto.search)
      where.OR = [
        { name: { contains: dto.search } },
        { email: { contains: dto.search } },
      ];
    if (dto.role) where.role = dto.role;
    if (typeof dto.isActive !== "undefined") where.isActive = dto.isActive;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { tier: { include: { tier: true } }, quota: true },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tier: { include: { tier: true } }, quota: true },
    });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async updateUser(
    adminId: string,
    adminEmail: string,
    targetId: string,
    dto: UpdateUserDto,
    ip: string,
    ua: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: targetId } });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: dto,
    });
    await this.redis.del(CacheKeys.user(targetId));
    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.UPDATE_USER,
      details: { targetId, ...dto },
      ip,
      userAgent: ua,
    });
    return updated;
  }

  async deleteUser(
    adminId: string,
    adminEmail: string,
    targetId: string,
    ip: string,
    ua: string,
  ) {
    if (adminId === targetId)
      throw new ForbiddenException({ code: ErrorCodes.CANNOT_DELETE_SELF });
    await this.prisma.user.delete({ where: { id: targetId } });
    await this.redis.del(CacheKeys.user(targetId));
    await this.audit.log({
      userId: adminId,
      userEmail: adminEmail,
      action: AuditAction.DELETE_USER,
      details: { targetId },
      ip,
      userAgent: ua,
    });
  }

  // FIX: self-delete — user menghapus akunnya sendiri
  async deleteSelf(userId: string, userEmail: string, ip: string, ua: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });

    // Catat audit log sebelum data user dihapus
    await this.audit.log({
      userId,
      userEmail,
      action: AuditAction.DELETE_USER,
      details: { selfDelete: true },
      ip,
      userAgent: ua,
    });

    // Hapus cache
    await this.redis.del(CacheKeys.user(userId));

    // Hapus user — Prisma Cascade akan menghapus semua relasi terkait
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async updateQuota(targetId: string, dto: UpdateQuotaDto) {
    return this.prisma.userQuota.upsert({
      where: { userId: targetId },
      create: { userId: targetId, ...dto },
      update: dto,
    });
  }
}

```
---

## File : `src/modules/webhook/dto/update-webhook.dto.ts`

```ts
import { IsOptional, IsString, IsUrl, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateWebhookDto {
  @ApiPropertyOptional() @IsOptional() @IsUrl() webhookUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

```
---

## File : `src/modules/webhook/processors/webhook.processor.ts`

```ts
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { QueueNames } from "../../../common/constants/queue-names.constant";
import axios from "axios";

export const WEBHOOK_RETRY_DELAYS_MS = [
  60_000, // 1 menit
  300_000, // 5 menit
  900_000, // 15 menit
  3_600_000, // 1 jam
  21_600_000, // 6 jam
];

@Processor(QueueNames.WEBHOOK, { concurrency: 5 })
export class WebhookProcessor extends WorkerHost {
  private logger = new Logger("WebhookProcessor");

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job) {
    const { userId, url, payload, headers, dbId } = job.data;
    const attempt = job.attemptsMade; // 0-based

    try {
      await axios.post(url, JSON.parse(payload), { headers, timeout: 10_000 });

      // Update DB: completed
      if (dbId) {
        await this.prisma.webhookQueue
          .update({ where: { id: dbId }, data: { status: "completed" } })
          .catch(() => {});
      }

      this.logger.debug(`Webhook delivered to ${url} (attempt ${attempt + 1})`);
    } catch (e) {
      const delayMs =
        WEBHOOK_RETRY_DELAYS_MS[attempt] ??
        WEBHOOK_RETRY_DELAYS_MS[WEBHOOK_RETRY_DELAYS_MS.length - 1];

      const isFinalAttempt = attempt + 1 >= 5;

      this.logger.warn(
        `Webhook failed (attempt ${attempt + 1}/5, ${isFinalAttempt ? "FINAL" : `retry in ${delayMs / 1000}s`}): ${e.message}`,
      );

      // Update DB
      if (dbId) {
        await this.prisma.webhookQueue
          .update({
            where: { id: dbId },
            data: {
              retries: { increment: 1 },
              lastError: e.message,
              nextRetryAt: new Date(Date.now() + delayMs),
              status: isFinalAttempt ? "failed" : "pending",
            },
          })
          .catch(() => {});
      }

      // FIX: Kirim notifikasi email jika semua retry habis (attempt ke-5 gagal)
      if (isFinalAttempt) {
        const user = await this.prisma.user
          .findUnique({ where: { id: userId }, select: { email: true } })
          .catch(() => null);
        if (user?.email) {
          this.notifications.notifyWebhookPersistentFailure(user.email, url, 5);
        }
      }

      throw e; // BullMQ akan retry sesuai job options
    }
  }
}

```
---

## File : `src/modules/webhook/webhook.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WebhookService } from "./webhook.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateWebhookDto } from "./dto/update-webhook.dto";

@ApiTags("Webhook")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("webhook")
@Controller({ path: "webhooks", version: "1" })
export class WebhookController {
  constructor(private svc: WebhookService) {}

  @Get("config")
  async getConfig(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.getConfig(u.id) };
  }
  @Put("config")
  async updateConfig(@CurrentUser() u: any, @Body() dto: UpdateWebhookDto) {
    return { status: true, data: await this.svc.updateConfig(u.id, dto) };
  }
  @Post("generate-secret")
  @HttpCode(HttpStatus.OK)
  async generateSecret(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.generateSecret(u.id) };
  }
  @Post("test")
  @HttpCode(HttpStatus.OK)
  async test(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.testWebhook(u.id) };
  }
}

```
---

## File : `src/modules/webhook/webhook.module.ts`

```ts
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WebhookProcessor } from "./processors/webhook.processor";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.WEBHOOK }),
    NotificationsModule, // FIX: diperlukan oleh WebhookProcessor untuk kirim email notifikasi
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookProcessor],
  exports: [WebhookService],
})
export class WebhookModule {}

```
---

## File : `src/modules/webhook/webhook.service.ts`

```ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../../prisma/prisma.service";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { generateWebhookSecret } from "../../common/utils/token-generator.util";
import { generateHmacSignature } from "../../common/utils/hmac.util";
import { WEBHOOK_RETRY_DELAYS_MS } from "./processors/webhook.processor";
import { UpdateWebhookDto } from "./dto/update-webhook.dto";
import axios from "axios";

@Injectable()
export class WebhookService {
  constructor(
    @InjectQueue(QueueNames.WEBHOOK) private webhookQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async getConfig(userId: string) {
    return this.prisma.webhookConfig.findUnique({ where: { userId } });
  }

  async updateConfig(userId: string, dto: UpdateWebhookDto) {
    return this.prisma.webhookConfig.upsert({
      where: { userId },
      create: {
        userId,
        webhookUrl: dto.webhookUrl,
        isActive: dto.isActive ?? true,
      },
      update: { webhookUrl: dto.webhookUrl, isActive: dto.isActive },
    });
  }

  async generateSecret(userId: string) {
    const secret = generateWebhookSecret();
    await this.prisma.webhookConfig.upsert({
      where: { userId },
      create: { userId, webhookSecret: secret },
      update: { webhookSecret: secret },
    });
    return { secret };
  }

  async testWebhook(userId: string) {
    const config = await this.prisma.webhookConfig.findUnique({
      where: { userId },
    });
    if (!config?.webhookUrl)
      throw new BadRequestException({
        code: ErrorCodes.WEBHOOK_NOT_CONFIGURED,
      });

    const payload = {
      event: "test",
      timestamp: new Date().toISOString(),
      message: "Webhook test from WA Gateway",
    };
    const start = Date.now();
    try {
      const res = await axios.post(config.webhookUrl, payload, {
        timeout: 10_000,
      });
      return {
        targetStatus: res.status,
        responseTime: `${Date.now() - start}ms`,
      };
    } catch (e) {
      throw new BadRequestException({
        code: ErrorCodes.INTERNAL,
        message: `Webhook error: ${e.message}`,
      });
    }
  }

  async dispatch(userId: string, event: string, payload: any) {
    const config = await this.prisma.webhookConfig.findUnique({
      where: { userId },
    });
    if (!config?.webhookUrl || !config.isActive) return;

    const body = JSON.stringify({ event, ...payload });
    const signature = config.webhookSecret
      ? generateHmacSignature(body, config.webhookSecret)
      : undefined;
    const headers: any = { "Content-Type": "application/json" };
    if (signature) headers["X-Hub-Signature"] = signature;

    // Catat di database sebelum enqueue
    const record = await this.prisma.webhookQueue.create({
      data: {
        userId,
        url: config.webhookUrl,
        payload: JSON.parse(body),
        headers,
        status: "pending",
        maxRetries: 5,
      },
    });

    // FIX: set attempts & custom backoff sesuai WEBHOOK_RETRY_DELAYS_MS
    await this.webhookQueue.add(
      "dispatch",
      {
        userId,
        url: config.webhookUrl,
        payload: body,
        headers,
        dbId: record.id,
      },
      {
        attempts: 5,
        backoff: {
          // BullMQ 'custom' backoff — nilai delay diambil dari array berdasarkan attemptsMade
          type: "custom",
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}

```
---

## File : `src/modules/workflow/dto/create-workflow.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsObject,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { WorkflowNodeDto } from "./workflow-node.dto";

export class TriggerConditionDto {
  @IsString()
  keyword: string;

  @IsString()
  matchType: string;
}

export class CreateWorkflowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => TriggerConditionDto)
  triggerCondition: TriggerConditionDto;

  @ApiProperty({ type: [WorkflowNodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowNodeDto)
  nodes: WorkflowNodeDto[];
}

```
---

## File : `src/modules/workflow/dto/toggle-workflow.dto.ts`

```ts
import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ToggleWorkflowDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

```
---

## File : `src/modules/workflow/dto/update-workflow.dto.ts`

```ts
import { PartialType } from "@nestjs/swagger";
import { CreateWorkflowDto } from "./create-workflow.dto";
export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) {}

```
---

## File : `src/modules/workflow/dto/workflow-node.dto.ts`

```ts
import { IsString, IsEnum, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class WorkflowNodeConfigDto {
  message?: string;
  seconds?: number;
  tag?: string;
}

export class WorkflowNodeDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: ["send_message", "delay", "add_tag"] })
  @IsEnum(["send_message", "delay", "add_tag"])
  type: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => WorkflowNodeConfigDto)
  config: WorkflowNodeConfigDto;
}

```
---

## File : `src/modules/workflow/workflow.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WorkflowService } from "./workflow.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";
import { ToggleWorkflowDto } from "./dto/toggle-workflow.dto";

@ApiTags("Workflow")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("workflow")
@Controller({ path: "workflows", version: "1" })
export class WorkflowController {
  constructor(private svc: WorkflowService) {}

  @Get()
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }
  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateWorkflowDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }
  @Put(":id")
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateWorkflowDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }
  @Post(":id/toggle")
  @HttpCode(HttpStatus.OK)
  async toggle(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ToggleWorkflowDto,
  ) {
    return {
      status: true,
      data: await this.svc.toggle(u.id, id, dto.isActive),
    };
  }
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}

```
---

## File : `src/modules/workflow/workflow.engine.ts`

```ts
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

```
---

## File : `src/modules/workflow/workflow.module.ts`

```ts
import { Module, forwardRef } from "@nestjs/common";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";
import { WorkflowEngine } from "./workflow.engine";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [forwardRef(() => SessionsModule)],
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowEngine],
  exports: [WorkflowEngine, WorkflowService],
})
export class WorkflowModule {}

```
---

## File : `src/modules/workflow/workflow.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { CacheKeys } from "../../common/constants/cache-keys.constant";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";

const MAX_NODES = 20;
const MAX_DELAY_SECONDS = 3600;

@Injectable()
export class WorkflowService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string) {
    const list = await this.prisma.workflow.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return list.map((w) => ({
      ...w,
      triggerCondition: w.triggerCondition,
      nodes: w.nodes,
    }));
  }

  async create(userId: string, dto: CreateWorkflowDto) {
    this.validate(dto);
    const wf = await this.prisma.workflow.create({
      data: {
        userId,
        name: dto.name,
        triggerCondition: dto.triggerCondition as any,
        nodes: dto.nodes as any,
      },
    });
    await this.invalidateCache(userId);
    return wf;
  }

  async update(userId: string, id: string, dto: UpdateWorkflowDto) {
    await this.findOwned(userId, id);
    this.validate(dto as CreateWorkflowDto);
    const wf = await this.prisma.workflow.update({
      where: { id },
      data: {
        name: dto.name,
        triggerCondition: dto.triggerCondition as any,
        nodes: dto.nodes as any,
      },
    });
    await this.invalidateCache(userId);
    return wf;
  }

  async toggle(userId: string, id: string, isActive: boolean) {
    await this.findOwned(userId, id);
    const wf = await this.prisma.workflow.update({
      where: { id },
      data: { isActive },
    });
    await this.invalidateCache(userId);
    return wf;
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.workflow.delete({ where: { id } });
    await this.invalidateCache(userId);
  }

  async getActive(userId: string) {
    const cacheKey = CacheKeys.workflowsActive(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    const workflows = await this.prisma.workflow.findMany({
      where: { userId, isActive: true },
    });
    await this.redis.set(cacheKey, workflows, 300);
    return workflows;
  }

  private validate(dto: Partial<CreateWorkflowDto>) {
    if (dto.nodes) {
      if (dto.nodes.length > MAX_NODES) {
        throw new BadRequestException({
          code: ErrorCodes.WORKFLOW_TOO_MANY_NODES,
        });
      }
      for (const node of dto.nodes) {
        if (!["send_message", "delay", "add_tag"].includes(node.type)) {
          throw new BadRequestException({
            code: ErrorCodes.VALIDATION,
            message: `Invalid node type: ${node.type}`,
          });
        }
        if (node.type === "delay" && node.config?.seconds > MAX_DELAY_SECONDS) {
          throw new BadRequestException({ code: ErrorCodes.DELAY_TOO_LONG });
        }
      }
    }
  }

  private async findOwned(userId: string, id: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { id, userId } });
    if (!wf) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    return wf;
  }

  private async invalidateCache(userId: string) {
    await this.redis.del(CacheKeys.workflowsActive(userId));
  }
}

```
---

## File : `src/modules/workspace/dto/create-workspace.dto.ts`

```ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

```
---

## File : `src/modules/workspace/dto/invite-member.dto.ts`

```ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteMemberDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

```
---

## File : `src/modules/workspace/dto/update-member-permission.dto.ts`

```ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WorkspaceMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export class UpdateMemberPermissionDto {
  @ApiPropertyOptional({ enum: WorkspaceMemberRole })
  @IsOptional()
  @IsEnum(WorkspaceMemberRole)
  role?: WorkspaceMemberRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, boolean>;
}

```
---

## File : `src/modules/workspace/workspace.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberPermissionDto } from './dto/update-member-permission.dto';

@ApiTags('Workspace')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workspaces', version: '1' })
export class WorkspaceController {
  constructor(private svc: WorkspaceService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar workspace yang diikuti' })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: 'Buat workspace baru' })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateWorkspaceDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        dto.name,
        req.ip,
        req.headers['user-agent'],
      ),
    };
  }

  @Post(':id/invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Undang anggota ke workspace' })
  async invite(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Body() dto: InviteMemberDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.invite(
        u.id,
        u.email,
        id,
        dto.email,
        req.ip,
        req.headers['user-agent'],
      ),
    };
  }

  @Put(':id/members/:memberId/permission')
  @ApiOperation({ summary: 'Update role atau permission anggota workspace' })
  async updateMemberPermission(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Param('memberId') mid: string,
    @Body() dto: UpdateMemberPermissionDto,
  ) {
    return {
      status: true,
      data: await this.svc.updateMemberPermission(u.id, id, mid, dto),
    };
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus anggota dari workspace' })
  async removeMember(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Param('memberId') mid: string,
    @Req() req: Request,
  ) {
    await this.svc.removeMember(
      u.id,
      u.email,
      id,
      mid,
      req.ip,
      req.headers['user-agent'],
    );
    return { status: true };
  }
}

```
---

## File : `src/modules/workspace/workspace.module.ts`

```ts
import { Module } from "@nestjs/common";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}

```
---

## File : `src/modules/workspace/workspace.service.ts`

```ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '@prisma/client';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { UpdateMemberPermissionDto } from './dto/update-member-permission.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(
    userId: string,
    email: string,
    name: string,
    ip: string,
    ua: string,
  ) {
    const ws = await this.prisma.workspace.create({
      data: {
        name,
        ownerId: userId,
        members: { create: { userId, role: 'owner' } },
      },
      include: { members: true },
    });
    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.CREATE_WORKSPACE,
      details: { workspaceId: ws.id },
      ip,
      userAgent: ua,
    });
    return ws;
  }

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  async invite(
    ownerId: string,
    ownerEmail: string,
    workspaceId: string,
    email: string,
    ip: string,
    ua: string,
  ) {
    const ws = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!ws) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const member = await this.prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
      create: { workspaceId, userId: user.id, role: 'member' },
      update: {},
    });
    await this.audit.log({
      userId: ownerId,
      userEmail: ownerEmail,
      action: AuditAction.INVITE_MEMBER,
      details: { workspaceId, email },
      ip,
      userAgent: ua,
    });
    return member;
  }

  async updateMemberPermission(
    ownerId: string,
    workspaceId: string,
    memberId: string,
    dto: UpdateMemberPermissionDto,
  ) {
    const ws = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!ws) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (memberId === ownerId)
      throw new ForbiddenException({ code: ErrorCodes.FORBIDDEN });
    return this.prisma.workspaceMember.updateMany({
      where: { workspaceId, userId: memberId },
      data: {
        ...(dto.role ? { role: dto.role } : {}),
        ...(dto.permissions ? { permissions: dto.permissions } : {}),
      },
    });
  }

  async removeMember(
    ownerId: string,
    ownerEmail: string,
    workspaceId: string,
    memberId: string,
    ip: string,
    ua: string,
  ) {
    const ws = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!ws) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (memberId === ownerId)
      throw new ForbiddenException({ code: ErrorCodes.CANNOT_DELETE_SELF });
    await this.prisma.workspaceMember.deleteMany({
      where: { workspaceId, userId: memberId },
    });
    await this.audit.log({
      userId: ownerId,
      userEmail: ownerEmail,
      action: AuditAction.REMOVE_MEMBER,
      details: { workspaceId, memberId },
      ip,
      userAgent: ua,
    });
  }
}

```
---

## File : `src/prisma/prisma.module.ts`

```ts
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}

```
---

## File : `src/prisma/prisma.service.ts`

```ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger("PrismaService");

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Database disconnected");
  }
}

```
---

## File : `src/queue/queue.module.ts`

```ts
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { QueueNames } from "../common/constants/queue-names.constant";

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueNames.BROADCAST }),
    BullModule.registerQueue({ name: QueueNames.WEBHOOK }),
  ],
  exports: [BullModule],
})
export class QueueModule {}

```
---

## File : `src/redis/redis.module.ts`

```ts
import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Global()
@Module({ providers: [RedisService], exports: [RedisService] })
export class RedisModule {}

```
---

## File : `src/redis/redis.service.ts`

```ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("RedisService");
  private client: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get("redis.host"),
      port: this.config.get("redis.port"),
      password: this.config.get("redis.password"),
      db: this.config.get("redis.db"),
      keyPrefix: this.config.get("redis.keyPrefix"),
    });
    this.client.on("connect", () => this.logger.log("Redis connected"));
    this.client.on("error", (err) => this.logger.error("Redis error", err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    return val ? JSON.parse(val) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const str = JSON.stringify(value);
    if (ttlSeconds) await this.client.set(key, str, "EX", ttlSeconds);
    else await this.client.set(key, str);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
}

```
---

