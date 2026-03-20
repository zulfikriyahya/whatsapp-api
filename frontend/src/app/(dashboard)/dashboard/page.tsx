'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { MessageSquare, TrendingUp, Megaphone } from 'lucide-react'
import { analyticsApi } from '@/api/analytics.api'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { PageHeader } from '@/components/common/page-header'
import { StatsCard } from '@/components/common/stats-card'
import { ErrorState } from '@/components/common/error-state'
import { StatusBadge } from '@/components/common/status-badge'
import { SessionStatusCards } from '@/components/session/session-status-cards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, truncate } from '@/lib/utils'
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

const DAY_OPTIONS = [
  { value: '7', label: '7 Hari' },
  { value: '14', label: '14 Hari' },
  { value: '30', label: '30 Hari' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [days, setDays] = useState(7)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QK.ANALYTICS_DASHBOARD(days),
    queryFn: () => analyticsApi.dashboard(days),
    refetchInterval: 60_000,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          description="Ringkasan aktivitas platform Anda"
        />
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && <ErrorState onRetry={refetch} />}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total Pesan Terkirim"
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

      {/* Session Status Cards */}
      <SessionStatusCards onAddSession={() => router.push(ROUTES.SESSIONS)} />

      {/* Message Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistik Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && data?.dailyStats && (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={data.dailyStats}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#6366f1"
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  name="Berhasil"
                  stroke="#22c55e"
                  fill="url(#colorSuccess)"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  name="Gagal"
                  stroke="#ef4444"
                  fill="url(#colorFailed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(data?.recentCampaigns ?? []).length === 0 ? (
              <p className="text-muted-foreground px-6 py-8 text-center text-sm">
                Belum ada campaign
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="px-4 py-2 text-left font-medium">Nama</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Berhasil
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentCampaigns ?? []).map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-muted/30 cursor-pointer border-b last:border-0"
                      onClick={() =>
                        router.push(ROUTES.BROADCAST_CAMPAIGN(c.id))
                      }
                    >
                      <td className="px-4 py-2">{truncate(c.name, 24)}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="text-muted-foreground px-4 py-2 text-right">
                        {c.successCount}/{c.totalRecipients}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Log Pesan Terbaru</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.push(ROUTES.MESSAGES_LOGS)}
            >
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {(data?.recentLogs ?? []).length === 0 ? (
              <p className="text-muted-foreground px-6 py-8 text-center text-sm">
                Belum ada log pesan
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="px-4 py-2 text-left font-medium">Tujuan</th>
                    <th className="px-4 py-2 text-left font-medium">Tipe</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-right font-medium">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentLogs ?? []).map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-mono text-xs">{l.to}</td>
                      <td className="text-muted-foreground px-4 py-2 capitalize">
                        {l.type}
                      </td>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
