// src/app/(dashboard)/settings/page.tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { usersApi } from '@/api/users.api'
import { settingsApi } from '@/api/settings.api'
import { useAuthStore } from '@/store/auth.store'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import {
  userSettingsSchema,
  type UserSettingsInput,
} from '@/validators/settings.schema'
import { PageHeader } from '@/components/common/page-header'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/constants/routes'

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [nameValue, setNameValue] = useState(user?.name ?? '')

  const { data: settings } = useQuery({
    queryKey: QK.SETTINGS_ME,
    queryFn: settingsApi.getMe,
  })

  const form = useForm<UserSettingsInput>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      geminiApiKey: settings?.geminiApiKey ?? '',
      confidenceThreshold: settings?.confidenceThreshold ?? 0.7,
      autoDownloadPhoto: settings?.autoDownloadPhoto ?? true,
      autoDownloadVideo: settings?.autoDownloadVideo ?? false,
      autoDownloadAudio: settings?.autoDownloadAudio ?? true,
      autoDownloadDocument: settings?.autoDownloadDocument ?? false,
    },
  })

  const profileMut = useMutation({
    mutationFn: () => usersApi.updateProfile({ name: nameValue }),
    onSuccess: (u) => {
      setUser({ ...user!, name: u.name })
      toast.success('Profil diperbarui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const settingsMut = useMutation({
    mutationFn: (d: UserSettingsInput) => settingsApi.updateMe(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SETTINGS_ME })
      toast.success('Pengaturan disimpan')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deleteMut = useMutation({
    mutationFn: usersApi.deleteMe,
    onSuccess: () => {
      setUser(null)
      router.push(ROUTES.LOGIN)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola preferensi akun Anda"
      />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Umum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama</Label>
            <div className="flex gap-2">
              <Input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
              <Button
                onClick={() => profileMut.mutate()}
                disabled={profileMut.isPending}
                size="sm"
              >
                {profileMut.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email ?? ''} disabled />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit((d) => settingsMut.mutate(d))}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI / Gemini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="geminiApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gemini API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="AIza..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confidenceThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confidence Threshold —{' '}
                      {Math.round((field.value ?? 0.7) * 100)}%
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.05}
                        value={[field.value ?? 0.7]}
                        onValueChange={([v]) => field.onChange(v)}
                        className="pt-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Auto Download */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Auto Download Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  'autoDownloadPhoto',
                  'autoDownloadVideo',
                  'autoDownloadAudio',
                  'autoDownloadDocument',
                ] as const
              ).map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">
                        {key.replace('autoDownload', '')}
                      </Label>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={settingsMut.isPending}
            className="mt-4 w-full"
          >
            {settingsMut.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </form>
      </Form>

      {/* Security link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keamanan</CardTitle>
          <CardDescription>Kelola autentikasi dua faktor</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.SETTINGS_SECURITY)}
          >
            Kelola 2FA
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Hapus Akun
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Akun"
        description="Akun Anda akan dihapus permanen beserta semua data. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus Akun"
        onConfirm={() => deleteMut.mutate()}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
