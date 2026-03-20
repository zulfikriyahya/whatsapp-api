'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  Link,
  RefreshCw,
  UserPlus,
  UserMinus,
  ShieldCheck,
  ShieldOff,
  LogOut,
  Pencil,
  Check,
  X,
  Copy,
  Users,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  groupsApi,
  type GroupParticipant,
  type MembershipRequest,
} from '@/api/groups.api'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone, formatDate } from '@/lib/utils'

import { PageHeader } from '@/components/common/page-header'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { ErrorState } from '@/components/common/error-state'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { CopyButton } from '@/components/common/copy-button'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

// ─────────────────────────────────────────────────────────────────────────────
// Edit Info Dialog
// ─────────────────────────────────────────────────────────────────────────────
const editSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  description: z.string().optional(),
})
type EditForm = z.infer<typeof editSchema>

function EditInfoDialog({
  sessionId,
  groupId,
  currentName,
  currentDesc,
  open,
  onClose,
}: {
  sessionId: string
  groupId: string
  currentName: string
  currentDesc?: string
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: currentName, description: currentDesc ?? '' },
  })
  const mut = useMutation({
    mutationFn: (d: EditForm) => groupsApi.updateInfo(sessionId, groupId, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.GROUP_INFO(sessionId, groupId) })
      toast.success('Info grup diperbarui')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Info Grup</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mut.mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Grup</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Add Participant Dialog
// ─────────────────────────────────────────────────────────────────────────────
function AddParticipantDialog({
  sessionId,
  groupId,
  open,
  onClose,
}: {
  sessionId: string
  groupId: string
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [numbers, setNumbers] = useState('')
  const mut = useMutation({
    mutationFn: () => {
      const participants = numbers
        .split('\n')
        .map((n) => normalizePhone(n.trim()))
        .filter(Boolean)
      if (!participants.length) throw new Error('Masukkan minimal 1 nomor')
      return groupsApi.addParticipants(sessionId, groupId, participants)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.GROUP_INFO(sessionId, groupId) })
      toast.success('Peserta ditambahkan')
      onClose()
      setNumbers('')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Peserta</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Nomor WhatsApp (satu per baris)</Label>
          <Textarea
            rows={4}
            placeholder={'628111...\n628222...'}
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!numbers.trim() || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? 'Menambahkan...' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Participant Row
// ─────────────────────────────────────────────────────────────────────────────
function ParticipantRow({
  participant,
  sessionId,
  groupId,
  isGroupAdmin,
}: {
  participant: GroupParticipant
  sessionId: string
  groupId: string
  isGroupAdmin: boolean
}) {
  const qc = useQueryClient()
  const [confirmRemove, setConfirmRemove] = useState(false)

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: QK.GROUP_INFO(sessionId, groupId) })

  const removeMut = useMutation({
    mutationFn: () =>
      groupsApi.removeParticipants(sessionId, groupId, [
        participant.phoneNumber,
      ]),
    onSuccess: () => {
      invalidate()
      toast.success('Peserta dihapus')
      setConfirmRemove(false)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const promoteMut = useMutation({
    mutationFn: () =>
      groupsApi.promoteParticipant(sessionId, groupId, participant.phoneNumber),
    onSuccess: () => {
      invalidate()
      toast.success('Dipromosikan menjadi admin')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const demoteMut = useMutation({
    mutationFn: () =>
      groupsApi.demoteParticipant(sessionId, groupId, participant.phoneNumber),
    onSuccess: () => {
      invalidate()
      toast.success('Diturunkan dari admin')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const initials = (participant.name ?? participant.phoneNumber)
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <div className="hover:bg-muted/40 flex items-center justify-between rounded-md px-3 py-2.5 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm leading-tight font-medium">
              {participant.name ?? participant.phoneNumber}
            </p>
            {participant.name && (
              <p className="text-muted-foreground font-mono text-xs">
                {participant.phoneNumber}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {participant.role === 'admin' && (
            <Badge
              variant="outline"
              className="border-0 bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              Admin
            </Badge>
          )}
          {isGroupAdmin && (
            <TooltipProvider delayDuration={200}>
              {/* Promote / Demote */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={promoteMut.isPending || demoteMut.isPending}
                    onClick={() =>
                      participant.role === 'admin'
                        ? demoteMut.mutate()
                        : promoteMut.mutate()
                    }
                  >
                    {participant.role === 'admin' ? (
                      <ShieldOff className="h-3.5 w-3.5 text-yellow-500" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {participant.role === 'admin'
                    ? 'Turunkan dari Admin'
                    : 'Jadikan Admin'}
                </TooltipContent>
              </Tooltip>

              {/* Remove */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-500 hover:text-red-500"
                    onClick={() => setConfirmRemove(true)}
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keluarkan dari Grup</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title="Keluarkan Peserta"
        description={`Keluarkan ${participant.name ?? participant.phoneNumber} dari grup?`}
        confirmLabel="Keluarkan"
        onConfirm={() => removeMut.mutate()}
        loading={removeMut.isPending}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Membership Request Row
// ─────────────────────────────────────────────────────────────────────────────
function MembershipRequestRow({
  req,
  sessionId,
  groupId,
}: {
  req: MembershipRequest
  sessionId: string
  groupId: string
}) {
  const qc = useQueryClient()
  const invalidate = () =>
    qc.invalidateQueries({
      queryKey: QK.MEMBERSHIP_REQUESTS(sessionId, groupId),
    })

  const approveMut = useMutation({
    mutationFn: () =>
      groupsApi.approveMembershipRequest(sessionId, groupId, req.id),
    onSuccess: () => {
      invalidate()
      qc.invalidateQueries({ queryKey: QK.GROUP_INFO(sessionId, groupId) })
      toast.success('Permintaan disetujui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const rejectMut = useMutation({
    mutationFn: () =>
      groupsApi.rejectMembershipRequest(sessionId, groupId, req.id),
    onSuccess: () => {
      invalidate()
      toast.success('Permintaan ditolak')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <div className="hover:bg-muted/40 flex items-center justify-between rounded-md px-3 py-2.5 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {(req.name ?? req.phoneNumber).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{req.name ?? req.phoneNumber}</p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {formatDate(req.requestedAt)}
          </p>
        </div>
      </div>
      <div className="flex gap-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-600"
          disabled={approveMut.isPending}
          onClick={() => approveMut.mutate()}
          title="Setujui"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-500"
          disabled={rejectMut.isPending}
          onClick={() => rejectMut.mutate()}
          title="Tolak"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string; groupId: string }>
}) {
  const { sessionId, groupId } = use(params)
  const router = useRouter()
  const qc = useQueryClient()

  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [leaveConfirm, setLeaveConfirm] = useState(false)
  const [revokeConfirm, setRevokeConfirm] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [searchParticipant, setSearchParticipant] = useState('')

  // ── Data ───────────────────────────────────────────────────────────────────
  const {
    data: group,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: QK.GROUP_INFO(sessionId, groupId),
    queryFn: () => groupsApi.getInfo(sessionId, groupId),
  })

  const {
    data: inviteData,
    refetch: refetchInvite,
    isFetching: inviteFetching,
  } = useQuery({
    queryKey: ['group-invite', sessionId, groupId],
    queryFn: () => groupsApi.getInviteLink(sessionId, groupId),
    enabled: false,
  })

  const { data: membershipRequests = [], isLoading: reqLoading } = useQuery({
    queryKey: QK.MEMBERSHIP_REQUESTS(sessionId, groupId),
    queryFn: () => groupsApi.getMembershipRequests(sessionId, groupId),
    enabled: !!group?.isAdmin,
  })

  // ── Mutations ──────────────────────────────────────────────────────────────
  const leaveMut = useMutation({
    mutationFn: () => groupsApi.leave(sessionId, groupId),
    onSuccess: () => {
      toast.success('Keluar dari grup')
      router.push(ROUTES.GROUPS)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const revokeMut = useMutation({
    mutationFn: () => groupsApi.revokeInviteLink(sessionId, groupId),
    onSuccess: (r) => {
      qc.setQueryData(['group-invite', sessionId, groupId], r)
      toast.success('Invite link diperbarui')
      setRevokeConfirm(false)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const joinMut = useMutation({
    mutationFn: () => groupsApi.joinViaCode(sessionId, joinCode.trim()),
    onSuccess: () => {
      toast.success('Berhasil bergabung ke grup')
      setJoinCode('')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  // ── Derived ────────────────────────────────────────────────────────────────
  if (isLoading) return <LoadingSkeleton />
  if (isError || !group) return <ErrorState onRetry={refetch} />

  const inviteLink = inviteData?.inviteLink
  const filteredParticipants = group.participants.filter((p) => {
    if (!searchParticipant) return true
    const q = searchParticipant.toLowerCase()
    return (p.name ?? '').toLowerCase().includes(q) || p.phoneNumber.includes(q)
  })
  const admins = filteredParticipants.filter((p) => p.role === 'admin')
  const members = filteredParticipants.filter((p) => p.role === 'member')

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 shrink-0"
          onClick={() => router.push(ROUTES.GROUPS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={group.name}
          description={group.description ?? `${group.participantCount} anggota`}
          action={
            group.isAdmin ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit Info
              </Button>
            ) : undefined
          }
        />
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 pt-5 text-sm">
          <div>
            <p className="text-muted-foreground">Total Anggota</p>
            <p className="text-lg font-semibold">{group.participantCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role Anda</p>
            <Badge
              variant="outline"
              className={`mt-1 border-0 ${group.isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {group.isAdmin ? 'Admin' : 'Member'}
            </Badge>
          </div>
          {group.description && (
            <div className="col-span-2">
              <p className="text-muted-foreground mb-0.5">Deskripsi</p>
              <p className="text-sm">{group.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Link className="h-4 w-4" />
            Invite Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inviteLink ? (
            <div className="bg-muted/50 flex items-center gap-2 rounded-md border px-3 py-2">
              <span className="flex-1 truncate text-xs">{inviteLink}</span>
              <CopyButton text={inviteLink} />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Klik tombol untuk memuat invite link.
            </p>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetchInvite()}
              disabled={inviteFetching}
            >
              {inviteFetching
                ? 'Memuat...'
                : inviteLink
                  ? 'Refresh'
                  : 'Lihat Invite Link'}
            </Button>
            {group.isAdmin && inviteLink && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 hover:text-red-500"
                onClick={() => setRevokeConfirm(true)}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Revoke
              </Button>
            )}
          </div>

          {/* Join via code */}
          <Separator />
          <div>
            <p className="mb-1.5 text-xs font-medium">
              Bergabung via Invite Code
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan invite code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                className="h-8 shrink-0"
                disabled={!joinCode.trim() || joinMut.isPending}
                onClick={() => joinMut.mutate()}
              >
                {joinMut.isPending ? 'Bergabung...' : 'Gabung'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Requests (admin only) */}
      {group.isAdmin && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Permintaan Bergabung
                {membershipRequests.length > 0 && (
                  <Badge className="ml-1 bg-orange-500 text-xs text-white">
                    {membershipRequests.length}
                  </Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {reqLoading ? (
              <p className="text-muted-foreground px-4 py-6 text-center text-sm">
                Memuat...
              </p>
            ) : membershipRequests.length === 0 ? (
              <p className="text-muted-foreground px-4 py-6 text-center text-sm">
                Tidak ada permintaan
              </p>
            ) : (
              <div className="px-2 pb-2">
                {membershipRequests.map((req: MembershipRequest) => (
                  <MembershipRequestRow
                    key={req.id}
                    req={req}
                    sessionId={sessionId}
                    groupId={groupId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Peserta ({group.participantCount})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Cari peserta..."
                value={searchParticipant}
                onChange={(e) => setSearchParticipant(e.target.value)}
                className="h-7 w-44 text-xs"
              />
              {group.isAdmin && (
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setAddOpen(true)}
                >
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Tambah
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-96">
            {admins.length > 0 && (
              <div>
                <p className="text-muted-foreground px-4 pt-2 pb-1 text-xs font-semibold tracking-wider uppercase">
                  Admin ({admins.length})
                </p>
                {admins.map((p: GroupParticipant) => (
                  <ParticipantRow
                    key={p.id}
                    participant={p}
                    sessionId={sessionId}
                    groupId={groupId}
                    isGroupAdmin={group.isAdmin}
                  />
                ))}
              </div>
            )}
            {members.length > 0 && (
              <div>
                <p className="text-muted-foreground px-4 pt-3 pb-1 text-xs font-semibold tracking-wider uppercase">
                  Anggota ({members.length})
                </p>
                {members.map((p: GroupParticipant) => (
                  <ParticipantRow
                    key={p.id}
                    participant={p}
                    sessionId={sessionId}
                    groupId={groupId}
                    isGroupAdmin={group.isAdmin}
                  />
                ))}
              </div>
            )}
            {filteredParticipants.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                Tidak ada peserta ditemukan
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/60">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setLeaveConfirm(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar dari Grup
          </Button>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditInfoDialog
        sessionId={sessionId}
        groupId={groupId}
        currentName={group.name}
        currentDesc={group.description}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <AddParticipantDialog
        sessionId={sessionId}
        groupId={groupId}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
      <ConfirmDialog
        open={leaveConfirm}
        onOpenChange={setLeaveConfirm}
        title="Keluar dari Grup"
        description={`Anda akan keluar dari grup "${group.name}". Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Keluar"
        onConfirm={() => leaveMut.mutate()}
        loading={leaveMut.isPending}
      />
      <ConfirmDialog
        open={revokeConfirm}
        onOpenChange={setRevokeConfirm}
        title="Revoke Invite Link"
        description="Link lama akan tidak berlaku dan link baru akan dibuat."
        confirmLabel="Revoke"
        onConfirm={() => revokeMut.mutate()}
        loading={revokeMut.isPending}
      />
    </div>
  )
}
