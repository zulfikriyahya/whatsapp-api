// ─────────────────────────────────────────────────────────────────────────────
// src/components/broadcast/broadcast-progress-dialog.tsx
'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useBroadcastStore } from '@/store/broadcast.store'

interface Props {
  campaignId: string
  open: boolean
  onClose: () => void
}
export function BroadcastProgressDialog({ campaignId, open, onClose }: Props) {
  const progress = useBroadcastStore((s) => s.progress[campaignId])
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Progress Broadcast</DialogTitle>
        </DialogHeader>
        {progress ? (
          <div className="space-y-4 py-2">
            <Progress value={progress.percentage} className="h-3" />
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-xl font-bold">{progress.current}</p>
                <p className="text-muted-foreground text-xs">Diproses</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">
                  {progress.successCount}
                </p>
                <p className="text-muted-foreground text-xs">Berhasil</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-500">
                  {progress.failedCount}
                </p>
                <p className="text-muted-foreground text-xs">Gagal</p>
              </div>
            </div>
            <p className="text-muted-foreground text-center text-sm">
              {progress.done
                ? 'Broadcast selesai!'
                : `${progress.percentage}% — ${progress.current}/${progress.total}`}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Menunggu data progress...
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
