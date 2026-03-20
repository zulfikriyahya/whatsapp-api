import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { useBroadcastStore } from '@/store/broadcast.store'
import { QK } from '@/constants/query-keys'
import type {
  BroadcastProgressPayload,
  BroadcastCompletePayload,
} from '@/types/socket'

export function useBroadcastProgress() {
  const { setProgress, setDone } = useBroadcastStore()
  const qc = useQueryClient()
  useEffect(() => {
    const socket = getSocket()
    const onProgress = (d: BroadcastProgressPayload) =>
      setProgress(d.campaignId, d)
    const onComplete = (d: BroadcastCompletePayload) => {
      setDone(d.campaignId, d.successCount, d.failedCount)
      qc.invalidateQueries({ queryKey: QK.CAMPAIGNS })
      toast.success(
        `Broadcast selesai — ${d.successCount} berhasil, ${d.failedCount} gagal`
      )
    }
    socket.on(SOCKET_EVENTS.BROADCAST_PROGRESS, onProgress)
    socket.on(SOCKET_EVENTS.BROADCAST_COMPLETE, onComplete)
    return () => {
      socket.off(SOCKET_EVENTS.BROADCAST_PROGRESS, onProgress)
      socket.off(SOCKET_EVENTS.BROADCAST_COMPLETE, onComplete)
    }
  }, [setProgress, setDone, qc])
}
