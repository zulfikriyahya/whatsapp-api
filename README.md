# WhatsApp Gateway SaaS — API Documentation

> **Base URL:** `http://localhost:3000/api/v1`
> **Swagger UI:** `http://localhost:3000/docs` *(development only)*
> **Auth:** Cookie `auth_token` (JWT HttpOnly) **atau** Header `X-API-Key`
> **Content-Type:** `application/json` *(kecuali upload file: `multipart/form-data`)*

---

## Response Format

### Success
```json
{ "status": true, "data": { ... } }
```

### Success dengan Pagination
```json
{
  "status": true,
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

### Error
```json
{ "status": false, "error": "Pesan error", "code": "ERR_CODE" }
```

### Error Codes

| Code | HTTP | Keterangan |
|------|------|-----------|
| `ERR_UNAUTHORIZED` | 401 | Tidak terautentikasi |
| `ERR_FORBIDDEN` | 403 | Tidak punya akses |
| `ERR_ACCOUNT_DISABLED` | 403 | Akun dinonaktifkan |
| `ERR_IP_NOT_WHITELISTED` | 403 | IP tidak diizinkan |
| `ERR_NOT_FOUND` | 404 | Data tidak ditemukan |
| `ERR_VALIDATION` | 400 | Validasi gagal |
| `ERR_INVALID_PHONE` | 400 | Format nomor tidak valid |
| `ERR_INVALID_REGEX` | 400 | Pola regex tidak valid |
| `ERR_INVALID_IP_FORMAT` | 400 | Format IP/CIDR tidak valid |
| `ERR_INVALID_TIME_FORMAT` | 400 | Format waktu HH:MM tidak valid |
| `ERR_SCHEDULE_PAST` | 400 | Waktu jadwal sudah lewat |
| `ERR_DUPLICATE_SESSION_NAME` | 409 | Nama sesi sudah ada |
| `ERR_DUPLICATE_CONTACT` | 409 | Kontak sudah ada |
| `ERR_DUPLICATE_TEMPLATE_NAME` | 409 | Nama template sudah ada |
| `ERR_DUPLICATE_DRIP_DAY` | 409 | Day offset drip sudah ada |
| `ERR_SESSION_NOT_CONNECTED` | 400 | Sesi WA tidak terkoneksi |
| `ERR_SESSION_LOGGED_OUT` | 400 | Sesi logout permanen |
| `ERR_SESSION_NOT_FOUND` | 404 | Sesi tidak ditemukan |
| `ERR_NO_SESSIONS` | 400 | Tidak ada sesi aktif |
| `ERR_NO_RECIPIENTS` | 400 | Tidak ada penerima broadcast |
| `ERR_QUOTA_DAILY_EXCEEDED` | 429 | Kuota pesan harian habis |
| `ERR_QUOTA_MONTHLY_EXCEEDED` | 429 | Kuota broadcast bulanan habis |
| `ERR_RATE_LIMIT` | 429 | Rate limit terlampaui |
| `ERR_2FA_INVALID_CODE` | 401 | Kode 2FA salah |
| `ERR_2FA_SESSION_EXPIRED` | 401 | Sesi 2FA expired (temp token) |
| `ERR_2FA_ALREADY_ENABLED` | 400 | 2FA sudah aktif |
| `ERR_2FA_NOT_ENABLED` | 400 | 2FA belum aktif |
| `ERR_CAMPAIGN_NOT_CANCELLABLE` | 400 | Campaign tidak bisa dibatalkan |
| `ERR_MESSAGE_ALREADY_SENT` | 400 | Pesan sudah terkirim |
| `ERR_WEBHOOK_NOT_CONFIGURED` | 400 | Webhook belum dikonfigurasi |
| `ERR_FEATURE_NOT_AVAILABLE` | 403 | Fitur tidak tersedia di tier ini |
| `ERR_AI_DISABLED` | 503 | AI Smart Reply dinonaktifkan |
| `ERR_SEND_FAILED` | 400 | Gagal kirim pesan ke WhatsApp |
| `ERR_FILE_TOO_LARGE` | 400 | File melebihi batas ukuran (50MB) |
| `ERR_FILE_TYPE_NOT_ALLOWED` | 400 | Tipe file tidak diizinkan |
| `ERR_WORKFLOW_TOO_MANY_NODES` | 400 | Workflow melebihi 20 node |
| `ERR_DELAY_TOO_LONG` | 400 | Delay melebihi 3600 detik |
| `ERR_CANNOT_DELETE_SELF` | 403 | Admin tidak bisa hapus dirinya sendiri |
| `ERR_MAINTENANCE` | 503 | Server dalam maintenance |
| `ERR_INTERNAL` | 500 | Error internal server |

---

## Pagination Query Params *(semua endpoint list)*

| Param | Type | Default | Max |
|-------|------|---------|-----|
| `page` | number | 1 | — |
| `limit` | number | 10 | 100 |

---

## Auth

### `GET /auth/google`
Redirect ke halaman login Google OAuth.
**Auth:** Tidak diperlukan

---

### `GET /auth/google/callback`
Callback Google OAuth. Set cookie `auth_token` dan redirect ke frontend.
**Auth:** Tidak diperlukan

**Redirect:**
- Jika 2FA aktif → `{CLIENT_URL}/auth/2fa?token={tempToken}`
- Jika tidak → `{CLIENT_URL}/dashboard`

---

### `POST /auth/2fa/verify`
Verifikasi kode 2FA setelah Google login. Mendukung kode TOTP 6 digit maupun backup code.
**Auth:** Tidak diperlukan

**Body:**
```json
{ "tempToken": "string", "code": "123456" }
```

> `tempToken` valid 5 menit dan one-time use.
> `code` bisa berupa:
> - Kode TOTP: `"123456"` (6 digit angka)
> - Backup code: `"ABCDE-FGHIJ"` (format 5 huruf besar + dash + 5 huruf besar)

**Response:** Set cookie `auth_token` secara otomatis.
```json
{
  "status": true,
  "data": { "user": { "id": "uuid", "email": "...", "role": "user" } }
}
```

---

### `GET /auth/me`
Data user yang sedang login.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://...",
    "role": "user",
    "twoFaEnabled": false
  }
}
```

---

