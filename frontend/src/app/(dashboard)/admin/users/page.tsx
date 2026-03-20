// src/app/(dashboard)/admin/users/page.tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { usersApi } from '@/api/users.api'
import { adminApi } from '@/api/admin.api'
import { tiersApi, type AssignTierPayload } from '@/api/settings.api'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { usePagination } from '@/hooks/use-pagination'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { SearchInput } from '@/components/common/search-input'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { RoleGate } from '@/components/common/role-gate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { User } from '@/types/user'

const ROLE_CFG: Record<string, string> = {
  user: 'bg-gray-100 text-gray-600',
  admin: 'bg-blue-100 text-blue-700',
  super_admin: 'bg-purple-100 text-purple-700',
}

export default function AdminUsersPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const dSearch = useDebounce(search)
  const [roleFilter, setRoleFilter] = useState('all')
  const { page, setPage, reset } = usePagination()

  const { data, isLoading } = useQuery({
    queryKey: QK.USERS({
      search: dSearch,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      page,
    }),
    queryFn: () =>
      usersApi.list({
        search: dSearch,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        page,
      }),
  })

  const impersonateMut = useMutation({
    mutationFn: (userId: string) => adminApi.impersonate(userId),
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

  const cols: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`border-0 text-xs ${ROLE_CFG[row.original.role] ?? ''}`}
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      id: 'tier',
      header: 'Tier',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="text-xs">{row.original.tier?.tier.name ?? '—'}</span>
          {row.original.tier?.isGrace && (
            <Badge
              variant="outline"
              className="border-0 bg-orange-100 text-xs text-orange-700"
            >
              Grace
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`border-0 text-xs ${row.original.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {row.original.isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Bergabung',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => router.push(ROUTES.ADMIN_USER(row.original.id))}
          >
            Detail
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => impersonateMut.mutate(row.original.id)}
            disabled={impersonateMut.isPending}
          >
            Impersonate
          </Button>
        </div>
      ),
    },
  ]

  return (
    <RoleGate roles={['admin', 'super_admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Kelola User"
          description="Manajemen semua pengguna platform"
        />
        <div className="flex flex-wrap gap-3">
          <SearchInput
            placeholder="Cari nama atau email..."
            onSearch={(v) => {
              setSearch(v)
              reset()
            }}
            className="w-64"
          />
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v)
              reset()
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={cols}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="Tidak ada user"
          pageCount={data?.meta.totalPages}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </RoleGate>
  )
}
