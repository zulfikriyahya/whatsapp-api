// src/app/(dashboard)/groups/page.tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone } from '@/lib/utils'
import { PageHeader } from '@/components/common/page-header'
import { SessionSelector } from '@/components/common/session-selector'
import { EmptyState } from '@/components/common/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

function CreateGroupDialog({
  sessionId,
  open,
  onClose,
}: {
  sessionId: string
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [participants, setParticipants] = useState('')
  const mut = useMutation({
    mutationFn: () =>
      api.post(`/groups/${sessionId}`, {
        name,
        participants: participants
          .split('\n')
          .map((n) => normalizePhone(n.trim()))
          .filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups', sessionId] })
      toast.success('Grup dibuat')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Grup WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Grup</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tim Marketing"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Peserta (satu nomor per baris)</Label>
            <Textarea
              rows={4}
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="628111...\n628222..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!name || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? 'Membuat...' : 'Buat Grup'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function GroupsPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const { data: groups = [] } = useQuery({
    queryKey: ['groups', sessionId],
    queryFn: () =>
      api
        .get(`/chats/${sessionId}`)
        .then((r) => (r.data.data ?? []).filter((c: any) => c.isGroup)),
    enabled: !!sessionId,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grup WhatsApp"
        description="Kelola grup dari akun WhatsApp"
        action={
          sessionId ? (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Buat Grup
            </Button>
          ) : undefined
        }
      />
      <div className="space-y-1.5">
        <Label>Pilih Sesi</Label>
        <SessionSelector value={sessionId} onChange={setSessionId} />
      </div>

      {sessionId &&
        (groups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Tidak ada grup"
            action={{ label: 'Buat Grup', onClick: () => setCreateOpen(true) }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g: any) => (
              <Card
                key={g.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => router.push(`/groups/${sessionId}/${g.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{g.name ?? g.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1">
                    {g.unreadCount > 0 && (
                      <Badge className="bg-green-500 text-xs">
                        {g.unreadCount} belum dibaca
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      {createOpen && (
        <CreateGroupDialog
          sessionId={sessionId}
          open
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  )
}
