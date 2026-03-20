// ─────────────────────────────────────────────────────────────────────────────
// src/components/session/session-card.tsx
'use client'
import { sessionsApi } from '@/api/sessions.api'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { useSessionStore } from '@/store/session.store'
import type { Session } from '@/types/session'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info, MoreVertical, RefreshCw, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { SessionStatusBadge } from './session-status-badge'

interface Props {
  session: Session
  onShowQr: (sessionId: string) => void
  onShowInfo: (sessionId: string) => void
}

export function SessionCard({ session, onShowQr, onShowInfo }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const qc = useQueryClient()
  const statusFromStore = useSessionStore((s) => s.sessionStatuses[session.id])
  const status = statusFromStore ?? session.status

  const deleteMut = useMutation({
    mutationFn: () => sessionsApi.delete(session.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SESSIONS })
      toast.success('Sesi dihapus')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const setDefaultMut = useMutation({
    mutationFn: () => sessionsApi.setDefault(session.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SESSIONS })
      toast.success('Sesi default diperbarui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const reconnectMut = useMutation({
    mutationFn: () => sessionsApi.reconnect(session.id),
    onSuccess: () => toast.info('Mencoba menghubungkan kembali...'),
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <>
      <Card className="relative">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{session.name}</p>
                {session.isDefault && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              {session.phoneNumber && (
                <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                  {session.phoneNumber}
                </p>
              )}
              <div className="mt-2">
                <SessionStatusBadge status={status} />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {(status === 'disconnected' || status === 'authenticating') && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  disabled={status === 'logged_out' || reconnectMut.isPending}
                  onClick={() => {
                    if (status === 'authenticating') onShowQr(session.id)
                    else reconnectMut.mutate()
                  }}
                  title="Reconnect"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!session.isDefault && (
                    <DropdownMenuItem onClick={() => setDefaultMut.mutate()}>
                      <Star className="mr-2 h-4 w-4" /> Set Default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onShowInfo(session.id)}>
                    <Info className="mr-2 h-4 w-4" /> Info Sesi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Hapus Sesi"
        description={`Hapus sesi "${session.name}"? Koneksi WhatsApp akan terputus.`}
        confirmLabel="Hapus"
        onConfirm={() => deleteMut.mutate()}
        loading={deleteMut.isPending}
      />
    </>
  )
}