### `POST /auth/2fa/setup`
Generate QR code untuk setup 2FA. Secret disimpan di Redis 10 menit.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": { "qrCode": "data:image/png;base64,...", "secret": "BASE32SECRET" }
}
```

---

### `POST /auth/2fa/enable`
Aktifkan 2FA setelah scan QR dan verifikasi kode.
**Auth:** Required

**Body:** `{ "code": "123456" }`

**Response:**
```json
{
  "status": true,
  "data": { "message": "2FA enabled", "backupCodes": ["XXXXX-XXXXX", "..."] }
}
```
> ⚠️ Simpan `backupCodes` — hanya ditampilkan sekali!

---

### `POST /auth/2fa/disable`
Nonaktifkan 2FA. Wajib verifikasi kode TOTP atau backup code.
**Auth:** Required

**Body:** `{ "code": "123456" }`

---

### `POST /auth/2fa/backup-codes/regenerate`
Regenerate backup codes. Kode lama otomatis tidak berlaku.
**Auth:** Required

**Body:** `{ "code": "123456" }`

**Response:** `{ "status": true, "data": { "backupCodes": ["XXXXX-XXXXX", "..."] } }`

---

### `POST /auth/logout`
Logout dan hapus cookie `auth_token`.
**Auth:** Required

---

## Users

### `GET /users/profile`
Profil user yang sedang login.
**Auth:** Required

---

### `PUT /users/profile`
Update profil (nama, foto).
**Auth:** Required

**Body:** `{ "name": "John Doe", "picture": "https://..." }`

---

### `DELETE /users/me`
Hapus akun sendiri. Semua data terkait ikut terhapus (cascade). Cookie otomatis dihapus.
**Auth:** Required

> ⚠️ Aksi ini permanen dan tidak bisa dibatalkan.

---

### `GET /users`
Daftar semua user.
**Auth:** Required — **Admin only**

**Query:** `search`, `role` (`user`|`admin`|`super_admin`), `isActive` (boolean), `page`, `limit`

---

### `GET /users/:id`
Detail user.
**Auth:** Required — **Admin only**

---

### `PUT /users/:id`
Update user (role, isActive).
**Auth:** Required — **Admin only**

**Body:** `{ "role": "admin", "isActive": true }`

---

### `DELETE /users/:id`
Hapus user. Tidak bisa menghapus diri sendiri (`ERR_CANNOT_DELETE_SELF`).
**Auth:** Required — **Admin only**

---

### `PUT /users/:id/quota`
Reset atau update kuota user secara manual.
**Auth:** Required — **Admin only**

**Body:** `{ "messagesSentToday": 0, "broadcastsThisMonth": 0 }`

---

## Sessions (WhatsApp)

### `GET /sessions`
Daftar semua sesi WA milik user.
**Auth:** Required

**Response data:**
```json
{
  "id": "uuid",
  "sessionName": "main",
  "phoneNumber": "628123456789",
  "status": "connected",
  "isDefault": true,
  "authFolder": "session_xxx_main",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Status values:** `disconnected` | `authenticating` | `connected` | `logged_out`

---

### `POST /sessions`
Buat sesi WA baru. QR/pairing code dikirim via WebSocket setelah berhasil.
**Auth:** Required

**Body:**
```json
{ "name": "main", "usePairingCode": false, "phoneNumber": "628123456789" }
```

> `usePairingCode: true` → wajib isi `phoneNumber`. Pairing code dikirim via event `code`.

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "uuid",
    "sessionName": "main",
    "status": "disconnected",
    "isDefault": false,
    "authFolder": "session_xxx_main",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `POST /sessions/:id/reconnect`
Reconnect sesi yang terputus. Tidak bisa reconnect sesi `logged_out`.
**Auth:** Required

---

### `POST /sessions/:id/default`
Set sesi sebagai default untuk `sessionId: "auto"`.
**Auth:** Required

---

### `GET /sessions/:id/info`
Info detail sesi (state, versi WA Web, info akun).
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "state": "CONNECTED",
    "version": "2.3000.1234",
    "info": { "wid": { "user": "628xxx" }, "pushname": "John", "platform": "android" }
  }
}
```

---

### `DELETE /sessions/:id`
Hapus/logout sesi. Folder auth dihapus dari disk. Semua status bisa dihapus termasuk `logged_out`.
**Auth:** Required

---

## Messages

> Semua endpoint kirim pesan dilindungi **QuotaGuard** — mengembalikan `ERR_QUOTA_DAILY_EXCEEDED` (429) jika kuota harian habis.
> Admin & super_admin **tidak** terkena quota check (bypass).
> Endpoint bertanda ✅ API Key dapat diakses via `X-API-Key`.

### `POST /messages/send` ✅
Kirim pesan teks.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "message": "Halo!",
  "sessionId": "auto",
  "quotedMessageId": "msg-id-optional",
  "mentions": ["628xxx@s.whatsapp.net"]
}
```

> `sessionId: "auto"` → round-robin Redis antar sesi aktif.

**Response:** `{ "status": true, "data": { "messageId": "true_628xxx_XXXXX" } }`

---

### `POST /messages/send-media` ✅
Kirim gambar, video, audio, atau dokumen.
**Auth:** Required
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|-----------|
| `file` | File | ✅ | Max 50MB |
| `to` | string | ✅ | Nomor tujuan |
| `sessionId` | string | ❌ | Default: `auto` |
| `caption` | string | ❌ | Caption media |

**MIME Types yang diizinkan:**
- Image: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Video: `video/mp4`, `video/3gpp`
- Audio: `audio/mpeg`, `audio/ogg`, `audio/mp4`, `audio/wav`
- Document: `application/pdf`, Word, Excel, PowerPoint, `text/plain`

---

### `POST /messages/send-voice-note` ✅
Kirim voice note (audio dikirim sebagai pesan suara).
**Auth:** Required
**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `file` | File (audio) | ✅ |
| `to` | string | ✅ |
| `sessionId` | string | ❌ |

---

### `POST /messages/send-location` ✅
Kirim lokasi statis.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "latitude": -6.2,
  "longitude": 106.8,
  "description": "Kantor Pusat",
  "sessionId": "auto"
}
```

---

### `POST /messages/send-live-location` ✅
Kirim live location.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "latitude": -6.2,
  "longitude": 106.8,
  "duration": 60,
  "description": "Posisi saya",
  "sessionId": "auto"
}
```

> `duration` dalam detik, default 60.

---

### `POST /messages/send-poll` ✅
Kirim poll/voting.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "question": "Pilih warna favoritmu?",
  "options": ["Merah", "Biru", "Hijau"],
  "multiselect": false,
  "sessionId": "auto"
}
```

---

### `POST /messages/send-contact` ✅
Kirim kontak sebagai vCard.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "contacts": ["628111111111", "628222222222"],
  "sessionId": "auto"
}
```

---

### `PATCH /messages/:sessionId/messages/:messageId/edit`
Edit pesan yang sudah dikirim.
**Auth:** Required

