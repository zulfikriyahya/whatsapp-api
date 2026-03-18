-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `picture` TEXT NULL,
    `role` ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `twoFaSecret` VARCHAR(191) NULL,
    `twoFaEnabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tiers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `maxSessions` INTEGER NOT NULL DEFAULT 1,
    `maxApiKeys` INTEGER NOT NULL DEFAULT 1,
    `maxDailyMessages` INTEGER NOT NULL DEFAULT 100,
    `maxMonthlyBroadcasts` INTEGER NOT NULL DEFAULT 5,
    `maxBroadcastRecipients` INTEGER NOT NULL DEFAULT 1000,
    `maxWorkflows` INTEGER NOT NULL DEFAULT 3,
    `maxDripCampaigns` INTEGER NOT NULL DEFAULT 3,
    `maxTemplates` INTEGER NOT NULL DEFAULT 10,
    `maxContacts` INTEGER NOT NULL DEFAULT 500,
    `rateLimitPerMinute` INTEGER NOT NULL DEFAULT 30,
    `features` JSON NOT NULL,
    `price` DECIMAL(10, 2) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tiers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_tiers` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tierId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `isGrace` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_tiers_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quotas` (
    `userId` VARCHAR(191) NOT NULL,
    `messagesSentToday` INTEGER NOT NULL DEFAULT 0,
    `broadcastsThisMonth` INTEGER NOT NULL DEFAULT 0,
    `lastDailyResetAt` DATETIME(3) NULL,
    `lastMonthlyResetAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `status` ENUM('disconnected', 'authenticating', 'connected', 'logged_out') NOT NULL DEFAULT 'disconnected',
    `authFolder` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `whatsapp_sessions_userId_idx`(`userId`),
    INDEX `whatsapp_sessions_status_idx`(`status`),
    UNIQUE INDEX `whatsapp_sessions_userId_sessionName_key`(`userId`, `sessionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_keys` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `keyHash` VARCHAR(191) NOT NULL,
    `keyPreview` VARCHAR(8) NOT NULL,
    `ipWhitelist` TEXT NULL,
    `lastUsedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `api_keys_keyHash_key`(`keyHash`),
    INDEX `api_keys_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `campaignId` VARCHAR(191) NULL,
    `target` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `messageType` ENUM('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'vcard', 'poll') NOT NULL DEFAULT 'text',
    `status` ENUM('success', 'failed', 'pending') NOT NULL,
    `readStatus` ENUM('sent', 'delivered', 'read') NOT NULL DEFAULT 'sent',
    `errorMessage` TEXT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `message_logs_userId_idx`(`userId`),
    INDEX `message_logs_timestamp_idx`(`timestamp`),
    INDEX `message_logs_campaignId_idx`(`campaignId`),
    INDEX `message_logs_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inbox` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `remoteJid` VARCHAR(191) NOT NULL,
    `pushName` VARCHAR(191) NULL,
    `messageContent` TEXT NULL,
    `messageType` ENUM('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'vcard', 'poll') NOT NULL DEFAULT 'text',
    `mediaUrl` TEXT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inbox_userId_idx`(`userId`),
    INDEX `inbox_userId_remoteJid_idx`(`userId`, `remoteJid`),
    INDEX `inbox_isRead_idx`(`isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `mediaPath` VARCHAR(191) NULL,
    `totalRecipients` INTEGER NOT NULL DEFAULT 0,
    `processedCount` INTEGER NOT NULL DEFAULT 0,
    `successCount` INTEGER NOT NULL DEFAULT 0,
    `failedCount` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `campaigns_userId_idx`(`userId`),
    INDEX `campaigns_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `contacts_userId_idx`(`userId`),
    INDEX `contacts_userId_tag_idx`(`userId`, `tag`),
    UNIQUE INDEX `contacts_userId_number_key`(`userId`, `number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auto_replies` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,
    `response` TEXT NOT NULL,
    `matchType` ENUM('exact', 'contains', 'regex', 'ai_smart') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `auto_replies_userId_idx`(`userId`),
    INDEX `auto_replies_userId_isActive_priority_idx`(`userId`, `isActive`, `priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workflows` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `triggerType` VARCHAR(191) NOT NULL DEFAULT 'message_received',
    `triggerCondition` JSON NOT NULL,
    `nodes` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `executionCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `workflows_userId_idx`(`userId`),
    INDEX `workflows_userId_isActive_idx`(`userId`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workflow_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workflowId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `logs` JSON NOT NULL,
    `errorMessage` TEXT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `workflow_logs_workflowId_idx`(`workflowId`),
    INDEX `workflow_logs_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drip_campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `triggerTag` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `drip_campaigns_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drip_steps` (
    `id` VARCHAR(191) NOT NULL,
    `dripId` VARCHAR(191) NOT NULL,
    `dayOffset` INTEGER NOT NULL,
    `timeAt` VARCHAR(5) NOT NULL,
    `message` TEXT NOT NULL,
    `mediaPath` VARCHAR(191) NULL,

    UNIQUE INDEX `drip_steps_dripId_dayOffset_key`(`dripId`, `dayOffset`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drip_subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `dripId` VARCHAR(191) NOT NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `status` ENUM('active', 'completed', 'paused', 'cancelled') NOT NULL DEFAULT 'active',
    `lastStepDay` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `drip_subscriptions_status_idx`(`status`),
    UNIQUE INDEX `drip_subscriptions_dripId_contactId_key`(`dripId`, `contactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scheduled_messages` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `messageType` ENUM('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'vcard', 'poll') NOT NULL DEFAULT 'text',
    `mediaPath` VARCHAR(191) NULL,
    `scheduledTime` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    `recurrenceType` ENUM('none', 'daily', 'weekly', 'monthly') NOT NULL DEFAULT 'none',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `scheduled_messages_status_scheduledTime_idx`(`status`, `scheduledTime`),
    INDEX `scheduled_messages_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `templates` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'General',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `templates_userId_idx`(`userId`),
    UNIQUE INDEX `templates_userId_name_key`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook_configs` (
    `userId` VARCHAR(191) NOT NULL,
    `webhookUrl` TEXT NULL,
    `webhookSecret` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook_queues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `payload` JSON NOT NULL,
    `headers` JSON NOT NULL,
    `retries` INTEGER NOT NULL DEFAULT 0,
    `maxRetries` INTEGER NOT NULL DEFAULT 5,
    `status` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    `lastError` TEXT NULL,
    `nextRetryAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `webhook_queues_status_idx`(`status`),
    INDEX `webhook_queues_status_nextRetryAt_idx`(`status`, `nextRetryAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `global_settings` (
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_settings` (
    `userId` VARCHAR(191) NOT NULL,
    `geminiApiKey` VARCHAR(191) NULL,
    `geminiConfidenceThreshold` DOUBLE NOT NULL DEFAULT 0.6,
    `autoDownloadPhotos` BOOLEAN NOT NULL DEFAULT false,
    `autoDownloadVideos` BOOLEAN NOT NULL DEFAULT false,
    `autoDownloadAudio` BOOLEAN NOT NULL DEFAULT false,
    `autoDownloadDocuments` BOOLEAN NOT NULL DEFAULT false,
    `backgroundSync` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `action` ENUM('LOGIN', 'LOGOUT', 'CREATE_SESSION', 'DELETE_SESSION', 'RECONNECT_SESSION', 'CREATE_API_KEY', 'DELETE_API_KEY', 'START_BROADCAST', 'CANCEL_BROADCAST', 'UPDATE_SETTINGS', 'ENABLE_2FA', 'DISABLE_2FA', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'ASSIGN_TIER', 'CREATE_WORKSPACE', 'INVITE_MEMBER', 'REMOVE_MEMBER') NOT NULL,
    `details` JSON NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` TEXT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_timestamp_idx`(`timestamp`),
    INDEX `audit_logs_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `call_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `fromNumber` VARCHAR(191) NOT NULL,
    `callType` VARCHAR(191) NOT NULL DEFAULT 'voice',
    `status` VARCHAR(191) NOT NULL DEFAULT 'missed',
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `call_logs_userId_idx`(`userId`),
    INDEX `call_logs_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspaces` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_members` (
    `id` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
    `permissions` JSON NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `workspace_members_workspaceId_userId_key`(`workspaceId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_tiers` ADD CONSTRAINT `user_tiers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tiers` ADD CONSTRAINT `user_tiers_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `tiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quotas` ADD CONSTRAINT `user_quotas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsapp_sessions` ADD CONSTRAINT `whatsapp_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_keys` ADD CONSTRAINT `api_keys_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message_logs` ADD CONSTRAINT `message_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message_logs` ADD CONSTRAINT `message_logs_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `whatsapp_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message_logs` ADD CONSTRAINT `message_logs_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inbox` ADD CONSTRAINT `inbox_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inbox` ADD CONSTRAINT `inbox_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `whatsapp_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `whatsapp_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auto_replies` ADD CONSTRAINT `auto_replies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflows` ADD CONSTRAINT `workflows_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflow_logs` ADD CONSTRAINT `workflow_logs_workflowId_fkey` FOREIGN KEY (`workflowId`) REFERENCES `workflows`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflow_logs` ADD CONSTRAINT `workflow_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drip_campaigns` ADD CONSTRAINT `drip_campaigns_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drip_campaigns` ADD CONSTRAINT `drip_campaigns_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `whatsapp_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drip_steps` ADD CONSTRAINT `drip_steps_dripId_fkey` FOREIGN KEY (`dripId`) REFERENCES `drip_campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drip_subscriptions` ADD CONSTRAINT `drip_subscriptions_dripId_fkey` FOREIGN KEY (`dripId`) REFERENCES `drip_campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drip_subscriptions` ADD CONSTRAINT `drip_subscriptions_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scheduled_messages` ADD CONSTRAINT `scheduled_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scheduled_messages` ADD CONSTRAINT `scheduled_messages_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `whatsapp_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `templates` ADD CONSTRAINT `templates_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webhook_configs` ADD CONSTRAINT `webhook_configs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webhook_queues` ADD CONSTRAINT `webhook_queues_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `call_logs` ADD CONSTRAINT `call_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `call_logs` ADD CONSTRAINT `call_logs_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `whatsapp_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_members` ADD CONSTRAINT `workspace_members_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_members` ADD CONSTRAINT `workspace_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- 1. ApiKey: tambah isSandbox dan expiresAt
ALTER TABLE api_keys
  ADD COLUMN is_sandbox BOOLEAN NOT NULL DEFAULT FALSE
    COMMENT 'Mode sandbox: request tidak dikirim ke WhatsApp sungguhan',
  ADD COLUMN expires_at DATETIME NULL
    COMMENT 'Tanggal kadaluarsa token (null = tidak expired)';

-- Index untuk cek expired token
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at);
