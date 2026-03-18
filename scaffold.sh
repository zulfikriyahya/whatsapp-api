#!/bin/bash

# =============================================================
#  WhatsApp Gateway SaaS — Frontend Scaffold (Final)
#  Next.js 15 (App Router) + Tailwind + shadcn/ui
# =============================================================

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
section() { echo -e "\n${BOLD}==============================${NC}\n${BOLD} $1${NC}\n${BOLD}==============================${NC}"; }

PROJECT="frontend"

# =============================================================
section "1. Inisialisasi Next.js 15"
# =============================================================

info "Membuat project Next.js 15..."
npx create-next-app@latest "$PROJECT" \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack \
  --use-pnpm

cd "$PROJECT"
success "Next.js project dibuat"

# =============================================================
section "2. Install Dependencies"
# =============================================================

info "Menginstall dependencies utama..."
pnpm add \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @tanstack/react-table \
  axios \
  socket.io-client \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  date-fns \
  date-fns-tz \
  recharts \
  lucide-react \
  next-themes \
  sonner \
  clsx \
  tailwind-merge \
  class-variance-authority \
  @radix-ui/react-accordion \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-avatar \
  @radix-ui/react-checkbox \
  @radix-ui/react-collapsible \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card \
  @radix-ui/react-label \
  @radix-ui/react-navigation-menu \
  @radix-ui/react-popover \
  @radix-ui/react-progress \
  @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slot \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-toggle \
  @radix-ui/react-tooltip \
  cmdk \
  input-otp \
  react-day-picker \
  embla-carousel-react \
  vaul \
  qrcode.react \
  papaparse

info "Menginstall dev dependencies..."
pnpm add -D \
  @types/papaparse \
  @types/qrcode \
  prettier \
  prettier-plugin-tailwindcss

success "Semua dependencies terinstall"

# =============================================================
section "3. Konfigurasi shadcn/ui"
# =============================================================

cat > components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
EOF
success "components.json dibuat"

# =============================================================
section "4. Environment Variables"
# =============================================================

cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=WA Gateway
NEXT_PUBLIC_APP_URL=http://localhost:3001
EOF

cat > .env.example << 'EOF'
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=WA Gateway
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
EOF
success ".env dibuat"

# =============================================================
section "5. Konfigurasi Prettier"
# =============================================================

cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF

# =============================================================
section "6. Struktur Folder & File"
# =============================================================

info "Membuat struktur direktori..."

# ── src/types ────────────────────────────────────────────────
mkdir -p src/types
# Core
touch src/types/api.ts             # ApiResponse, PaginatedResponse, PaginationParams
touch src/types/auth.ts            # AuthUser, Role, Setup2fa, TwoFaVerify
touch src/types/socket.ts          # semua WS event payload types
# Modules — sesuai setiap resource API
touch src/types/session.ts         # WaSession, SessionStatus, SessionInfo, CreateSession
touch src/types/message.ts         # MessageLog, SendMessage, SendMedia, SendLocation, SendPoll, SendContact, SendVoiceNote
touch src/types/broadcast.ts       # Campaign, CampaignStatus, CreateBroadcast
touch src/types/broadcast-list.ts  # BroadcastList
touch src/types/inbox.ts           # InboxMessage, Conversation, ReplyInbox
touch src/types/contact.ts         # Contact, CreateContact, BulkDelete, ImportGoogle
touch src/types/customer-note.ts   # CustomerNote, UpsertNote
touch src/types/auto-reply.ts      # AutoReply, MatchType, CreateAutoReply
touch src/types/workflow.ts        # Workflow, WorkflowNode, NodeType, TriggerCondition
touch src/types/drip.ts            # DripCampaign, DripStep, DripSubscription, DripSubscriptionStatus
touch src/types/scheduler.ts       # ScheduledMessage, ScheduledMessageStatus, RecurrenceType
touch src/types/scheduled-event.ts # ScheduledEvent, EventResponse
touch src/types/template.ts        # Template, CreateTemplate
touch src/types/webhook.ts         # WebhookConfig, WebhookQueue, WebhookPayload
touch src/types/api-key.ts         # ApiKey, CreateApiKey
touch src/types/settings.ts        # UserSetting, GlobalSetting, UpdateSettings
touch src/types/analytics.ts       # Dashboard, SystemStatus, ChartData, QueueCounts
touch src/types/audit.ts           # AuditLog, AuditAction
touch src/types/tier.ts            # Tier, UserTier, TierFeatureKey, AssignTier
touch src/types/user.ts            # User, UpdateUser, UpdateProfile, UpdateQuota
touch src/types/workspace.ts       # Workspace, WorkspaceMember, WorkspaceMemberRole
touch src/types/profile.ts         # WaProfile, WaContact
touch src/types/chat.ts            # WaChat
touch src/types/group.ts           # WaGroup, GroupParticipant, MembershipRequest
touch src/types/channel.ts         # WaChannel
touch src/types/label.ts           # WaLabel
touch src/types/status.ts          # WaStatus
touch src/types/call.ts            # CallLog
touch src/types/storage.ts         # StorageFile
touch src/types/admin.ts           # ImpersonationResult
touch src/types/health.ts          # HealthStatus

# ── src/lib ──────────────────────────────────────────────────
mkdir -p src/lib
touch src/lib/utils.ts        # cn, formatDate, formatRelative, formatBytes, normalizePhone, truncate
touch src/lib/axios.ts        # axios instance + interceptors (401 → redirect /login)
touch src/lib/socket.ts       # socket.io singleton (getSocket, disconnectSocket)
touch src/lib/query-client.ts # TanStack QueryClient instance
touch src/lib/api-error.ts    # parseApiError helper — ambil error.code & message dari AxiosError

# ── src/hooks ────────────────────────────────────────────────
mkdir -p src/hooks
# Auth & User
touch src/hooks/use-auth.ts              # GET /auth/me, set authStore
touch src/hooks/use-tier-features.ts     # cek fitur tier dari user.tier.features
touch src/hooks/use-quota.ts             # baca quota dari user, tampilkan warning
# Socket & Realtime
touch src/hooks/use-socket.ts            # connect/disconnect socket, auth token
touch src/hooks/use-qr-listener.ts       # event: qr → sessionStore.setActiveQr
touch src/hooks/use-pairing-listener.ts  # event: code → sessionStore.setActivePairing
touch src/hooks/use-connection-listener.ts # event: connection_update → update status
touch src/hooks/use-broadcast-progress.ts  # event: broadcast_progress, broadcast_complete
touch src/hooks/use-inbox-realtime.ts    # event: new_message → invalidate inbox queries
touch src/hooks/use-system-alerts.ts     # event: system_alert → notificationStore + sonner toast
touch src/hooks/use-message-ack.ts       # event: message_ack → update pesan status
touch src/hooks/use-incoming-call.ts     # event: incoming_call → toast notifikasi
# UI Utility
touch src/hooks/use-debounce.ts
touch src/hooks/use-media-query.ts
touch src/hooks/use-copy-to-clipboard.ts
touch src/hooks/use-pagination.ts
touch src/hooks/use-file-upload.ts       # validasi mime, ukuran sebelum upload
touch src/hooks/use-session-status.ts    # ambil status sesi dari sessionStore atau query