**Body:** `{ "text": "Pesan yang sudah diedit" }`

---

### `POST /messages/:sessionId/messages/:messageId/forward`
Forward pesan ke nomor lain.
**Auth:** Required

**Body:** `{ "to": "628123456789" }`

---

### `POST /messages/:sessionId/messages/:messageId/pin`
Pin pesan di chat.
**Auth:** Required

**Body:** `{ "duration": 86400 }`

---

### `POST /messages/:sessionId/messages/:messageId/unpin`
Unpin pesan.
**Auth:** Required

---

### `POST /messages/:sessionId/messages/:messageId/download`
Download media dari pesan masuk. File disimpan di server, dapat diakses via `GET /storage/uploads/:filename`.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": { "filename": "xxx.jpg", "mimetype": "image/jpeg", "path": "/storage/uploads/..." }
}
```

---

### `POST /messages/:sessionId/messages/:messageId/react`
Beri reaksi emoji pada pesan.
**Auth:** Required

**Body:** `{ "reaction": "👍" }`

> Kirim `reaction: ""` untuk hapus reaksi.

---

### `DELETE /messages/:sessionId/messages/:messageId`
Hapus pesan.
**Auth:** Required

**Query:** `forEveryone` (boolean, default `true`)

---

### `GET /messages/check/:sessionId/:phone` ✅
Cek apakah nomor terdaftar di WhatsApp.
**Auth:** Required

**Response:** `{ "status": true, "data": { "phone": "628123456789", "isRegistered": true } }`

---

### `GET /messages/logs`
Riwayat pesan terkirim.
**Auth:** Required

**Query:** `status` (`success`|`failed`|`pending`), `sessionId`, `page`, `limit`

---

### `GET /messages/logs/export-pdf`
Export riwayat pesan ke PDF.
**Auth:** Required
**Response:** File download `messages_YYYYMMDD.pdf`

---

## Storage

### `GET /storage/uploads/:filename`
Akses file media yang telah didownload via endpoint `/messages/:sessionId/messages/:messageId/download`.

**Alur penggunaan:**
1. Panggil `POST /messages/:sessionId/messages/:messageId/download`
2. Response mengembalikan `{ "filename": "xxx.jpg", ... }`
3. Akses file via `GET /storage/uploads/xxx.jpg`

User hanya bisa akses file miliknya sendiri (resolved dari JWT).
**Auth:** Required

> Path traversal dicegah — hanya file di folder `uploads/{userId}/` yang bisa diakses.

---

## Broadcast

> `POST /broadcast` juga mengembalikan `ERR_NO_SESSIONS` (400) jika tidak ada sesi WA yang aktif/connected.
> Membutuhkan fitur `broadcast` di tier.

### `GET /broadcast/campaigns`
Daftar campaign broadcast.
**Auth:** Required

**Query:** `status` (`pending`|`processing`|`completed`|`cancelled`), `page`, `limit`

**Response data:**
```json
{
  "id": "uuid",
  "name": "Promo Lebaran",
  "message": "Halo {name}!",
  "mediaPath": null,
  "totalRecipients": 500,
  "processedCount": 500,
  "successCount": 490,
  "failedCount": 10,
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:01:00.000Z"
}
```

---

### `GET /broadcast/campaigns/:id`
Detail campaign broadcast.
**Auth:** Required

---

### `GET /broadcast/campaigns/:id/export-pdf`
Export hasil campaign ke PDF (daftar penerima + status sukses/gagal).
**Auth:** Required
**Response:** File download `campaign_{id}_YYYYMMDD.pdf`

---

### `POST /broadcast`
Buat broadcast baru. Membutuhkan fitur `broadcast` di tier.
**Auth:** Required
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|-----------|
| `name` | string | ✅ | Nama campaign |
| `message` | string | ✅ | Isi pesan |
| `recipients` | string[] | ❌ | Array nomor tujuan |
| `csvData` | string | ❌ | Raw CSV (`name,number,tag`) |
| `filterTag` | string | ❌ | Filter kontak berdasarkan tag |
| `file` | File | ❌ | Media attachment |

> Minimal satu dari `recipients`, `csvData`, atau `filterTag`.
> Penerima di-deduplikasi otomatis, maksimal 10.000.

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "uuid", "name": "Promo Lebaran",
    "totalRecipients": 500, "status": "pending", "createdAt": "..."
  }
}
```

---

### `POST /broadcast/campaigns/:id/cancel`
Batalkan campaign `pending` atau `processing`.
**Auth:** Required

---

## Broadcast List (WA Native)

### `GET /broadcast-list/:sessionId`
Dapatkan semua broadcast list dari akun WA.
**Auth:** Required

### `GET /broadcast-list/:sessionId/:broadcastId`
Detail broadcast list by ID.
**Auth:** Required

### `POST /broadcast-list/:sessionId/:broadcastId/send`
Kirim pesan ke broadcast list.
**Auth:** Required

**Body:** `{ "message": "Halo semua!" }`

---

## Inbox

### `GET /inbox`
Daftar pesan masuk.
**Auth:** Required

**Query:** `unread` (boolean), `jid` (filter by nomor/JID), `page`, `limit`

**Response data:**
```json
{
  "id": "true_628xxx_XXXXX",
  "remoteJid": "628123456789@s.whatsapp.net",
  "pushName": "John Doe",
  "messageContent": "Halo!",
  "messageType": "text",
  "mediaUrl": null,
  "isRead": false,
  "sessionId": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /inbox/conversations`
