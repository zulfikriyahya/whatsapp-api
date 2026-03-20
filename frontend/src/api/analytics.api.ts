import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { DashboardStats, SystemStatus } from '@/types/analytics'

export const analyticsApi = {
  dashboard: (days: number = 7) =>
    api
      .get<
        ApiResponse<DashboardStats>
      >('/analytics/dashboard', { params: { days } })
      .then((r) => r.data.data!),

  system: () =>
    api
      .get<ApiResponse<SystemStatus>>('/analytics/system')
      .then((r) => r.data.data!),
}
