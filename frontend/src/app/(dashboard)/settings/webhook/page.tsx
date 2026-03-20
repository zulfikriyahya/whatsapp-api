// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/settings/webhook/page.tsx
'use client'
import { webhookApi } from '@/api/webhook.api'
import { CopyButton } from '@/components/common/copy-button'
import { PageHeader } from '@/components/common/page-header'
import { TierGate } from '@/components/common/tier-gate'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function WebhookPage() {
  const qc = useQueryClient()
  const { data: config } = useQuery({
    queryKey: QK.WEBHOOK_CONFIG,
    queryFn: webhookApi.getConfig,
  })
  const [urlInput, setUrlInput] = useState(config?.url ?? '')
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{
    targetStatus: number
    responseTime: number
  } | null>(null)

  const updateMut = useMutation({
    mutationFn: () =>
      webhookApi.updateConfig({
        url: urlInput,
        isActive: config?.isActive ?? false,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WEBHOOK_CONFIG })
      toast.success('Webhook disimpan')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const toggleMut = useMutation({
    mutationFn: (isActive: boolean) => webhookApi.updateConfig({ isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.WEBHOOK_CONFIG }),
    onError: (e) => toast.error(parseApiError(e)),
  })
  const secretMut = useMutation({
    mutationFn: webhookApi.generateSecret,
    onSuccess: (r) => setNewSecret(r.secret),
    onError: (e) => toast.error(parseApiError(e)),
  })
  const testMut = useMutation({
    mutationFn: webhookApi.test,
    onSuccess: (r) => setTestResult(r),
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <TierGate feature="webhook">
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Webhook"
          description="Konfigurasi endpoint untuk menerima notifikasi event WhatsApp"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Konfigurasi URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={config?.isActive ?? false}
                onCheckedChange={(v) => toggleMut.mutate(v)}
              />
              <Label>{config?.isActive ? 'Aktif' : 'Nonaktif'}</Label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="https://yourdomain.com/webhook"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                onClick={() => updateMut.mutate()}
                disabled={updateMut.isPending}
              >
                {updateMut.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testMut.mutate()}
              disabled={testMut.isPending || !config?.url}
            >
              {testMut.isPending ? 'Testing...' : 'Test Webhook'}
            </Button>
            {testResult && (
              <div className="flex gap-3 text-sm">
                <Badge
                  variant="outline"
                  className={
                    testResult.targetStatus < 300
                      ? 'text-green-600'
                      : 'text-red-500'
                  }
                >
                  HTTP {testResult.targetStatus}
                </Badge>
                <span className="text-muted-foreground">
                  {testResult.responseTime}ms
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Webhook Secret</CardTitle>
            <CardDescription>
              Digunakan untuk verifikasi HMAC-SHA256
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="bg-muted flex-1 rounded px-3 py-2 text-xs">
                {config?.secret ? '••••••••••••••••' : 'Belum ada secret'}
              </code>
              {config?.secret && <CopyButton text={config.secret} />}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => secretMut.mutate()}
              disabled={secretMut.isPending}
            >
              {secretMut.isPending ? 'Generating...' : 'Generate Ulang Secret'}
            </Button>
          </CardContent>
        </Card>

        {newSecret && (
          <Dialog open onOpenChange={() => setNewSecret(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Secret Baru</DialogTitle>
              </DialogHeader>
              <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
                <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-300">
                  ⚠️ Simpan secret ini sekarang. Tidak akan ditampilkan lagi.
                </AlertDescription>
              </Alert>
              <div className="bg-muted/50 flex items-center gap-2 rounded-md border p-3">
                <code className="flex-1 text-xs break-all">{newSecret}</code>
                <CopyButton text={newSecret} />
              </div>
              <DialogFooter>
                <Button onClick={() => setNewSecret(null)}>
                  Saya sudah menyimpannya
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TierGate>
  )
}
