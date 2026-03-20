// src/hooks/use-quota.ts
import { useAuthStore } from '@/store/auth.store'
export function useQuota() {
  const user = useAuthStore((s) => s.user)
  if (!user?.tier)
    return {
      dailyUsed: 0,
      dailyLimit: 0,
      monthlyUsed: 0,
      monthlyLimit: 0,
      dailyPct: 0,
      monthlyPct: 0,
    }

  // quota from user object — populated from /auth/me
  const q = (user as any).quota ?? {
    messagesSentToday: 0,
    broadcastsThisMonth: 0,
    dailyLimit: 0,
    monthlyLimit: 0,
  }
  return {
    dailyUsed: q.messagesSentToday,
    dailyLimit: q.dailyLimit,
    monthlyUsed: q.broadcastsThisMonth,
    monthlyLimit: q.monthlyLimit,
    dailyPct:
      q.dailyLimit > 0
        ? Math.min(100, (q.messagesSentToday / q.dailyLimit) * 100)
        : 0,
    monthlyPct:
      q.monthlyLimit > 0
        ? Math.min(100, (q.broadcastsThisMonth / q.monthlyLimit) * 100)
        : 0,
  }
}
