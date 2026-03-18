# WhatsApp Gateway SaaS — API Documentation

> Base URL: `http://localhost:3000/api/v1`
> Swagger UI: `http://localhost:3000/docs`
> Auth: Cookie `auth_token` (JWT) **atau** Header `X-API-Key`
> Content-Type: `application/json` (kecuali upload file: `multipart/form-data`)

---

## Response Format

### Success
```json
{ "status": true, "data": { ... } }
```

### Success with Pagination
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
| Code | Keterangan |
|------|-----------|
| `ERR_UNAUTHORIZED` | Tidak terautentikasi |
| `ERR_FORBIDDEN` | Tidak punya akses |
| `ERR_ACCOUNT_DISABLED` | Akun dinonaktifkan |
| `ERR_NOT_FOUND` | Data tidak ditemukan |
| `ERR_VALIDATION` | Validasi gagal |
| `ERR_INVALID_PHONE` | Format nomor tidak valid |
| `ERR_DUPLICATE_SESSION_NAME` | Nama sesi sudah ada |
| `ERR_DUPLICATE_CONTACT` | Kontak sudah ada |
| `ERR_DUPLICATE_TEMPLATE_NAME` | Nama template sudah ada |
| `ERR_SESSION_NOT_CONNECTED` | Sesi WA tidak terkoneksi |
| `ERR_NO_SESSIONS` | Tidak ada sesi aktif |
| `ERR_QUOTA_DAILY_EXCEEDED` | Kuota harian habis |
| `ERR_QUOTA_MONTHLY_EXCEEDED` | Kuota bulanan habis |
| `ERR_2FA_INVALID_CODE` | Kode 2FA salah |
| `ERR_2FA_SESSION_EXPIRED` | Sesi 2FA expired |
| `ERR_CAMPAIGN_NOT_CANCELLABLE` | Campaign tidak bisa dibatalkan |
| `ERR_WEBHOOK_NOT_CONFIGURED` | Webhook belum dikonfigurasi |
| `ERR_AI_DISABLED` | AI Smart Reply dinonaktifkan |
| `ERR_MAINTENANCE` | Server dalam maintenance |

---

## Pagination Query Params (semua endpoint list)
| Param | Type | Default | Keterangan |
|-------|------|---------|-----------|
| `page` | number | 1 | Halaman |
| `limit` | number | 10 | Item per halaman (max 100) |

---

## 1. Auth

### GET `/auth/google`
Redirect ke halaman login Google OAuth.
**Auth:** Tidak diperlukan

---

### GET `/auth/google/callback`
Callback setelah login Google. Set cookie `auth_token` dan redirect ke frontend.
**Auth:** Tidak diperlukan
**Redirect:** Jika 2FA aktif → `{CLIENT_URL}/auth/2fa?token={tempToken}`, jika tidak → `{CLIENT_URL}/dashboard`

---

### POST `/auth/2fa/verify`
Verifikasi kode 2FA setelah Google login.
**Auth:** Tidak diperlukan

**Body:**
```json
{ "tempToken": "string", "code": "123456" }
```

**Response:**
```json
{
  "status": true,
  "data": { "user": { "id": "uuid", "email": "...", "role": "user" } }
}
```
*Set cookie `auth_token` secara otomatis.*

---

### GET `/auth/me`
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

