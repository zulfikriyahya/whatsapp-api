// src/app/(dashboard)/analytics/page.tsx
'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics.api'
import { QK } from '@/constants/query-keys'
import { useAuthStore } from '@/store/auth.store'
import { PageHeader } from '@/components/common/page-header'
import { StatsCard } from '@/components/common/stats-card'
import { ErrorState } from '@/components/common/error-state'
import { StatusBadge } from '@/components/common/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, formatBytes, truncate } from '@/lib/utils'
import {
  MessageSquare,
  TrendingUp,
  Megaphone,
  Server,
  Layers,
  AlertTriangle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function AnalyticsPage() {
  const [days, setDays] = useState(7)
  const isAdmin = useAuthStore((s) => s.isAdmin())

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QK.ANALYTICS_DASHBOARD(days),
    queryFn: () => analyticsApi.dashboard(days),
  })
  const { data: system } = useQuery({
    queryKey: QK.ANALYTICS_SYSTEM,
    queryFn: analyticsApi.system,
    enabled: isAdmin,
    refetchInterval: 30_000,
  })

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Analytics"
          description="Visualisasi data pengiriman pesan"
        />
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Hari</SelectItem>
            <SelectItem value="14">14 Hari</SelectItem>
            <SelectItem value="30">30 Hari</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total Pesan"
          value={isLoading ? '—' : (data?.totalMessages ?? 0).toLocaleString()}
          icon={MessageSquare}
        />
        <StatsCard
          label="Success Rate"
          value={isLoading ? '—' : `${data?.successRate ?? 0}%`}
          icon={TrendingUp}
        />
        <StatsCard
          label="Total Broadcast"
          value={
            isLoading ? '—' : (data?.totalBroadcasts ?? 0).toLocaleString()
          }
          icon={Megaphone}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistik Pesan Harian</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && data?.dailyStats && (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.dailyStats}>
                <defs>
                  {[
                    ['total', '#6366f1'],
                    ['success', '#22c55e'],
                    ['failed', '#ef4444'],
                  ].map(([k, c]) => (
                    <linearGradient
                      key={k}
                      id={`g-${k}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#6366f1"
                  fill="url(#g-total)"
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  name="Berhasil"
                  stroke="#22c55e"
                  fill="url(#g-success)"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  name="Gagal"
                  stroke="#ef4444"
                  fill="url(#g-failed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="px-4 py-2 text-left font-medium">Nama</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Berhasil</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentCampaigns ?? []).map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{truncate(c.name, 24)}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="text-muted-foreground px-4 py-2 text-right text-xs">
                      {c.successCount}/{c.totalRecipients}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Log Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="px-4 py-2 text-left font-medium">Tujuan</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentLogs ?? []).map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-mono text-xs">{l.to}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="text-muted-foreground px-4 py-2 text-right text-xs">
                      {formatDate(l.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Admin: System Status */}
      {isAdmin && system && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold">Status Sistem</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4" />
                  Server
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory</span>
                  <span>
                    {formatBytes(system.memory.used)} /{' '}
                    {formatBytes(system.memory.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span>{Math.floor(system.uptime / 3600)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Node</span>
                  <span>{system.nodeVersion}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4" />
                  Sesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>{system.sessions.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terhubung</span>
                  <span className="text-green-600">
                    {system.sessions.connected}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terputus</span>
                  <span className="text-red-500">
                    {system.sessions.disconnected}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {(['broadcast', 'webhook'] as const).map((q) => (
                  <div key={q}>
                    <p className="text-muted-foreground mb-0.5 text-xs capitalize">
                      {q}
                    </p>
                    <div className="flex gap-3 text-xs">
                      <span>W:{system.queues[q].waiting}</span>
                      <span>A:{system.queues[q].active}</span>
                      <span className="text-red-500">
                        F:{system.queues[q].failed}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