Daftar percakapan grouped by kontak (seperti chat list WA).
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": [{
    "remoteJid": "628xxx@s.whatsapp.net",
    "pushName": "John",
    "lastMessage": "Halo!",
    "messageType": "text",
    "lastTime": "2024-01-01T00:00:00.000Z",
    "unreadCount": 3,
    "isGroup": false,
    "sessionId": "uuid"
  }]
}
```

---

### `PATCH /inbox/:id/read`
Tandai satu pesan sebagai dibaca.
**Auth:** Required

---

### `PATCH /inbox/conversations/:jid/read-all`
Tandai semua pesan dari satu percakapan sebagai dibaca.
**Auth:** Required

> ⚠️ `:jid` mengandung karakter `@` yang harus di-URL-encode. Contoh: `628123456789@s.whatsapp.net` → `628123456789%40s.whatsapp.net`.

---

### `POST /inbox/:id/reply`
Balas pesan langsung dari inbox. Secara otomatis menggunakan sesi yang sama dengan pesan masuk.
**Auth:** Required

**Body:**
```json
{ "message": "Balas pesan", "quotedMessageId": "optional-msg-id" }
```

> Reply dari inbox **dihitung sebagai kuota harian** (`messagesSentToday` +1).

---

## Contacts (Phonebook)

### `GET /contacts`
Daftar kontak internal.
**Auth:** Required

**Query:** `search` (nama/nomor/tag), `tag`, `page`, `limit`

---

### `POST /contacts`
Tambah kontak. Nomor otomatis dinormalisasi (`0xxx` → `62xxx`).
**Auth:** Required

**Body:** `{ "name": "John Doe", "number": "628123456789", "tag": "pelanggan", "notes": "VIP" }`

---

### `PUT /contacts/:id`
Update kontak.
**Auth:** Required

---

### `DELETE /contacts/:id`
Hapus kontak.
**Auth:** Required

---

### `POST /contacts/bulk-delete`
Hapus banyak kontak sekaligus.
**Auth:** Required

**Body:**
```json
{
  "ids": ["uuid1", "uuid2"],
  "selectAll": false,
  "search": "keyword",
  "filterTag": "pelanggan"
}
```

---

### `POST /contacts/import`
Import kontak dari file CSV.
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form:** `file` — `.csv` dengan header `name,number,tag`

**Response:** `{ "status": true, "data": { "imported": 45, "skipped": 3, "errors": [] } }`

---

### `POST /contacts/import-google`
Import kontak dari Google Contacts via OAuth.
**Auth:** Required

**Body:** `{ "accessToken": "google-oauth-access-token" }`

---

### `GET /contacts/export`
Export semua kontak ke CSV.
**Auth:** Required
**Response:** File download `contacts_YYYYMMDD.csv`

---

## Customer Note

> Membutuhkan fitur `customer_note` di tier.

### `GET /contacts/:contactId/note`
Dapatkan catatan internal kontak.
**Auth:** Required

**Response:** `{ "status": true, "data": { "contactId": "uuid", "notes": "Pelanggan VIP sejak 2020" } }`

---

### `PUT /contacts/:contactId/note`
Tambah atau update catatan kontak.
**Auth:** Required

**Body:** `{ "content": "Catatan baru..." }`

---

### `DELETE /contacts/:contactId/note`
Hapus catatan kontak.
**Auth:** Required

---

## Auto Reply

> Membutuhkan fitur `auto_reply` di tier.

### `GET /auto-reply`
Daftar rules auto reply.
**Auth:** Required

**Response data:**
```json
{
  "id": "uuid", "keyword": "halo",
  "response": "Halo juga!", "matchType": "contains",
  "isActive": true, "priority": 0
}
```

**Match Types:** `exact` | `contains` | `regex` | `ai_smart`

---

### `POST /auto-reply`
Buat rule auto reply.
**Auth:** Required

**Body:**
```json
{
  "keyword": "halo",
  "response": "Halo juga!",
  "matchType": "contains",
  "priority": 0
}
```

> Untuk `matchType: "ai_smart"`, isi `response` dengan persona/instruksi AI.
> Hanya satu rule yang dieksekusi per pesan (priority terkecil = pertama).
> Loop protection: tidak membalas ke JID yang sama dalam 30 detik.

---

### `PUT /auto-reply/:id`
Update rule.
**Auth:** Required

---

### `POST /auto-reply/:id/toggle`
Aktifkan / nonaktifkan rule.
**Auth:** Required

**Body:** `{ "isActive": true }`

---

### `DELETE /auto-reply/:id`
Hapus rule.
**Auth:** Required

---

## Workflow Automation

> Membutuhkan fitur `workflow` di tier.

### `GET /workflows`
Daftar workflow.
**Auth:** Required

---

### `POST /workflows`
Buat workflow baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Welcome Flow",
  "triggerCondition": { "keyword": "daftar", "matchType": "contains" },
  "nodes": [
    { "id": "n1", "type": "send_message", "config": { "message": "Selamat datang! 👋" } },
    { "id": "n2", "type": "delay", "config": { "seconds": 5 } },
    { "id": "n3", "type": "add_tag", "config": { "tag": "new-member" } }
  ]
}
```

**Node Types:**

| Type | Config | Keterangan |
|------|--------|-----------|
| `send_message` | `message: string` | Kirim pesan ke pengirim |
| `delay` | `seconds: number` (max 3600) | Tunggu N detik |
| `add_tag` | `tag: string` | Tag kontak; buat baru jika belum ada |

**matchType:** `exact` | `contains` | `regex` — **Max 20 nodes**

---

### `PUT /workflows/:id`
Update workflow.
**Auth:** Required

---

### `POST /workflows/:id/toggle`
Aktifkan / nonaktifkan workflow.
**Auth:** Required

**Body:** `{ "isActive": true }`

---

### `DELETE /workflows/:id`
Hapus workflow.
**Auth:** Required

---

## Drip Campaign

> Membutuhkan fitur `drip_campaign` di tier.

### `GET /drip-campaigns`
Daftar drip campaign.
**Auth:** Required

**Response data:**
```json
{
  "id": "uuid", "name": "Onboarding Series",
  "triggerTag": "new-customer", "isActive": true,
  "subscriberCount": 42,
  "steps": [
    { "id": "uuid", "dayOffset": 1, "timeAt": "09:00", "message": "Selamat bergabung!" }
  ]
}
```

---

### `POST /drip-campaigns`
Buat drip campaign.
**Auth:** Required

**Body:**
```json
{
  "name": "Onboarding Series",
  "triggerTag": "new-customer",
  "sessionId": "uuid-optional",
  "steps": [
    { "dayOffset": 1, "timeAt": "09:00", "message": "Selamat bergabung! {name}" },
    { "dayOffset": 3, "timeAt": "10:00", "message": "Tips hari ke-3, {name}" },
    { "dayOffset": 7, "timeAt": "09:00", "message": "Sudah seminggu bergabung!" }
  ]
}
```

> Placeholder: `{name}` (nama kontak), `{date}` (tanggal hari ini).
> `timeAt` format `HH:MM` (WIB). Tidak boleh ada dua step dengan `dayOffset` sama.
> Kontak dengan tag cocok otomatis terdaftar setiap menit.

---

### `PUT /drip-campaigns/:id`
Update drip campaign.
**Auth:** Required

---

### `POST /drip-campaigns/:id/toggle`
Aktifkan / nonaktifkan.
**Auth:** Required

**Body:** `{ "isActive": true }`

---

### `DELETE /drip-campaigns/:id`
Hapus drip campaign.
**Auth:** Required

---

### `GET /drip-campaigns/:id/subscribers`
Daftar subscriber.
**Auth:** Required