### POST `/auth/2fa/setup`
Generate QR code untuk setup 2FA.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": { "qrCode": "data:image/png;base64,...", "secret": "BASE32SECRET" }
}
```

---

### POST `/auth/2fa/enable`
Aktifkan 2FA setelah scan QR.
**Auth:** Required

**Body:**
```json
{ "code": "123456" }
```

**Response:**
```json
{
  "status": true,
  "data": { "message": "2FA enabled", "backupCodes": ["XXXXX-XXXXX", ...] }
}
```

---

### POST `/auth/2fa/disable`
Nonaktifkan 2FA.
**Auth:** Required

**Body:**
```json
{ "code": "123456" }
```

---

### POST `/auth/2fa/backup-codes/regenerate`
Regenerate backup codes 2FA.
**Auth:** Required

**Body:**
```json
{ "code": "123456" }
```

**Response:**
```json
{ "status": true, "data": { "backupCodes": ["XXXXX-XXXXX", ...] } }
```

---

### POST `/auth/logout`
Logout, clear cookie `auth_token`.
**Auth:** Required

**Response:**
```json
{ "status": true }
```

---

## 2. Sessions (WhatsApp)

### GET `/sessions`
Daftar semua sesi WA milik user.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "sessionName": "main",
      "phoneNumber": "628123456789",
      "status": "connected",
      "isDefault": true,
      "authFolder": "session_xxx_main",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Session Status:** `disconnected` | `authenticating` | `connected` | `logged_out`

---

### POST `/sessions`
Buat sesi WA baru. QR code / pairing code dikirim via WebSocket.
**Auth:** Required

**Body:**
```json
{
  "name": "main",
  "usePairingCode": false,
  "phoneNumber": "628123456789"
}
```

> Jika `usePairingCode: true`, wajib isi `phoneNumber`. Pairing code dikirim via event WebSocket `code`.

---

### POST `/sessions/:id/reconnect`
Reconnect sesi yang terputus.
**Auth:** Required

---

### POST `/sessions/:id/default`
Set sesi sebagai sesi default (digunakan untuk `sessionId: "auto"`).
**Auth:** Required

---

### GET `/sessions/:id/info`
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

### DELETE `/sessions/:id`
Hapus / logout sesi. Folder auth dihapus dari disk.
**Auth:** Required

---

## 3. Messages

### POST `/messages/send`
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

> `sessionId: "auto"` → sistem pilih sesi aktif secara round-robin.

**Response:**
```json
{ "status": true, "data": { "messageId": "true_628xxx_XXXXX" } }
```

---

### POST `/messages/send-media`
Kirim pesan media (gambar, video, audio, dokumen).
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Keterangan |
|-------|------|-----------|
| `file` | File | File media |
| `to` | string | Nomor tujuan |
| `sessionId` | string | ID sesi (`auto`) |
| `caption` | string | Caption (opsional) |

**Allowed MIME Types:**
- Image: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Video: `video/mp4`, `video/3gpp`
- Audio: `audio/mpeg`, `audio/ogg`, `audio/mp4`, `audio/wav`
- Document: `application/pdf`, `application/msword`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `text/plain`

---

### POST `/messages/send-location`
Kirim lokasi.
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

### POST `/messages/send-poll`
Kirim poll.
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

### POST `/messages/send-contact`
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

### PATCH `/messages/:sessionId/messages/:messageId/edit`
Edit pesan yang sudah dikirim.
**Auth:** Required

**Body:**
```json
{ "text": "Pesan yang sudah diedit" }
```

---

### POST `/messages/:sessionId/messages/:messageId/forward`
Forward pesan ke nomor lain.
**Auth:** Required

**Body:**
```json
{ "to": "628123456789" }
```

---

### POST `/messages/:sessionId/messages/:messageId/pin`
Pin pesan di chat.
**Auth:** Required

**Body:**
```json
{ "duration": 86400 }
```

---

### POST `/messages/:sessionId/messages/:messageId/unpin`
Unpin pesan.
**Auth:** Required

---

### POST `/messages/:sessionId/messages/:messageId/download`
Download media dari pesan masuk, simpan ke storage server.
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "filename": "xxx.jpg", "mimetype": "image/jpeg", "path": "/storage/uploads/..." } }
```

---

### POST `/messages/:sessionId/messages/:messageId/react`
Beri reaksi emoji pada pesan.
**Auth:** Required

**Body:**
```json
{ "reaction": "👍" }
```
> Kirim `reaction: ""` untuk hapus reaksi.

---

### DELETE `/messages/:sessionId/messages/:messageId`
Hapus pesan.
**Auth:** Required

**Query Params:**
| Param | Type | Default | Keterangan |
|-------|------|---------|-----------|
| `forEveryone` | boolean | `true` | Hapus untuk semua orang |

---

### GET `/messages/check/:sessionId/:phone`
Cek apakah nomor terdaftar di WhatsApp.
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "phone": "628123456789", "isRegistered": true } }
```

---

### GET `/messages/logs`
Riwayat pesan terkirim.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `status` | string | `success` \| `failed` \| `pending` |
| `sessionId` | string | Filter by sesi |
| `page` | number | |
| `limit` | number | |

---

### GET `/messages/logs/export-pdf`
Export riwayat pesan ke PDF.
**Auth:** Required
**Response:** File download `messages_YYYYMMDD.pdf`

---

## 4. Broadcast

### GET `/broadcast/campaigns`
Daftar campaign broadcast.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `status` | string | `pending` \| `processing` \| `completed` \| `cancelled` |
| `page` | number | |
| `limit` | number | |

---

### POST `/broadcast`
Buat broadcast baru.
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Keterangan |
|-------|------|----------|-----------|
| `name` | string | ✅ | Nama campaign |
| `message` | string | ✅ | Isi pesan |
| `recipients` | string[] | ❌ | Array nomor tujuan |
| `csvData` | string | ❌ | Raw CSV string (kolom: name,number,tag) |
| `filterTag` | string | ❌ | Filter kontak berdasarkan tag |
| `file` | File | ❌ | Media attachment |

> Minimal satu dari `recipients`, `csvData`, atau `filterTag` harus ada.

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "uuid",
    "name": "Promo Lebaran",
    "totalRecipients": 500,
    "status": "pending",
    "createdAt": "..."
  }
}
```

---

### POST `/broadcast/campaigns/:id/cancel`
Batalkan campaign yang sedang pending/processing.
**Auth:** Required

---

## 5. Broadcast List (WA Native)

### GET `/broadcast-list/:sessionId`
Dapatkan semua broadcast list dari akun WA.
**Auth:** Required

---

### GET `/broadcast-list/:sessionId/:broadcastId`
Detail broadcast list by ID.
**Auth:** Required

---

### POST `/broadcast-list/:sessionId/:broadcastId/send`
Kirim pesan ke broadcast list.
**Auth:** Required

**Body:**
```json
{ "message": "Halo semua!" }
```

---

## 6. Inbox

### GET `/inbox`
Daftar pesan masuk.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `unread` | boolean | Filter hanya yang belum dibaca |
| `jid` | string | Filter by nomor/JID tertentu |
| `page` | number | |
| `limit` | number | |

**Response data fields:**
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

