// src/hooks/use-socket.ts
import { useSocket as useSocketCtx } from '@/providers/socket-provider'
export function useSocket() {
  return useSocketCtx()
}
