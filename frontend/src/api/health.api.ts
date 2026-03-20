import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface HealthStatus {
  status: string
  redis: 'available' | 'unavailable'
  uptime: number
}

export const healthApi = {
  check: () =>
    api.get<ApiResponse<HealthStatus>>('/health').then((r) => r.data.data!),
}
