#!/bin/bash

OUTPUT="blueprint-frontend.md"
> "$OUTPUT"

get_lang() {
  case "${1##*.}" in
    ts|tsx) echo "ts" ;;
    js|jsx) echo "js" ;;
    json)   echo "json" ;;
    css)    echo "css" ;;
    sh)     echo "bash" ;;
    md)     echo "md" ;;
    env*)   echo "bash" ;;
    *)      echo "" ;;
  esac
}

FILES=(
  # ── Config & Root ──────────────────────────────────────────
  "package.json"
  "tsconfig.json"
  "next.config.ts"
  "tailwind.config.ts"
  "components.json"
  ".env.local"
  ".env.example"
  ".prettierrc"
  "src/middleware.ts"
  "src/app/layout.tsx"
  "src/app/globals.css"
  "src/app/page.tsx"
  "src/app/not-found.tsx"
  "src/app/error.tsx"
  "src/app/loading.tsx"

  # ── Auth Pages ─────────────────────────────────────────────
  "src/app/(auth)/layout.tsx"
  "src/app/(auth)/login/page.tsx"
  "src/app/(auth)/auth/2fa/page.tsx"

  # ── Dashboard Layout ───────────────────────────────────────
  "src/app/(dashboard)/layout.tsx"

  # ── Dashboard Pages ────────────────────────────────────────
  "src/app/(dashboard)/dashboard/page.tsx"
  "src/app/(dashboard)/sessions/page.tsx"
  "src/app/(dashboard)/messages/send/page.tsx"
  "src/app/(dashboard)/messages/logs/page.tsx"
  "src/app/(dashboard)/inbox/page.tsx"
  "src/app/(dashboard)/broadcast/campaigns/page.tsx"
  "src/app/(dashboard)/broadcast/campaigns/[id]/page.tsx"
  "src/app/(dashboard)/broadcast-list/page.tsx"
  "src/app/(dashboard)/contacts/page.tsx"
  "src/app/(dashboard)/auto-reply/page.tsx"
  "src/app/(dashboard)/workflows/page.tsx"
  "src/app/(dashboard)/drip-campaigns/page.tsx"
  "src/app/(dashboard)/drip-campaigns/[id]/subscribers/page.tsx"
  "src/app/(dashboard)/scheduler/page.tsx"
  "src/app/(dashboard)/scheduled-events/page.tsx"
  "src/app/(dashboard)/templates/page.tsx"
  "src/app/(dashboard)/chats/page.tsx"
  "src/app/(dashboard)/groups/page.tsx"
  "src/app/(dashboard)/groups/[sessionId]/[groupId]/page.tsx"
  "src/app/(dashboard)/channels/page.tsx"
  "src/app/(dashboard)/labels/page.tsx"
  "src/app/(dashboard)/calls/page.tsx"
  "src/app/(dashboard)/profile/page.tsx"
  "src/app/(dashboard)/analytics/page.tsx"
  "src/app/(dashboard)/audit/page.tsx"
  "src/app/(dashboard)/api-keys/page.tsx"
  "src/app/(dashboard)/workspaces/page.tsx"
  "src/app/(dashboard)/settings/page.tsx"
  "src/app/(dashboard)/settings/webhook/page.tsx"
  "src/app/(dashboard)/settings/ai/page.tsx"
  "src/app/(dashboard)/settings/security/page.tsx"

  # ── Admin Pages ────────────────────────────────────────────
  "src/app/(dashboard)/admin/users/page.tsx"
  "src/app/(dashboard)/admin/users/[id]/page.tsx"
  "src/app/(dashboard)/admin/tiers/page.tsx"
  "src/app/(dashboard)/admin/audit/page.tsx"
  "src/app/(dashboard)/admin/settings/page.tsx"

  # ── Lib ────────────────────────────────────────────────────
  "src/lib/utils.ts"
  "src/lib/axios.ts"
  "src/lib/socket.ts"
  "src/lib/query-client.ts"
  "src/lib/api-error.ts"

  # ── Types ──────────────────────────────────────────────────
  "src/types/api.ts"
  "src/types/auth.ts"
  "src/types/socket.ts"
  "src/types/session.ts"
  "src/types/message.ts"
  "src/types/broadcast.ts"
  "src/types/broadcast-list.ts"
  "src/types/inbox.ts"
  "src/types/contact.ts"
  "src/types/customer-note.ts"
  "src/types/auto-reply.ts"
  "src/types/workflow.ts"
  "src/types/drip.ts"
  "src/types/scheduler.ts"
  "src/types/scheduled-event.ts"
  "src/types/template.ts"
  "src/types/webhook.ts"
  "src/types/api-key.ts"
  "src/types/settings.ts"
  "src/types/analytics.ts"
  "src/types/audit.ts"
  "src/types/tier.ts"
  "src/types/user.ts"
  "src/types/workspace.ts"
  "src/types/profile.ts"
  "src/types/chat.ts"
  "src/types/group.ts"
  "src/types/channel.ts"
  "src/types/label.ts"
  "src/types/status.ts"
  "src/types/call.ts"
  "src/types/storage.ts"
  "src/types/admin.ts"
  "src/types/health.ts"

  # ── Stores ─────────────────────────────────────────────────
  "src/store/auth.store.ts"
  "src/store/session.store.ts"
  "src/store/notification.store.ts"
  "src/store/broadcast.store.ts"
  "src/store/inbox.store.ts"
  "src/store/ui.store.ts"

  # ── Constants ──────────────────────────────────────────────
  "src/constants/routes.ts"
  "src/constants/query-keys.ts"
  "src/constants/tier-features.ts"
  "src/constants/nav-items.ts"
  "src/constants/error-codes.ts"
  "src/constants/socket-events.ts"

  # ── Validators ─────────────────────────────────────────────
  "src/validators/auth.schema.ts"
  "src/validators/session.schema.ts"
  "src/validators/message.schema.ts"
  "src/validators/broadcast.schema.ts"
  "src/validators/contact.schema.ts"
  "src/validators/customer-note.schema.ts"
  "src/validators/auto-reply.schema.ts"
  "src/validators/workflow.schema.ts"
  "src/validators/drip.schema.ts"
  "src/validators/scheduler.schema.ts"
  "src/validators/scheduled-event.schema.ts"
  "src/validators/template.schema.ts"
  "src/validators/webhook.schema.ts"
  "src/validators/api-key.schema.ts"
  "src/validators/settings.schema.ts"
  "src/validators/tier.schema.ts"
  "src/validators/workspace.schema.ts"
  "src/validators/user.schema.ts"
  "src/validators/profile.schema.ts"
  "src/validators/groups.schema.ts"

  # ── API Functions ──────────────────────────────────────────
  "src/api/auth.api.ts"
  "src/api/users.api.ts"
  "src/api/sessions.api.ts"
  "src/api/messages.api.ts"
  "src/api/broadcast.api.ts"
  "src/api/broadcast-list.api.ts"
  "src/api/inbox.api.ts"
  "src/api/contacts.api.ts"
  "src/api/customer-note.api.ts"
  "src/api/auto-reply.api.ts"
  "src/api/workflow.api.ts"
  "src/api/drip.api.ts"
  "src/api/scheduler.api.ts"
  "src/api/scheduled-event.api.ts"
  "src/api/templates.api.ts"
  "src/api/webhook.api.ts"
  "src/api/api-keys.api.ts"
  "src/api/settings.api.ts"
  "src/api/analytics.api.ts"
  "src/api/audit.api.ts"
  "src/api/tiers.api.ts"
  "src/api/workspace.api.ts"
  "src/api/profile.api.ts"
  "src/api/chats.api.ts"
  "src/api/groups.api.ts"
  "src/api/channels.api.ts"
  "src/api/labels.api.ts"
  "src/api/status.api.ts"
  "src/api/calls.api.ts"
  "src/api/storage.api.ts"
  "src/api/admin.api.ts"
  "src/api/health.api.ts"

  # ── Hooks ──────────────────────────────────────────────────
  "src/hooks/use-auth.ts"
  "src/hooks/use-socket.ts"
  "src/hooks/use-qr-listener.ts"
  "src/hooks/use-pairing-listener.ts"
  "src/hooks/use-connection-listener.ts"
  "src/hooks/use-broadcast-progress.ts"
  "src/hooks/use-inbox-realtime.ts"
  "src/hooks/use-system-alerts.ts"
  "src/hooks/use-message-ack.ts"
  "src/hooks/use-incoming-call.ts"
  "src/hooks/use-tier-features.ts"
  "src/hooks/use-quota.ts"
  "src/hooks/use-session-status.ts"
  "src/hooks/use-debounce.ts"
  "src/hooks/use-media-query.ts"
  "src/hooks/use-copy-to-clipboard.ts"
  "src/hooks/use-pagination.ts"
  "src/hooks/use-file-upload.ts"
  "src/hooks/use-toast.ts"

  # ── Providers ──────────────────────────────────────────────
  "src/providers/query-provider.tsx"
  "src/providers/theme-provider.tsx"
  "src/providers/socket-provider.tsx"
  "src/providers/auth-provider.tsx"

  # ── Layout Components ──────────────────────────────────────
  "src/components/layout/app-shell.tsx"
  "src/components/layout/sidebar.tsx"
  "src/components/layout/sidebar-nav.tsx"
  "src/components/layout/sidebar-nav-item.tsx"
  "src/components/layout/sidebar-section.tsx"
  "src/components/layout/header.tsx"
  "src/components/layout/breadcrumb.tsx"
  "src/components/layout/mobile-nav.tsx"
  "src/components/layout/user-menu.tsx"
  "src/components/layout/notification-bell.tsx"
  "src/components/layout/theme-toggle.tsx"
  "src/components/layout/impersonation-banner.tsx"
  "src/components/layout/maintenance-banner.tsx"
  "src/components/layout/quota-warning-banner.tsx"

  # ── Common Components ──────────────────────────────────────
  "src/components/common/page-header.tsx"
  "src/components/common/data-table.tsx"
  "src/components/common/data-table-pagination.tsx"
  "src/components/common/data-table-toolbar.tsx"
  "src/components/common/data-table-column-header.tsx"
  "src/components/common/confirm-dialog.tsx"
  "src/components/common/empty-state.tsx"
  "src/components/common/error-state.tsx"
  "src/components/common/loading-spinner.tsx"
  "src/components/common/loading-skeleton.tsx"
  "src/components/common/error-boundary.tsx"
  "src/components/common/copy-button.tsx"
  "src/components/common/status-badge.tsx"
  "src/components/common/file-uploader.tsx"
  "src/components/common/phone-input.tsx"
  "src/components/common/date-picker.tsx"
  "src/components/common/date-range-picker.tsx"
  "src/components/common/search-input.tsx"
  "src/components/common/stats-card.tsx"
  "src/components/common/tier-gate.tsx"
  "src/components/common/role-gate.tsx"
  "src/components/common/quota-bar.tsx"
  "src/components/common/export-pdf-button.tsx"
  "src/components/common/session-selector.tsx"
  "src/components/common/api-error-alert.tsx"

  # ── Auth Components ────────────────────────────────────────
  "src/components/auth/google-login-button.tsx"
  "src/components/auth/two-factor-form.tsx"
  "src/components/auth/setup-2fa-dialog.tsx"
  "src/components/auth/backup-codes-dialog.tsx"
  "src/components/auth/disable-2fa-dialog.tsx"

  # ── Session Components ─────────────────────────────────────
  "src/components/session/session-list.tsx"
  "src/components/session/session-card.tsx"
  "src/components/session/session-status-badge.tsx"
  "src/components/session/add-session-dialog.tsx"
  "src/components/session/session-qr-dialog.tsx"
  "src/components/session/session-pairing-dialog.tsx"
  "src/components/session/session-info-dialog.tsx"
  "src/components/session/reconnect-button.tsx"

  # ── Message Components ─────────────────────────────────────
  "src/components/messages/message-type-tabs.tsx"
  "src/components/messages/send-message-form.tsx"
  "src/components/messages/send-media-form.tsx"
  "src/components/messages/send-location-form.tsx"
  "src/components/messages/send-live-location-form.tsx"
  "src/components/messages/send-poll-form.tsx"
  "src/components/messages/send-contact-form.tsx"
  "src/components/messages/send-voice-note-form.tsx"
  "src/components/messages/message-log-table.tsx"
  "src/components/messages/message-status-badge.tsx"
  "src/components/messages/check-number-form.tsx"

  # ── Broadcast Components ───────────────────────────────────
  "src/components/broadcast/campaign-table.tsx"
  "src/components/broadcast/campaign-card.tsx"
  "src/components/broadcast/campaign-status-badge.tsx"
  "src/components/broadcast/create-broadcast-dialog.tsx"
  "src/components/broadcast/recipients-tab.tsx"
  "src/components/broadcast/csv-upload-tab.tsx"
  "src/components/broadcast/tag-filter-tab.tsx"
  "src/components/broadcast/broadcast-progress-dialog.tsx"
  "src/components/broadcast/broadcast-stats-cards.tsx"
  "src/components/broadcast/cancel-broadcast-button.tsx"

  # ── Broadcast List Components ──────────────────────────────
  "src/components/broadcast-list/broadcast-list-table.tsx"
  "src/components/broadcast-list/send-to-list-dialog.tsx"

  # ── Inbox Components ───────────────────────────────────────
  "src/components/inbox/conversation-list.tsx"
  "src/components/inbox/conversation-item.tsx"
  "src/components/inbox/message-thread.tsx"
  "src/components/inbox/message-bubble.tsx"
  "src/components/inbox/reply-form.tsx"
  "src/components/inbox/inbox-filters.tsx"
  "src/components/inbox/unread-badge.tsx"

  # ── Contact Components ─────────────────────────────────────
  "src/components/contacts/contact-table.tsx"
  "src/components/contacts/contact-form.tsx"
  "src/components/contacts/import-csv-dialog.tsx"
  "src/components/contacts/import-google-dialog.tsx"
  "src/components/contacts/bulk-actions-bar.tsx"
  "src/components/contacts/contact-tag-badge.tsx"
  "src/components/contacts/export-button.tsx"

  # ── Customer Note Components ───────────────────────────────
  "src/components/customer-note/note-dialog.tsx"

  # ── Auto Reply Components ──────────────────────────────────
  "src/components/auto-reply/rule-table.tsx"
  "src/components/auto-reply/rule-form-dialog.tsx"
  "src/components/auto-reply/match-type-badge.tsx"
  "src/components/auto-reply/toggle-switch.tsx"

  # ── Workflow Components ────────────────────────────────────
  "src/components/workflow/workflow-list.tsx"
  "src/components/workflow/workflow-card.tsx"
  "src/components/workflow/workflow-form-dialog.tsx"
  "src/components/workflow/trigger-condition-form.tsx"
  "src/components/workflow/node-editor.tsx"
  "src/components/workflow/node-card.tsx"
  "src/components/workflow/node-type-selector.tsx"

  # ── Drip Components ────────────────────────────────────────
  "src/components/drip/drip-list.tsx"
  "src/components/drip/drip-card.tsx"
  "src/components/drip/drip-form-dialog.tsx"
  "src/components/drip/step-editor.tsx"
  "src/components/drip/step-form.tsx"
  "src/components/drip/subscriber-table.tsx"
  "src/components/drip/subscription-status-badge.tsx"
  "src/components/drip/cancel-subscription-button.tsx"

  # ── Scheduler Components ───────────────────────────────────
  "src/components/scheduler/scheduled-table.tsx"
  "src/components/scheduler/create-scheduled-dialog.tsx"
  "src/components/scheduler/recurrence-select.tsx"
  "src/components/scheduler/scheduled-status-badge.tsx"

  # ── Scheduled Event Components ─────────────────────────────
  "src/components/scheduled-event/send-event-dialog.tsx"
  "src/components/scheduled-event/respond-event-dialog.tsx"

  # ── Template Components ────────────────────────────────────
  "src/components/templates/template-list.tsx"
  "src/components/templates/template-card.tsx"
  "src/components/templates/template-form-dialog.tsx"
  "src/components/templates/template-picker.tsx"

  # ── Webhook Components ─────────────────────────────────────
  "src/components/webhook/webhook-config-form.tsx"
  "src/components/webhook/webhook-secret-card.tsx"
  "src/components/webhook/test-webhook-button.tsx"

  # ── API Key Components ─────────────────────────────────────
  "src/components/api-keys/api-key-table.tsx"
  "src/components/api-keys/create-key-dialog.tsx"
  "src/components/api-keys/key-reveal-dialog.tsx"
  "src/components/api-keys/sandbox-badge.tsx"
  "src/components/api-keys/ip-whitelist-input.tsx"

  # ── Settings Components ────────────────────────────────────
  "src/components/settings/user-settings-form.tsx"
  "src/components/settings/ai-settings-form.tsx"
  "src/components/settings/security-settings.tsx"
  "src/components/settings/global-settings-form.tsx"
  "src/components/settings/maintenance-toggle.tsx"
  "src/components/settings/announcement-form.tsx"

  # ── Analytics Components ───────────────────────────────────
  "src/components/analytics/summary-cards.tsx"
  "src/components/analytics/message-chart.tsx"
  "src/components/analytics/recent-campaigns.tsx"
  "src/components/analytics/recent-logs.tsx"
  "src/components/analytics/system-status-card.tsx"
  "src/components/analytics/sessions-status-card.tsx"
  "src/components/analytics/queue-status-card.tsx"
  "src/components/analytics/days-filter.tsx"

  # ── Audit Components ───────────────────────────────────────
  "src/components/audit/audit-table.tsx"
  "src/components/audit/audit-filters.tsx"
  "src/components/audit/audit-action-badge.tsx"
  "src/components/audit/export-pdf-button.tsx"

  # ── Tier Components ────────────────────────────────────────
  "src/components/tiers/tier-list.tsx"
  "src/components/tiers/tier-card.tsx"
  "src/components/tiers/tier-badge.tsx"
  "src/components/tiers/tier-feature-list.tsx"
  "src/components/tiers/tier-form-dialog.tsx"
  "src/components/tiers/assign-tier-dialog.tsx"
  "src/components/tiers/tier-history-table.tsx"
  "src/components/tiers/grace-period-banner.tsx"

  # ── User Components (admin) ────────────────────────────────
  "src/components/users/user-table.tsx"
  "src/components/users/user-detail-card.tsx"
  "src/components/users/update-user-dialog.tsx"
  "src/components/users/quota-editor.tsx"
  "src/components/users/delete-user-dialog.tsx"
  "src/components/users/user-tier-badge.tsx"

  # ── Workspace Components ───────────────────────────────────
  "src/components/workspace/workspace-list.tsx"
  "src/components/workspace/workspace-card.tsx"
  "src/components/workspace/create-workspace-dialog.tsx"
  "src/components/workspace/member-table.tsx"
  "src/components/workspace/invite-member-dialog.tsx"
  "src/components/workspace/permission-editor.tsx"
  "src/components/workspace/remove-member-button.tsx"

  # ── Profile Components ─────────────────────────────────────
  "src/components/profile/wa-profile-card.tsx"
  "src/components/profile/set-display-name-form.tsx"
  "src/components/profile/set-status-form.tsx"
  "src/components/profile/profile-photo-upload.tsx"
  "src/components/profile/wa-contacts-table.tsx"
  "src/components/profile/contact-profile-photo.tsx"
  "src/components/profile/block-unblock-button.tsx"
  "src/components/profile/blocked-contacts-list.tsx"

  # ── Chat Components ────────────────────────────────────────
  "src/components/chats/chat-list.tsx"
  "src/components/chats/chat-list-item.tsx"
  "src/components/chats/chat-actions-menu.tsx"
  "src/components/chats/search-messages.tsx"

  # ── Group Components ───────────────────────────────────────
  "src/components/groups/group-list.tsx"
  "src/components/groups/group-info-card.tsx"
  "src/components/groups/create-group-dialog.tsx"
  "src/components/groups/manage-participants-dialog.tsx"
  "src/components/groups/membership-requests-list.tsx"
  "src/components/groups/invite-link-card.tsx"
  "src/components/groups/common-groups-list.tsx"

  # ── Channel Components ─────────────────────────────────────
  "src/components/channels/channel-list.tsx"
  "src/components/channels/channel-card.tsx"
  "src/components/channels/channel-search-dialog.tsx"
  "src/components/channels/subscribe-button.tsx"
  "src/components/channels/send-to-channel-dialog.tsx"
  "src/components/channels/manage-admin-dialog.tsx"
  "src/components/channels/transfer-ownership-dialog.tsx"

  # ── Label Components ───────────────────────────────────────
  "src/components/labels/label-list.tsx"
  "src/components/labels/label-badge.tsx"
  "src/components/labels/assign-label-dialog.tsx"
  "src/components/labels/chats-by-label.tsx"

  # ── Status Components ──────────────────────────────────────
  "src/components/status/set-bio-form.tsx"
  "src/components/status/send-status-form.tsx"
  "src/components/status/presence-toggle.tsx"

  # ── Call Components ────────────────────────────────────────
  "src/components/calls/call-log-table.tsx"
  "src/components/calls/call-type-badge.tsx"
  "src/components/calls/call-status-badge.tsx"
  "src/components/calls/create-call-link-dialog.tsx"

  # ── Admin Components ───────────────────────────────────────
  "src/components/admin/impersonation-dialog.tsx"
  "src/components/admin/exit-impersonation-button.tsx"
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
echo "blueprint-frontend.md berhasil dibuat!"
echo "   $FOUND file berhasil diproses"
echo "   $SKIPPED file dilewati (tidak ditemukan)"
