// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/maintenance-banner.tsx
import { AlertTriangle } from 'lucide-react'
export function MaintenanceBanner() {
  return (
    <div className="flex items-center gap-3 bg-red-600 px-4 py-2 text-sm font-medium text-white">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        Server sedang dalam mode maintenance. Beberapa fitur mungkin tidak
        tersedia.
      </span>
    </div>
  )
}