**Query:** `status` (`active`|`completed`|`paused`|`cancelled`), `page`, `limit`

---

### `POST /drip-campaigns/subscriptions/:id/cancel`
Batalkan subscription kontak.
**Auth:** Required

> `:id` = subscription ID (bukan campaign ID).

---

## Scheduler

> Membutuhkan fitur `scheduler` di tier.

### `GET /scheduler`
Daftar pesan terjadwal.
**Auth:** Required

**Query:** `status` (`pending`|`sent`|`failed`|`cancelled`), `page`, `limit`

---

### `POST /scheduler`
Buat pesan terjadwal.
**Auth:** Required

**Body:**
```json
{
  "target": "628123456789",
  "message": "Pengingat meeting!",
  "sessionId": "uuid",
  "scheduledTime": "2024-12-25T07:00:00.000Z",
  "recurrenceType": "none"
}
```

**Recurrence:** `none` | `daily` | `weekly` | `monthly`

> `scheduledTime` harus di masa depan. Timezone WIB (UTC+7).

---

### `POST /scheduler/:id/cancel`
Batalkan pesan terjadwal. Hanya status `pending`.
**Auth:** Required

---

### `DELETE /scheduler/:id`
Hapus record pesan terjadwal (semua status bisa dihapus).
**Auth:** Required

---

## Scheduled Event (WA Event)

### `POST /scheduled-events/send`
Kirim undangan Scheduled Event WhatsApp.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "title": "Meeting Bulanan",
  "startTime": "2024-12-25T09:00:00.000Z",
  "description": "Review Q4",
  "location": "Zoom",
  "sessionId": "auto"
}
```

---

### `POST /scheduled-events/respond`
Accept atau decline event yang diterima.
**Auth:** Required

**Body:**
```json
{ "messageId": "true_628xxx_XXXXX", "response": "accept", "sessionId": "uuid" }
```

**response values:** `accept` | `decline`

---

## Templates

### `GET /templates`
Daftar template pesan.
**Auth:** Required

**Query:** `category`

---

### `POST /templates`
Buat template baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Sapaan Pagi",
  "content": "Selamat pagi {name}! Ada yang bisa kami bantu?",
  "category": "Greeting"
}
```

> Placeholder: `{name}`, `{date}`, dan custom key lainnya. Nama unik per user.

---

### `PUT /templates/:id`
Update template.
**Auth:** Required

---

### `DELETE /templates/:id`
Hapus template.
**Auth:** Required

---

## Webhook

> Membutuhkan fitur `webhook` di tier.

### `GET /webhooks/config`
Dapatkan konfigurasi webhook.
**Auth:** Required

---

### `PUT /webhooks/config`
Update URL webhook.
**Auth:** Required

**Body:** `{ "webhookUrl": "https://yourapp.com/webhook", "isActive": true }`

---

### `POST /webhooks/generate-secret`
Generate webhook secret baru untuk HMAC verification.
**Auth:** Required

**Response:** `{ "status": true, "data": { "secret": "hex-string" } }`

---

### `POST /webhooks/test`
Test kirim payload ke URL webhook yang dikonfigurasi.
**Auth:** Required

**Response:** `{ "status": true, "data": { "targetStatus": 200, "responseTime": "45ms" } }`

#### Webhook Payload Format
```json
{
  "event": "new_message",
  "session": "session-id",
  "from": "628xxx@s.whatsapp.net",
  "text": "Halo",
  "type": "chat",
  "timestamp": 1234567890
}
```

**Header:**
```
X-Hub-Signature: sha256=<hmac-sha256>
Content-Type: application/json
```

**Retry schedule:** 1 mnt → 5 mnt → 15 mnt → 1 jam → 6 jam. Setelah 5x gagal, notifikasi email dikirim.

---

## API Keys

> Membutuhkan fitur `api_access` di tier.

### `GET /keys`
Daftar API token milik user.
**Auth:** Required

**Response data:**
```json
{
  "id": "uuid", "name": "Mobile App Key",
  "keyPreview": "a1b2c3d4", "ipWhitelist": "192.168.1.0/24",
  "isSandbox": false, "expiresAt": null,
  "lastUsedAt": "2024-01-01T00:00:00.000Z", "createdAt": "..."
}
```

---

### `POST /keys`
Generate API token baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Mobile App Key",
  "ipWhitelist": "192.168.1.1,10.0.0.0/8",
  "isSandbox": false,
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "uuid",
    "key": "FULL-PLAINTEXT-KEY-TAMPIL-SEKALI",
    "name": "Mobile App Key",
    "keyPreview": "a1b2c3d4",
    "isSandbox": false,
    "expiresAt": null
  }
}
```

> ⚠️ Simpan `key` sekarang — tidak akan ditampilkan lagi!
> Token `isSandbox: true` → request kirim pesan tidak diteruskan ke WhatsApp, response sukses palsu dikembalikan.

---

### `DELETE /keys/:id`
Hapus API token.
**Auth:** Required

---

## Settings

### `GET /settings/me`
Dapatkan pengaturan user.
**Auth:** Required

---

### `POST /settings/me`
Update pengaturan user.
**Auth:** Required

**Body:** *(semua opsional)*
```json
{
  "geminiApiKey": "AIzaSy...",
  "geminiConfidenceThreshold": 0.7,
  "autoDownloadPhotos": true,
  "autoDownloadVideos": false,
  "autoDownloadAudio": false,
  "autoDownloadDocuments": false,
  "backgroundSync": false
}
```

---

### `GET /settings/global`
Dapatkan pengaturan global sistem.
**Auth:** Required — **Admin only**

---

### `POST /settings/global`
Update pengaturan global.
**Auth:** Required — **Admin only**

**Body:** `{ "defaultDailyMessageLimit": 2000, "defaultMonthlyBroadcastLimit": 20 }`

---

### `POST /settings/maintenance`
Aktifkan / nonaktifkan maintenance mode.
**Auth:** Required — **Admin only**

**Body:** `{ "enabled": true }`

> Admin tetap bisa akses saat maintenance aktif.

---

### `POST /settings/announcement`
Broadcast pengumuman ke semua user aktif via WebSocket.
**Auth:** Required — **Admin only**

**Body:** `{ "message": "Server maintenance pukul 02.00 WIB" }`

---

## Analytics

### `GET /analytics/dashboard`
Data statistik dashboard.
**Auth:** Required

**Query:** `days` (1-30, default 7)

**Response:**
```json
{
  "status": true,
  "data": {
    "summary": { "totalSent": 1200, "successRate": 94.5, "totalBroadcasts": 5 },
    "chart": [{ "date": "2024-01-01", "total": 150, "success": 140, "failed": 10 }],
    "recentCampaigns": [...],
    "recentLogs": [...]
  }
}
```

---

### `GET /analytics/system`
Status sistem dan resource server.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "server": {
      "nodeVersion": "v24.x.x",
      "memory": { "used": "256MB", "total": "512MB" },
      "uptimeSeconds": 86400
    },
    "sessions": { "total": 10, "connected": 8, "disconnected": 2 },
    "queues": {
      "broadcast": { "waiting": 0, "active": 1, "failed": 0 },
      "webhook": { "waiting": 5, "active": 2, "failed": 1 }
    }
  }
}
```

