// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/admin/settings/page.tsx
'use client'
import { settingsApi } from '@/api/settings.api'
import { PageHeader } from '@/components/common/page-header'
import { RoleGate } from '@/components/common/role-gate'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const qc = useQueryClient()
  const { data: gs } = useQuery({
    queryKey: QK.SETTINGS_GLOBAL,
    queryFn: settingsApi.getGlobal,
  })
  const [dailyLimit, setDailyLimit] = useState(
    String(gs?.defaultDailyMessageLimit ?? 500)
  )
  const [monthlyLimit, setMonthlyLimit] = useState(
    String(gs?.defaultMonthlyBroadcastLimit ?? 50)
  )
  const [announcement, setAnnouncement] = useState('')

  const globalMut = useMutation({
    mutationFn: () =>
      settingsApi.updateGlobal({
        defaultDailyMessageLimit: Number(dailyLimit),
        defaultMonthlyBroadcastLimit: Number(monthlyLimit),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SETTINGS_GLOBAL })
      toast.success('Pengaturan global disimpan')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const maintenanceMut = useMutation({
    mutationFn: (enabled: boolean) => settingsApi.setMaintenance(enabled),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SETTINGS_GLOBAL })
      toast.success('Mode maintenance diperbarui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const announceMut = useMutation({
    mutationFn: () => settingsApi.sendAnnouncement(announcement),
    onSuccess: () => {
      toast.success('Pengumuman terkirim ke semua user')
      setAnnouncement('')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <RoleGate roles={['admin', 'super_admin']}>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Pengaturan Global"
          description="Konfigurasi sistem untuk semua pengguna"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Batas Default</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Pesan Harian Default</Label>
                <Input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Broadcast Bulanan Default</Label>
                <Input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() => globalMut.mutate()}
              disabled={globalMut.isPending}
            >
              {globalMut.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mode Maintenance</CardTitle>
            <CardDescription>
              Aktifkan untuk mencegah akses ke platform saat pemeliharaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Switch
                checked={gs?.maintenanceMode ?? false}
                onCheckedChange={(v) => maintenanceMut.mutate(v)}
                disabled={maintenanceMut.isPending}
              />
              <Label>
                {gs?.maintenanceMode
                  ? 'Maintenance Aktif'
                  : 'Maintenance Nonaktif'}
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengumuman</CardTitle>
            <CardDescription>
              Kirim notifikasi ke semua user yang sedang online
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={3}
              placeholder="Tulis pengumuman..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <Button
              onClick={() => announceMut.mutate()}
              disabled={!announcement || announceMut.isPending}
            >
              {announceMut.isPending ? 'Mengirim...' : 'Kirim Pengumuman'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  )
}