### GET `/inbox/conversations`
Daftar percakapan dikelompokkan per kontak (seperti tampilan chat list).
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "remoteJid": "628xxx@s.whatsapp.net",
      "pushName": "John",
      "lastMessage": "Halo!",
      "messageType": "text",
      "lastTime": "2024-01-01T00:00:00.000Z",
      "unreadCount": 3,
      "isGroup": false,
      "sessionId": "uuid"
    }
  ]
}
```

---

### PATCH `/inbox/:id/read`
Tandai satu pesan sebagai dibaca.
**Auth:** Required

---

### PATCH `/inbox/conversations/:jid/read-all`
Tandai semua pesan dari satu percakapan sebagai dibaca.
**Auth:** Required
**Param:** `jid` = JID kontak, contoh `628123456789@s.whatsapp.net`

---

## 7. Contacts

### GET `/contacts`
Daftar kontak.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `search` | string | Cari nama/nomor/tag |
| `tag` | string | Filter by tag |
| `page` | number | |
| `limit` | number | |

---

### POST `/contacts`
Tambah kontak.
**Auth:** Required

**Body:**
```json
{ "name": "John Doe", "number": "628123456789", "tag": "pelanggan", "notes": "VIP customer" }
```

---

### PUT `/contacts/:id`
Update kontak.
**Auth:** Required

**Body:** (semua field opsional)
```json
{ "name": "John Doe", "number": "628123456789", "tag": "reseller", "notes": "..." }
```

---

### DELETE `/contacts/:id`
Hapus kontak.
**Auth:** Required

---

### POST `/contacts/bulk-delete`
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
> Gunakan `ids` untuk hapus by ID, atau `selectAll: true` untuk hapus berdasarkan filter.

---

### POST `/contacts/import`
Import kontak dari file CSV.
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Keterangan |
|-------|------|-----------|
| `file` | File | File `.csv` dengan header: `name,number,tag` |

**Response:**
```json
{ "status": true, "data": { "imported": 45, "skipped": 3, "errors": [] } }
```

---

### POST `/contacts/import-google`
Import kontak dari Google Contacts.
**Auth:** Required

**Body:**
```json
{ "accessToken": "google-oauth-access-token" }
```

---

### GET `/contacts/export`
Export semua kontak ke file CSV.
**Auth:** Required
**Response:** File download `contacts_YYYYMMDD.csv`

---

## 8. Customer Note

### GET `/contacts/:contactId/note`
Dapatkan catatan untuk kontak tertentu.
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "contactId": "uuid", "notes": "Pelanggan VIP sejak 2020" } }
```

---

### PUT `/contacts/:contactId/note`
Tambah atau update catatan kontak.
**Auth:** Required

**Body:**
```json
{ "content": "Catatan baru..." }
```

---

### DELETE `/contacts/:contactId/note`
Hapus catatan kontak.
**Auth:** Required

---

## 9. Auto Reply

### GET `/auto-reply`
Daftar rules auto reply.
**Auth:** Required

**Response data fields:**
```json
{
  "id": "uuid",
  "keyword": "halo",
  "response": "Halo juga! Ada yang bisa dibantu?",
  "matchType": "contains",
  "isActive": true,
  "priority": 0
}
```

**Match Types:** `exact` | `contains` | `regex` | `ai_smart`

---

### POST `/auto-reply`
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

> Untuk `matchType: "ai_smart"`, isi `response` dengan persona/instruksi AI, contoh: `"Kamu adalah CS ramah toko sepatu. Balas pertanyaan pelanggan dengan sopan."`

---

### PUT `/auto-reply/:id`
Update rule auto reply.
**Auth:** Required

**Body:** (semua field opsional)
```json
{ "keyword": "hai", "response": "Hai!", "matchType": "exact", "priority": 1 }
```

---

### POST `/auto-reply/:id/toggle`
Aktifkan / nonaktifkan rule.
**Auth:** Required

**Body:**
```json
{ "isActive": true }
```

---

### DELETE `/auto-reply/:id`
Hapus rule auto reply.
**Auth:** Required

---

## 10. Workflow

### GET `/workflows`
Daftar workflow.
**Auth:** Required

---

### POST `/workflows`
Buat workflow baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Welcome Flow",
  "triggerCondition": {
    "keyword": "daftar",
    "matchType": "contains"
  },
  "nodes": [
    {
      "id": "node1",
      "type": "send_message",
      "config": { "message": "Selamat datang! 👋" }
    },
    {
      "id": "node2",
      "type": "delay",
      "config": { "seconds": 5 }
    },
    {
      "id": "node3",
      "type": "add_tag",
      "config": { "tag": "new-member" }
    }
  ]
}
```

**Node Types:**
| Type | Config fields | Keterangan |
|------|---------------|-----------|
| `send_message` | `message: string` | Kirim pesan ke pengirim |
| `delay` | `seconds: number` (max 3600) | Tunggu sebelum node berikutnya |
| `add_tag` | `tag: string` | Tambahkan tag ke kontak |

**matchType:** `exact` | `contains` | `regex`
**Max nodes:** 20

---

### PUT `/workflows/:id`
Update workflow.
**Auth:** Required

**Body:** Sama seperti POST, semua field opsional.

---

### POST `/workflows/:id/toggle`
Aktifkan / nonaktifkan workflow.
**Auth:** Required

**Body:**
```json
{ "isActive": true }
```

---

### DELETE `/workflows/:id`
Hapus workflow.
**Auth:** Required

---

## 11. Drip Campaign

### GET `/drip-campaigns`
Daftar drip campaign.
**Auth:** Required

**Response data fields:**
```json
{
  "id": "uuid",
  "name": "Onboarding Series",
  "triggerTag": "new-customer",
  "isActive": true,
  "subscriberCount": 42,
  "steps": [
    { "id": "uuid", "dayOffset": 1, "timeAt": "09:00", "message": "Selamat bergabung!" },
    { "id": "uuid", "dayOffset": 3, "timeAt": "10:00", "message": "Tips hari ke-3..." }
  ]
}
```

---

### POST `/drip-campaigns`
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
    { "dayOffset": 3, "timeAt": "10:00", "message": "Tips hari ke-3 untuk {name}" },
    { "dayOffset": 7, "timeAt": "09:00", "message": "Sudah seminggu bergabung!" }
  ]
}
```