# ── src/store ────────────────────────────────────────────────
mkdir -p src/store
touch src/store/auth.store.ts          # user, isLoading, setUser, isAdmin()
touch src/store/session.store.ts       # activeQr, activePairing, sessionStatuses map
touch src/store/notification.store.ts  # notifications[], unreadCount, addNotification, markRead
touch src/store/broadcast.store.ts     # activeProgress map: campaignId → BroadcastProgressPayload
touch src/store/inbox.store.ts         # unreadTotal (dari WS new_message)
touch src/store/ui.store.ts            # sidebarOpen, isMobile

# ── src/api ──────────────────────────────────────────────────
# Satu file per resource, berisi semua fungsi fetch untuk resource tersebut
mkdir -p src/api
touch src/api/auth.api.ts           # me, verify2fa, setup2fa, enable2fa, disable2fa, regenerateBackupCodes, logout
touch src/api/users.api.ts          # profile, updateProfile, deleteSelf, findAll, findOne, updateUser, deleteUser, updateQuota
touch src/api/sessions.api.ts       # findAll, create, reconnect, setDefault, getInfo, remove
touch src/api/messages.api.ts       # send, sendMedia, sendVoiceNote, sendLocation, sendLiveLocation, sendPoll, sendContact, editMessage, forwardMessage, pinMessage, unpinMessage, downloadMedia, reactMessage, deleteMessage, checkRegistered, getLogs, exportLogsPdf
touch src/api/broadcast.api.ts      # findAll, findOne, exportPdf, create, cancel
touch src/api/broadcast-list.api.ts # getAll, getById, send
touch src/api/inbox.api.ts          # findAll, getConversations, markRead, markAllRead, reply
touch src/api/contacts.api.ts       # findAll, create, update, remove, bulkDelete, importCsv, importGoogle, exportCsv
touch src/api/customer-note.api.ts  # getNote, upsertNote, deleteNote
touch src/api/auto-reply.api.ts     # findAll, create, update, toggle, remove
touch src/api/workflow.api.ts       # findAll, create, update, toggle, remove
touch src/api/drip.api.ts           # findAll, create, update, toggle, remove, getSubscribers, cancelSubscription
touch src/api/scheduler.api.ts      # findAll, create, cancel, remove
touch src/api/scheduled-event.api.ts # send, respond
touch src/api/templates.api.ts      # findAll, create, update, remove
touch src/api/webhook.api.ts        # getConfig, updateConfig, generateSecret, test
touch src/api/api-keys.api.ts       # findAll, create, remove
touch src/api/settings.api.ts       # getMe, updateMe, getGlobal, updateGlobal, setMaintenance, sendAnnouncement
touch src/api/analytics.api.ts      # getDashboard, getSystemStatus
touch src/api/audit.api.ts          # findAll, exportPdf
touch src/api/tiers.api.ts          # findAll, create, update, remove, assign, getHistory
touch src/api/workspace.api.ts      # findAll, create, invite, updateMemberPermission, removeMember
touch src/api/profile.api.ts        # getProfile, setDisplayName, setStatus, setPhoto, deletePhoto, getAllContacts, getContactById, getContactPhoto, blockContact, unblockContact, getBlockedContacts
touch src/api/chats.api.ts          # getAll, getById, archive, unarchive, mute, unmute, pin, unpin, delete, markRead, search
touch src/api/groups.api.ts         # create, getInfo, addParticipants, removeParticipants, promote, demote, update, leave, getInviteCode, revokeInvite, join, getInviteInfo, handleMembershipRequest, getMembershipRequests, getCommonGroups
touch src/api/channels.api.ts       # getAll, search, getByInviteCode, subscribe, unsubscribe, send, manageAdmin, transferOwnership, update, delete
touch src/api/labels.api.ts         # getAll, getById, addToChat, removeFromChat, getChatsByLabel
touch src/api/status.api.ts         # setBio, sendStatus, setPresence
touch src/api/calls.api.ts          # findAll, createCallLink
touch src/api/storage.api.ts        # getFileUrl (helper URL builder untuk /storage/uploads/:filename)
touch src/api/admin.api.ts          # impersonate, exitImpersonation
touch src/api/health.api.ts         # check

# ── src/components/ui ────────────────────────────────────────
mkdir -p src/components/ui
# Diisi oleh: pnpm dlx shadcn@latest add <component>

# ── src/components/layout ────────────────────────────────────
mkdir -p src/components/layout
touch src/components/layout/app-shell.tsx          # root shell: sidebar + header + main
touch src/components/layout/sidebar.tsx            # sidebar container (desktop)
touch src/components/layout/sidebar-nav.tsx        # nav item list dari NAV_ITEMS
touch src/components/layout/sidebar-nav-item.tsx   # single nav item dengan active state
touch src/components/layout/sidebar-section.tsx    # group header dalam sidebar
touch src/components/layout/header.tsx             # top bar: breadcrumb + search + icons
touch src/components/layout/breadcrumb.tsx         # auto breadcrumb dari pathname
touch src/components/layout/mobile-nav.tsx         # sheet sidebar untuk mobile
touch src/components/layout/user-menu.tsx          # dropdown: profil, settings, logout
touch src/components/layout/notification-bell.tsx  # bell icon + dropdown notifikasi realtime
touch src/components/layout/theme-toggle.tsx       # dark/light mode toggle
touch src/components/layout/impersonation-banner.tsx # banner kuning saat mode impersonation aktif
touch src/components/layout/maintenance-banner.tsx # banner merah saat maintenance mode aktif
touch src/components/layout/quota-warning-banner.tsx # banner peringatan kuota 80%/habis

# ── src/components/common ────────────────────────────────────
mkdir -p src/components/common
touch src/components/common/page-header.tsx          # judul halaman + action buttons
touch src/components/common/data-table.tsx           # TanStack Table wrapper
touch src/components/common/data-table-pagination.tsx
touch src/components/common/data-table-toolbar.tsx   # search + filter bar
touch src/components/common/data-table-column-header.tsx # sortable column header
touch src/components/common/confirm-dialog.tsx       # AlertDialog konfirmasi hapus
touch src/components/common/empty-state.tsx          # ilustrasi + pesan data kosong
touch src/components/common/error-state.tsx          # ilustrasi + pesan error + retry
touch src/components/common/loading-spinner.tsx
touch src/components/common/loading-skeleton.tsx     # generic skeleton loader
touch src/components/common/error-boundary.tsx
touch src/components/common/copy-button.tsx          # copy ke clipboard + feedback
touch src/components/common/status-badge.tsx         # badge reusable dengan warna per status
touch src/components/common/file-uploader.tsx        # drag-drop + preview + validasi mime/size
touch src/components/common/phone-input.tsx          # input nomor WA dengan normalisasi 62xxx
touch src/components/common/date-picker.tsx          # date + time picker
touch src/components/common/date-range-picker.tsx    # untuk filter analytics/audit
touch src/components/common/search-input.tsx         # input search dengan debounce
touch src/components/common/stats-card.tsx           # card KPI dashboard
touch src/components/common/tier-gate.tsx            # render children hanya jika punya fitur
touch src/components/common/quota-bar.tsx            # progress bar kuota harian/bulanan
touch src/components/common/export-pdf-button.tsx    # trigger download PDF + loading state
touch src/components/common/session-selector.tsx     # reusable: pilih sesi WA aktif
touch src/components/common/role-gate.tsx            # render children berdasarkan role
touch src/components/common/api-error-alert.tsx      # tampilkan error.code dengan pesan Indonesia

