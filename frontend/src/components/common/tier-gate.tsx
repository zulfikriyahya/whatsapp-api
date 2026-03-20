// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/tier-gate.tsx
'use client'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import type { TierFeatureKey } from '@/types/tier'
import { Lock } from 'lucide-react'

interface Props {
  feature: TierFeatureKey
  children: React.ReactNode
  fallback?: React.ReactNode
}
export function TierGate({ feature, children, fallback }: Props) {
  const hasFeature = useAuthStore((s) => s.hasFeature)
  if (hasFeature(feature)) return <>{children}</>
  if (fallback) return <>{fallback}</>
  return (
    <div className="text-muted-foreground flex items-center gap-2 rounded-md border border-dashed p-3 text-sm">
      <Lock className="h-4 w-4 shrink-0" />
      <span>Fitur ini tidak tersedia di tier Anda.</span>
      <Button size="sm" variant="outline" className="ml-auto h-7 text-xs">
        Upgrade
      </Button>
    </div>
  )
}
