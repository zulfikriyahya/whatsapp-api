// src/hooks/use-auth.ts
import { useAuthStore } from '@/store/auth.store'
export function useAuth() {
  return useAuthStore()
}
