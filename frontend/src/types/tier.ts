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