> Placeholder tersedia: `{name}` (nama kontak), `{date}` (tanggal).
> `timeAt` format: `HH:MM` (24 jam, timezone WIB).
> Kontak dengan tag yang cocok akan otomatis terdaftar setiap menit.

---

### PUT `/drip-campaigns/:id`
Update drip campaign.
**Auth:** Required

---

### POST `/drip-campaigns/:id/toggle`
Aktifkan / nonaktifkan drip campaign.
**Auth:** Required

**Body:**
```json
{ "isActive": true }
```

---

### DELETE `/drip-campaigns/:id`
Hapus drip campaign.
**Auth:** Required

---

### GET `/drip-campaigns/:id/subscribers`
Daftar subscriber drip campaign.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `status` | string | `active` \| `completed` \| `paused` \| `cancelled` |
| `page` | number | |
| `limit` | number | |

---

### POST `/drip-campaigns/subscriptions/:id/cancel`
Batalkan subscription kontak dari drip campaign.
**Auth:** Required
**Param:** `id` = subscription ID (bukan campaign ID)

---

## 12. Scheduler

### GET `/scheduler`
Daftar pesan terjadwal.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `status` | string | `pending` \| `sent` \| `failed` \| `cancelled` |
| `page` | number | |
| `limit` | number | |

---

### POST `/scheduler`
Buat pesan terjadwal.
**Auth:** Required

**Body:**
```json
{
  "target": "628123456789",
  "message": "Pengingat meeting jam 2 siang!",
  "sessionId": "uuid",
  "scheduledTime": "2024-12-25T07:00:00.000Z",
  "recurrenceType": "none"
}
```

**Recurrence Types:** `none` | `daily` | `weekly` | `monthly`

> `scheduledTime` harus di masa depan.

---

### POST `/scheduler/:id/cancel`
Batalkan pesan terjadwal (hanya yang masih `pending`).
**Auth:** Required

---

### DELETE `/scheduler/:id`
Hapus pesan terjadwal.
**Auth:** Required

---

## 13. Scheduled Event (WA Event)

### POST `/scheduled-events/send`
Kirim undangan Scheduled Event WhatsApp.
**Auth:** Required

**Body:**
```json
{
  "to": "628123456789",
  "title": "Meeting Bulanan",
  "startTime": "2024-12-25T09:00:00.000Z",
  "description": "Review Q4 2024",
  "location": "Zoom / Google Meet",
  "sessionId": "auto"
}
```

---

### POST `/scheduled-events/respond`
Accept atau decline event yang diterima.
**Auth:** Required

**Body:**
```json
{
  "messageId": "true_628xxx_XXXXX",
  "response": "accept",
  "sessionId": "uuid"
}
```

**Response values:** `accept` | `decline`

---

## 14. Templates

### GET `/templates`
Daftar template pesan.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `category` | string | Filter by kategori |

---

### POST `/templates`
Buat template baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Sapaan Pagi",
  "content": "Selamat pagi {name}! Ada yang bisa kami bantu hari ini?",
  "category": "Greeting"
}
```

> Placeholder: `{name}`, `{date}`, dan custom key lainnya didukung.

---

### PUT `/templates/:id`
Update template.
**Auth:** Required

---

### DELETE `/templates/:id`
Hapus template.
**Auth:** Required

---

## 15. Webhook

### GET `/webhooks/config`
Dapatkan konfigurasi webhook.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "userId": "uuid",
    "webhookUrl": "https://yourapp.com/webhook",
    "webhookSecret": "***",
    "isActive": true
  }
}
```

---

### PUT `/webhooks/config`
Update URL webhook.
**Auth:** Required

**Body:**
```json
{
  "webhookUrl": "https://yourapp.com/webhook",
  "isActive": true
}
```

---

### POST `/webhooks/generate-secret`
Generate webhook secret baru (untuk HMAC signature verification).
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "secret": "hex-string" } }
```

---

### POST `/webhooks/test`
Test kirim payload ke webhook URL.
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "targetStatus": 200, "responseTime": "45ms" } }
```

---

#### Webhook Payload Format
Setiap event masuk akan dikirim ke URL webhook dengan format:
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
X-Hub-Signature: sha256=<hmac-signature>
Content-Type: application/json
```

---

## 16. API Keys

### GET `/keys`
Daftar API token.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mobile App Key",
      "keyPreview": "a1b2c3d4",
      "ipWhitelist": "192.168.1.0/24",
      "lastUsedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "..."
    }
  ]
}
```

---

