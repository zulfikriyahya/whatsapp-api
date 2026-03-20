export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  TWO_FA: '/auth/2fa',
  DASHBOARD: '/dashboard',

  // Sessions
  SESSIONS: '/sessions',

  // Messages
  MESSAGES_SEND: '/messages/send',
  MESSAGES_LOGS: '/messages/logs',

  // Inbox
  INBOX: '/inbox',

  // Broadcast
  BROADCAST_CAMPAIGNS: '/broadcast/campaigns',
  BROADCAST_CAMPAIGN: (id: string) => `/broadcast/campaigns/${id}`,
  BROADCAST_LIST: '/broadcast-list',

  // Contacts
  CONTACTS: '/contacts',

  // Automation
  AUTO_REPLY: '/auto-reply',
  WORKFLOWS: '/workflows',
  DRIP_CAMPAIGNS: '/drip-campaigns',
  DRIP_SUBSCRIBERS: (id: string) => `/drip-campaigns/${id}/subscribers`,
  SCHEDULER: '/scheduler',
  SCHEDULED_EVENTS: '/scheduled-events',

  // Templates
  TEMPLATES: '/templates',

  // WA Features
  CHATS: '/chats',
  GROUPS: '/groups',
  GROUP_DETAIL: (sessionId: string, groupId: string) =>
    `/groups/${sessionId}/${groupId}`,
  CHANNELS: '/channels',
  LABELS: '/labels',
  CALLS: '/calls',

  // Account
  PROFILE: '/profile',
  WORKSPACES: '/workspaces',
  API_KEYS: '/api-keys',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_WEBHOOK: '/settings/webhook',
  SETTINGS_AI: '/settings/ai',
  SETTINGS_SECURITY: '/settings/security',

  // Analytics
  ANALYTICS: '/analytics',
  AUDIT: '/audit',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_USER: (id: string) => `/admin/users/${id}`,
  ADMIN_TIERS: '/admin/tiers',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_SETTINGS: '/admin/settings',

  // System
  MAINTENANCE: '/maintenance',
} as const

// Breadcrumb label mapping
export const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  sessions: 'Sesi WhatsApp',
  messages: 'Pesan',
  send: 'Kirim Pesan',
  logs: 'Riwayat Pesan',
  inbox: 'Inbox',
  broadcast: 'Broadcast',
  campaigns: 'Campaign',
  'broadcast-list': 'Broadcast List',
  contacts: 'Kontak',
  'auto-reply': 'Auto Reply',
  workflows: 'Workflow',
  'drip-campaigns': 'Drip Campaign',
  subscribers: 'Subscriber',
  scheduler: 'Scheduler',
  'scheduled-events': 'Scheduled Event',
  templates: 'Template',
  chats: 'Chat',
  groups: 'Grup',
  channels: 'Channel',
  labels: 'Label',
  calls: 'Panggilan',
  profile: 'Profil WA',
  workspaces: 'Workspace',
  'api-keys': 'API Keys',
  settings: 'Pengaturan',
  webhook: 'Webhook',
  ai: 'Pengaturan AI',
  security: 'Keamanan',
  analytics: 'Analytics',
  audit: 'Audit Log',
  admin: 'Admin',
  users: 'Kelola User',
  tiers: 'Kelola Tier',
}