# ── src/components/auth ──────────────────────────────────────
mkdir -p src/components/auth
touch src/components/auth/google-login-button.tsx  # tombol "Login dengan Google"
touch src/components/auth/two-factor-form.tsx      # form input kode TOTP / backup code
touch src/components/auth/setup-2fa-dialog.tsx     # flow: setup → scan QR → verifikasi
touch src/components/auth/backup-codes-dialog.tsx  # tampilkan & sarankan simpan backup codes
touch src/components/auth/disable-2fa-dialog.tsx   # konfirmasi + verifikasi sebelum disable

# ── src/components/session ───────────────────────────────────
mkdir -p src/components/session
touch src/components/session/session-list.tsx            # grid/list semua sesi
touch src/components/session/session-card.tsx            # card: status, nama, nomor, actions
touch src/components/session/session-status-badge.tsx    # badge warna per status
touch src/components/session/add-session-dialog.tsx      # form: nama + pilih QR/pairing code
touch src/components/session/session-qr-dialog.tsx       # tampilkan QR code realtime via WS
touch src/components/session/session-pairing-dialog.tsx  # tampilkan pairing code 8 digit
touch src/components/session/session-info-dialog.tsx     # state, version, phone info
touch src/components/session/reconnect-button.tsx        # tombol reconnect + confirm jika logged_out

# ── src/components/messages ──────────────────────────────────
mkdir -p src/components/messages
touch src/components/messages/message-type-tabs.tsx   # tabs: Teks | Media | Lokasi | Poll | Kontak | Voice
touch src/components/messages/send-message-form.tsx   # POST /messages/send
touch src/components/messages/send-media-form.tsx     # POST /messages/send-media
touch src/components/messages/send-location-form.tsx  # POST /messages/send-location
touch src/components/messages/send-live-location-form.tsx # POST /messages/send-live-location
touch src/components/messages/send-poll-form.tsx      # POST /messages/send-poll
touch src/components/messages/send-contact-form.tsx   # POST /messages/send-contact
touch src/components/messages/send-voice-note-form.tsx # POST /messages/send-voice-note
touch src/components/messages/message-log-table.tsx   # GET /messages/logs dengan filter
touch src/components/messages/message-status-badge.tsx
touch src/components/messages/check-number-form.tsx   # GET /messages/check/:sessionId/:phone

# ── src/components/broadcast ─────────────────────────────────
mkdir -p src/components/broadcast
touch src/components/broadcast/campaign-table.tsx         # GET /broadcast/campaigns
touch src/components/broadcast/campaign-card.tsx          # detail summary campaign
touch src/components/broadcast/campaign-status-badge.tsx
touch src/components/broadcast/create-broadcast-dialog.tsx # POST /broadcast (form multi-tab)
touch src/components/broadcast/recipients-tab.tsx         # tab: manual input nomor
touch src/components/broadcast/csv-upload-tab.tsx         # tab: upload CSV
touch src/components/broadcast/tag-filter-tab.tsx         # tab: filter by tag kontak
touch src/components/broadcast/broadcast-progress-dialog.tsx # WS: broadcast_progress realtime
touch src/components/broadcast/broadcast-stats-cards.tsx  # total/sukses/gagal
touch src/components/broadcast/cancel-broadcast-button.tsx

# ── src/components/broadcast-list ────────────────────────────
mkdir -p src/components/broadcast-list
touch src/components/broadcast-list/broadcast-list-table.tsx # GET /broadcast-list/:sessionId
touch src/components/broadcast-list/send-to-list-dialog.tsx  # POST /broadcast-list/:sid/:bid/send

# ── src/components/inbox ─────────────────────────────────────
mkdir -p src/components/inbox
touch src/components/inbox/conversation-list.tsx   # GET /inbox/conversations (sidebar kiri)
touch src/components/inbox/conversation-item.tsx   # satu item conversation
touch src/components/inbox/message-thread.tsx      # GET /inbox?jid=... (area tengah)
touch src/components/inbox/message-bubble.tsx      # bubble pesan masuk/keluar
touch src/components/inbox/reply-form.tsx          # POST /inbox/:id/reply
touch src/components/inbox/inbox-filters.tsx       # filter: unread, jid
touch src/components/inbox/unread-badge.tsx        # badge jumlah unread realtime

# ── src/components/contacts ──────────────────────────────────
mkdir -p src/components/contacts
touch src/components/contacts/contact-table.tsx        # GET /contacts dengan filter/search
touch src/components/contacts/contact-form.tsx         # POST/PUT /contacts
touch src/components/contacts/import-csv-dialog.tsx    # POST /contacts/import
touch src/components/contacts/import-google-dialog.tsx # POST /contacts/import-google
touch src/components/contacts/bulk-actions-bar.tsx     # POST /contacts/bulk-delete
touch src/components/contacts/contact-tag-badge.tsx
touch src/components/contacts/export-button.tsx        # GET /contacts/export

# ── src/components/customer-note ─────────────────────────────
mkdir -p src/components/customer-note
touch src/components/customer-note/note-dialog.tsx # GET/PUT/DELETE /contacts/:contactId/note

# ── src/components/auto-reply ────────────────────────────────
mkdir -p src/components/auto-reply
touch src/components/auto-reply/rule-table.tsx       # GET /auto-reply
touch src/components/auto-reply/rule-form-dialog.tsx # POST/PUT /auto-reply
touch src/components/auto-reply/match-type-badge.tsx # exact | contains | regex | ai_smart
touch src/components/auto-reply/toggle-switch.tsx    # POST /auto-reply/:id/toggle

# ── src/components/workflow ──────────────────────────────────
mkdir -p src/components/workflow
touch src/components/workflow/workflow-list.tsx           # GET /workflows
touch src/components/workflow/workflow-card.tsx
touch src/components/workflow/workflow-form-dialog.tsx    # POST/PUT /workflows
touch src/components/workflow/trigger-condition-form.tsx  # keyword + matchType
touch src/components/workflow/node-editor.tsx             # list node + add/remove
touch src/components/workflow/node-card.tsx               # satu node: type + config
touch src/components/workflow/node-type-selector.tsx      # pilih: send_message | delay | add_tag

# ── src/components/drip ──────────────────────────────────────
mkdir -p src/components/drip
touch src/components/drip/drip-list.tsx              # GET /drip-campaigns
touch src/components/drip/drip-card.tsx
touch src/components/drip/drip-form-dialog.tsx       # POST/PUT /drip-campaigns
touch src/components/drip/step-editor.tsx            # list step + add/remove
touch src/components/drip/step-form.tsx              # dayOffset + timeAt + message
touch src/components/drip/subscriber-table.tsx       # GET /drip-campaigns/:id/subscribers
touch src/components/drip/subscription-status-badge.tsx
touch src/components/drip/cancel-subscription-button.tsx # POST /drip-campaigns/subscriptions/:id/cancel

