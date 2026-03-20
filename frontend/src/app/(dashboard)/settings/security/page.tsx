'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck, ShieldOff, KeyRound, Copy, Check } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { parseApiError } from '@/lib/api-error'
import { PageHeader } from '@/components/common/page-header'
import { CopyButton } from '@/components/common/copy-button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Badge } from '@/components/ui/badge'

// ── Setup 2FA Dialog ──────────────────────────────────────────────────────────
function Setup2FADialog({
  open,
  onClose,
  onEnabled,
}: {
  open: boolean
  onClose: () => void
  onEnabled: (codes: string[]) => void
}) {
  const [step, setStep] = useState<'qr' | 'verify'>('qr')
  const [qrData, setQrData] = useState<{
    qrCode: string
    secret: string
  } | null>(null)
  const [code, setCode] = useState('')

  const setupMut = useMutation({
    mutationFn: authApi.setup2fa,
    onSuccess: (d) => {
      setQrData(d)
      setStep('qr')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const enableMut = useMutation({
    mutationFn: () => authApi.enable2fa({ code }),
    onSuccess: (r) => {
      onEnabled(r.backupCodes)
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const handleOpen = () => {
    if (!qrData) setupMut.mutate()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
        else handleOpen()
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Aktifkan 2FA</DialogTitle>
        </DialogHeader>
        {step === 'qr' && qrData ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Scan QR code ini dengan aplikasi authenticator (Google
              Authenticator, Authy, dll).
            </p>
            <div className="flex justify-center">
              <div className="rounded-xl border bg-white p-3">
                <QRCodeSVG value={qrData.qrCode} size={180} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Atau masukkan secret manual:</Label>
              <div className="flex items-center gap-2">
                <code className="bg-muted flex-1 rounded px-2 py-1.5 text-xs break-all">
                  {qrData.secret}
                </code>
                <CopyButton text={qrData.secret} />
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep('verify')}>
              Lanjut Verifikasi
            </Button>
          </div>
        ) : step === 'verify' ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Masukkan kode 6 digit dari aplikasi authenticator untuk
              mengkonfirmasi.
            </p>
            <div className="flex flex-col items-center gap-3">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('qr')}>
                Kembali
              </Button>
              <Button
                onClick={() => enableMut.mutate()}
                disabled={code.length < 6 || enableMut.isPending}
              >
                {enableMut.isPending ? 'Mengaktifkan...' : 'Aktifkan'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4 text-center">
            <Button
              onClick={() => setupMut.mutate()}
              disabled={setupMut.isPending}
            >
              {setupMut.isPending ? 'Memuat...' : 'Muat QR Code'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Backup Codes Dialog ───────────────────────────────────────────────────────
function BackupCodesDialog({
  codes,
  onClose,
}: {
  codes: string[]
  onClose: () => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backup Codes</DialogTitle>
        </DialogHeader>
        <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ Simpan backup codes ini sekarang di tempat yang aman. Tidak akan
            ditampilkan lagi.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-2 gap-2">
          {codes.map((c) => (
            <div
              key={c}
              className="bg-muted/50 flex items-center gap-1 rounded border px-3 py-1.5"
            >
              <code className="flex-1 font-mono text-xs">{c}</code>
              <CopyButton text={c} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Saya sudah menyimpannya</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Disable 2FA Dialog ────────────────────────────────────────────────────────
function Disable2FADialog({
  open,
  onClose,
  onDisabled,
}: {
  open: boolean
  onClose: () => void
  onDisabled: () => void
}) {
  const [code, setCode] = useState('')
  const mut = useMutation({
    mutationFn: () => authApi.disable2fa({ code }),
    onSuccess: () => {
      onDisabled()
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nonaktifkan 2FA</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Masukkan kode dari aplikasi authenticator untuk mengonfirmasi.
        </p>
        <div className="flex flex-col items-center gap-3">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => mut.mutate()}
            disabled={code.length < 6 || mut.isPending}
          >
            {mut.isPending ? 'Menonaktifkan...' : 'Nonaktifkan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Regenerate Backup Codes Dialog ────────────────────────────────────────────
function RegenerateCodesDialog({
  open,
  onClose,
  onRegenerated,
}: {
  open: boolean
  onClose: () => void
  onRegenerated: (codes: string[]) => void
}) {
  const [code, setCode] = useState('')
  const mut = useMutation({
    mutationFn: () => authApi.regenerateBackupCodes({ code }),
    onSuccess: (r) => {
      onRegenerated(r.backupCodes)
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Regenerate Backup Codes</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Backup codes lama akan dinonaktifkan. Masukkan kode authenticator
          untuk lanjut.
        </p>
        <div className="flex flex-col items-center gap-3">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={() => mut.mutate()}
            disabled={code.length < 6 || mut.isPending}
          >
            {mut.isPending ? 'Generating...' : 'Regenerate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SecuritySettingsPage() {
  const { user, setUser } = useAuthStore()
  const [setupOpen, setSetupOpen] = useState(false)
  const [disableOpen, setDisableOpen] = useState(false)
  const [regenOpen, setRegenOpen] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)

  const handleEnabled = (codes: string[]) => {
    setUser({ ...user!, twoFaEnabled: true })
    setBackupCodes(codes)
  }
  const handleDisabled = () => setUser({ ...user!, twoFaEnabled: false })

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Keamanan"
        description="Kelola autentikasi dua faktor akun Anda"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {user?.twoFaEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldOff className="text-muted-foreground h-5 w-5" />
            )}
            <div>
              <CardTitle className="text-base">
                Autentikasi Dua Faktor (2FA)
              </CardTitle>
              <CardDescription>
                {user?.twoFaEnabled
                  ? 'Akun Anda dilindungi dengan 2FA'
                  : 'Tambahkan lapisan keamanan ekstra pada akun Anda'}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`ml-auto border-0 ${user?.twoFaEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {user?.twoFaEnabled ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {user?.twoFaEnabled ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDisableOpen(true)}
              >
                <ShieldOff className="mr-2 h-4 w-4" />
                Nonaktifkan 2FA
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRegenOpen(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Regenerate Backup Codes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setSetupOpen(true)}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Aktifkan 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Setup2FADialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onEnabled={handleEnabled}
      />
      <Disable2FADialog
        open={disableOpen}
        onClose={() => setDisableOpen(false)}
        onDisabled={handleDisabled}
      />
      <RegenerateCodesDialog
        open={regenOpen}
        onClose={() => setRegenOpen(false)}
        onRegenerated={setBackupCodes}
      />
      {backupCodes && (
        <BackupCodesDialog
          codes={backupCodes}
          onClose={() => setBackupCodes(null)}
        />
      )}
    </div>
  )
}
