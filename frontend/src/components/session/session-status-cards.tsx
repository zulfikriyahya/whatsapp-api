// ─────────────────────────────────────────────────────────────────────────────
// src/components/session/session-status-cards.tsx — for Dashboard
'use client'
import { sessionsApi } from '@/api/sessions.api'
import { EmptyState } from '@/components/common/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { QK } from '@/constants/query-keys'
import { useSessionStore } from '@/store/session.store'
import type { SessionStatus } from '@/types/session'
import { useQuery } from '@tanstack/react-query'
import { Smartphone } from 'lucide-react'
import { SessionStatusBadge } from './session-status-badge'

interface Props {
  onAddSession: () => void
}
export function SessionStatusCards({ onAddSession }: Props) {
  const { data: sessions = [] } = useQuery({
    queryKey: QK.SESSIONS,
    queryFn: sessionsApi.list,
    refetchInterval: 60_000,
  })
  const statuses = useSessionStore((s) => s.sessionStatuses)

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Smartphone}
        title="Belum ada sesi WhatsApp"
        description="Tambah sesi untuk mulai mengirim pesan"
        action={{ label: 'Tambah Sesi', onClick: onAddSession }}
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sessions.map((s) => {
        const status = (statuses[s.id] ?? s.status) as SessionStatus
        return (
          <Card key={s.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <Smartphone className="text-primary h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.name}</p>
                {s.phoneNumber && (
                  <p className="text-muted-foreground truncate font-mono text-xs">
                    {s.phoneNumber}
                  </p>
                )}
                <SessionStatusBadge status={status} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
