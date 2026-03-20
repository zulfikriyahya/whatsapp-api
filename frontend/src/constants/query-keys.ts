export const QK = {
  // Auth
  ME: ['me'],

  // Sessions
  SESSIONS: ['sessions'],
  SESSION: (id: string) => ['sessions', id],
  SESSION_INFO: (id: string) => ['sessions', id, 'info'],

  // Messages
  MESSAGE_LOGS: (filter?: object) => ['message-logs', filter],

  // Broadcast
  CAMPAIGNS: ['campaigns'],
  CAMPAIGN: (id: string) => ['campaigns', id],

  // Broadcast List
  BROADCAST_LISTS: (sessionId: string) => ['broadcast-lists', sessionId],
  BROADCAST_LIST: (sessionId: string, id: string) => [
    'broadcast-lists',
    sessionId,
    id,
  ],

  // Inbox
  CONVERSATIONS: ['conversations'],
  INBOX: (jid: string) => ['inbox', jid],

  // Contacts
  CONTACTS: (filter?: object) => ['contacts', filter],
  CONTACT: (id: string) => ['contacts', id],

  // Auto Reply
  AUTO_REPLY_RULES: ['auto-reply-rules'],

  // Workflows
  WORKFLOWS: ['workflows'],
  WORKFLOW: (id: string) => ['workflows', id],

  // Drip
  DRIP_CAMPAIGNS: ['drip-campaigns'],
  DRIP_CAMPAIGN: (id: string) => ['drip-campaigns', id],
  DRIP_SUBSCRIBERS: (id: string) => ['drip-campaigns', id, 'subscribers'],

  // Scheduler
  SCHEDULED: (filter?: object) => ['scheduled', filter],

  // Templates
  TEMPLATES: (filter?: object) => ['templates', filter],

  // Webhook
  WEBHOOK_CONFIG: ['webhook-config'],

  // API Keys
  API_KEYS: ['api-keys'],

  // Settings
  SETTINGS_ME: ['settings-me'],
  SETTINGS_GLOBAL: ['settings-global'],

  // Analytics
  ANALYTICS_DASHBOARD: (days: number) => ['analytics-dashboard', days],
  ANALYTICS_SYSTEM: ['analytics-system'],

  // Audit
  AUDIT_LOGS: (filter?: object) => ['audit-logs', filter],

  // Tiers
  TIERS: ['tiers'],
  TIER: (id: string) => ['tiers', id],
  TIER_HISTORY: (userId: string) => ['tier-history', userId],

  // Users
  USERS: (filter?: object) => ['users', filter],
  USER: (id: string) => ['users', id],

  // Workspaces
  WORKSPACES: ['workspaces'],
  WORKSPACE: (id: string) => ['workspaces', id],
  WORKSPACE_MEMBERS: (id: string) => ['workspaces', id, 'members'],

  // Profile WA
  WA_PROFILE: (sessionId: string) => ['wa-profile', sessionId],
  WA_CONTACTS: (sessionId: string) => ['wa-contacts', sessionId],
  WA_BLOCKED: (sessionId: string) => ['wa-blocked', sessionId],

  // Chats
  CHATS: (sessionId: string) => ['chats', sessionId],

  // Groups
  GROUPS: (sessionId: string) => ['groups', sessionId],
  GROUP_INFO: (sessionId: string, groupId: string) => [
    'groups',
    sessionId,
    groupId,
  ],
  GROUP_PARTICIPANTS: (sessionId: string, groupId: string) => [
    'groups',
    sessionId,
    groupId,
    'participants',
  ],
  MEMBERSHIP_REQUESTS: (sessionId: string, groupId: string) => [
    'groups',
    sessionId,
    groupId,
    'membership-requests',
  ],

  // Channels
  CHANNELS: (sessionId: string) => ['channels', sessionId],

  // Labels
  LABELS: (sessionId: string) => ['labels', sessionId],

  // Calls
  CALLS: ['calls'],

  // Health
  HEALTH: ['health'],
} as const