### POST `/keys`
Generate API token baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Mobile App Key",
  "ipWhitelist": "192.168.1.1,10.0.0.0/8"
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
    "keyPreview": "a1b2c3d4"
  }
}
```

> ⚠️ Simpan `key` sekarang, tidak akan ditampilkan lagi!

---

### DELETE `/keys/:id`
Hapus API token.
**Auth:** Required

---

## 17. Settings

### GET `/settings/me`
Dapatkan pengaturan user (AI, auto-download, dll).
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "userId": "uuid",
    "geminiApiKey": "****abcd",
    "geminiConfidenceThreshold": 0.6,
    "autoDownloadPhotos": false,
    "autoDownloadVideos": false,
    "autoDownloadAudio": false,
    "autoDownloadDocuments": false,
    "backgroundSync": false
  }
}
```

---

### POST `/settings/me`
Update pengaturan user.
**Auth:** Required

**Body:** (semua field opsional)
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

### GET `/settings/global`
Dapatkan pengaturan global sistem.
**Auth:** Required (Admin only)

**Response:**
```json
{
  "status": true,
  "data": {
    "defaultDailyMessageLimit": "1000",
    "defaultMonthlyBroadcastLimit": "10",
    "maintenanceMode": "false",
    "maxBroadcastRecipients": "10000"
  }
}
```

---

### POST `/settings/global`
Update pengaturan global.
**Auth:** Required (Admin only)

**Body:**
```json
{
  "defaultDailyMessageLimit": 2000,
  "defaultMonthlyBroadcastLimit": 20
}
```

---

### POST `/settings/maintenance`
Aktifkan / nonaktifkan maintenance mode.
**Auth:** Required (Admin only)

**Body:**
```json
{ "enabled": true }
```

---

### POST `/settings/announcement`
Broadcast pengumuman ke semua user aktif (via WebSocket).
**Auth:** Required (Admin only)

**Body:**
```json
{ "message": "Server akan maintenance pukul 02.00 WIB" }
```

---

## 18. Analytics

### GET `/analytics/dashboard`
Data statistik dan dashboard.
**Auth:** Required

**Query Params:**
| Param | Type | Default | Keterangan |
|-------|------|---------|-----------|
| `days` | number | 7 | Rentang hari (1-30) |

**Response:**
```json
{
  "status": true,
  "data": {
    "summary": { "totalSent": 1200, "successRate": 94.5, "totalBroadcasts": 5 },
    "chart": [
      { "date": "2024-01-01", "total": 150, "success": 140, "failed": 10 }
    ],
    "recentCampaigns": [...],
    "recentLogs": [...]
  }
}
```

---

