// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/messages/logs/page.tsx
import { PageHeader } from '@/components/common/page-header'
import { MessageLogTable } from '@/components/messages/message-log-table'

export default function MessageLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Pesan"
        description="Log semua pesan yang telah dikirim"
      />
      <MessageLogTable />
    </div>
  )
}
