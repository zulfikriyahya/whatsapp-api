// src/components/messages/check-number-form.tsx
'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { messagesApi } from '@/api/messages.api'
import { normalizePhone } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SessionSelector } from '@/components/common/session-selector'
import { CheckCircle2, XCircle } from 'lucide-react'

export function CheckNumberForm() {
  const [phone, setPhone] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [shouldCheck, setShouldCheck] = useState(false)

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['check-number', sessionId, phone],
    queryFn: () => messagesApi.checkNumber(sessionId, normalizePhone(phone)),
    enabled: false,
  })

  const check = () => {
    setShouldCheck(true)
    refetch()
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <p className="text-sm font-medium">Cek Nomor WhatsApp</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-1">
          <Label className="text-xs">Sesi</Label>
          <SessionSelector value={sessionId} onChange={setSessionId} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Nomor</Label>
          <Input
            placeholder="628xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={check}
            disabled={!phone || !sessionId || isFetching}
            variant="outline"
            size="sm"
            className="h-10"
          >
            {isFetching ? 'Mengecek...' : 'Cek'}
          </Button>
        </div>
      </div>
      {shouldCheck && data !== undefined && (
        <div
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${data.exists ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-red-50 text-red-700 dark:bg-red-900/20'}`}
        >
          {data.exists ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Nomor terdaftar di WhatsApp
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" /> Nomor tidak terdaftar di WhatsApp
            </>
          )}
        </div>
      )}
    </div>
  )
}
