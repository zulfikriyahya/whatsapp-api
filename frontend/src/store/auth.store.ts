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
