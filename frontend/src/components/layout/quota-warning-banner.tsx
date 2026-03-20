// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/quota-warning-banner.tsx
'use client'
import { SYSTEM_ALERT_TYPES } from '@/constants/socket-events'
import { useNotificationStore } from '@/store/notification.store'
import { AlertTriangle } from 'lucide-react'

export function QuotaWarningBanner() {
  const notifications = useNotificationStore((s) => s.notifications)
  const hasQuotaAlert = notifications.some(
    (n) =>
      !n.read &&
      (n.type === SYSTEM_ALERT_TYPES.QUOTA_WARNING ||
        n.type === SYSTEM_ALERT_TYPES.QUOTA_EXCEEDED)
  )
  const isExceeded = notifications.some(
    (n) => !n.read && n.type === SYSTEM_ALERT_TYPES.QUOTA_EXCEEDED
  )

  if (!hasQuotaAlert) return null
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 text-sm font-medium ${isExceeded ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        {isExceeded
          ? 'Kuota pesan Anda telah habis.'
          : 'Kuota pesan Anda hampir habis.'}
      </span>
    </div>
  )
}
