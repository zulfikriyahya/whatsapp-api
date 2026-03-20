export interface DashboardStats {
  totalMessages: number
  successRate: number
  totalBroadcasts: number
  dailyStats: DailyStat[]
  recentCampaigns: RecentCampaign[]
  recentLogs: RecentLog[]
}

export interface DailyStat {
  date: string
  total: number
  success: number
  failed: number
}

export interface RecentCampaign {
  id: string
  name: string
  status: string
  totalRecipients: number
  successCount: number
  failedCount: number
  createdAt: string
}

export interface RecentLog {
  id: string
  to: string
  type: string
  status: string
  message?: string
  createdAt: string
}

export interface SystemStatus {
  memory: {
    used: number
    total: number
    percentage: number
  }
  uptime: number
  nodeVersion: string
  sessions: {
    total: number
    connected: number
    disconnected: number
  }
  queues: {
    broadcast: QueueStatus
    webhook: QueueStatus
  }
}

export interface QueueStatus {
  waiting: number
  active: number
  failed: number
}
