// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/chats/page.tsx
'use client'
import { chatsApi, type Chat } from '@/api/chats.api'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { SearchInput } from '@/components/common/search-input'
import { SessionSelector } from '@/components/common/session-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Archive,
  CheckCheck,
  MessageSquare,
  MoreVertical,
  Pin,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ChatsPage() {
  const qc = useQueryClient()
  const [sessionId, setSessionId] = useState('')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: chats = [], isLoading } = useQuery({
    queryKey: QK.CHATS(sessionId),
    queryFn: () =>
      search ? chatsApi.search(sessionId, search) : chatsApi.list(sessionId),
    enabled: !!sessionId,
  })

  const act = (fn: () => Promise<unknown>) =>
    fn()
      .then(() => qc.invalidateQueries({ queryKey: QK.CHATS(sessionId) }))
      .catch((e) => toast.error(parseApiError(e)))
  const deleteMut = useMutation({
    mutationFn: () => chatsApi.delete(sessionId, deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CHATS(sessionId) })
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chat"
        description="Kelola daftar chat dari akun WhatsApp"
      />
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Sesi</Label>
          <SessionSelector value={sessionId} onChange={setSessionId} />
        </div>
        <SearchInput
          placeholder="Cari chat..."
          onSearch={setSearch}
          className="w-56"
        />
      </div>

      {sessionId &&
        (!isLoading && chats.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Tidak ada chat" />
        ) : (
          <div className="divide-y rounded-xl border">
            {chats.map((c: Chat) => (
              <div
                key={c.id}
                className="hover:bg-muted/30 flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
                    {c.name?.[0] ?? '#'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name ?? c.id}</p>
                    <div className="mt-0.5 flex gap-1">
                      {c.isGroup && (
                        <Badge variant="secondary" className="h-4 text-xs">
                          Grup
                        </Badge>
                      )}
                      {c.isArchived && (
                        <Badge variant="outline" className="h-4 text-xs">
                          Arsip
                        </Badge>
                      )}
                      {c.isPinned && (
                        <Badge variant="outline" className="h-4 text-xs">
                          Pin
                        </Badge>
                      )}
                      {c.unreadCount > 0 && (
                        <Badge className="h-4 bg-green-500 text-xs">
                          {c.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        act(() =>
                          chatsApi.archive(sessionId, c.id, !c.isArchived)
                        )
                      }
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      {c.isArchived ? 'Unarchive' : 'Archive'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        act(() => chatsApi.pin(sessionId, c.id, !c.isPinned))
                      }
                    >
                      <Pin className="mr-2 h-4 w-4" />
                      {c.isPinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        act(() =>
                          c.isMuted
                            ? chatsApi.unmute(sessionId, c.id)
                            : chatsApi.mute(sessionId, c.id, 3600)
                        )
                      }
                    >
                      {c.isMuted ? (
                        <Volume2 className="mr-2 h-4 w-4" />
                      ) : (
                        <VolumeX className="mr-2 h-4 w-4" />
                      )}
                      {c.isMuted ? 'Unmute' : 'Mute 1 Jam'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        act(() => chatsApi.markRead(sessionId, c.id))
                      }
                    >
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Tandai Dibaca
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => setDeleteId(c.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ))}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Hapus Chat"
        description="Riwayat chat akan dihapus dari perangkat ini."
        confirmLabel="Hapus"
        onConfirm={() => deleteMut.mutate()}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
