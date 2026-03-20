// ─────────────────────────────────────────────────────────────────────────────
// src/app/(auth)/auth/2fa/page.tsx
'use client'
import { authApi } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/lib/api-error'
import { ShieldCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TwoFaPage() {
  const params = useSearchParams()
  const router = useRouter()
  const tempToken = params.get('token') ?? ''
  const [code, setCode] = useState('')
  const [isBackup, setIsBackup] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!code) return
    setLoading(true)
    try {
      await authApi.verify2fa({ tempToken, code })
      router.push(ROUTES.DASHBOARD)
    } catch (e) {
      const msg = parseApiError(e)
      if (msg.includes('kadaluarsa')) {
        toast.error(msg)
        router.push(ROUTES.LOGIN)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
          <ShieldCheck className="text-primary h-6 w-6" />
        </div>
        <CardTitle>Verifikasi 2FA</CardTitle>
        <CardDescription>
          {isBackup
            ? 'Masukkan backup code Anda'
            : 'Masukkan kode dari aplikasi authenticator Anda'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isBackup ? (
          <div className="flex flex-col items-center gap-3">
            <Label>Kode 6 Digit</Label>
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Backup Code</Label>
            <Input
              placeholder="XXXXX-XXXXX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center font-mono tracking-widest"
            />
          </div>
        )}

        <Button className="w-full" onClick={submit} disabled={loading || !code}>
          {loading ? 'Memverifikasi...' : 'Verifikasi'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-full"
          onClick={() => {
            setIsBackup(!isBackup)
            setCode('')
          }}
        >
          {isBackup ? 'Gunakan kode authenticator' : 'Gunakan backup code'}
        </Button>
      </CardContent>
    </Card>
  )
}
