import type { TierFeatureKey } from '@/types/tier'

export const TIER_FEATURE_LABELS: Record<TierFeatureKey, string> = {
  broadcast: 'Broadcast',
  auto_reply: 'Auto Reply',
  workflow: 'Workflow Automation',
  drip_campaign: 'Drip Campaign',
  ai_smart_reply: 'AI Smart Reply',
  channels: 'WA Channels',
  labels: 'Label WA Business',
  customer_note: 'Catatan Pelanggan',
  scheduler: 'Scheduler Pesan',
  webhook: 'Webhook',
  api_access: 'API Access',
}

export const TIER_FEATURE_DESCRIPTIONS: Record<TierFeatureKey, string> = {
  broadcast: 'Kirim pesan massal ke banyak penerima sekaligus',
  auto_reply: 'Balas pesan masuk secara otomatis berdasarkan keyword',
  workflow: 'Buat alur otomasi multi-step dari trigger pesan',
  drip_campaign: 'Kirim pesan berseri otomatis berdasarkan hari',
  ai_smart_reply: 'Gunakan AI untuk membalas pesan secara cerdas',
  channels: 'Kelola WA Channels untuk broadcast satu arah',
  labels: 'Beri label pada chat untuk organisasi yang lebih baik',
  customer_note: 'Simpan catatan internal untuk setiap kontak',
  scheduler: 'Jadwalkan pengiriman pesan pada waktu tertentu',
  webhook: 'Terima notifikasi event WhatsApp via HTTP callback',
  api_access: 'Akses API secara programmatik dengan API Key',
}