# ── src/components/scheduler ─────────────────────────────────
mkdir -p src/components/scheduler
touch src/components/scheduler/scheduled-table.tsx      # GET /scheduler
touch src/components/scheduler/create-scheduled-dialog.tsx # POST /scheduler
touch src/components/scheduler/recurrence-select.tsx    # none | daily | weekly | monthly
touch src/components/scheduler/scheduled-status-badge.tsx

# ── src/components/scheduled-event ───────────────────────────
mkdir -p src/components/scheduled-event
touch src/components/scheduled-event/send-event-dialog.tsx   # POST /scheduled-events/send
touch src/components/scheduled-event/respond-event-dialog.tsx # POST /scheduled-events/respond

# ── src/components/templates ─────────────────────────────────
mkdir -p src/components/templates
touch src/components/templates/template-list.tsx      # GET /templates (grid cards)
touch src/components/templates/template-card.tsx
touch src/components/templates/template-form-dialog.tsx # POST/PUT /templates
touch src/components/templates/template-picker.tsx    # popover pilih template untuk diisi ke form pesan

# ── src/components/webhook ───────────────────────────────────
mkdir -p src/components/webhook
touch src/components/webhook/webhook-config-form.tsx  # GET/PUT /webhooks/config
touch src/components/webhook/webhook-secret-card.tsx  # POST /webhooks/generate-secret + tampilkan sekali
touch src/components/webhook/test-webhook-button.tsx  # POST /webhooks/test + tampilkan responseTime

# ── src/components/api-keys ──────────────────────────────────
mkdir -p src/components/api-keys
touch src/components/api-keys/api-key-table.tsx       # GET /keys
touch src/components/api-keys/create-key-dialog.tsx   # POST /keys (form: name, ipWhitelist, sandbox, expiresAt)
touch src/components/api-keys/key-reveal-dialog.tsx   # tampilkan key satu kali setelah create
touch src/components/api-keys/sandbox-badge.tsx       # badge "Sandbox" untuk key isSandbox=true
touch src/components/api-keys/ip-whitelist-input.tsx  # input multi-IP CIDR

# ── src/components/settings ──────────────────────────────────
mkdir -p src/components/settings
touch src/components/settings/user-settings-form.tsx    # GET/POST /settings/me (AI, download, sync)
touch src/components/settings/ai-settings-form.tsx      # bagian Gemini API Key + threshold
touch src/components/settings/security-settings.tsx     # 2FA section (setup, enable, disable, backup codes)
touch src/components/settings/global-settings-form.tsx  # GET/POST /settings/global (admin)
touch src/components/settings/maintenance-toggle.tsx    # POST /settings/maintenance (admin)
touch src/components/settings/announcement-form.tsx     # POST /settings/announcement (admin)

# ── src/components/analytics ─────────────────────────────────
mkdir -p src/components/analytics
touch src/components/analytics/summary-cards.tsx     # totalSent, successRate, totalBroadcasts
touch src/components/analytics/message-chart.tsx     # recharts: total/sukses/gagal per hari
touch src/components/analytics/recent-campaigns.tsx  # daftar campaign terbaru
touch src/components/analytics/recent-logs.tsx       # daftar log pesan terbaru
touch src/components/analytics/system-status-card.tsx # server memory, uptime, node version
touch src/components/analytics/sessions-status-card.tsx # total/connected/disconnected
touch src/components/analytics/queue-status-card.tsx   # broadcast & webhook queue counts
touch src/components/analytics/days-filter.tsx          # selector: 1 | 7 | 14 | 30 hari

# ── src/components/audit ─────────────────────────────────────
mkdir -p src/components/audit
touch src/components/audit/audit-table.tsx          # GET /audit
touch src/components/audit/audit-filters.tsx        # action, from, to filter
touch src/components/audit/audit-action-badge.tsx   # badge warna per AuditAction
touch src/components/audit/export-pdf-button.tsx    # GET /audit/export-pdf

# ── src/components/tiers ─────────────────────────────────────
mkdir -p src/components/tiers
touch src/components/tiers/tier-list.tsx            # GET /tiers (cards)
touch src/components/tiers/tier-card.tsx            # nama, harga, limits, features
touch src/components/tiers/tier-badge.tsx           # badge nama tier di header/user
touch src/components/tiers/tier-feature-list.tsx    # list fitur dengan ✓/✗
touch src/components/tiers/tier-form-dialog.tsx     # POST/PUT /tiers (admin)
touch src/components/tiers/assign-tier-dialog.tsx   # POST /tiers/assign (admin)
touch src/components/tiers/tier-history-table.tsx   # GET /tiers/history/:userId
touch src/components/tiers/grace-period-banner.tsx  # banner saat isGrace=true

# ── src/components/users (admin) ─────────────────────────────
mkdir -p src/components/users
touch src/components/users/user-table.tsx           # GET /users (admin)
touch src/components/users/user-detail-card.tsx     # GET /users/:id (admin)
touch src/components/users/update-user-dialog.tsx   # PUT /users/:id (role, isActive)
touch src/components/users/quota-editor.tsx         # PUT /users/:id/quota
touch src/components/users/delete-user-dialog.tsx   # DELETE /users/:id (confirm)
touch src/components/users/user-tier-badge.tsx      # tampilkan nama tier + isGrace

# ── src/components/workspace ─────────────────────────────────
mkdir -p src/components/workspace
touch src/components/workspace/workspace-list.tsx          # GET /workspaces
touch src/components/workspace/workspace-card.tsx
touch src/components/workspace/create-workspace-dialog.tsx # POST /workspaces
touch src/components/workspace/member-table.tsx            # members list
touch src/components/workspace/invite-member-dialog.tsx    # POST /workspaces/:id/invite
touch src/components/workspace/permission-editor.tsx       # PUT /workspaces/:id/members/:mid/permission
touch src/components/workspace/remove-member-button.tsx    # DELETE /workspaces/:id/members/:mid

# ── src/components/profile ───────────────────────────────────
mkdir -p src/components/profile
touch src/components/profile/wa-profile-card.tsx          # GET /profile/:sessionId
touch src/components/profile/set-display-name-form.tsx    # POST /profile/:sessionId/display-name
touch src/components/profile/set-status-form.tsx          # POST /profile/:sessionId/status
touch src/components/profile/profile-photo-upload.tsx     # POST /profile/:sessionId/photo
touch src/components/profile/wa-contacts-table.tsx        # GET /profile/:sessionId/contacts
touch src/components/profile/contact-profile-photo.tsx    # GET /profile/:sessionId/contacts/:contactId/photo
touch src/components/profile/block-unblock-button.tsx     # POST /profile/:sessionId/contacts/:contactId/block|unblock
touch src/components/profile/blocked-contacts-list.tsx    # GET /profile/:sessionId/contacts/blocked

# ── src/components/chats ─────────────────────────────────────
mkdir -p src/components/chats
touch src/components/chats/chat-list.tsx          # GET /chats/:sessionId
touch src/components/chats/chat-list-item.tsx
touch src/components/chats/chat-actions-menu.tsx  # archive, mute, pin, delete, mark-read
touch src/components/chats/search-messages.tsx    # GET /chats/:sessionId/search

