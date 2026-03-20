// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/broadcast/campaigns/[id]/page.tsx
'use client'
import { broadcastApi } from '@/api/broadcast.api'
import { BroadcastProgressDialog } from '@/components/broadcast/broadcast-progress-dialog'
import { BroadcastStatsCards } from '@/components/broadcast/broadcast-stats-cards'
import { CampaignStatusBadge } from '@/components/broadcast/campaign-status-badge'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { ErrorState } from '@/components/common/error-state'
import { ExportPdfButton } from '@/components/common/export-pdf-button'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BarChart2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { toast } from 'sonner'

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const qc = useQueryClient()
  const [progressOpen, setProgressOpen] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)

  const {
    data: campaign,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: QK.CAMPAIGN(id),
    queryFn: () => broadcastApi.get(id),
    refetchInterval: (d) =>
      d.state.data?.status === 'processing' ? 5000 : false,
  })

  const cancelMut = useMutation({
    mutationFn: () => broadcastApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CAMPAIGN(id) })
      toast.success('Broadcast dibatalkan')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError || !campaign) return <ErrorState onRetry={refetch} />

  const canCancel =
    campaign.status === 'pending' || campaign.status === 'processing'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(ROUTES.BROADCAST_CAMPAIGNS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={campaign.name}
          description={`Dibuat ${formatDate(campaign.createdAt)}`}
          action={
            <div className="flex items-center gap-2">
              <CampaignStatusBadge status={campaign.status} />
              {campaign.status === 'processing' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressOpen(true)}
                >
                  <BarChart2 className="mr-2 h-3.5 w-3.5" /> Progress
                </Button>
              )}
              <ExportPdfButton
                onExport={() => broadcastApi.exportPdf(id)}
                filename={`broadcast-${id}.pdf`}
              />
              {canCancel && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setCancelConfirm(true)}
                >
                  <XCircle className="mr-2 h-3.5 w-3.5" /> Batalkan
                </Button>
              )}
            </div>
          }
        />
      </div>

      <BroadcastStatsCards campaign={campaign} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{campaign.message}</p>
        </CardContent>
      </Card>

      <BroadcastProgressDialog
        campaignId={id}
        open={progressOpen}
        onClose={() => setProgressOpen(false)}
      />
      <ConfirmDialog
        open={cancelConfirm}
        onOpenChange={setCancelConfirm}
        title="Batalkan Broadcast"
        description="Broadcast yang sedang berjalan akan dihentikan. Lanjutkan?"
        confirmLabel="Batalkan Broadcast"
        onConfirm={() => cancelMut.mutate()}
        loading={cancelMut.isPending}
      />
    </div>
  )
}
