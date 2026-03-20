// src/app/(dashboard)/workspaces/page.tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Users, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import {
  workspaceApi,
  type Workspace,
  type WorkspaceMember,
} from '@/api/workspace.api'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

function CreateWorkspaceDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const mut = useMutation({
    mutationFn: () => workspaceApi.create(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WORKSPACES })
      toast.success('Workspace dibuat')
      onClose()
      setName('')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Buat Workspace</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nama workspace"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!name || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? 'Membuat...' : 'Buat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InviteMemberDialog({
  workspaceId,
  open,
  onClose,
}: {
  workspaceId: string
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const mut = useMutation({
    mutationFn: () => workspaceApi.invite(workspaceId, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WORKSPACE_MEMBERS(workspaceId) })
      toast.success('Undangan terkirim')
      onClose()
      setEmail('')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Undang Anggota</DialogTitle>
        </DialogHeader>
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!email || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? 'Mengundang...' : 'Undang'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [removeId, setRemoveId] = useState<string | null>(null)

  const { data: members = [] } = useQuery({
    queryKey: QK.WORKSPACE_MEMBERS(workspace.id),
    queryFn: () => workspaceApi.getMembers(workspace.id),
    enabled: expanded,
  })
  const removeMut = useMutation({
    mutationFn: () => workspaceApi.removeMember(workspace.id, removeId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WORKSPACE_MEMBERS(workspace.id) })
      toast.success('Anggota dihapus')
      setRemoveId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{workspace.name}</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {workspace.memberCount} anggota
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setInviteOpen(true)}
              >
                <Plus className="mr-1 h-3 w-3" />
                Undang
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {expanded && (
          <CardContent className="border-t pt-3">
            <div className="space-y-2">
              {members.map((m: WorkspaceMember) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-muted-foreground text-xs">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {m.role}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500"
                      onClick={() => setRemoveId(m.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      <InviteMemberDialog
        workspaceId={workspace.id}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
      <ConfirmDialog
        open={!!removeId}
        onOpenChange={() => setRemoveId(null)}
        title="Hapus Anggota"
        description="Anggota akan dikeluarkan dari workspace."
        confirmLabel="Hapus"
        onConfirm={() => removeMut.mutate()}
        loading={removeMut.isPending}
      />
    </>
  )
}

export default function WorkspacesPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: QK.WORKSPACES,
    queryFn: workspaceApi.list,
  })
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace"
        description="Kelola tim dan kolaborasi"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Workspace
          </Button>
        }
      />
      {!isLoading && workspaces.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada workspace"
          action={{
            label: 'Buat Workspace',
            onClick: () => setCreateOpen(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          {workspaces.map((w: Workspace) => (
            <WorkspaceCard key={w.id} workspace={w} />
          ))}
        </div>
      )}
      <CreateWorkspaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  )
}