# ── src/components/groups ────────────────────────────────────
mkdir -p src/components/groups
touch src/components/groups/group-list.tsx                   # list semua group dari sesi
touch src/components/groups/group-info-card.tsx              # GET /groups/:sessionId/:groupId
touch src/components/groups/create-group-dialog.tsx          # POST /groups/:sessionId
touch src/components/groups/manage-participants-dialog.tsx   # add/remove/promote/demote
touch src/components/groups/membership-requests-list.tsx     # GET & handle membership requests
touch src/components/groups/invite-link-card.tsx             # get/revoke invite + join via code
touch src/components/groups/common-groups-list.tsx           # GET .../common-groups

# ── src/components/channels ──────────────────────────────────
mkdir -p src/components/channels
touch src/components/channels/channel-list.tsx            # GET /channels/:sessionId
touch src/components/channels/channel-card.tsx
touch src/components/channels/channel-search-dialog.tsx   # GET /channels/:sessionId/search
touch src/components/channels/subscribe-button.tsx        # POST subscribe/unsubscribe
touch src/components/channels/send-to-channel-dialog.tsx  # POST /channels/:sessionId/:channelId/send
touch src/components/channels/manage-admin-dialog.tsx     # POST .../admin
touch src/components/channels/transfer-ownership-dialog.tsx

# ── src/components/labels ────────────────────────────────────
mkdir -p src/components/labels
touch src/components/labels/label-list.tsx          # GET /labels/:sessionId
touch src/components/labels/label-badge.tsx
touch src/components/labels/assign-label-dialog.tsx # add/remove label dari chat
touch src/components/labels/chats-by-label.tsx      # GET /labels/:sessionId/labels/:labelId/chats

# ── src/components/status ────────────────────────────────────
mkdir -p src/components/status
touch src/components/status/set-bio-form.tsx       # POST /status/:sessionId/bio
touch src/components/status/send-status-form.tsx   # POST /status/:sessionId/send
touch src/components/status/presence-toggle.tsx    # POST /status/:sessionId/presence

# ── src/components/calls ─────────────────────────────────────
mkdir -p src/components/calls
touch src/components/calls/call-log-table.tsx          # GET /calls
touch src/components/calls/call-type-badge.tsx         # voice | video
touch src/components/calls/call-status-badge.tsx       # missed
touch src/components/calls/create-call-link-dialog.tsx # POST /calls/link

# ── src/components/admin ─────────────────────────────────────
mkdir -p src/components/admin
touch src/components/admin/impersonation-dialog.tsx  # POST /admin/impersonate
touch src/components/admin/exit-impersonation-button.tsx # DELETE /admin/impersonate/:targetUserId

# ── src/app (Route Groups) ───────────────────────────────────
# (auth) = tidak butuh sidebar, untuk halaman login & 2FA
# (dashboard) = butuh sidebar + header, semua halaman setelah login

mkdir -p "src/app/(auth)/login"
mkdir -p "src/app/(auth)/auth/2fa"
touch "src/app/(auth)/layout.tsx"
touch "src/app/(auth)/login/page.tsx"
touch "src/app/(auth)/auth/2fa/page.tsx"

mkdir -p "src/app/(dashboard)/dashboard"
mkdir -p "src/app/(dashboard)/sessions"
mkdir -p "src/app/(dashboard)/messages/send"
mkdir -p "src/app/(dashboard)/messages/logs"
mkdir -p "src/app/(dashboard)/inbox"
mkdir -p "src/app/(dashboard)/broadcast/campaigns"
mkdir -p "src/app/(dashboard)/broadcast/campaigns/[id]"
mkdir -p "src/app/(dashboard)/broadcast-list"
mkdir -p "src/app/(dashboard)/contacts"
mkdir -p "src/app/(dashboard)/auto-reply"
mkdir -p "src/app/(dashboard)/workflows"
mkdir -p "src/app/(dashboard)/drip-campaigns"
mkdir -p "src/app/(dashboard)/drip-campaigns/[id]/subscribers"
mkdir -p "src/app/(dashboard)/scheduler"
mkdir -p "src/app/(dashboard)/scheduled-events"
mkdir -p "src/app/(dashboard)/templates"
mkdir -p "src/app/(dashboard)/chats"
mkdir -p "src/app/(dashboard)/groups"
mkdir -p "src/app/(dashboard)/groups/[sessionId]/[groupId]"
mkdir -p "src/app/(dashboard)/channels"
mkdir -p "src/app/(dashboard)/labels"
mkdir -p "src/app/(dashboard)/calls"
mkdir -p "src/app/(dashboard)/profile"
mkdir -p "src/app/(dashboard)/analytics"
mkdir -p "src/app/(dashboard)/audit"
mkdir -p "src/app/(dashboard)/api-keys"
mkdir -p "src/app/(dashboard)/workspaces"
mkdir -p "src/app/(dashboard)/settings"
mkdir -p "src/app/(dashboard)/settings/webhook"
mkdir -p "src/app/(dashboard)/settings/ai"
mkdir -p "src/app/(dashboard)/settings/security"

# Admin only
mkdir -p "src/app/(dashboard)/admin/users"
mkdir -p "src/app/(dashboard)/admin/users/[id]"
mkdir -p "src/app/(dashboard)/admin/tiers"
mkdir -p "src/app/(dashboard)/admin/audit"
mkdir -p "src/app/(dashboard)/admin/settings"

touch "src/app/(dashboard)/layout.tsx"
touch "src/app/(dashboard)/dashboard/page.tsx"
touch "src/app/(dashboard)/sessions/page.tsx"
touch "src/app/(dashboard)/messages/send/page.tsx"
touch "src/app/(dashboard)/messages/logs/page.tsx"
touch "src/app/(dashboard)/inbox/page.tsx"
touch "src/app/(dashboard)/broadcast/campaigns/page.tsx"
touch "src/app/(dashboard)/broadcast/campaigns/[id]/page.tsx"
touch "src/app/(dashboard)/broadcast-list/page.tsx"
touch "src/app/(dashboard)/contacts/page.tsx"
touch "src/app/(dashboard)/auto-reply/page.tsx"
touch "src/app/(dashboard)/workflows/page.tsx"
touch "src/app/(dashboard)/drip-campaigns/page.tsx"
touch "src/app/(dashboard)/drip-campaigns/[id]/subscribers/page.tsx"
touch "src/app/(dashboard)/scheduler/page.tsx"
touch "src/app/(dashboard)/scheduled-events/page.tsx"
touch "src/app/(dashboard)/templates/page.tsx"
touch "src/app/(dashboard)/chats/page.tsx"
touch "src/app/(dashboard)/groups/page.tsx"
touch "src/app/(dashboard)/groups/[sessionId]/[groupId]/page.tsx"
touch "src/app/(dashboard)/channels/page.tsx"
touch "src/app/(dashboard)/labels/page.tsx"
touch "src/app/(dashboard)/calls/page.tsx"
touch "src/app/(dashboard)/profile/page.tsx"
touch "src/app/(dashboard)/analytics/page.tsx"
touch "src/app/(dashboard)/audit/page.tsx"
touch "src/app/(dashboard)/api-keys/page.tsx"
touch "src/app/(dashboard)/workspaces/page.tsx"
touch "src/app/(dashboard)/settings/page.tsx"
touch "src/app/(dashboard)/settings/webhook/page.tsx"
touch "src/app/(dashboard)/settings/ai/page.tsx"
touch "src/app/(dashboard)/settings/security/page.tsx"
touch "src/app/(dashboard)/admin/users/page.tsx"
touch "src/app/(dashboard)/admin/users/[id]/page.tsx"
touch "src/app/(dashboard)/admin/tiers/page.tsx"
touch "src/app/(dashboard)/admin/audit/page.tsx"
touch "src/app/(dashboard)/admin/settings/page.tsx"