### GET `/analytics/system`
Status sistem dan resource server.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "server": {
      "nodeVersion": "v20.x.x",
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

## 19. Audit Log

### GET `/audit`
Riwayat audit log. Admin melihat semua, user biasa hanya miliknya.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `action` | string | Filter by action (lihat tabel di bawah) |
| `from` | string | Tanggal mulai (ISO 8601) |
| `to` | string | Tanggal akhir (ISO 8601) |
| `page` | number | |
| `limit` | number | |

**Audit Actions:**
`LOGIN` | `LOGOUT` | `CREATE_SESSION` | `DELETE_SESSION` | `RECONNECT_SESSION` | `CREATE_API_KEY` | `DELETE_API_KEY` | `START_BROADCAST` | `CANCEL_BROADCAST` | `UPDATE_SETTINGS` | `ENABLE_2FA` | `DISABLE_2FA` | `CREATE_USER` | `UPDATE_USER` | `DELETE_USER` | `ASSIGN_TIER` | `CREATE_WORKSPACE` | `INVITE_MEMBER` | `REMOVE_MEMBER`

---

### GET `/audit/export-pdf`
Export audit log ke PDF.
**Auth:** Required
**Response:** File download `audit_YYYYMMDD.pdf`

---

## 20. Users (Admin)

### GET `/users/profile`
Profil user yang sedang login.
**Auth:** Required

---

### PUT `/users/profile`
Update profil (nama, foto).
**Auth:** Required

**Body:**
```json
{ "name": "John Doe", "picture": "https://..." }
```

---

### GET `/users`
Daftar semua user.
**Auth:** Required (Admin only)

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `search` | string | Cari nama/email |
| `role` | string | `user` \| `admin` \| `super_admin` |
| `isActive` | boolean | Filter status aktif |
| `page` | number | |
| `limit` | number | |

---

### GET `/users/:id`
Detail user.
**Auth:** Required (Admin only)

---

### PUT `/users/:id`
Update user (role, isActive).
**Auth:** Required (Admin only)

**Body:**
```json
{ "role": "admin", "isActive": true }
```

---

### DELETE `/users/:id`
Hapus user.
**Auth:** Required (Admin only)

---

### PUT `/users/:id/quota`
Update kuota user secara manual.
**Auth:** Required (Admin only)

**Body:**
```json
{ "messagesSentToday": 0, "broadcastsThisMonth": 0 }
```

---

## 21. Tiers

### GET `/tiers`
Daftar semua tier.
**Auth:** Required

**Response data fields:**
```json
{
  "id": "uuid",
  "name": "Pro",
  "description": "Tier profesional",
  "maxSessions": 5,
  "maxApiKeys": 5,
  "maxDailyMessages": 2000,
  "maxMonthlyBroadcasts": 50,
  "maxBroadcastRecipients": 5000,
  "maxWorkflows": 10,
  "maxDripCampaigns": 5,
  "maxTemplates": 50,
  "maxContacts": 5000,
  "rateLimitPerMinute": 60,
  "features": ["broadcast", "auto_reply", "workflow", "drip_campaign", "ai_smart_reply", "channels", "labels", "customer_note", "scheduler", "webhook", "api_access"],
  "price": "299000.00",
  "isActive": true
}
```

---

### POST `/tiers`
Buat tier baru.
**Auth:** Required (Admin only)

**Body:**
```json
{
  "name": "Starter",
  "description": "Tier starter",
  "maxSessions": 1,
  "maxApiKeys": 2,
  "maxDailyMessages": 200,
  "maxMonthlyBroadcasts": 5,
  "features": ["auto_reply", "scheduler"],
  "isActive": true
}
```

---

### PUT `/tiers/:id`
Update tier.
**Auth:** Required (Admin only)

---

### DELETE `/tiers/:id`
Hapus tier.
**Auth:** Required (Admin only)

---

### POST `/tiers/assign`
Assign tier ke user.
**Auth:** Required (Admin only)

**Body:**
```json
{
  "userId": "uuid",
  "tierId": "uuid",
  "expiresAt": "2025-12-31T23:59:59.000Z"
}
```

---

## 22. Workspace

### GET `/workspaces`
Daftar workspace yang diikuti user.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tim Marketing",
      "ownerId": "uuid",
      "members": [
        {
          "id": "uuid",
          "role": "owner",
          "permissions": null,
          "user": { "id": "uuid", "name": "John", "email": "john@example.com" }
        }
      ]
    }
  ]
}
```

---

### POST `/workspaces`
Buat workspace baru.
**Auth:** Required

**Body:**
```json
{ "name": "Tim Marketing" }
```

---

### POST `/workspaces/:id/invite`
Undang anggota ke workspace via email.
**Auth:** Required (Owner only)

**Body:**
```json
{ "email": "member@example.com" }
```

---

### PUT `/workspaces/:id/members/:memberId/permission`
Update role atau permission anggota.
**Auth:** Required (Owner only)

**Body:**
```json
{
  "role": "admin",
  "permissions": { "canBroadcast": true, "canViewAnalytics": false }
}
```

**Roles:** `admin` | `member`

---

### DELETE `/workspaces/:id/members/:memberId`
Hapus anggota dari workspace.
**Auth:** Required (Owner only)

---

## 23. Profile (WA Account)

### GET `/profile/:sessionId`
Dapatkan info profil akun WA.
**Auth:** Required

**Response:**
```json
{
  "status": true,
  "data": {
    "wid": { "user": "628123456789", "server": "s.whatsapp.net" },
    "pushname": "John Doe",
    "platform": "android"
  }
}
```

---

### POST `/profile/:sessionId/display-name`
Set display name akun WA.
**Auth:** Required

**Body:**
```json
{ "name": "John Doe Business" }
```

---

### POST `/profile/:sessionId/status`
Set status/bio akun WA.
**Auth:** Required

**Body:**
```json
{ "status": "Melayani 24 jam 🕐" }
```

---

### POST `/profile/:sessionId/photo`
Upload foto profil akun WA.
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Keterangan |
|-------|------|-----------|
| `file` | File | Gambar (JPEG/PNG) |

---

### DELETE `/profile/:sessionId/photo`
Hapus foto profil akun WA.
**Auth:** Required

---

### GET `/profile/:sessionId/contacts`
Dapatkan semua kontak dari akun WA.
**Auth:** Required

---

### GET `/profile/:sessionId/contacts/:contactId`
Dapatkan kontak WA by ID (JID).
**Auth:** Required
**Param:** `contactId` contoh: `628123456789@s.whatsapp.net`

---

### GET `/profile/:sessionId/contacts/:contactId/photo`
Dapatkan URL foto profil kontak.
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "url": "https://..." } }
```

---

### POST `/profile/:sessionId/contacts/:contactId/block`
Blokir kontak.
**Auth:** Required

---

### POST `/profile/:sessionId/contacts/:contactId/unblock`
Unblokir kontak.
**Auth:** Required

---

### GET `/profile/:sessionId/contacts/blocked`
Daftar kontak yang diblokir.
**Auth:** Required

---

## 24. Chats

### GET `/chats/:sessionId`
Dapatkan semua chat dari akun WA.
**Auth:** Required

---

### GET `/chats/:sessionId/:chatId`
Detail chat by ID.
**Auth:** Required

---

### POST `/chats/:sessionId/:chatId/archive`
Arsipkan chat.
**Auth:** Required

---

### POST `/chats/:sessionId/:chatId/unarchive`
Batalkan arsip chat.
**Auth:** Required

---

### POST `/chats/:sessionId/:chatId/mute`
Bisukan chat.
**Auth:** Required

**Body:**
```json
{ "duration": 3600 }
```
> Isi `duration` dalam detik. Kosongkan untuk mute selamanya.

---

### POST `/chats/:sessionId/:chatId/unmute`
Batalkan bisukan chat.
**Auth:** Required

---

### POST `/chats/:sessionId/:chatId/pin`
Pin chat.
**Auth:** Required

---

