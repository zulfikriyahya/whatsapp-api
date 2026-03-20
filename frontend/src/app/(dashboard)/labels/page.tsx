// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/labels/page.tsx
'use client'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { SessionSelector } from '@/components/common/session-selector'
import { TierGate } from '@/components/common/tier-gate'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { parseApiError } from '@/lib/api-error'
import api from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Tag } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LabelsPage() {
  const [sessionId, setSessionId] = useState('')
  const [assignOpen, setAssignOpen] = useState<string | null>(null)
  const [chatId, setChatId] = useState('')

  const { data: labels = [] } = useQuery({
    queryKey: ['labels', sessionId],
    queryFn: () =>
      api.get(`/labels/${sessionId}`).then((r) => r.data.data ?? []),
    enabled: !!sessionId,
  })

  const assignMut = useMutation({
    mutationFn: ({ labelId }: { labelId: string }) =>
      api.post(`/labels/${sessionId}/chats/${chatId}/labels/${labelId}`),
    onSuccess: () => {
      toast.success('Label ditambahkan')
      setAssignOpen(null)
      setChatId('')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <TierGate feature="labels">
      <div className="space-y-6">
        <PageHeader
          title="Label"
          description="Kelola label WA Business pada chat"
        />
        <div className="space-y-1.5">
          <Label>Pilih Sesi</Label>
          <SessionSelector value={sessionId} onChange={setSessionId} />
        </div>
        {sessionId &&
          (labels.length === 0 ? (
            <EmptyState icon={Tag} title="Tidak ada label" />
          ) : (
            <div className="flex flex-wrap gap-3">
              {labels.map((l: any) => (
                <div
                  key={l.id}
                  className="flex items-center gap-2 rounded-full border px-4 py-2"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: l.color ?? '#6366f1' }}
                  />
                  <span className="text-sm font-medium">{l.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-1 h-6 text-xs"
                    onClick={() => setAssignOpen(l.id)}
                  >
                    Assign ke Chat
                  </Button>
                </div>
              ))}
            </div>
          ))}
        {assignOpen && (
          <Dialog
            open
            onOpenChange={() => {
              setAssignOpen(null)
              setChatId('')
            }}
          >
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Assign Label ke Chat</DialogTitle>
              </DialogHeader>
              <div className="space-y-1.5">
                <Label>ID Chat</Label>
                <input
                  className="bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="628xxxxxxxxx@s.whatsapp.net"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAssignOpen(null)
                    setChatId('')
                  }}
                >
                  Batal
                </Button>
                <Button
                  disabled={!chatId || assignMut.isPending}
                  onClick={() => assignMut.mutate({ labelId: assignOpen })}
                >
                  {assignMut.isPending ? 'Mengassign...' : 'Assign'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TierGate>
  )
}