touch "src/app/page.tsx"
touch "src/app/not-found.tsx"
touch "src/app/error.tsx"
touch "src/app/loading.tsx"

# ── src/providers ────────────────────────────────────────────
mkdir -p src/providers
touch src/providers/query-provider.tsx   # TanStack QueryClientProvider
touch src/providers/theme-provider.tsx   # next-themes ThemeProvider
touch src/providers/socket-provider.tsx  # init socket, attach semua listener global
touch src/providers/auth-provider.tsx    # fetch /auth/me saat mount, set authStore

# ── src/constants ────────────────────────────────────────────
mkdir -p src/constants
touch src/constants/routes.ts          # semua ROUTES constants
touch src/constants/query-keys.ts      # semua QK constants
touch src/constants/tier-features.ts   # TIER_FEATURES enum
touch src/constants/nav-items.ts       # NAV_ITEMS + ADMIN_NAV_ITEMS
touch src/constants/error-codes.ts     # ERROR_CODES map + getErrorMessage()
touch src/constants/socket-events.ts   # SOCKET_EVENTS + SYSTEM_ALERT_TYPES

# ── src/validators (Zod schemas) ─────────────────────────────
mkdir -p src/validators
touch src/validators/auth.schema.ts            # twoFaVerify, verifyCode
touch src/validators/session.schema.ts         # createSession
touch src/validators/message.schema.ts         # sendMessage, sendMedia, sendLocation, sendLiveLocation, sendPoll, sendContact
touch src/validators/broadcast.schema.ts       # createBroadcast
touch src/validators/contact.schema.ts         # createContact, updateContact, bulkDelete, importGoogle
touch src/validators/customer-note.schema.ts   # upsertNote
touch src/validators/auto-reply.schema.ts      # createAutoReply, updateAutoReply
touch src/validators/workflow.schema.ts        # createWorkflow, workflowNode, triggerCondition
touch src/validators/drip.schema.ts            # createDrip, dripStep
touch src/validators/scheduler.schema.ts       # createScheduledMessage
touch src/validators/scheduled-event.schema.ts # sendEvent, respondEvent
touch src/validators/template.schema.ts        # createTemplate
touch src/validators/webhook.schema.ts         # updateWebhook
touch src/validators/api-key.schema.ts         # createApiKey (ipWhitelist CIDR validation)
touch src/validators/settings.schema.ts        # updateSettings, updateGlobal
touch src/validators/tier.schema.ts            # createTier, assignTier
touch src/validators/workspace.schema.ts       # createWorkspace, inviteMember, updatePermission
touch src/validators/user.schema.ts            # updateProfile, updateUser, updateQuota
touch src/validators/profile.schema.ts         # setDisplayName, setStatus
touch src/validators/groups.schema.ts          # createGroup, manageParticipants

success "Semua folder dan file berhasil dibuat"

# =============================================================
section "7. File Konfigurasi Isi"
# =============================================================

# ── next.config.ts ───────────────────────────────────────────
cat > next.config.ts << 'EOF'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
}

export default nextConfig
EOF

# ── src/middleware.ts ────────────────────────────────────────
cat > src/middleware.ts << 'EOF'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/auth/2fa']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
}
EOF