### POST `/chats/:sessionId/:chatId/unpin`
Unpin chat.
**Auth:** Required

---

### DELETE `/chats/:sessionId/:chatId`
Hapus chat.
**Auth:** Required

---

### POST `/chats/:sessionId/:chatId/read`
Tandai chat sebagai dibaca.
**Auth:** Required

---

### GET `/chats/:sessionId/search`
Cari pesan di semua chat.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `q` | string | Kata kunci pencarian |

---

## 25. Groups

### POST `/groups`
Buat grup baru.
**Auth:** Required

**Body:**
```json
{
  "name": "Tim Internal",
  "participants": ["628111111111", "628222222222"]
}
```

---

### GET `/groups/:sessionId/:groupId`
Info detail grup.
**Auth:** Required
**Param:** `groupId` contoh: `120363xxxxxxxx@g.us`

---

### POST `/groups/:sessionId/:groupId/participants/add`
Tambah anggota grup.
**Auth:** Required

**Body:**
```json
{ "participants": ["628333333333@s.whatsapp.net"] }
```

---

### POST `/groups/:sessionId/:groupId/participants/remove`
Hapus anggota dari grup.
**Auth:** Required

**Body:**
```json
{ "participants": ["628333333333@s.whatsapp.net"] }
```

---

### POST `/groups/:sessionId/:groupId/participants/promote`
Jadikan anggota sebagai admin grup.
**Auth:** Required

**Body:**
```json
{ "participants": ["628333333333@s.whatsapp.net"] }
```

---

### POST `/groups/:sessionId/:groupId/participants/demote`
Turunkan admin menjadi anggota biasa.
**Auth:** Required

**Body:**
```json
{ "participants": ["628333333333@s.whatsapp.net"] }
```

---

### POST `/groups/:sessionId/:groupId/update`
Update nama dan/atau deskripsi grup.
**Auth:** Required

**Body:**
```json
{ "subject": "Nama Grup Baru", "description": "Deskripsi baru" }
```

---

### POST `/groups/:sessionId/:groupId/leave`
Keluar dari grup.
**Auth:** Required

---

### GET `/groups/:sessionId/:groupId/invite`
Dapatkan invite link grup.
**Auth:** Required

**Response:**
```json
{ "status": true, "data": { "inviteLink": "https://chat.whatsapp.com/XXXXX" } }
```

---

### POST `/groups/:sessionId/:groupId/invite/revoke`
Revoke (reset) invite link grup.
**Auth:** Required

---

### POST `/groups/:sessionId/join`
Join grup via invite code.
**Auth:** Required

**Body:**
```json
{ "inviteCode": "XXXXX" }
```

---

### GET `/groups/:sessionId/invite/:inviteCode/info`
Dapatkan info grup sebelum join.
**Auth:** Required

---

### POST `/groups/:sessionId/:groupId/membership-request`
Approve atau reject join request.
**Auth:** Required

**Body:**
```json
{
  "requesterJid": "628xxx@s.whatsapp.net",
  "action": "approve"
}
```
**Actions:** `approve` | `reject`

---

### GET `/groups/:sessionId/:groupId/membership-requests`
Daftar join request yang pending.
**Auth:** Required

---

### GET `/groups/:sessionId/contacts/:contactId/common-groups`
Dapatkan grup yang sama antara akun WA dan kontak.
**Auth:** Required

---

## 26. Channels (WA Channels)

### GET `/channels/:sessionId`
Dapatkan semua channel yang diikuti.
**Auth:** Required

---

### GET `/channels/:sessionId/search`
Cari channel berdasarkan keyword.
**Auth:** Required

**Query Params:**
| Param | Type | Keterangan |
|-------|------|-----------|
| `query` | string | Kata kunci |

---

### GET `/channels/:sessionId/invite/:inviteCode`
Dapatkan info channel by invite code.
**Auth:** Required

---

### POST `/channels/:sessionId/:channelId/subscribe`
Subscribe ke channel.
**Auth:** Required

---

### POST `/channels/:sessionId/:channelId/unsubscribe`
Unsubscribe dari channel.
**Auth:** Required

---

### POST `/channels/:sessionId/:channelId/send`
Kirim pesan ke channel (harus jadi admin).
**Auth:** Required

**Body:**
```json
{ "message": "Pengumuman penting!" }
```

---

### POST `/channels/:sessionId/:channelId/admin`
Kelola admin channel.
**Auth:** Required

**Body:**
```json
{
  "participantJid": "628xxx@s.whatsapp.net",
  "action": "add"
}
```
**Actions:** `add` | `remove`

---

### POST `/channels/:sessionId/:channelId/transfer`
Transfer kepemilikan channel.
**Auth:** Required

**Body:**
```json
{ "newOwnerJid": "628xxx@s.whatsapp.net" }
```

---

### PUT `/channels/:sessionId/:channelId`
Update nama dan deskripsi channel.
**Auth:** Required

**Body:**
```json
{ "name": "Channel Baru", "description": "Deskripsi channel" }
```

---

### DELETE `/channels/:sessionId/:channelId`
Hapus channel.
**Auth:** Required

---

## 27. Labels (WA Native Labels)

### GET `/labels/:sessionId`
Dapatkan semua label dari akun WA.
**Auth:** Required

---

### GET `/labels/:sessionId/:labelId`
Detail label by ID.
**Auth:** Required

---

