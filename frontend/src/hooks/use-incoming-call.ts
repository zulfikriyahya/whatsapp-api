import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { QK } from '@/constants/query-keys'
import type { IncomingCallPayload } from '@/types/socket'

export function useIncomingCall() {
  const qc = useQueryClient()
  useEffect(() => {
    const socket = getSocket()
    const handler = (data: IncomingCallPayload) => {
      const label = data.call.isVideo ? 'Panggilan Video' : 'Panggilan Suara'
      toast.info(`${label} masuk dari ${data.call.from}`)
      qc.invalidateQueries({ queryKey: QK.CALLS })
    }
    socket.on(SOCKET_EVENTS.INCOMING_CALL, handler)
    return () => {
      socket.off(SOCKET_EVENTS.INCOMING_CALL, handler)
    }
  }, [qc])
}