---

## Audit Log

### `GET /audit`
Riwayat audit log. Admin melihat semua, user biasa hanya miliknya.
**Auth:** Required

**Query:** `action`, `from` (ISO 8601), `to` (ISO 8601), `page`, `limit`

**Actions:** `LOGIN` | `LOGOUT` | `CREATE_SESSION` | `DELETE_SESSION` | `RECONNECT_SESSION` | `CREATE_API_KEY` | `DELETE_API_KEY` | `START_BROADCAST` | `CANCEL_BROADCAST` | `UPDATE_SETTINGS` | `ENABLE_2FA` | `DISABLE_2FA` | `CREATE_USER` | `UPDATE_USER` | `DELETE_USER` | `ASSIGN_TIER` | `CREATE_WORKSPACE` | `INVITE_MEMBER` | `REMOVE_MEMBER`

---

### `GET /audit/export-pdf`
Export audit log ke PDF.
**Auth:** Required
**Response:** File download `audit_YYYYMMDD.pdf`

---

## Profile (WA Account)

### `GET /profile/:sessionId`
Info profil akun WA.
**Auth:** Required

### `POST /profile/:sessionId/display-name`
Set display name.
**Auth:** Required

**Body:** `{ "name": "John Doe Business" }`

### `POST /profile/:sessionId/status`
Set status/bio WA.
**Auth:** Required

**Body:** `{ "status": "Melayani 24 jam 🕐" }`

### `POST /profile/:sessionId/photo`
Upload foto profil WA.
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form:** `file` (JPEG/PNG)

### `DELETE /profile/:sessionId/photo`
Hapus foto profil WA.
**Auth:** Required

### `GET /profile/:sessionId/contacts`
Semua kontak dari akun WA.
**Auth:** Required

### `GET /profile/:sessionId/contacts/:contactId`
Kontak WA by ID (JID, contoh: `628123456789@s.whatsapp.net`).
**Auth:** Required

### `GET /profile/:sessionId/contacts/:contactId/photo`
URL foto profil kontak.
**Auth:** Required

### `POST /profile/:sessionId/contacts/:contactId/block`
Blokir kontak.
**Auth:** Required

### `POST /profile/:sessionId/contacts/:contactId/unblock`
Unblokir kontak.
**Auth:** Required

### `GET /profile/:sessionId/contacts/blocked`
Daftar kontak yang diblokir.
**Auth:** Required

---

## Chats

### `GET /chats/:sessionId` — Semua chat
### `GET /chats/:sessionId/:chatId` — Detail chat
### `POST /chats/:sessionId/:chatId/archive` — Arsipkan
### `POST /chats/:sessionId/:chatId/unarchive` — Batal arsip
### `POST /chats/:sessionId/:chatId/mute` — Bisukan (`{ "duration": 3600 }`)
### `POST /chats/:sessionId/:chatId/unmute` — Batal bisukan
### `POST /chats/:sessionId/:chatId/pin` — Pin chat
### `POST /chats/:sessionId/:chatId/unpin` — Unpin chat
### `DELETE /chats/:sessionId/:chatId` — Hapus chat
### `POST /chats/:sessionId/:chatId/read` — Tandai dibaca
### `GET /chats/:sessionId/search?q=keyword` — Cari pesan

**Auth:** Required *(semua endpoint di atas)*

---

## Groups

### `POST /groups/:sessionId`
Buat grup baru.
**Auth:** Required

**Body:** `{ "name": "Tim Internal", "participants": ["628111111111"] }`

### `GET /groups/:sessionId/:groupId` — Info grup
### `POST /groups/:sessionId/:groupId/participants/add` — Tambah anggota (`{ "participants": ["628xxx@s.whatsapp.net"] }`)
### `POST /groups/:sessionId/:groupId/participants/remove` — Hapus anggota
### `POST /groups/:sessionId/:groupId/participants/promote` — Jadikan admin
### `POST /groups/:sessionId/:groupId/participants/demote` — Turunkan admin
### `POST /groups/:sessionId/:groupId/update` — Update info (`{ "subject": "...", "description": "..." }`)
### `POST /groups/:sessionId/:groupId/leave` — Keluar grup
### `GET /groups/:sessionId/:groupId/invite` — Dapatkan invite link
### `POST /groups/:sessionId/:groupId/invite/revoke` — Revoke invite link
### `POST /groups/:sessionId/join` — Join via invite code (`{ "inviteCode": "XXXXX" }`)
### `GET /groups/:sessionId/invite/:inviteCode/info` — Info grup sebelum join
### `POST /groups/:sessionId/:groupId/membership-request` — Approve/reject join request (`{ "requesterJid": "...", "action": "approve" }`)
### `GET /groups/:sessionId/:groupId/membership-requests` — Daftar pending requests
### `GET /groups/:sessionId/contacts/:contactId/common-groups` — Grup yang sama dengan kontak

**Auth:** Required *(semua endpoint di atas)*

---

## Channels

> Membutuhkan fitur `channels` di tier.

### `GET /channels/:sessionId` — Channel yang diikuti
### `GET /channels/:sessionId/search?query=keyword` — Cari channel
### `GET /channels/:sessionId/invite/:inviteCode` — Info channel by invite code
### `POST /channels/:sessionId/:channelId/subscribe` — Subscribe
### `POST /channels/:sessionId/:channelId/unsubscribe` — Unsubscribe
### `POST /channels/:sessionId/:channelId/send` — Kirim pesan (`{ "message": "..." }`)
### `POST /channels/:sessionId/:channelId/admin` — Kelola admin (`{ "participantJid": "...", "action": "add" }`)
### `POST /channels/:sessionId/:channelId/transfer` — Transfer ownership (`{ "newOwnerJid": "..." }`)
### `PUT /channels/:sessionId/:channelId` — Update info (`{ "name": "...", "description": "..." }`)
### `DELETE /channels/:sessionId/:channelId` — Hapus channel

**Auth:** Required *(semua endpoint di atas)*

---

## Labels (WA Business)