### POST `/labels/:sessionId/chats/:chatId/labels/:labelId`
Tambahkan label ke chat.
**Auth:** Required

---

### POST `/labels/:sessionId/chats/:chatId/labels/:labelId/remove`
Hapus label dari chat.
**Auth:** Required

---

### GET `/labels/:sessionId/labels/:labelId/chats`
Dapatkan semua chat yang memiliki label tertentu.
**Auth:** Required

---

## 28. Status (WA Status)

### POST `/status/:sessionId/bio`
Set teks bio/status WA.
**Auth:** Required

**Body:**
```json
{ "status": "Tersedia untuk konsultasi 🕐" }
```

---

### POST `/status/:sessionId/send`
Kirim status/story teks ke WA.
**Auth:** Required

**Body:**
```json
{ "text": "Hari yang menyenangkan! ☀️" }
```

---

### POST `/status/:sessionId/presence`
Set presence (online/offline).
**Auth:** Required

**Body:**
```json
{ "available": true }
```

---

## 29. Calls

### GET `/calls`
Log panggilan masuk.
**Auth:** Required

**Query Params:** `page`, `limit`

**Response data fields:**
```json
{
  "id": "uuid",
  "fromNumber": "628123456789",
  "callType": "voice",
  "status": "missed",
  "sessionId": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 30. Health

### GET `/health`
Cek status server dan Redis.
**Auth:** Tidak diperlukan

**Response:**
```json
{ "status": "ok", "redis": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## 31. WebSocket Events

**URL:** `ws://localhost:3000`
**Auth:** Kirim JWT token saat connect:
```js
const socket = io("http://localhost:3000", {
  auth: { token: "your-jwt-token" }
});
```

User otomatis join room berdasarkan `userId`, sehingga hanya menerima event milik sendiri.

### Events yang Diterima Client (Server → Client)

| Event | Payload | Keterangan |
|-------|---------|-----------|
| `qr` | `{ sessionId, qr }` | QR code untuk scan (base64) |
| `code` | `{ sessionId, code }` | Pairing code |
| `connection_update` | `{ sessionId, status, phoneNumber? }` | Update status koneksi sesi |
| `new_message` | `{ message: { id, from, body, type, sessionId } }` | Pesan masuk baru |
| `message_ack` | `{ sessionId, msgId, ack }` | Update status baca pesan (sent/delivered/read) |
| `message_edit` | WA raw | Pesan diedit |
| `message_reaction` | WA raw | Reaksi pada pesan |
| `message_revoke_everyone` | WA raw | Pesan dihapus untuk semua |
| `group_join` | `{ sessionId, notification }` | Ada yang join grup |
| `group_leave` | `{ sessionId, notification }` | Ada yang keluar grup |
| `incoming_call` | `{ sessionId, call }` | Panggilan masuk |
| `broadcast_progress` | `{ campaignId, current, total, percentage, successCount, failedCount }` | Progress broadcast berjalan |
| `broadcast_complete` | `{ campaignId, successCount, failedCount }` | Broadcast selesai |
| `system_alert` | `{ type, message, data? }` | Alert sistem (quota, disconnect, dll) |

### System Alert Types
| Type | Keterangan |
|------|-----------|
| `quota_warning` | Kuota hampir habis |
| `quota_exceeded` | Kuota habis |
| `session_disconnected` | Sesi terputus |
| `session_logged_out` | Sesi logout |
| `ai_disabled` | AI key tidak valid |
| `announcement` | Pengumuman dari admin |

---

## 32. Roles & Permission Matrix

| Endpoint | user | admin | super_admin |
|----------|------|-------|-------------|
| Auth, Sessions, Messages, Broadcast, Contacts, dll | ✅ | ✅ | ✅ |
| GET `/analytics/system` | ✅ | ✅ | ✅ |
| GET/POST `/settings/global` | ❌ | ✅ | ✅ |
| POST `/settings/maintenance` | ❌ | ✅ | ✅ |
| POST `/settings/announcement` | ❌ | ✅ | ✅ |
| GET `/audit` | Milik sendiri | Semua | Semua |
| GET `/users` | ❌ | ✅ | ✅ |
| PUT/DELETE `/users/:id` | ❌ | ✅ | ✅ |
| POST `/tiers` & `/tiers/assign` | ❌ | ✅ | ✅ |

---

## 33. Tier Features

| Feature Key | Keterangan |
|-------------|-----------|
| `broadcast` | Fitur broadcast massal |
| `auto_reply` | Auto reply |
| `workflow` | Workflow otomatis |
| `drip_campaign` | Drip campaign |
| `ai_smart_reply` | Auto reply dengan AI (Gemini) |
| `channels` | Kelola WA Channels |
| `labels` | Label WA native |
| `customer_note` | Catatan kontak |
| `scheduler` | Pesan terjadwal |
| `webhook` | Integrasi webhook |
| `api_access` | Akses via API Key |

---

## 34. Tier Defaults (Seed Data)

| Tier | Harga | Sessions | Msg/Hari | Broadcast/Bulan |
|------|-------|----------|----------|-----------------|
| Free | Grp | 1 | 100 | 2 |
| Basic | Rp 99.000 | 2 | 500 | 10 |
| Pro | Rp 299.000 | 5 | 2.000 | 50 |
| Enterprise | Rp 999.000 | 20 | 10.000 | 200 |
