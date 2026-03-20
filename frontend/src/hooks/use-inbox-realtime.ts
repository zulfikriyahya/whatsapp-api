import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { useInboxStore } from '@/store/inbox.store'
import { QK } from '@/constants/query-keys'
import type { NewMessagePayload } from '@/types/socket'

export function useInboxRealtime() {
  const increment = useInboxStore((s) => s.increment)
  const qc = useQueryClient()
  const pathname = usePathname()
  useEffect(() => {
    const socket = getSocket()
    const handler = (data: NewMessagePayload) => {
      increment()
      qc.invalidateQueries({ queryKey: QK.CONVERSATIONS })
      if (!pathname.startsWith('/inbox')) {
        toast.info(`Pesan baru dari ${data.message.from}`)
      }
    }
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handler)
    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handler)
    }
  }, [increment, qc, pathname])
}
