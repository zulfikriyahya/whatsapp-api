#!/bin/bash

OUTPUT="blueprint.md"
> "$OUTPUT"

get_lang() {
  case "${1##*.}" in
    ts) echo "ts" ;;
    js) echo "js" ;;
    json) echo "json" ;;
    prisma) echo "prisma" ;;
    sh) echo "bash" ;;
    md) echo "md" ;;
    *) echo "" ;;
  esac
}

FILES=(
  "ecosystem.config.js"
  "nest-cli.json"
  "package.json"
  "tsconfig.json"
  "tsconfig.build.json"

  "prisma/schema.prisma"
  "prisma/seed.ts"

  "src/main.ts"
  "src/app.module.ts"

  # Constants
  "src/common/constants/cache-keys.constant.ts"
  "src/common/constants/error-codes.constant.ts"
  "src/common/constants/event-names.constant.ts"
  "src/common/constants/mime-types.constant.ts"
  "src/common/constants/queue-names.constant.ts"
  "src/common/constants/quota.constant.ts"

  # Decorators
  "src/common/decorators/api-key.decorator.ts"
  "src/common/decorators/current-user.decorator.ts"
  "src/common/decorators/public.decorator.ts"
  "src/common/decorators/roles.decorator.ts"

  # DTOs
  "src/common/dto/pagination.dto.ts"
  "src/common/dto/response.dto.ts"

  # Enums
  "src/common/enums/match-type.enum.ts"
  "src/common/enums/message-status.enum.ts"
  "src/common/enums/recurrence-type.enum.ts"
  "src/common/enums/role.enum.ts"
  "src/common/enums/session-status.enum.ts"
  "src/common/enums/status.enum.ts"
  "src/common/enums/tier.enum.ts"

  # Filters
  "src/common/filters/http-exception.filter.ts"
  "src/common/filters/prisma-exception.filter.ts"

  # Guards
  "src/common/guards/active-user.guard.ts"
  "src/common/guards/api-key.guard.ts"
  "src/common/guards/api-key-restriction.guard.ts"
  "src/common/guards/google-auth.guard.ts"
  "src/common/guards/jwt-auth.guard.ts"
  "src/common/guards/quota.guard.ts"
  "src/common/guards/roles.guard.ts"
  "src/common/guards/tier-feature.guard.ts"
  "src/common/guards/tier-throttler.guard.ts"

  # Interceptors
  "src/common/interceptors/logging.interceptor.ts"
  "src/common/interceptors/response.interceptor.ts"
  "src/common/interceptors/sandbox.interceptor.ts"
  "src/common/interceptors/timeout.interceptor.ts"

  # Interfaces
  "src/common/interfaces/api-key-payload.interface.ts"
  "src/common/interfaces/jwt-payload.interface.ts"
  "src/common/interfaces/pagination.interface.ts"
  "src/common/interfaces/response.interface.ts"

  # Middlewares
  "src/common/middlewares/ip-whitelist.middleware.ts"
  "src/common/middlewares/logger.middleware.ts"
  "src/common/middlewares/maintenance.middleware.ts"

  # Pipes
  "src/common/pipes/parse-pagination.pipe.ts"
  "src/common/pipes/validation.pipe.ts"

  # Utils
  "src/common/utils/csv-parser.util.ts"
  "src/common/utils/date.util.ts"
  "src/common/utils/hash.util.ts"
  "src/common/utils/hmac.util.ts"
  "src/common/utils/ip-validator.util.ts"
  "src/common/utils/mime-validator.util.ts"
  "src/common/utils/pdf-generator.util.ts"
  "src/common/utils/phone-normalizer.util.ts"
  "src/common/utils/placeholder.util.ts"
  "src/common/utils/token-generator.util.ts"

  # Config
  "src/config/app.config.ts"
  "src/config/database.config.ts"
  "src/config/gemini.config.ts"
  "src/config/google.config.ts"
  "src/config/jwt.config.ts"
  "src/config/redis.config.ts"
  "src/config/throttler.config.ts"
  "src/config/whatsapp.config.ts"

  # Gateway
  "src/gateway/app.gateway.ts"
  "src/gateway/gateway.module.ts"
  "src/gateway/gateway.service.ts"

  # Admin
  "src/modules/admin/admin.module.ts"
  "src/modules/admin/dto/impersonate.dto.ts"
  "src/modules/admin/impersonation.controller.ts"
  "src/modules/admin/impersonation.service.ts"

  # AI
  "src/modules/ai/ai.module.ts"
  "src/modules/ai/ai.service.ts"
  "src/modules/ai/dto/ai-reply.dto.ts"

  # Analytics
  "src/modules/analytics/analytics.controller.ts"
  "src/modules/analytics/analytics.module.ts"
  "src/modules/analytics/analytics.service.ts"
  "src/modules/analytics/dto/query-analytics.dto.ts"

  # API Keys
  "src/modules/api-keys/api-key-monitor.service.ts"
  "src/modules/api-keys/api-keys.controller.ts"
  "src/modules/api-keys/api-keys.module.ts"
  "src/modules/api-keys/api-keys.service.ts"
  "src/modules/api-keys/dto/create-api-key.dto.ts"

  # Audit
  "src/modules/audit/audit.controller.ts"
  "src/modules/audit/audit.module.ts"
  "src/modules/audit/audit.service.ts"
  "src/modules/audit/dto/query-audit.dto.ts"

  # Auth
  "src/modules/auth/auth.controller.ts"
  "src/modules/auth/auth.module.ts"
  "src/modules/auth/auth.service.ts"
  "src/modules/auth/dto/disable-2fa.dto.ts"
  "src/modules/auth/dto/enable-2fa.dto.ts"
  "src/modules/auth/dto/google-auth.dto.ts"
  "src/modules/auth/dto/verify-2fa.dto.ts"
  "src/modules/auth/dto/verify-code.dto.ts"
  "src/modules/auth/strategies/google.strategy.ts"
  "src/modules/auth/strategies/jwt.strategy.ts"

  # Auto Reply
  "src/modules/auto-reply/auto-reply.controller.ts"
  "src/modules/auto-reply/auto-reply.engine.ts"
  "src/modules/auto-reply/auto-reply.module.ts"
  "src/modules/auto-reply/auto-reply.service.ts"
  "src/modules/auto-reply/dto/create-auto-reply.dto.ts"
  "src/modules/auto-reply/dto/toggle-auto-reply.dto.ts"
  "src/modules/auto-reply/dto/update-auto-reply.dto.ts"

  # Backup
  "src/modules/backup/backup.module.ts"
  "src/modules/backup/backup.service.ts"

  # Broadcast
  "src/modules/broadcast/broadcast.controller.ts"
  "src/modules/broadcast/broadcast.module.ts"
  "src/modules/broadcast/broadcast.service.ts"
  "src/modules/broadcast/dto/create-broadcast.dto.ts"
  "src/modules/broadcast/dto/query-campaigns.dto.ts"
  "src/modules/broadcast/processors/broadcast.processor.ts"

  # Broadcast List
  "src/modules/broadcast-list/broadcast-list.controller.ts"
  "src/modules/broadcast-list/broadcast-list.module.ts"
  "src/modules/broadcast-list/broadcast-list.service.ts"

  # Calls
  "src/modules/calls/calls.controller.ts"
  "src/modules/calls/calls.module.ts"
  "src/modules/calls/calls.service.ts"
  "src/modules/calls/dto/query-calls.dto.ts"

  # Channels
  "src/modules/channels/channels.controller.ts"
  "src/modules/channels/channels.module.ts"
  "src/modules/channels/channels.service.ts"
  "src/modules/channels/dto/create-channel.dto.ts"
  "src/modules/channels/dto/manage-channel-admin.dto.ts"
  "src/modules/channels/dto/search-channel.dto.ts"
  "src/modules/channels/dto/update-channel.dto.ts"

  # Chats
  "src/modules/chats/chats.controller.ts"
  "src/modules/chats/chats.module.ts"
  "src/modules/chats/chats.service.ts"
  "src/modules/chats/dto/mute-chat.dto.ts"
  "src/modules/chats/dto/search-messages.dto.ts"

  # Cleanup
  "src/modules/cleanup/cleanup.module.ts"
  "src/modules/cleanup/cleanup.service.ts"

  # Contacts
  "src/modules/contacts/contacts.controller.ts"
  "src/modules/contacts/contacts.module.ts"
  "src/modules/contacts/contacts.service.ts"
  "src/modules/contacts/dto/bulk-delete-contacts.dto.ts"
  "src/modules/contacts/dto/create-contact.dto.ts"
  "src/modules/contacts/dto/import-contacts.dto.ts"
  "src/modules/contacts/dto/import-google-contacts.dto.ts"
  "src/modules/contacts/dto/query-contacts.dto.ts"
  "src/modules/contacts/dto/update-contact.dto.ts"

  # Customer Note
  "src/modules/customer-note/customer-note.controller.ts"
  "src/modules/customer-note/customer-note.module.ts"
  "src/modules/customer-note/customer-note.service.ts"
  "src/modules/customer-note/dto/upsert-note.dto.ts"

  # Drip
  "src/modules/drip/drip.controller.ts"
  "src/modules/drip/drip.manager.ts"
  "src/modules/drip/drip.module.ts"
  "src/modules/drip/drip.service.ts"
  "src/modules/drip/dto/create-drip.dto.ts"
  "src/modules/drip/dto/drip-step.dto.ts"
  "src/modules/drip/dto/query-subscribers.dto.ts"
  "src/modules/drip/dto/toggle-drip.dto.ts"
  "src/modules/drip/dto/update-drip.dto.ts"

  # Groups
  "src/modules/groups/dto/create-group.dto.ts"
  "src/modules/groups/dto/manage-admins.dto.ts"
  "src/modules/groups/dto/manage-members.dto.ts"
  "src/modules/groups/dto/membership-request.dto.ts"
  "src/modules/groups/dto/update-group.dto.ts"
  "src/modules/groups/groups.controller.ts"
  "src/modules/groups/groups.module.ts"
  "src/modules/groups/groups.service.ts"

  # Health
  "src/modules/health/health.controller.ts"
  "src/modules/health/health.module.ts"
  "src/modules/health/health.service.ts"

  # Inbox
  "src/modules/inbox/dto/query-inbox.dto.ts"
  "src/modules/inbox/dto/reply-inbox.dto.ts"
  "src/modules/inbox/inbox.controller.ts"
  "src/modules/inbox/inbox.module.ts"
  "src/modules/inbox/inbox.service.ts"

  # Labels
  "src/modules/labels/dto/assign-label.dto.ts"
  "src/modules/labels/dto/create-label.dto.ts"
  "src/modules/labels/labels.controller.ts"
  "src/modules/labels/labels.module.ts"
  "src/modules/labels/labels.service.ts"

  # Messages
  "src/modules/messages/dto/query-messages.dto.ts"
  "src/modules/messages/dto/react-message.dto.ts"
  "src/modules/messages/dto/send-contact.dto.ts"
  "src/modules/messages/dto/send-live-location.dto.ts"
  "src/modules/messages/dto/send-location.dto.ts"
  "src/modules/messages/dto/send-media.dto.ts"
  "src/modules/messages/dto/send-message.dto.ts"
  "src/modules/messages/dto/send-poll.dto.ts"
  "src/modules/messages/dto/send-voice-note.dto.ts"
  "src/modules/messages/messages.controller.ts"
  "src/modules/messages/messages.module.ts"
  "src/modules/messages/messages.service.ts"

  # Notifications
  "src/modules/notifications/dto/send-notification.dto.ts"
  "src/modules/notifications/email.service.ts"
  "src/modules/notifications/notifications.module.ts"
  "src/modules/notifications/notifications.service.ts"
  "src/modules/notifications/system-monitor.service.ts"

  # Profile
  "src/modules/profile/dto/update-profile-wa.dto.ts"
  "src/modules/profile/profile.controller.ts"
  "src/modules/profile/profile.module.ts"
  "src/modules/profile/profile.service.ts"

  # Scheduled Event
  "src/modules/scheduled-event/dto/create-scheduled-event.dto.ts"
  "src/modules/scheduled-event/dto/respond-event.dto.ts"
  "src/modules/scheduled-event/scheduled-event.controller.ts"
  "src/modules/scheduled-event/scheduled-event.module.ts"
  "src/modules/scheduled-event/scheduled-event.service.ts"

  # Scheduler
  "src/modules/scheduler/dto/create-scheduled-message.dto.ts"
  "src/modules/scheduler/dto/query-scheduled-messages.dto.ts"
  "src/modules/scheduler/scheduler.controller.ts"
  "src/modules/scheduler/scheduler.module.ts"
  "src/modules/scheduler/scheduler.processor.ts"
  "src/modules/scheduler/scheduler.service.ts"

  # Sessions
  "src/modules/sessions/dto/create-session.dto.ts"
  "src/modules/sessions/dto/switch-session.dto.ts"
  "src/modules/sessions/session-manager.service.ts"
  "src/modules/sessions/sessions.controller.ts"
  "src/modules/sessions/sessions.module.ts"
  "src/modules/sessions/sessions.service.ts"
  "src/modules/sessions/warming.service.ts"

  # Settings
  "src/modules/settings/dto/update-global-settings.dto.ts"
  "src/modules/settings/dto/update-settings.dto.ts"
  "src/modules/settings/settings.controller.ts"
  "src/modules/settings/settings.module.ts"
  "src/modules/settings/settings.service.ts"

  # Status
  "src/modules/status/dto/send-status.dto.ts"
  "src/modules/status/status.controller.ts"
  "src/modules/status/status.module.ts"
  "src/modules/status/status.service.ts"

  # Storage
  "src/modules/storage/storage.controller.ts"
  "src/modules/storage/storage.module.ts"

  # Templates
  "src/modules/templates/dto/create-template.dto.ts"
  "src/modules/templates/dto/query-templates.dto.ts"
  "src/modules/templates/dto/update-template.dto.ts"
  "src/modules/templates/templates.controller.ts"
  "src/modules/templates/templates.module.ts"
  "src/modules/templates/templates.service.ts"

  # Tiers
  "src/modules/tiers/dto/assign-tier.dto.ts"
  "src/modules/tiers/dto/create-tier.dto.ts"
  "src/modules/tiers/dto/update-tier.dto.ts"
  "src/modules/tiers/grace-period.service.ts"
  "src/modules/tiers/subscription-monitor.service.ts"
  "src/modules/tiers/tiers.controller.ts"
  "src/modules/tiers/tiers.module.ts"
  "src/modules/tiers/tiers.service.ts"

  # Users
  "src/modules/users/dto/query-users.dto.ts"
  "src/modules/users/dto/update-profile.dto.ts"
  "src/modules/users/dto/update-quota.dto.ts"
  "src/modules/users/dto/update-user.dto.ts"
  "src/modules/users/users.controller.ts"
  "src/modules/users/users.module.ts"
  "src/modules/users/users.service.ts"

  # Webhook
  "src/modules/webhook/dto/update-webhook.dto.ts"
  "src/modules/webhook/processors/webhook.processor.ts"
  "src/modules/webhook/webhook.controller.ts"
  "src/modules/webhook/webhook.module.ts"
  "src/modules/webhook/webhook.service.ts"

  # Workflow
  "src/modules/workflow/dto/create-workflow.dto.ts"
  "src/modules/workflow/dto/toggle-workflow.dto.ts"
  "src/modules/workflow/dto/update-workflow.dto.ts"
  "src/modules/workflow/dto/workflow-node.dto.ts"
  "src/modules/workflow/workflow.controller.ts"
  "src/modules/workflow/workflow.engine.ts"
  "src/modules/workflow/workflow.module.ts"
  "src/modules/workflow/workflow.service.ts"

  # Workspace
  "src/modules/workspace/dto/create-workspace.dto.ts"
  "src/modules/workspace/dto/invite-member.dto.ts"
  "src/modules/workspace/dto/update-member-permission.dto.ts"
  "src/modules/workspace/workspace.controller.ts"
  "src/modules/workspace/workspace.module.ts"
  "src/modules/workspace/workspace.service.ts"

  # Prisma
  "src/prisma/prisma.module.ts"
  "src/prisma/prisma.service.ts"

  # Queue
  "src/queue/queue.module.ts"

  # Redis
  "src/redis/redis.module.ts"
  "src/redis/redis.service.ts"
)

FOUND=0
SKIPPED=0

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    LANG=$(get_lang "$FILE")
    echo "## File : \`$FILE\`" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "\`\`\`${LANG}" >> "$OUTPUT"
    cat "$FILE" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "\`\`\`" >> "$OUTPUT"
    echo "---" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    ((FOUND++))
  else
    echo "[SKIP] $FILE tidak ditemukan"
    ((SKIPPED++))
  fi
done

echo ""
echo "blueprint.md berhasil dibuat!"
echo "   $FOUND file berhasil diproses"
echo "   $SKIPPED file dilewati (tidak ditemukan)"
