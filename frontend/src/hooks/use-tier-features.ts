// src/hooks/use-tier-features.ts
import { useAuthStore } from '@/store/auth.store'
import type { TierFeatureKey } from '@/types/tier'
export function useTierFeatures() {
  const { hasFeature, isAdmin } = useAuthStore()
  return { hasFeature, isAdmin: isAdmin() }
}
