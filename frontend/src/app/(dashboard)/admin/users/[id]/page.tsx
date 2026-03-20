'use client'
import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  UserCog,
  Layers,
  BarChart2,
  Trash2,
  Monitor,
} from 'lucide-react'
import { toast } from 'sonner'
import { usersApi } from '@/api/users.api'
import { adminApi } from '@/api/admin.api'
import { tiersApi } from '@/api/settings.api'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/common/page-header'
import { RoleGate } from '@/components/common/role-gate'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { QuotaBar } from '@/components/common/quota-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { User } from '@/types/user'
import type { Tier } from '@/types/tier'

// ── Update User Dialog ────────────────────────────────────────────────────────
function UpdateUserDialog({
  user,
  open,
  onClose,
}: {
  user: User
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const form = useForm({
    defaultValues: { role: user.role, isActive: user.isActive },
  })
  const mut = useMutation({
    mutationFn: (d: { role: string; isActive: boolean }) =>
      usersApi.update(user.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.USER(user.id) })
      toast.success('User diperbarui')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mut.mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Akun Aktif</FormLabel>
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

// ── Update Quota Dialog ───────────────────────────────────────────────────────
function UpdateQuotaDialog({
  user,
  open,
  onClose,
}: {
  user: User
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const form = useForm({
    defaultValues: {
      messagesSentToday: user.quota?.messagesSentToday ?? 0,
      broadcastsThisMonth: user.quota?.broadcastsThisMonth ?? 0,
    },
  })
  const mut = useMutation({
    mutationFn: (d: {
      messagesSentToday: number
      broadcastsThisMonth: number
    }) => usersApi.updateQuota(user.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.USER(user.id) })
      toast.success('Kuota diperbarui')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Kuota</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) =>
              mut.mutate({
                messagesSentToday: Number(d.messagesSentToday),
                broadcastsThisMonth: Number(d.broadcastsThisMonth),
              })
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="messagesSentToday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan Terkirim Hari Ini</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broadcastsThisMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broadcast Bulan Ini</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
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

// ── Assign Tier Dialog ────────────────────────────────────────────────────────
function AssignTierDialog({
  userId,
  open,
  onClose,
}: {
  userId: string
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const { data: tiers = [] } = useQuery({
    queryKey: QK.TIERS,
    queryFn: tiersApi.list,
  })
  const [tierId, setTierId] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const mut = useMutation({
    mutationFn: () =>
      tiersApi.assign({ userId, tierId, expiresAt: expiresAt || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.USER(userId) })
      toast.success('Tier diassign')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Tier</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tier</label>
            <Select value={tierId} onValueChange={setTierId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((t: Tier) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Berlaku Sampai (opsional)
            </label>
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!tierId || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? 'Mengassign...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const qc = useQueryClient()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [quotaOpen, setQuotaOpen] = useState(false)
  const [tierOpen, setTierOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: QK.USER(id),
    queryFn: () => usersApi.get(id),
  })

  const impersonateMut = useMutation({
    mutationFn: () => adminApi.impersonate(id),
    onSuccess: (res) => {
      sessionStorage.setItem('impersonation_token', res.token)
      sessionStorage.setItem(
        'impersonation_user',
        JSON.stringify(res.targetUser)
      )
      toast.success(`Impersonating ${res.targetUser.name}`)
      router.push(ROUTES.DASHBOARD)
      router.refresh()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deleteMut = useMutation({
    mutationFn: () => usersApi.delete(id),
    onSuccess: () => {
      router.push(ROUTES.ADMIN_USERS)
      toast.success('User dihapus')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError || !user) return <ErrorState onRetry={refetch} />

  const ROLE_CFG: Record<string, string> = {
    user: 'bg-gray-100 text-gray-600',
    admin: 'bg-blue-100 text-blue-700',
    super_admin: 'bg-purple-100 text-purple-700',
  }

  return (
    <RoleGate roles={['admin', 'super_admin']}>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(ROUTES.ADMIN_USERS)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader title={user.name} description={user.email} />
        </div>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi User</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Role</p>
              <Badge
                variant="outline"
                className={`mt-1 border-0 ${ROLE_CFG[user.role]}`}
              >
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={`mt-1 border-0 ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {user.isActive ? 'Aktif' : 'Nonaktif'}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">2FA</p>
              <p className="mt-0.5 font-medium">
                {user.twoFaEnabled ? 'Aktif' : 'Nonaktif'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Bergabung</p>
              <p className="mt-0.5 font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" />
              Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.tier ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Tier</p>
                  <p className="font-medium">{user.tier.tier.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Berlaku Sampai</p>
                  <p className="font-medium">
                    {user.tier.expiresAt
                      ? formatDate(user.tier.expiresAt)
                      : 'Selamanya'}
                  </p>
                </div>
                {user.tier.isGrace && (
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className="border-0 bg-orange-100 text-orange-700"
                    >
                      Grace Period Aktif
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Tidak ada tier aktif
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTierOpen(true)}
            >
              Assign Tier
            </Button>
          </CardContent>
        </Card>

        {/* Quota */}
        {user.quota && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart2 className="h-4 w-4" />
                Kuota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuotaBar
                label="Pesan Hari Ini"
                used={user.quota.messagesSentToday}
                limit={user.quota.dailyLimit}
              />
              <QuotaBar
                label="Broadcast Bulan Ini"
                used={user.quota.broadcastsThisMonth}
                limit={user.quota.monthlyLimit}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuotaOpen(true)}
              >
                Update Kuota
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tindakan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUpdateOpen(true)}
            >
              <UserCog className="mr-2 h-3.5 w-3.5" />
              Update User
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => impersonateMut.mutate()}
              disabled={impersonateMut.isPending}
            >
              <Monitor className="mr-2 h-3.5 w-3.5" />
              Impersonate
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Hapus User
            </Button>
          </CardContent>
        </Card>

        <UpdateUserDialog
          user={user}
          open={updateOpen}
          onClose={() => setUpdateOpen(false)}
        />
        <UpdateQuotaDialog
          user={user}
          open={quotaOpen}
          onClose={() => setQuotaOpen(false)}
        />
        <AssignTierDialog
          userId={id}
          open={tierOpen}
          onClose={() => setTierOpen(false)}
        />
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus User"
          description={`User "${user.name}" akan dihapus permanen beserta semua datanya.`}
          confirmLabel="Hapus User"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </RoleGate>
  )
}