> Membutuhkan fitur `labels` di tier.

### `GET /labels/:sessionId` — Semua label
### `GET /labels/:sessionId/:labelId` — Label by ID
### `POST /labels/:sessionId/chats/:chatId/labels/:labelId` — Tambah label ke chat
### `POST /labels/:sessionId/chats/:chatId/labels/:labelId/remove` — Hapus label dari chat
### `GET /labels/:sessionId/labels/:labelId/chats` — Chat berdasarkan label

**Auth:** Required *(semua endpoint di atas)*

---

## Status (WA Status/Story)

### `POST /status/:sessionId/bio`
Set teks bio/status WA.
**Auth:** Required

**Body:** `{ "status": "Tersedia 24 jam 🕐" }`

### `POST /status/:sessionId/send`
Kirim status/story teks.
**Auth:** Required

**Body:** `{ "text": "Hari yang menyenangkan! ☀️" }`

### `POST /status/:sessionId/presence`
Set presence online/offline.
**Auth:** Required

**Body:** `{ "available": true }`

---

## Calls

### `GET /calls`
Log panggilan masuk.
**Auth:** Required

**Query:** `page`, `limit`

**Response data:**
```json
{
  "id": "uuid", "fromNumber": "628123456789",
  "callType": "voice", "status": "missed",
  "sessionId": "uuid", "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### `POST /calls/link`
Buat call link untuk dibagikan.
**Auth:** Required

**Body:** `{ "sessionId": "uuid" }`

**Response:** `{ "status": true, "data": { "callLink": "https://..." } }`

> ⚠️ Endpoint ini bergantung pada dukungan versi whatsapp-web.js yang digunakan. Jika tidak didukung, mengembalikan `ERR_INTERNAL` dengan pesan "createCallLink tidak didukung di versi whatsapp-web.js ini."

---

## Tiers

### `GET /tiers`
Daftar semua tier.
**Auth:** Required

**Response data:**
```json
{
  "id": "uuid", "name": "Pro",
  "maxSessions": 5, "maxApiKeys": 5,
  "maxDailyMessages": 2000, "maxMonthlyBroadcasts": 50,
  "maxBroadcastRecipients": 5000, "maxWorkflows": 10,
  "maxDripCampaigns": 5, "maxTemplates": 50,
  "maxContacts": 5000, "rateLimitPerMinute": 60,
  "features": ["broadcast", "auto_reply", "workflow", "drip_campaign",
               "ai_smart_reply", "channels", "labels", "customer_note",
               "scheduler", "webhook", "api_access"],
  "price": "299000.00", "isActive": true
}
```

### `POST /tiers` — Buat tier baru *(Admin only)*
### `PUT /tiers/:id` — Update tier *(Admin only)*
### `DELETE /tiers/:id` — Hapus tier *(Admin only)*

### `POST /tiers/assign`
Assign tier ke user.
**Auth:** Required — **Admin only**

**Body:** `{ "userId": "uuid", "tierId": "uuid", "expiresAt": "2026-12-31T23:59:59.000Z" }`

> ⚠️ Perubahan tier baru efektif dalam maksimal **5 menit** karena cache fitur tier di Redis (TTL 5 menit).

### `GET /tiers/history/:userId`
Riwayat perubahan tier user.
**Auth:** Required — **Admin only**

**Query:** `page`, `limit`

**Response data:**
```json
{
  "id": "uuid",
  "action": "ASSIGN_TIER",
  "userEmail": "admin@example.com",
  "details": {
    "targetUserId": "uuid",
    "tierId": "uuid",
    "tierName": "Pro"
  },
  "ipAddress": "127.0.0.1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Tier Lifecycle

```
Aktif → [expiresAt terlewat] → Grace Period (3 hari) → Downgrade ke Free
```

- Saat expired: `isGrace: true`, akses masih berjalan
- Setelah 3 hari grace period: otomatis downgrade ke tier Free
- Downgrade dilakukan oleh cron setiap jam (`GracePeriodService`)

---

## Tier Feature Keys

| Key | Fitur |
|-----|-------|
| `broadcast` | Broadcast massal |
| `auto_reply` | Auto reply |
| `workflow` | Workflow otomatis |
| `drip_campaign` | Drip campaign |
| `ai_smart_reply` | Auto reply dengan AI (Gemini) |
| `channels` | Kelola WA Channels |
| `labels` | Label WA Business |
| `customer_note` | Catatan kontak |
| `scheduler` | Pesan terjadwal |
| `webhook` | Integrasi webhook |
| `api_access` | Akses via API Key |

---

## Default Tier Plans

| Tier | Harga | Sessions | Msg/Hari | Broadcast/Bulan | Fitur |
|------|-------|----------|----------|-----------------|-------|
| Free | Gratis | 1 | 100 | 2 | auto_reply, scheduler, webhook |
| Basic | Rp 99.000 | 2 | 500 | 10 | + broadcast, workflow, api_access, labels |
| Pro | Rp 299.000 | 5 | 2.000 | 50 | Semua fitur |
| Enterprise | Rp 999.000 | 20 | 10.000 | 200 | Semua fitur |

---

## Workspace

### `GET /workspaces` — Daftar workspace yang diikuti

### `POST /workspaces`
Buat workspace baru.
**Auth:** Required

**Body:** `{ "name": "Tim Marketing" }`

### `POST /workspaces/:id/invite`
Undang anggota via email.
**Auth:** Required — Owner only

**Body:** `{ "email": "member@example.com" }`

### `PUT /workspaces/:id/members/:memberId/permission`
Update role/permission anggota.
**Auth:** Required — Owner only

**Body:** `{ "role": "admin", "permissions": { "canBroadcast": true } }`

**Roles:** `admin` | `member`

### `DELETE /workspaces/:id/members/:memberId`
Hapus anggota dari workspace.
**Auth:** Required — Owner only

---

## Admin

### `POST /admin/impersonate`
Generate token sementara atas nama user target (untuk support/debug).
**Auth:** Required — **Admin only**

**Body:** `{ "userId": "uuid" }`

**Response:**
```json
{
  "status": true,
  "data": {
    "token": "JWT-TOKEN-SEMENTARA",
    "targetUser": { "id": "uuid", "email": "...", "name": "...", "role": "user" },
    "expiresIn": 3600
  }
}
```

**Cara penggunaan token:**
```http
Authorization: Bearer JWT-TOKEN-SEMENTARA
```

> Token berlaku 1 jam. Tidak bisa impersonate sesama admin/super_admin.
> Semua aksi dicatat di audit log dengan keterangan `IMPERSONATE_START`.
> Gunakan `DELETE /admin/impersonate/:targetUserId` untuk mengakhiri sesi lebih awal.

---

### `DELETE /admin/impersonate/:targetUserId`
Akhiri sesi impersonation — invalidasi token di Redis.
**Auth:** Required — **Admin only**

---

## Health

### `GET /health`
Cek status server dan Redis.
**Auth:** Tidak diperlukan

**Response:**
```json
{ "status": "ok", "redis": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## WebSocket Events

**URL:** `ws://localhost:3000`

**Koneksi:**
```js
const socket = io("http://localhost:3000", {
  auth: { token: "your-jwt-token" }
});
```

User otomatis join room `userId` — hanya menerima event milik sendiri.

### Events Server → Client

| Event | Payload | Keterangan |
|-------|---------|-----------|
| `qr` | `{ sessionId, qr }` | QR code untuk scan (base64) |
| `code` | `{ sessionId, code }` | Pairing code |
| `connection_update` | `{ sessionId, status, phoneNumber? }` | Update status koneksi |
| `new_message` | `{ message: { id, from, body, type, sessionId } }` | Pesan masuk baru |
| `message_ack` | `{ sessionId, msgId, ack }` | Status baca: `sent`/`delivered`/`read` |
| `message_edit` | WA raw | Pesan diedit |
| `message_reaction` | WA raw | Reaksi pada pesan |
| `message_revoke_everyone` | WA raw | Pesan dihapus untuk semua |
| `message_revoke_me` | WA raw | Pesan dihapus untuk saya |
| `message_ciphertext` | WA raw | Pesan terenkripsi belum bisa didekripsi |
| `media_uploaded` | WA raw | Media selesai diupload |
| `vote_update` | WA raw | Perubahan vote pada poll |
| `group_join` | `{ sessionId, notification }` | Ada yang join grup |
| `group_leave` | `{ sessionId, notification }` | Ada yang keluar grup |
| `group_admin_changed` | WA raw | Perubahan admin grup |
| `group_update` | WA raw | Perubahan info grup |
| `group_membership_request` | WA raw | Join request masuk |
| `contact_changed` | WA raw | Kontak berubah nomor |
| `chat_archived` | WA raw | Chat diarsipkan |
| `chat_removed` | WA raw | Chat dihapus |
| `change_state` | WA raw | Perubahan state koneksi |
| `change_battery` | WA raw | Perubahan baterai device |
| `incoming_call` | `{ sessionId, call: { id, from, isVideo, timestamp } }` | Panggilan masuk |
| `broadcast_progress` | `{ campaignId, current, total, percentage, successCount, failedCount }` | Progress broadcast |
| `broadcast_complete` | `{ campaignId, successCount, failedCount }` | Broadcast selesai |
| `system_alert` | `{ type, message, data? }` | Alert sistem |

### System Alert Types

| Type | Trigger |
|------|---------|
| `quota_warning` | Kuota mencapai 80% |
| `quota_exceeded` | Kuota habis 100% |
| `session_disconnected` | Sesi WA terputus |
| `session_logged_out` | Sesi logout permanen |
| `all_sessions_down` | Semua sesi user terputus |
| `ai_disabled` | Gemini API key tidak valid |
| `disk_warning` | Disk usage >80% |
| `redis_disconnected` | Koneksi Redis terputus |
| `broadcast_complete` | Broadcast selesai (juga via event) |
| `announcement` | Pengumuman dari admin |

---

## Roles & Permission Matrix

| Endpoint | user | admin | super_admin | API Key |
|----------|------|-------|-------------|---------|
| Auth, Profile, Sessions | ✅ | ✅ | ✅ | ❌ |
| Kirim Pesan (send, media, dll) | ✅ | ✅ | ✅ | ✅ |
| Cek nomor WA | ✅ | ✅ | ✅ | ✅ |
| Broadcast | ✅ | ✅ | ✅ | ❌ |
| Inbox, Contacts, Templates | ✅ | ✅ | ✅ | ❌ |
| Auto Reply, Workflow, Drip | ✅ | ✅ | ✅ | ❌ |
| Scheduler, Webhook, API Keys | ✅ | ✅ | ✅ | ❌ |
| Groups, Channels, Labels | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ | ❌ |
| Audit Log (milik sendiri) | ✅ | ✅ | ✅ | ❌ |
| Audit Log (semua) | ❌ | ✅ | ✅ | ❌ |
| Settings Global | ❌ | ✅ | ✅ | ❌ |
| Maintenance, Announcement | ❌ | ✅ | ✅ | ❌ |
| Kelola User | ❌ | ✅ | ✅ | ❌ |
| Kelola Tier & Assign | ❌ | ✅ | ✅ | ❌ |
| Impersonation | ❌ | ✅ | ✅ | ❌ |
| `DELETE /users/me` | ✅ | ✅ | ✅ | ❌ |
| `GET /health` | ✅ | ✅ | ✅ | ✅ |

---

## Quota & Reset Schedule

| Kuota | Field | Reset Otomatis |
|-------|-------|----------------|
| Pesan harian | `messagesSentToday` | Setiap hari jam 00:00 WIB |
| Broadcast bulanan | `broadcastsThisMonth` | Setiap tanggal 1 jam 00:00 WIB |

---

## Notifikasi Sistem

### In-App (Socket.IO real-time)
Sesi terputus, semua sesi down, kuota 80%/100%, broadcast selesai, AI disabled, Redis down, disk >80%, pengumuman admin.

### Email (via SMTP)
| Trigger | Penerima |
|---------|---------|
| Sesi WA terputus/banned | Pemilik akun |
| Login dari IP baru | Pemilik akun |
| Webhook gagal 5x | Pemilik akun |
| Langganan hampir habis (D-7, D-3) | Pemilik akun |
| API Key hampir expired (D-7, D-3) | Pemilik key |
| Gemini API key invalid | Pemilik akun + admin |

---

## Sandbox Mode

Token API dengan `isSandbox: true` — request ke endpoint kirim pesan **tidak diteruskan** ke WhatsApp, response sukses palsu dikembalikan.

Set `isSandbox: true` saat membuat token di `POST /keys`:
```json
{ "name": "Testing Key", "isSandbox": true }
```

Response dari endpoint kirim pesan saat sandbox aktif:

```json
{
  "status": true,
  "data": {
    "messageId": "sandbox_1234567890",
    "sandbox": true,
    "note": "Pesan tidak dikirim. Token dalam mode sandbox."
  }
}
```

Endpoint yang terpengaruh: `send`, `send-media`, `send-location`, `send-live-location`, `send-poll`, `send-contact`, `send-voice-note`, `broadcast`.