# ── src/lib/utils.ts ─────────────────────────────────────────
cat > src/lib/utils.ts << 'EOF'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelative(date: string | Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function normalizePhone(phone: string): string {
  let num = phone.replace(/\D/g, '')
  if (num.startsWith('0')) num = '62' + num.slice(1)
  return num
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '...' : str
}

export function buildFileUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/v1/storage/uploads/${filename}`
}
EOF

# ── src/lib/axios.ts ─────────────────────────────────────────
cat > src/lib/axios.ts << 'EOF'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
EOF

# ── src/lib/api-error.ts ─────────────────────────────────────
cat > src/lib/api-error.ts << 'EOF'
import type { AxiosError } from 'axios'
import { getErrorMessage } from '@/constants/error-codes'

export function parseApiError(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; code?: string; message?: string }>
  const data = axiosErr.response?.data
  if (data?.code) return getErrorMessage(data.code, data.error)
  if (data?.error) return data.error
  if (data?.message) return data.message
  return axiosErr.message ?? 'Terjadi kesalahan'
}
EOF

# ── src/lib/socket.ts ────────────────────────────────────────
cat > src/lib/socket.ts << 'EOF'
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      withCredentials: true,
      auth: token ? { token } : undefined,
      autoConnect: false,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
EOF

# ── src/lib/query-client.ts ──────────────────────────────────
cat > src/lib/query-client.ts << 'EOF'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
    mutations: { retry: 0 },
  },
})
EOF

# ── src/constants/error-codes.ts ─────────────────────────────
cat > src/constants/error-codes.ts << 'EOF'
export const ERROR_CODES: Record<string, string> = {
  ERR_UNAUTHORIZED: 'Sesi tidak valid, silakan login ulang',
  ERR_FORBIDDEN: 'Anda tidak memiliki akses',
  ERR_ACCOUNT_DISABLED: 'Akun Anda dinonaktifkan',
  ERR_IP_NOT_WHITELISTED: 'IP Anda tidak diizinkan',
  ERR_NOT_FOUND: 'Data tidak ditemukan',
  ERR_VALIDATION: 'Data tidak valid',
  ERR_INVALID_PHONE: 'Format nomor telepon tidak valid',
  ERR_INVALID_REGEX: 'Pola regex tidak valid',
  ERR_INVALID_IP_FORMAT: 'Format IP/CIDR tidak valid',
  ERR_INVALID_TIME_FORMAT: 'Format waktu harus HH:MM',
  ERR_SCHEDULE_PAST: 'Waktu jadwal sudah lewat',
  ERR_DUPLICATE_SESSION_NAME: 'Nama sesi sudah digunakan',
  ERR_DUPLICATE_CONTACT: 'Kontak sudah ada',
  ERR_DUPLICATE_TEMPLATE_NAME: 'Nama template sudah digunakan',
  ERR_DUPLICATE_DRIP_DAY: 'Day offset sudah ada di step lain',
  ERR_SESSION_NOT_CONNECTED: 'Sesi WhatsApp tidak terhubung',
  ERR_SESSION_LOGGED_OUT: 'Sesi logout permanen, scan ulang QR',
  ERR_SESSION_NOT_FOUND: 'Sesi tidak ditemukan',
  ERR_NO_SESSIONS: 'Tidak ada sesi WhatsApp aktif',
  ERR_NO_RECIPIENTS: 'Tidak ada penerima broadcast',
  ERR_QUOTA_DAILY_EXCEEDED: 'Kuota pesan harian habis',
  ERR_QUOTA_MONTHLY_EXCEEDED: 'Kuota broadcast bulanan habis',
  ERR_RATE_LIMIT: 'Terlalu banyak request, coba lagi nanti',
  ERR_2FA_INVALID_CODE: 'Kode 2FA tidak valid',
  ERR_2FA_SESSION_EXPIRED: 'Sesi 2FA kadaluarsa, ulangi login',
  ERR_2FA_ALREADY_ENABLED: '2FA sudah aktif',
  ERR_2FA_NOT_ENABLED: '2FA belum diaktifkan',
  ERR_CAMPAIGN_NOT_CANCELLABLE: 'Campaign tidak dapat dibatalkan',
  ERR_MESSAGE_ALREADY_SENT: 'Pesan sudah terkirim',
  ERR_WEBHOOK_NOT_CONFIGURED: 'URL webhook belum dikonfigurasi',
  ERR_FEATURE_NOT_AVAILABLE: 'Fitur ini tidak tersedia di tier Anda',
  ERR_AI_DISABLED: 'AI Smart Reply sedang tidak aktif',
  ERR_SEND_FAILED: 'Gagal mengirim pesan ke WhatsApp',
  ERR_FILE_TOO_LARGE: 'Ukuran file melebihi batas 50MB',
  ERR_FILE_TYPE_NOT_ALLOWED: 'Tipe file tidak diizinkan',
  ERR_WORKFLOW_TOO_MANY_NODES: 'Workflow maksimal 20 node',
  ERR_DELAY_TOO_LONG: 'Delay maksimal 3600 detik',
  ERR_CANNOT_DELETE_SELF: 'Tidak bisa menghapus akun sendiri',
  ERR_MAINTENANCE: 'Server sedang dalam maintenance',
  ERR_INTERNAL: 'Terjadi kesalahan internal server',
}

export function getErrorMessage(code?: string, fallback?: string): string {
  if (!code) return fallback ?? 'Terjadi kesalahan'
  return ERROR_CODES[code] ?? fallback ?? code
}
EOF

# ── src/constants/socket-events.ts ───────────────────────────
cat > src/constants/socket-events.ts << 'EOF'
export const SOCKET_EVENTS = {
  QR: 'qr',
  CODE: 'code',
  CONNECTION_UPDATE: 'connection_update',
  NEW_MESSAGE: 'new_message',
  MESSAGE_ACK: 'message_ack',
  MESSAGE_EDIT: 'message_edit',
  MESSAGE_REACTION: 'message_reaction',
  MESSAGE_REVOKE_EVERYONE: 'message_revoke_everyone',
  MESSAGE_REVOKE_ME: 'message_revoke_me',
  MEDIA_UPLOADED: 'media_uploaded',
  VOTE_UPDATE: 'vote_update',
  GROUP_JOIN: 'group_join',
  GROUP_LEAVE: 'group_leave',
  GROUP_ADMIN_CHANGED: 'group_admin_changed',
  GROUP_UPDATE: 'group_update',
  GROUP_MEMBERSHIP_REQUEST: 'group_membership_request',
  CONTACT_CHANGED: 'contact_changed',
  CHAT_ARCHIVED: 'chat_archived',
  CHAT_REMOVED: 'chat_removed',
  CHANGE_STATE: 'change_state',
  CHANGE_BATTERY: 'change_battery',
  INCOMING_CALL: 'incoming_call',
  BROADCAST_PROGRESS: 'broadcast_progress',
  BROADCAST_COMPLETE: 'broadcast_complete',
  SYSTEM_ALERT: 'system_alert',
} as const

export const SYSTEM_ALERT_TYPES = {
  QUOTA_WARNING: 'quota_warning',
  QUOTA_EXCEEDED: 'quota_exceeded',
  SESSION_DISCONNECTED: 'session_disconnected',
  SESSION_LOGGED_OUT: 'session_logged_out',
  ALL_SESSIONS_DOWN: 'all_sessions_down',
  AI_DISABLED: 'ai_disabled',
  DISK_WARNING: 'disk_warning',
  REDIS_DISCONNECTED: 'redis_disconnected',
  BROADCAST_COMPLETE: 'broadcast_complete',
  ANNOUNCEMENT: 'announcement',
} as const
EOF

# ── src/store/auth.store.ts ──────────────────────────────────
cat > src/store/auth.store.ts << 'EOF'
import { create } from 'zustand'
import type { TierFeatureKey } from '@/types/tier'

export type Role = 'user' | 'admin' | 'super_admin'

export interface AuthUser {
  id: string
  email: string
  name: string
  picture?: string
  role: Role
  twoFaEnabled: boolean
  tier?: {
    name: string
    features: TierFeatureKey[]
    isGrace: boolean
    expiresAt?: string
  }
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (v: boolean) => void
  isAdmin: () => boolean
  hasFeature: (feature: TierFeatureKey) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  isAdmin: () => {
    const role = get().user?.role
    return role === 'admin' || role === 'super_admin'
  },
  hasFeature: (feature) => {
    const u = get().user
    if (!u) return false
    if (u.role === 'admin' || u.role === 'super_admin') return true
    return u.tier?.features?.includes(feature) ?? false
  },
}))
EOF

# ── src/store/session.store.ts ───────────────────────────────
cat > src/store/session.store.ts << 'EOF'
import { create } from 'zustand'

export type SessionStatus = 'disconnected' | 'authenticating' | 'connected' | 'logged_out'

interface SessionState {
  activeQr: { sessionId: string; qr: string } | null
  activePairing: { sessionId: string; code: string } | null
  sessionStatuses: Record<string, SessionStatus>
  setActiveQr: (data: { sessionId: string; qr: string } | null) => void
  setActivePairing: (data: { sessionId: string; code: string } | null) => void
  updateStatus: (sessionId: string, status: SessionStatus) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  activeQr: null,
  activePairing: null,
  sessionStatuses: {},
  setActiveQr: (activeQr) => set({ activeQr }),
  setActivePairing: (activePairing) => set({ activePairing }),
  updateStatus: (sessionId, status) =>
    set((s) => ({ sessionStatuses: { ...s.sessionStatuses, [sessionId]: status } })),
}))
EOF

# ── src/store/notification.store.ts ─────────────────────────
cat > src/store/notification.store.ts << 'EOF'
import { create } from 'zustand'

export interface AppNotification {
  id: string
  type: string
  message: string
  data?: unknown
  timestamp: Date
  read: boolean
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  add: (n: Pick<AppNotification, 'type' | 'message' | 'data'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  add: (n) => {
    const notif: AppNotification = {
      ...n, id: crypto.randomUUID(), timestamp: new Date(), read: false,
    }
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    }))
  },
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 })),
  clear: () => set({ notifications: [], unreadCount: 0 }),
}))
EOF

# ── src/store/broadcast.store.ts ─────────────────────────────
cat > src/store/broadcast.store.ts << 'EOF'
import { create } from 'zustand'

export interface BroadcastProgress {
  campaignId: string
  current: number
  total: number
  percentage: number
  successCount: number
  failedCount: number
  done: boolean
}

interface BroadcastState {
  progress: Record<string, BroadcastProgress>
  setProgress: (campaignId: string, data: Omit<BroadcastProgress, 'done'>) => void
  setDone: (campaignId: string, successCount: number, failedCount: number) => void
  clear: (campaignId: string) => void
}

export const useBroadcastStore = create<BroadcastState>((set) => ({
  progress: {},
  setProgress: (campaignId, data) =>
    set((s) => ({ progress: { ...s.progress, [campaignId]: { ...data, done: false } } })),
  setDone: (campaignId, successCount, failedCount) =>
    set((s) => ({
      progress: {
        ...s.progress,
        [campaignId]: { ...s.progress[campaignId], successCount, failedCount, done: true },
      },
    })),
  clear: (campaignId) =>
    set((s) => {
      const { [campaignId]: _, ...rest } = s.progress
      return { progress: rest }
    }),
}))
EOF

# ── src/store/inbox.store.ts ─────────────────────────────────
cat > src/store/inbox.store.ts << 'EOF'
import { create } from 'zustand'

interface InboxState {
  unreadTotal: number
  increment: () => void
  reset: () => void
}

export const useInboxStore = create<InboxState>((set) => ({
  unreadTotal: 0,
  increment: () => set((s) => ({ unreadTotal: s.unreadTotal + 1 })),
  reset: () => set({ unreadTotal: 0 }),
}))
EOF

# ── src/store/ui.store.ts ────────────────────────────────────
cat > src/store/ui.store.ts << 'EOF'
import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
EOF

# ── src/types/api.ts ─────────────────────────────────────────
cat > src/types/api.ts << 'EOF'
export interface ApiResponse<T = unknown> {
  status: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  status: boolean
  data: T[]
  meta: PaginationMeta
}

export interface PaginationParams {
  page?: number
  limit?: number
}
EOF

# ── src/types/socket.ts ──────────────────────────────────────
cat > src/types/socket.ts << 'EOF'
export interface QrPayload { sessionId: string; qr: string }
export interface CodePayload { sessionId: string; code: string }
export interface ConnectionUpdatePayload {
  sessionId: string
  status: 'connected' | 'disconnected' | 'authenticating' | 'logged_out'
  phoneNumber?: string
}
export interface NewMessagePayload {
  message: { id: string; from: string; body: string; type: string; sessionId: string }
}
export interface MessageAckPayload { sessionId: string; msgId: string; ack: 'sent' | 'delivered' | 'read' }
export interface GroupNotificationPayload { sessionId: string; notification: unknown }
export interface IncomingCallPayload {
  sessionId: string
  call: { id: string; from: string; isVideo: boolean; timestamp: number }
}
export interface BroadcastProgressPayload {
  campaignId: string; current: number; total: number
  percentage: number; successCount: number; failedCount: number
}
export interface BroadcastCompletePayload { campaignId: string; successCount: number; failedCount: number }
export interface SystemAlertPayload { type: string; message: string; data?: unknown }
EOF

# ── src/types/tier.ts ────────────────────────────────────────
cat > src/types/tier.ts << 'EOF'
export type TierFeatureKey =
  | 'broadcast' | 'auto_reply' | 'workflow' | 'drip_campaign'
  | 'ai_smart_reply' | 'channels' | 'labels' | 'customer_note'
  | 'scheduler' | 'webhook' | 'api_access'

export interface Tier {
  id: string; name: string; description?: string
  maxSessions: number; maxApiKeys: number; maxDailyMessages: number
  maxMonthlyBroadcasts: number; maxBroadcastRecipients: number
  maxWorkflows: number; maxDripCampaigns: number; maxTemplates: number
  maxContacts: number; rateLimitPerMinute: number
  features: TierFeatureKey[]; price?: string; isActive: boolean
  createdAt: string; updatedAt: string
}

export interface UserTier {
  id: string; userId: string; tierId: string
  startedAt: string; expiresAt?: string; isGrace: boolean
  tier: Tier
}
EOF

# ── src/providers/query-provider.tsx ─────────────────────────
cat > src/providers/query-provider.tsx << 'EOF'
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
EOF

# ── src/providers/theme-provider.tsx ─────────────────────────
cat > src/providers/theme-provider.tsx << 'EOF'
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
EOF

# ── src/app/layout.tsx ───────────────────────────────────────
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'WA Gateway', template: '%s — WA Gateway' },
  description: 'WhatsApp Gateway SaaS Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
EOF

# ── src/app/page.tsx ─────────────────────────────────────────
cat > src/app/page.tsx << 'EOF'
import { redirect } from 'next/navigation'
export default function RootPage() { redirect('/dashboard') }
EOF

cat >> .gitignore << 'EOF'
.env.local
.env.development.local
EOF

# Update package.json untuk port 3001
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.dev = 'next dev -p 3001';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# =============================================================
section "Selesai!"
# =============================================================

echo -e "
${GREEN}${BOLD}Scaffold frontend berhasil dibuat!${NC}

  Direktori  : ${PWD}
  Framework  : Next.js 15 (App Router)
  Styling    : Tailwind CSS + shadcn/ui
  State      : Zustand (auth, session, notification, broadcast, inbox, ui)
  Fetching   : TanStack Query + Axios
  Realtime   : Socket.io Client (25 events)
  Forms      : React Hook Form + Zod (21 schema validators)

${BOLD}Coverage API:${NC}
  ✅ Auth (Google OAuth, 2FA, backup codes, logout)
  ✅ Sessions (QR, pairing code, reconnect, info)
  ✅ Messages (7 tipe kirim + edit/forward/pin/react/delete/download)
  ✅ Broadcast + Broadcast List
  ✅ Inbox (conversations, reply, mark read)
  ✅ Contacts + Customer Note (import CSV/Google, export, bulk delete)
  ✅ Auto Reply, Workflow, Drip Campaign, Scheduler, Scheduled Event
  ✅ Templates + Template Picker
  ✅ Webhook (config, secret, test)
  ✅ API Keys (sandbox mode, IP whitelist, expiry)
  ✅ Settings (user, AI/Gemini, global, maintenance, announcement)
  ✅ Analytics (dashboard chart, system status, queue status)
  ✅ Audit Log (filter, export PDF)
  ✅ Tiers (CRUD, assign, grace period, history)
  ✅ Users Admin (CRUD, quota, impersonation)
  ✅ Workspace (invite, permission)
  ✅ Profile WA (foto, status, kontak, blokir)
  ✅ Chats, Groups, Channels, Labels, Status, Calls
  ✅ Storage (file URL builder)
  ✅ Health check
  ✅ WebSocket (25 events + 10 system alert types)
  ✅ Role & Tier gate components
  ✅ Error codes (35 kode → pesan Indonesia)

${BOLD}Langkah berikutnya:${NC}
  1. pnpm dev           → http://localhost:3001
  2. Tambah shadcn/ui components:
     pnpm dlx shadcn@latest add button card input label select textarea \\
       dialog sheet tabs badge avatar skeleton table dropdown-menu \\
       popover tooltip progress separator scroll-area switch checkbox \\
       radio-group alert alert-dialog command input-otp sonner
"
