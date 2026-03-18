# Software Requirements Specification (SRS)
## WhatsApp Gateway SaaS — Frontend
**Versi:** 1.0.0
**Tanggal:** 2026-03-19
**Status:** Final

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Gambaran Sistem](#2-gambaran-sistem)
3. [Pengguna & Role](#3-pengguna--role)
4. [Arsitektur & Stack Teknologi](#4-arsitektur--stack-teknologi)
5. [Autentikasi & Keamanan](#5-autentikasi--keamanan)
6. [Layout & Navigasi](#6-layout--navigasi)
7. [Modul — Fungsional Requirements](#7-modul--fungsional-requirements)
   - 7.1 Dashboard
   - 7.2 Sessions (WhatsApp)
   - 7.3 Messages
   - 7.4 Broadcast
   - 7.5 Broadcast List
   - 7.6 Inbox
   - 7.7 Contacts
   - 7.8 Customer Note
   - 7.9 Auto Reply
   - 7.10 Workflow Automation
   - 7.11 Drip Campaign
   - 7.12 Scheduler
   - 7.13 Scheduled Event
   - 7.14 Templates
   - 7.15 Webhook
   - 7.16 API Keys
   - 7.17 Settings
   - 7.18 Analytics
   - 7.19 Audit Log
   - 7.20 Tiers
   - 7.21 Users (Admin)
   - 7.22 Workspace
   - 7.23 Profile WA
   - 7.24 Chats
   - 7.25 Groups
   - 7.26 Channels
   - 7.27 Labels
   - 7.28 Status WA
   - 7.29 Calls
   - 7.30 Storage
   - 7.31 Admin — Impersonation
   - 7.32 Health
8. [Realtime — WebSocket](#8-realtime--websocket)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Komponen Reusable](#10-komponen-reusable)
11. [State Management](#11-state-management)
12. [Error Handling Global](#12-error-handling-global)
13. [Batasan & Asumsi](#13-batasan--asumsi)

---

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen ini mendefinisikan seluruh kebutuhan fungsional dan non-fungsional untuk membangun antarmuka web (frontend) aplikasi WhatsApp Gateway SaaS. Frontend dibangun di atas Next.js 15 App Router dan berkomunikasi dengan backend NestJS melalui REST API dan WebSocket.

### 1.2 Ruang Lingkup
Frontend mencakup:
- Semua halaman yang berkorespondensi dengan 32 resource API backend
- Koneksi WebSocket realtime untuk QR code, status sesi, pesan masuk, progress broadcast, dan notifikasi sistem
- Sistem autentikasi via Google OAuth + 2FA
- Role-based access control (user, admin, super_admin)
- Tier-based feature gating
- Antarmuka admin untuk manajemen user, tier, dan impersonation

### 1.3 Referensi
- Backend API Documentation v1.0
- Backend source code (NestJS + Prisma)
- Scaffold frontend: `setup.sh`
- Base URL API: `NEXT_PUBLIC_API_URL`
- WebSocket URL: `NEXT_PUBLIC_WS_URL`

---

## 2. Gambaran Sistem

```
Browser (Next.js 15)
  ├── REST API  ──→ NestJS Backend (http://localhost:3000/api/v1)
  └── WebSocket ──→ Socket.io Server (http://localhost:3000)
```

Frontend berjalan di port **3001**. Autentikasi menggunakan cookie `auth_token` (HttpOnly, dikirim otomatis via `withCredentials: true`). Semua request non-publik wajib menyertakan cookie ini. Untuk akses via API Key, header `X-API-Key` digunakan — namun fitur ini hanya relevan untuk integrasi eksternal, bukan untuk UI.

---

## 3. Pengguna & Role

| Role | Akses |
|------|-------|
| `user` | Semua fitur sesuai tier yang dimiliki |
| `admin` | Semua fitur user + kelola user, tier, setting global, impersonation |
| `super_admin` | Sama dengan admin |

**Tier Feature Gating:** Beberapa fitur hanya tersedia jika tier user memiliki feature key tertentu. Komponen `<TierGate feature="...">` digunakan untuk menyembunyikan/memblokir akses fitur yang tidak tersedia. Admin dan super_admin selalu bypass feature gate.

---

## 4. Arsitektur & Stack Teknologi

| Kategori | Pilihan |
|----------|---------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State Global | Zustand (auth, session, notification, broadcast, inbox, ui) |
| Data Fetching | TanStack Query v5 + Axios |
| Realtime | Socket.io Client v4 |
| Form | React Hook Form + Zod |
| Tabel | TanStack Table v8 |
| Grafik | Recharts |
| Notifikasi | Sonner |
| Dark Mode | next-themes |
| QR Code | qrcode.react |
| CSV | papaparse |

### 4.1 Struktur Route Groups
```
src/app/
  (auth)/           → layout tanpa sidebar (login, 2FA)
  (dashboard)/      → layout dengan sidebar + header
    dashboard/
    sessions/
    messages/
    inbox/
    broadcast/
    contacts/
    auto-reply/
    workflows/
    drip-campaigns/
    scheduler/
    scheduled-events/
    templates/
    chats/
    groups/
    channels/
    labels/
    calls/
    profile/
    analytics/
    audit/
    api-keys/
    workspaces/
    settings/
    admin/            → hanya admin & super_admin
```

### 4.2 Pola Data Fetching
- Semua GET request menggunakan `useQuery` dari TanStack Query
- Semua POST/PUT/PATCH/DELETE menggunakan `useMutation`
- Cache key terpusat di `src/constants/query-keys.ts`
- Setelah mutasi berhasil: `queryClient.invalidateQueries(QK.xxx)`
- Error ditangani via `parseApiError()` dan ditampilkan dengan `sonner.toast.error()`

---

## 5. Autentikasi & Keamanan

### 5.1 Alur Login
1. User klik tombol "Login dengan Google" → redirect ke `GET /auth/google`
2. Setelah OAuth callback, backend set cookie `auth_token`
3. Jika user punya 2FA aktif → redirect ke `/auth/2fa?token={tempToken}`
4. Jika tidak → redirect ke `/dashboard`

### 5.2 Halaman 2FA (`/auth/2fa`)
- Baca `?token` dari URL search params
- Form input kode 6 digit (TOTP) atau backup code (format `XXXXX-XXXXX`)
- Submit: `POST /auth/2fa/verify` dengan `{ tempToken, code }`
- Sukses: redirect ke `/dashboard`
- Error `ERR_2FA_SESSION_EXPIRED`: tampilkan pesan + redirect ke `/login`
- Gunakan komponen `<InputOTP>` dari shadcn/ui untuk input 6 digit

### 5.3 Middleware (`src/middleware.ts`)
- Setiap request ke route `(dashboard)` dicek keberadaan cookie `auth_token`
- Jika tidak ada: redirect ke `/login`
- Jika ada dan request ke `/login` atau `/auth/2fa`: redirect ke `/dashboard`

### 5.4 Auth Provider (`src/providers/auth-provider.tsx`)
- Saat mount: fetch `GET /auth/me`
- Simpan hasilnya ke `useAuthStore`
- Jika 401: redirect ke `/login`
- Tampilkan loading skeleton selama fetch berlangsung

### 5.5 Setup 2FA (di halaman Settings > Security)
- Tombol "Aktifkan 2FA" → `POST /auth/2fa/setup` → tampilkan QR code + secret
- User scan QR di authenticator app, lalu input kode → `POST /auth/2fa/enable`
- Response `backupCodes` ditampilkan di dialog dengan peringatan "Simpan sekarang, tidak akan ditampilkan lagi"
- Tombol "Nonaktifkan 2FA" → konfirmasi + input kode → `POST /auth/2fa/disable`
- Tombol "Regenerate Backup Codes" → konfirmasi + input kode → `POST /auth/2fa/backup-codes/regenerate`

### 5.6 Logout
- Tombol di user menu → `POST /auth/logout` → redirect ke `/login`

---

## 6. Layout & Navigasi

### 6.1 App Shell
Semua halaman dashboard dibungkus `<AppShell>` yang terdiri dari:
- **Sidebar** (desktop, fixed kiri): logo, navigasi per grup, user section bawah
- **Header** (top bar): hamburger menu (mobile), breadcrumb auto, notification bell, theme toggle, user avatar
- **Main Content** (area kanan): `{children}`

### 6.2 Sidebar Navigation
Grup navigasi (dari `src/constants/nav-items.ts`):
1. **Utama**: Dashboard, Sesi WhatsApp, Inbox
2. **Pesan**: Kirim Pesan, Riwayat Pesan, Broadcast
3. **Otomatisasi**: Auto Reply, Workflow, Drip Campaign, Scheduler
4. **Manajemen**: Kontak, Template, Grup, Channel, Label, Panggilan
5. **Akun**: Profil WA, Workspace, API Keys, Webhook
6. **Laporan**: Analytics, Audit Log
7. **Pengaturan**: Settings
8. **Admin** (hanya role admin/super_admin): Kelola User, Kelola Tier, Audit Log, Pengaturan Global

Nav item dengan `feature` property hanya ditampilkan jika `useAuthStore.hasFeature(feature)` bernilai `true`.

### 6.3 Banner Kontekstual (di bawah header)
- **Impersonation Banner** (kuning): muncul jika token memiliki claim `impersonatedBy` — tampilkan "Anda sedang melihat akun {nama}" + tombol "Akhiri Sesi"
- **Maintenance Banner** (merah): muncul jika `globalSetting.maintenanceMode === true`
- **Grace Period Banner** (oranye): muncul jika `user.tier.isGrace === true` — tampilkan "Langganan Anda berakhir {tanggal}, tier akan downgrade ke Free"
- **Quota Warning Banner** (kuning): muncul saat WS event `system_alert` type `quota_warning` atau `quota_exceeded`

### 6.4 Notification Bell
- Ikon lonceng di header dengan badge jumlah unread (dari `useNotificationStore`)
- Klik: dropdown list 10 notifikasi terbaru
- Setiap notifikasi dari WS event `system_alert` ditambahkan ke store
- "Tandai semua dibaca" + "Hapus semua" action
- Klik item: tandai read

### 6.5 Breadcrumb
- Auto-generate dari `pathname` menggunakan mapping dari `ROUTES`
- Contoh: `/broadcast/campaigns/uuid` → `Broadcast > Campaigns > Detail`

---

## 7. Modul — Fungsional Requirements

---

### 7.1 Dashboard (`/dashboard`)

**Tujuan:** Ringkasan aktivitas terkini dalam satu tampilan.

**Komponen utama:**
- `<SummaryCards>` — 3 kartu KPI: Total Pesan Terkirim, Success Rate (%), Total Broadcast. Data dari `GET /analytics/dashboard?days=7`
- `<MessageChart>` — Line/bar chart pesan per hari (total, sukses, gagal). Recharts. Selector: 7 | 14 | 30 hari
- `<RecentCampaigns>` — Tabel 5 campaign terakhir dengan status badge
- `<RecentLogs>` — Tabel 20 log pesan terakhir
- `<SessionStatusCards>` — Card untuk setiap sesi WA milik user: nama, nomor, status badge realtime (dari `useSessionStore`)
- `<SystemStatusCard>` — Memory, uptime, Node version. Data dari `GET /analytics/system` (hanya admin)

**Perilaku:**
- Seluruh data di-refetch otomatis setiap 60 detik (`refetchInterval: 60_000`)
- Jika tidak ada sesi WA: tampilkan `<EmptyState>` dengan tombol "Tambah Sesi"

---

### 7.2 Sessions — Sesi WhatsApp (`/sessions`)

**Tujuan:** Kelola koneksi akun WhatsApp.

**Halaman:**
- List semua sesi: `GET /sessions`
- Setiap sesi ditampilkan sebagai `<SessionCard>` dengan: nama, nomor, status badge realtime, tombol aksi

**Aksi per sesi:**
- **Tambah Sesi**: dialog form `{ name, usePairingCode }`. Jika `usePairingCode: true`, wajib isi `phoneNumber`. Submit → `POST /sessions`
- **QR Code**: setelah POST, WS event `qr` diterima → buka `<SessionQrDialog>` yang menampilkan QR code via `qrcode.react`. Update realtime jika QR refresh
- **Pairing Code**: setelah POST dengan pairing, WS event `code` diterima → buka `<SessionPairingDialog>` menampilkan 8 karakter code
- **Reconnect**: `POST /sessions/:id/reconnect`. Disabled jika status `logged_out`
- **Set Default**: `POST /sessions/:id/default`. Satu sesi default per user (ditandai bintang)
- **Info**: `GET /sessions/:id/info` → dialog tampilkan state, version, pushname, platform
- **Hapus**: konfirmasi dialog → `DELETE /sessions/:id`

**Status badge warna:**
- `connected` → hijau
- `authenticating` → kuning/amber
- `disconnected` → abu
- `logged_out` → merah

**Realtime:**
- WS `connection_update` → update `useSessionStore.updateStatus()`
- WS `qr` → update QR di dialog yang sedang terbuka
- WS `code` → tampilkan pairing code

---

### 7.3 Messages — Pesan (`/messages/send`, `/messages/logs`)

#### 7.3.1 Kirim Pesan (`/messages/send`)
Halaman dengan tabs untuk setiap tipe pengiriman:

| Tab | Endpoint | Field Utama |
|-----|----------|-------------|
| Teks | `POST /messages/send` | to, message, sessionId, quotedMessageId |
| Media | `POST /messages/send-media` | to, file (multipart), sessionId, caption |
| Lokasi | `POST /messages/send-location` | to, latitude, longitude, description |
| Live Lokasi | `POST /messages/send-live-location` | to, latitude, longitude, duration, description |
| Poll | `POST /messages/send-poll` | to, question, options (min 2), multiselect |
| Kontak | `POST /messages/send-contact` | to, contacts (array nomor) |
| Voice Note | `POST /messages/send-voice-note` | to, file audio (multipart) |

**Perilaku umum:**
- Field `sessionId` default `"auto"` — dropdown pilih sesi aktif atau biarkan auto round-robin
- Nomor `to` divalidasi format dan dinormalisasi (`0xxx` → `62xxx`) sebelum submit
- Sukses: `sonner.toast.success("Pesan terkirim")` + reset form
- Error: tampilkan pesan dari `parseApiError()` via `sonner.toast.error()`
- Respons sandbox: jika `data.sandbox === true`, tampilkan badge "Sandbox — Pesan tidak dikirim"
- Tombol "Pilih Template" membuka `<TemplatePicker>` yang mengisi field `message`
- Upload file: validasi MIME di client sebelum upload, tampilkan progress jika besar

**Cek Nomor WA:**
- Sub-section: input nomor + tombol cek → `GET /messages/check/:sessionId/:phone`
- Tampilkan hasil: ✓ Terdaftar / ✗ Tidak terdaftar

#### 7.3.2 Riwayat Pesan (`/messages/logs`)
- Tabel: timestamp, target, tipe, status badge, pesan (truncate 50 char)
- Filter: status (success/failed/pending), sessionId, date range
- Pagination server-side
- Tombol "Export PDF" → `GET /messages/logs/export-pdf` → download file

---

### 7.4 Broadcast (`/broadcast/campaigns`)

**Tujuan:** Kirim pesan massal ke banyak penerima.

**List Campaign (`/broadcast/campaigns`):**
- Tabel: nama, total penerima, sukses, gagal, status, waktu
- Filter: status campaign
- Status badge: pending (abu) | processing (biru) | completed (hijau) | cancelled (merah)
- Tombol "Buat Broadcast"

**Detail Campaign (`/broadcast/campaigns/[id]`):**
- Statistik: total, sukses, gagal, persentase
- Jika status `processing`: tampilkan `<BroadcastProgressDialog>` dengan progress bar realtime dari WS
- Tombol "Export PDF" → `GET /broadcast/campaigns/:id/export-pdf`
- Tombol "Batalkan" (hanya status pending/processing) → `POST /broadcast/campaigns/:id/cancel` + konfirmasi

**Buat Broadcast (Dialog):**
Form multi-tab untuk penerima:
- **Tab Manual**: textarea input nomor (satu per baris atau koma)
- **Tab CSV**: upload file CSV (`name,number,tag`) — parse client-side dengan papaparse, preview 5 baris pertama
- **Tab Tag**: dropdown pilih tag dari daftar tag kontak

Field lain: nama campaign, pesan, attachment file (opsional).
Validasi: minimal satu tab penerima terisi. Submit → `POST /broadcast`.

**Realtime Progress:**
WS `broadcast_progress` → update `useBroadcastStore.setProgress()` → progress bar + counter di detail campaign
WS `broadcast_complete` → `useBroadcastStore.setDone()` → notifikasi + invalidate query

---

### 7.5 Broadcast List (`/broadcast-list`)

**Tujuan:** Kelola WA native broadcast list.

- Selector sesi → `GET /broadcast-list/:sessionId` → tabel daftar broadcast list
- Klik item → `GET /broadcast-list/:sessionId/:broadcastId` → detail
- Tombol "Kirim Pesan" → dialog form pesan → `POST /broadcast-list/:sessionId/:broadcastId/send`

---

### 7.6 Inbox (`/inbox`)

**Tujuan:** Antarmuka percakapan masuk (CRM-like).

**Layout 2-kolom:**
- **Kiri**: `<ConversationList>` — `GET /inbox/conversations`, diurutkan pesan terbaru, badge unread count realtime
- **Kanan**: `<MessageThread>` — `GET /inbox?jid={jid}` saat conversation dipilih

**ConversationList:**
- Setiap item: nama/nomor, preview pesan terakhir, waktu, badge unread (merah)
- Klik → set active JID → load thread kanan
- Filter: tombol "Semua" / "Belum Dibaca"
- Total unread dari `useInboxStore.unreadTotal` (diupdate WS `new_message`)

**MessageThread:**
- Daftar pesan sebagai bubble (masuk = kiri, keluar tidak ditampilkan di inbox)
- Klik pesan → "Tandai Dibaca" (`PATCH /inbox/:id/read`)
- Tombol "Tandai Semua Dibaca" → `PATCH /inbox/conversations/:jid/read-all`
- Form reply di bawah: input teks + tombol kirim → `POST /inbox/:id/reply`
- Support `quotedMessageId` — klik reply pada bubble pesan

**Realtime:**
WS `new_message` → `useInboxStore.increment()` + `queryClient.invalidateQueries(QK.CONVERSATIONS)` + scroll to bottom jika conversation aktif

---

### 7.7 Contacts (`/contacts`)

**Tujuan:** Phonebook internal — kontak yang digunakan untuk broadcast, drip, dll.

**Fitur:**
- Tabel dengan search (nama/nomor/tag), filter by tag, pagination
- Kolom: nama, nomor, tag, catatan (preview), aksi
- **Tambah**: dialog form → `POST /contacts`
- **Edit**: dialog form pre-filled → `PUT /contacts/:id`
- **Hapus**: konfirmasi → `DELETE /contacts/:id`
- **Bulk Delete**: checkbox multiple → toolbar bulk action → `POST /contacts/bulk-delete`
- **Import CSV**: dialog upload file → preview → `POST /contacts/import` → tampilkan hasil `{imported, skipped, errors}`
- **Import Google**: dialog input `accessToken` → `POST /contacts/import-google`
- **Export CSV**: tombol → `GET /contacts/export` → download file
- Nomor input otomatis dinormalisasi (0xxx → 62xxx)

---

### 7.8 Customer Note (`/contacts` — inline)

**Tujuan:** Catatan internal per kontak (fitur tier `customer_note`).

- Kolom "Catatan" di tabel kontak dibungkus `<TierGate feature="customer_note">`
- Ikon notes pada baris kontak → buka `<NoteDialog>`
- Dialog: tampilkan catatan existing (jika ada) + textarea untuk edit
- Simpan: `PUT /contacts/:contactId/note`
- Hapus: `DELETE /contacts/:contactId/note`

---

### 7.9 Auto Reply (`/auto-reply`)

**Tujuan:** Balas pesan masuk secara otomatis berdasarkan keyword (fitur tier `auto_reply`).

**Halaman:**
- Tabel rules: keyword, tipe match, respons (truncate), prioritas, status (active/inactive), aksi
- Diurutkan berdasarkan prioritas (terkecil duluan)
- Filter: active/inactive
- **Tambah/Edit**: dialog form — keyword, response, matchType, priority
- **Toggle**: switch aktif/nonaktif → `POST /auto-reply/:id/toggle`
- **Hapus**: konfirmasi → `DELETE /auto-reply/:id`

**Match Type Badge warna:**
- `exact` → biru
- `contains` → hijau
- `regex` → ungu
- `ai_smart` → oranye (AI)

**Validasi khusus:**
- `matchType: "regex"` → validasi format regex di client sebelum submit
- `matchType: "ai_smart"` → field `response` berubah label menjadi "Persona / Instruksi AI"

---

### 7.10 Workflow Automation (`/workflows`)

**Tujuan:** Otomasi multi-step berdasarkan trigger pesan (fitur tier `workflow`).

**Halaman:**
- Grid/list workflow card: nama, trigger keyword, jumlah node, status, executionCount
- **Tambah/Edit**: dialog form dengan 2 bagian:
  1. **Trigger Condition**: keyword + matchType (exact/contains/regex)
  2. **Node Editor**: list node yang bisa ditambah/hapus/reorder
- **Toggle**: `POST /workflows/:id/toggle`
- **Hapus**: konfirmasi → `DELETE /workflows/:id`

**Node Editor:**
Setiap node memiliki:
- Selector tipe: `send_message` | `delay` | `add_tag`
- Config dinamis sesuai tipe:
  - `send_message` → textarea pesan
  - `delay` → input detik (1–3600)
  - `add_tag` → input nama tag
- Tombol "Tambah Node" + hapus per node
- Validasi: maksimal 20 node, delay tidak boleh > 3600 detik

---

### 7.11 Drip Campaign (`/drip-campaigns`)

**Tujuan:** Kirim pesan otomatis berseri berdasarkan hari sejak kontak ditandai (fitur tier `drip_campaign`).

**List Drip:**
- Card: nama, triggerTag, jumlah subscriber aktif, jumlah step, status
- **Tambah/Edit**: dialog form — nama, triggerTag, sessionId (opsional), steps

**Step Editor:**
Setiap step: dayOffset (hari ke berapa), timeAt (HH:MM WIB), pesan. Validasi:
- Tidak boleh dua step dengan dayOffset yang sama
- `timeAt` harus format HH:MM

**Subscriber (`/drip-campaigns/[id]/subscribers`):**
- Tabel: nama kontak, nomor, status subscription, lastStepDay, tanggal mulai
- Filter: status (active/completed/paused/cancelled)
- Tombol "Batalkan" per subscriber → `POST /drip-campaigns/subscriptions/:id/cancel`

---

### 7.12 Scheduler (`/scheduler`)

**Tujuan:** Jadwalkan pengiriman pesan pada waktu tertentu (fitur tier `scheduler`).

**Halaman:**
- Tabel: target, pesan (truncate), sesi, waktu jadwal, recurrence, status
- Status badge: pending (abu) | sent (hijau) | failed (merah) | cancelled (abu gelap)
- Filter: status
- **Buat**: dialog form — target, message, sessionId, scheduledTime (datetime picker), recurrenceType
- **Batalkan** (hanya pending): `POST /scheduler/:id/cancel`
- **Hapus**: `DELETE /scheduler/:id` (semua status bisa dihapus)

**Validasi:**
- `scheduledTime` harus di masa depan
- `sessionId` dipilih dari dropdown sesi aktif user

---

### 7.13 Scheduled Event (`/scheduled-events`)

**Tujuan:** Kirim undangan WA Scheduled Event dan respond event masuk.

**Halaman:**
- Tab "Kirim Event": form → `POST /scheduled-events/send`
  - Field: to, title, startTime (datetime picker), description, location, sessionId
- Tab "Respond Event": form → `POST /scheduled-events/respond`
  - Field: messageId, response (accept/decline), sessionId

---

### 7.14 Templates (`/templates`)

**Tujuan:** Template pesan yang bisa dipakai ulang di form kirim pesan.

**Halaman:**
- Grid card: nama, kategori badge, preview konten (truncate)
- Filter by kategori
- **Tambah/Edit**: dialog form — nama, content (textarea dengan hint placeholder {name}, {date}), kategori
- **Hapus**: konfirmasi → `DELETE /templates/:id`

**Template Picker (`<TemplatePicker>`):**
- Komponen popover yang bisa dipasang di form kirim pesan
- Klik template → isi field `message` di form induk
- Search template by nama/kategori

---

### 7.15 Webhook (`/settings/webhook`)

**Tujuan:** Konfigurasi webhook untuk menerima notifikasi event WA (fitur tier `webhook`).

**Halaman:**
- **Config Form**: tampilkan URL webhook saat ini, toggle isActive, input URL baru → `PUT /webhooks/config`
- **Secret Card**: tampilkan secret (masked) + tombol "Generate Ulang" → `POST /webhooks/generate-secret` → tampilkan secret baru **sekali** di dialog (peringatan: simpan sekarang)
- **Test Webhook**: tombol → `POST /webhooks/test` → tampilkan `{ targetStatus, responseTime }` atau error
- **Format Payload**: section informatif menampilkan contoh payload dan header HMAC

---

### 7.16 API Keys (`/api-keys`)

**Tujuan:** Generate dan kelola token API untuk akses programmatik (fitur tier `api_access`).

**Halaman:**
- Tabel: nama, preview (8 karakter), IP whitelist, sandbox badge, expiry, last used, aksi
- **Buat Token**: dialog form — nama, ipWhitelist (input multi-IP), isSandbox (toggle), expiresAt (date picker opsional)
- Setelah create: `<KeyRevealDialog>` tampilkan token penuh dengan peringatan "Simpan sekarang — tidak ditampilkan lagi" + tombol copy
- **Hapus**: konfirmasi → `DELETE /keys/:id`
- Sandbox badge ditampilkan oranye untuk key dengan `isSandbox: true`

---

### 7.17 Settings

**Halaman utama (`/settings`):** Pengaturan personal user.

- **General**: nama, foto profil → `PUT /users/profile`
- **AI/Gemini** (`/settings/ai`): Gemini API Key (masked + reveal), confidence threshold slider → `POST /settings/me`
- **Auto Download**: toggle foto, video, audio, dokumen → `POST /settings/me`
- **Security** (`/settings/security`): section 2FA (lihat 5.5)
- **Danger Zone**: tombol "Hapus Akun" → konfirmasi dialog → `DELETE /users/me` → redirect `/login`

**Halaman admin (`/admin/settings`):**

- **Global Settings**: defaultDailyMessageLimit, defaultMonthlyBroadcastLimit → `POST /settings/global`
- **Maintenance Mode**: toggle ON/OFF → `POST /settings/maintenance`
- **Announcement**: textarea + kirim → `POST /settings/announcement` — broadcast ke semua user via WS

---

### 7.18 Analytics (`/analytics`)

**Tujuan:** Visualisasi data pengiriman pesan dan status sistem.

**Halaman:**
- Selector periode: 7 | 14 | 30 hari → `GET /analytics/dashboard?days={n}`
- `<SummaryCards>`: Total Pesan, Success Rate, Total Broadcast
- `<MessageChart>`: area chart per hari (total, sukses, gagal) — Recharts
- `<RecentCampaigns>`: tabel 5 campaign terakhir
- `<RecentLogs>`: tabel 20 log terbaru

**System Status** (hanya admin, sub-section bawah):
- Data dari `GET /analytics/system`
- `<SystemStatusCard>`: memory, uptime, Node version
- `<SessionsStatusCard>`: total, connected, disconnected
- `<QueueStatusCard>`: broadcast & webhook queue (waiting, active, failed)
- Auto-refresh setiap 30 detik

---

### 7.19 Audit Log (`/audit`)

**Tujuan:** Riwayat aktivitas akun.

**Halaman:**
- Tabel: timestamp, email, action badge, IP, detail (popover)
- Admin melihat semua user. User biasa hanya miliknya
- Filter: action (dropdown semua AuditAction), from date, to date
- Pagination
- Tombol "Export PDF" → `GET /audit/export-pdf` → download

**Action badge warna (contoh):**
- LOGIN/LOGOUT → abu
- CREATE/DELETE SESSION → biru/merah
- START/CANCEL BROADCAST → hijau/merah
- ENABLE/DISABLE 2FA → ungu
- ASSIGN_TIER → kuning
- CREATE/DELETE USER → biru/merah

---

### 7.20 Tiers (`/admin/tiers`)

**Tujuan (admin):** Kelola paket layanan. Hanya diakses admin/super_admin.

**Halaman:**
- Grid tier card: nama, harga, limits (sessions, pesan/hari, dll), daftar fitur dengan ✓
- **Tambah/Edit**: dialog form — nama, deskripsi, semua limit, features (checkbox list), harga, isActive
- **Hapus**: konfirmasi → `DELETE /tiers/:id`
- **Assign Tier**: `POST /tiers/assign` — input userId (atau search user), pilih tier, pilih expiresAt
- **Riwayat Tier**: link ke tabel riwayat per user dari `GET /tiers/history/:userId`

**Grace Period:**
- Tier dengan `isGrace: true` ditandai badge "Grace" di user detail
- Informasi: tier otomatis downgrade ke Free setelah 3 hari grace period

---

### 7.21 Users — Admin (`/admin/users`)

**Tujuan (admin):** Kelola semua user platform.

**List (`/admin/users`):**
- Tabel: nama, email, role badge, tier badge + grace indicator, status (active/inactive), tanggal daftar
- Search (nama/email), filter role, filter isActive
- Pagination

**Detail (`/admin/users/[id]`):**
- Info lengkap user
- Tier aktif + tanggal expiry + isGrace
- Quota saat ini (messagesSentToday, broadcastsThisMonth)
- Tombol "Update User": dialog → ubah role, isActive → `PUT /users/:id`
- Tombol "Update Kuota": dialog → reset/set quota → `PUT /users/:id/quota`
- Tombol "Assign Tier": buka assign tier dialog
- Tombol "Riwayat Tier": tabel log ASSIGN_TIER dari `GET /tiers/history/:id`
- Tombol "Impersonate": buka impersonation dialog
- Tombol "Hapus User": konfirmasi → `DELETE /users/:id`

---

### 7.22 Workspace (`/workspaces`)

**Tujuan:** Kelola tim/workspace untuk kolaborasi.

**Halaman:**
- List workspace yang diikuti: `GET /workspaces`
- Setiap card: nama workspace, jumlah anggota, role user di workspace
- **Buat Workspace**: dialog form nama → `POST /workspaces`
- **Detail Workspace** (inline expand atau modal):
  - Tabel anggota: nama, email, role, joined at
  - **Undang Anggota** (owner): dialog input email → `POST /workspaces/:id/invite`
  - **Update Permission** (owner): dialog edit role + custom permissions → `PUT /workspaces/:id/members/:memberId/permission`
  - **Hapus Anggota** (owner): konfirmasi → `DELETE /workspaces/:id/members/:memberId`

---

### 7.23 Profile WA (`/profile`)

**Tujuan:** Kelola profil akun WhatsApp aktif.

**Halaman:**
- Selector sesi (dropdown sesi connected)
- Setelah pilih sesi → load `GET /profile/:sessionId`
- **Info Profil**: tampilkan pushname, nomor, platform
- **Ubah Display Name**: inline form → `POST /profile/:sessionId/display-name`
- **Ubah Status/Bio**: inline form → `POST /profile/:sessionId/status`
- **Foto Profil**: tampilkan foto (jika ada) + tombol upload → `POST /profile/:sessionId/photo` + hapus → `DELETE /profile/:sessionId/photo`

**Kontak WA:**
- Tabel kontak dari WA: `GET /profile/:sessionId/contacts`
- Klik kontak → foto profil (`GET .../photo`) + tombol blokir/unblokir
- Tab "Diblokir": `GET /profile/:sessionId/contacts/blocked`

---

### 7.24 Chats (`/chats`)

**Tujuan:** Kelola chat list dari akun WA.

**Halaman:**
- Selector sesi → `GET /chats/:sessionId`
- List chat dengan aksi per item:
  - Archive / Unarchive
  - Mute (input durasi detik) / Unmute
  - Pin / Unpin
  - Mark as Read
  - Hapus (konfirmasi)
- Search: `GET /chats/:sessionId/search?q=keyword`

---

### 7.25 Groups (`/groups`)

**Tujuan:** Kelola grup WhatsApp.

**List (`/groups`):**
- Selector sesi → tampilkan semua grup dari sesi tersebut (via `GET /chats` filter grup)
- Tombol "Buat Grup": dialog — nama, daftar nomor peserta → `POST /groups/:sessionId`
- Klik grup → ke detail

**Detail (`/groups/[sessionId]/[groupId]`):**
- Info: nama, deskripsi, jumlah anggota — `GET /groups/:sessionId/:groupId`
- **Invite Link**: tampilkan link + revoke → `GET .../invite` + `POST .../invite/revoke`
- **Join via Code**: form input invite code → `POST /groups/:sessionId/join`
- **Tabel Anggota**: daftar peserta + role (admin/member)
  - Tambah: `POST .../participants/add`
  - Hapus: `POST .../participants/remove`
  - Promote/Demote: toggle per anggota
- **Membership Requests**: list pending requests + tombol Approve/Reject → `GET/POST .../membership-request`
- **Update Info**: form nama + deskripsi → `POST .../update`
- **Keluar Grup**: konfirmasi → `POST .../leave`

---

### 7.26 Channels (`/channels`)

**Tujuan:** Kelola WA Channels (fitur tier `channels`).

**Halaman:**
- Selector sesi → `GET /channels/:sessionId`
- Tombol "Cari Channel": dialog search → `GET /channels/:sessionId/search?query=...`
- Tombol "Join via Invite Code": form → `GET /channels/:sessionId/invite/:inviteCode`
- Per channel card: nama, subscriber count, tombol Subscribe/Unsubscribe
- **Kirim Pesan**: dialog → `POST /channels/:sessionId/:channelId/send`
- **Kelola Admin** (owner): dialog → `POST .../admin` (add/remove)
- **Transfer Ownership**: dialog → `POST .../transfer`
- **Update Info**: form nama + deskripsi → `PUT .../`
- **Hapus Channel**: konfirmasi → `DELETE .../`

---

### 7.27 Labels (`/labels`)

**Tujuan:** Kelola label WA Business (fitur tier `labels`).

**Halaman:**
- Selector sesi → `GET /labels/:sessionId`
- List label dengan warna
- Klik label → `GET /labels/:sessionId/labels/:labelId/chats` → tampilkan chat berlabel
- **Assign Label ke Chat**: dialog pilih chatId + labelId → `POST /labels/:sessionId/chats/:chatId/labels/:labelId`
- **Hapus Label dari Chat**: `POST .../remove`

---

### 7.28 Status WA (`/profile` — sub-section atau inline)

**Tujuan:** Kelola status/story akun WA.

- **Set Bio**: form → `POST /status/:sessionId/bio`
- **Kirim Status Teks**: form teks → `POST /status/:sessionId/send`
- **Presence Toggle**: switch Online/Offline → `POST /status/:sessionId/presence`

---

### 7.29 Calls (`/calls`)

**Tujuan:** Log panggilan masuk dan buat call link.

**Halaman:**
- Tabel log panggilan: nomor, tipe (voice/video), status (missed), sesi, waktu — `GET /calls`
- Tombol "Buat Call Link": dialog pilih sesi → `POST /calls/link` → tampilkan link + copy button
- Realtime: WS `incoming_call` → toast notifikasi + tambah ke tabel (invalidate query)

---

### 7.30 Storage

**Tujuan:** Tidak ada halaman khusus. Utility untuk mengakses file media yang didownload.

- `buildFileUrl(filename)` dari `src/lib/utils.ts` menghasilkan URL `GET /storage/uploads/:filename`
- Digunakan oleh komponen yang menampilkan media hasil download (inbox message dengan media, dll)
- Autentikasi via cookie (withCredentials), backend validasi userId dari JWT

---

### 7.31 Admin — Impersonation

**Tujuan (admin):** Login sebagai user lain untuk keperluan support/debug.

**Alur:**
1. Di halaman `/admin/users/[id]`: tombol "Impersonate" → `<ImpersonationDialog>`
2. Dialog konfirmasi → `POST /admin/impersonate` dengan `{ userId }`
3. Response: `{ token, targetUser, expiresIn }`
4. Simpan token di sessionStorage (bukan cookie) untuk digunakan sementara
5. Tampilkan `<ImpersonationBanner>` di seluruh halaman: "Anda sedang melihat akun {nama}" + tombol "Akhiri"
6. Akhiri: `DELETE /admin/impersonate/:targetUserId` + hapus token dari sessionStorage + sembunyikan banner

**Batasan:**
- Tidak bisa impersonate sesama admin/super_admin
- Token impersonation berlaku 1 jam

---

### 7.32 Health

**Tujuan:** Monitoring kesehatan sistem (background check).

- Tidak ada halaman khusus
- Dipanggil di `auth-provider` saat init: `GET /health`
- Jika redis down (`"redis": "unavailable"`): tampilkan system alert banner

---

## 8. Realtime — WebSocket

### 8.1 Inisialisasi
`socket-provider.tsx` bertanggung jawab:
1. Panggil `getSocket(token)` menggunakan JWT dari cookie (diambil via `/auth/me`)
2. `socket.connect()` setelah user terautentikasi
3. `socket.disconnect()` saat logout
4. Attach semua listener global di provider

### 8.2 Mapping Event → Aksi Frontend

| Event | Handler | Aksi |
|-------|---------|------|
| `qr` | `use-qr-listener` | `sessionStore.setActiveQr()` |
| `code` | `use-pairing-listener` | `sessionStore.setActivePairing()` |
| `connection_update` | `use-connection-listener` | `sessionStore.updateStatus()` + `invalidate QK.SESSIONS` |
| `new_message` | `use-inbox-realtime` | `inboxStore.increment()` + `invalidate QK.CONVERSATIONS` + toast jika bukan halaman inbox |
| `message_ack` | `use-message-ack` | `invalidate QK.INBOX` untuk conversation aktif |
| `incoming_call` | `use-incoming-call` | toast notifikasi + `invalidate QK.CALLS` |
| `broadcast_progress` | `use-broadcast-progress` | `broadcastStore.setProgress()` |
| `broadcast_complete` | `use-broadcast-progress` | `broadcastStore.setDone()` + `invalidate QK.CAMPAIGNS` + toast |
| `system_alert` | `use-system-alerts` | `notificationStore.add()` + toast berdasarkan type |
| `group_join` | global | toast info + `invalidate QK.GROUP_INFO` |
| `group_leave` | global | toast + invalidate |
| `group_membership_request` | global | toast + badge di halaman groups |

### 8.3 System Alert Handling

| Type | Tampilan |
|------|---------|
| `quota_warning` | Toast warning + QuotaWarningBanner |
| `quota_exceeded` | Toast error + banner |
| `session_disconnected` | Toast warning + update status badge |
| `session_logged_out` | Toast error + update status badge |
| `all_sessions_down` | Toast error besar |
| `ai_disabled` | Toast warning |
| `disk_warning` | Toast warning (admin) |
| `redis_disconnected` | Toast error (admin) |
| `announcement` | Toast info + notifikasi bell |

---

## 9. Non-Functional Requirements

### 9.1 Performa
- LCP (Largest Contentful Paint) < 2.5 detik pada koneksi 4G
- Semua halaman list menggunakan server-side pagination (tidak load semua data)
- Image dari Google profile dioptimasi via `next/image`
- Skeleton loading untuk semua query yang memerlukan fetch

### 9.2 Aksesibilitas
- Semua form memiliki label yang benar dan error message yang jelas
- Komponen shadcn/ui memastikan keyboard navigation dan ARIA attributes
- Warna badge memiliki kontras cukup untuk dark mode dan light mode

### 9.3 Responsivitas
- Sidebar tersembunyi di mobile (< 768px), diganti hamburger menu → Sheet
- Tabel horizontal scroll di mobile
- Form dialog menyesuaikan viewport

### 9.4 Dark Mode
- Seluruh UI mendukung dark/light mode via `next-themes`
- Default: mengikuti system preference

### 9.5 Error Handling
- Semua error API ditampilkan dengan pesan bahasa Indonesia via `parseApiError()`
- Error 401: redirect ke `/login` (di axios interceptor)
- Error 503 `ERR_MAINTENANCE`: tampilkan halaman maintenance khusus
- Error 403 `ERR_FEATURE_NOT_AVAILABLE`: tampilkan dialog upgrade tier
- Network error: toast "Tidak dapat terhubung ke server, periksa koneksi"

### 9.6 Keamanan
- Tidak ada kredensial atau token yang disimpan di localStorage
- Cookie `auth_token` bersifat HttpOnly (dikelola browser, tidak diakses JS)
- Input file divalidasi MIME type di client sebelum upload
- Nomor telepon dinormalisasi dan divalidasi sebelum dikirim ke API

---

## 10. Komponen Reusable

| Komponen | Lokasi | Kegunaan |
|----------|--------|---------|
| `<DataTable>` | `common/data-table` | Tabel dengan sort, pagination, TanStack Table |
| `<ConfirmDialog>` | `common/confirm-dialog` | AlertDialog konfirmasi hapus/aksi destruktif |
| `<EmptyState>` | `common/empty-state` | Ilustrasi + pesan + CTA saat data kosong |
| `<ErrorState>` | `common/error-state` | Ilustrasi + pesan error + tombol retry |
| `<LoadingSkeleton>` | `common/loading-skeleton` | Placeholder saat data loading |
| `<StatusBadge>` | `common/status-badge` | Badge dengan warna per status |
| `<FileUploader>` | `common/file-uploader` | Drag-drop + preview + validasi MIME/ukuran |
| `<PhoneInput>` | `common/phone-input` | Input nomor + normalisasi 62xxx |
| `<DatePicker>` | `common/date-picker` | Date + time picker |
| `<DateRangePicker>` | `common/date-range-picker` | Untuk filter analytics/audit |
| `<SearchInput>` | `common/search-input` | Input search dengan debounce 300ms |
| `<StatsCard>` | `common/stats-card` | Card KPI: label, nilai, icon, trend |
| `<TierGate>` | `common/tier-gate` | Render children hanya jika punya feature |
| `<RoleGate>` | `common/role-gate` | Render children berdasarkan role |
| `<QuotaBar>` | `common/quota-bar` | Progress bar kuota harian/bulanan |
| `<ExportPdfButton>` | `common/export-pdf-button` | Trigger download + loading state |
| `<SessionSelector>` | `common/session-selector` | Dropdown pilih sesi WA aktif |
| `<CopyButton>` | `common/copy-button` | Copy ke clipboard + icon feedback |
| `<ApiErrorAlert>` | `common/api-error-alert` | Alert merah dengan pesan error Indonesia |
| `<TemplatePicker>` | `templates/template-picker` | Popover pilih template untuk isi form |
| `<PageHeader>` | `common/page-header` | Judul halaman + breadcrumb + action buttons |

---

## 11. State Management

### 11.1 Zustand Stores

| Store | State | Diupdate oleh |
|-------|-------|---------------|
| `useAuthStore` | user, isLoading, isAdmin(), hasFeature() | auth-provider, logout |
| `useSessionStore` | activeQr, activePairing, sessionStatuses | WS listeners |
| `useNotificationStore` | notifications[], unreadCount | WS system_alert |
| `useBroadcastStore` | progress map per campaignId | WS broadcast_progress/complete |
| `useInboxStore` | unreadTotal | WS new_message |
| `useUiStore` | sidebarOpen | header toggle |

### 11.2 TanStack Query
Digunakan untuk semua data server. Tidak ada duplikasi state server di Zustand. Aturan:
- Data yang berubah karena WS event: invalidate query yang relevan
- Data UI ephemeral (modal open, form state): local `useState`
- Data global yang dibutuhkan banyak komponen tanpa re-fetch: Zustand

---

## 12. Error Handling Global

### 12.1 Hirarki Error
1. **Axios Interceptor**: tangkap 401 → redirect `/login`
2. **useMutation onError**: `parseApiError(error)` → `sonner.toast.error(message)`
3. **useQuery onError**: tampilkan `<ErrorState>` dengan tombol retry
4. **Error Boundary**: tangkap error render → tampilkan fallback UI

### 12.2 `parseApiError(error)`
```
AxiosError → response.data.code → ERROR_CODES[code] → pesan Indonesia
AxiosError → response.data.error → teks langsung
AxiosError → message → fallback
Unknown → "Terjadi kesalahan"
```

### 12.3 Kasus Khusus
| Error Code | Penanganan Khusus |
|------------|------------------|
| `ERR_FEATURE_NOT_AVAILABLE` | Dialog "Upgrade Tier" dengan info fitur dan CTA upgrade |
| `ERR_QUOTA_DAILY_EXCEEDED` | Toast + QuotaBar merah di halaman kirim pesan |
| `ERR_SESSION_NOT_CONNECTED` | Toast + link ke halaman Sessions |
| `ERR_MAINTENANCE` | Redirect ke halaman `/maintenance` |
| `ERR_2FA_SESSION_EXPIRED` | Toast + redirect ke `/login` |

---

## 13. Batasan & Asumsi

1. Frontend **tidak** mengimplementasi payment gateway — manajemen tier dilakukan manual oleh admin
2. Upload file maksimal 50MB sesuai batas backend (`MAX_FILE_SIZE_MB`)
3. MIME types yang diizinkan untuk upload mengikuti list dari backend (image, video, audio, document)
4. Timezone seluruh tampilan tanggal/waktu menggunakan **WIB (Asia/Jakarta)** via `date-fns-tz`
5. Browser minimum: Chrome 90+, Firefox 88+, Safari 14+
6. Frontend tidak menyimpan media secara permanen — file diakses via endpoint `/storage/uploads/:filename`
7. Fitur impersonation hanya tersedia di halaman admin dan tidak mengubah route URL
8. Socket.io reconnect otomatis ditangani oleh library; tidak perlu logic manual
9. Semua export PDF diproses di backend — frontend hanya trigger download dan terima binary
10. `sessionId: "auto"` pada form kirim pesan berarti backend memilih sesi via round-robin; user tetap bisa pilih sesi spesifik lewat dropdown
