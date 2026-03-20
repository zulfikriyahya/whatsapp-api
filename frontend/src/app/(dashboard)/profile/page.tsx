// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/profile/page.tsx
'use client'
import { profileApi } from '@/api/profile.api'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { PageHeader } from '@/components/common/page-header'
import { SessionSelector } from '@/components/common/session-selector'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const qc = useQueryClient()
  const [sessionId, setSessionId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [status, setStatus] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)

  const { data: profile, isLoading } = useQuery({
    queryKey: QK.WA_PROFILE(sessionId),
    queryFn: () => profileApi.get(sessionId),
    enabled: !!sessionId,
    onSuccess: (d) => {
      setDisplayName(d.pushname ?? '')
      setStatus(d.about ?? '')
    },
  })

  const nameMut = useMutation({
    mutationFn: () => profileApi.setDisplayName(sessionId, displayName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WA_PROFILE(sessionId) })
      toast.success('Nama diperbarui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const statusMut = useMutation({
    mutationFn: () => profileApi.setStatus(sessionId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WA_PROFILE(sessionId) })
      toast.success('Status diperbarui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const photoMut = useMutation({
    mutationFn: (file: File) => profileApi.uploadPhoto(sessionId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WA_PROFILE(sessionId) })
      toast.success('Foto diperbarui')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deletePhotoMut = useMutation({
    mutationFn: () => profileApi.deletePhoto(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WA_PROFILE(sessionId) })
      toast.success('Foto dihapus')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader
        title="Profil WhatsApp"
        description="Kelola profil akun WhatsApp aktif"
      />

      <div className="space-y-1.5">
        <Label>Pilih Sesi</Label>
        <SessionSelector value={sessionId} onChange={setSessionId} />
      </div>

      {sessionId && (
        <>
          {isLoading ? (
            <LoadingSkeleton rows={3} />
          ) : (
            profile && (
              <>
                {/* Photo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Foto Profil</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.profilePictureUrl} />
                        <AvatarFallback>
                          {profile.pushname?.[0] ?? 'W'}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        className="bg-primary absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-white"
                        onClick={() => photoRef.current?.click()}
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                      <input
                        ref={photoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) photoMut.mutate(f)
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {profile.pushname ?? 'Tidak ada nama'}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {profile.phoneNumber}
                      </p>
                      {profile.profilePictureUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-1 h-6 px-0 text-xs text-red-500"
                          onClick={() => deletePhotoMut.mutate()}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Hapus Foto
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Display Name */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Nama Tampilan</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <Button
                      onClick={() => nameMut.mutate()}
                      disabled={nameMut.isPending}
                    >
                      {nameMut.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Status/Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Status / Bio</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Input
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      placeholder="Hey there! I am using WhatsApp."
                    />
                    <Button
                      onClick={() => statusMut.mutate()}
                      disabled={statusMut.isPending}
                    >
                      {statusMut.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Info Sesi</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ['Platform', profile.platform],
                      ['Nomor', profile.phoneNumber],
                    ].map(([k, v]) =>
                      v ? (
                        <div key={k as string}>
                          <p className="text-muted-foreground">{k}</p>
                          <p className="font-medium">{v}</p>
                        </div>
                      ) : null
                    )}
                  </CardContent>
                </Card>
              </>
            )
          )}
        </>
      )}
    </div>
  )
}
