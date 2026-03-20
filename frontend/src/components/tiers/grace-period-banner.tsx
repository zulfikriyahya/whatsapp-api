// ─────────────────────────────────────────────────────────────────────────────
// src/components/tiers/grace-period-banner.tsx
'use client'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { Clock } from 'lucide-react'

export function GracePeriodBanner() {
  const user = useAuthStore((s) => s.user)
  if (!user?.tier?.isGrace) return null
  return (
    <div className="flex items-center gap-3 bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
      <Clock className="h-4 w-4 shrink-0" />
      <span>
        Langganan Anda telah berakhir
        {user.tier.expiresAt ? ` pada ${formatDate(user.tier.expiresAt)}` : ''}.
        Tier akan downgrade ke Free dalam 3 hari.
      </span>
    </div>
  )
}
