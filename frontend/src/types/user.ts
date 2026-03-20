import type { UserTier } from './tier'

export type Role = 'user' | 'admin' | 'super_admin'

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  role: Role
  isActive: boolean
  twoFaEnabled: boolean
  tier?: UserTier
  quota?: UserQuota
  createdAt: string
  updatedAt: string
}

export interface UserQuota {
  messagesSentToday: number
  broadcastsThisMonth: number
  dailyLimit: number
  monthlyLimit: number
}

export interface UpdateUserPayload {
  role?: Role
  isActive?: boolean
}

export interface UpdateQuotaPayload {
  messagesSentToday?: number
  broadcastsThisMonth?: number
}

export interface UpdateProfilePayload {
  name?: string
  picture?: string
}
