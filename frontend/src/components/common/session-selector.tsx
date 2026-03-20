// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/session-selector.tsx
'use client'
import { sessionsApi } from '@/api/sessions.api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QK } from '@/constants/query-keys'
import { useSessionStore } from '@/store/session.store'
import { useQuery } from '@tanstack/react-query'

interface Props {
  value?: string
  onChange: (value: string) => void
  connectedOnly?: boolean
  placeholder?: string
}
export function SessionSelector({
  value,
  onChange,
  connectedOnly = true,
  placeholder = 'Pilih sesi',
}: Props) {
  const { data: sessions = [] } = useQuery({
    queryKey: QK.SESSIONS,
    queryFn: sessionsApi.list,
  })
  const statuses = useSessionStore((s) => s.sessionStatuses)
  const filtered = connectedOnly
    ? sessions.filter((s) => (statuses[s.id] ?? s.status) === 'connected')
    : sessions
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filtered.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name} {s.phoneNumber ? `(${s.phoneNumber})` : ''}
          </SelectItem>
        ))}
        {filtered.length === 0 && (
          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
            Tidak ada sesi aktif
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
