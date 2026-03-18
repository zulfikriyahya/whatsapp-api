# Fitur Lengkap Aplikasi WhatsApp Gateway SaaS

---

## 1. 🔐 Autentikasi & Akun

### Login & Registrasi
- Login menggunakan akun Google (OAuth 2.0)
- Registrasi otomatis saat pertama kali login dengan Google
- Email super_admin/admin dari konfigurasi otomatis mendapat role admin saat pertama login

### Multi-Factor Authentication (MFA/2FA)
- MFA opsional per akun
- Mendukung TOTP (Google Authenticator, Authy, dll)
- Proses login 2 tahap: Google login → temp_token 5 menit (one-time) → verifikasi kode 6 digit TOTP
- Backup codes untuk recovery jika MFA hilang
- Paksa MFA untuk role tertentu (admin, super_admin)
- Toleransi waktu ±40 detik (2-step window) untuk validasi kode TOTP
- Aktifkan 2FA: generate QR code secret → scan di authenticator → verifikasi kode
- Nonaktifkan 2FA: wajib verifikasi kode terlebih dahulu

### Manajemen Akun
- Edit profil (nama, foto)
- Lihat riwayat login (IP, device, waktu) via audit log
- Hapus akun (dengan konfirmasi)

---

## 2. 👑 Role & Permission

| Role | Keterangan |
|---|---|
| `super_admin` | Akses penuh, kelola semua user & tier |
| `admin` | Kelola user, konfigurasi sistem, semua fitur |
| `user` | Akses fitur komunikasi & otomasi milik sendiri |
| `external_client` | Akses via API Key, hanya kirim pesan & cek status |

- RBAC (Role-Based Access Control) per endpoint
- Super admin / admin dapat impersonate akun user (untuk support/debug)
- Audit log setiap aksi admin & super admin
- User hanya bisa akses resource milik sendiri (isolasi data antar user)

### Matriks Hak Akses

| Fitur | Admin | User | External Client (API Key) |
|---|---|---|---|
| Kelola User | ✅ | ❌ | ❌ |
| Kelola Sesi WA | ✅ | ✅ (milik sendiri) | ❌ |
| Kirim Pesan Teks | ✅ | ✅ | ✅ |
| Kirim Pesan Multimedia | ✅ | ✅ | ✅ |
| Mode Auto (round-robin) | ✅ | ✅ | ✅ |
| Broadcast | ✅ | ✅ | ❌ |
| Auto Reply / Workflow | ✅ | ✅ | ❌ |
| Drip Campaign | ✅ | ✅ | ❌ |
| Konfigurasi Global | ✅ | ❌ | ❌ |
| Kelola API Keys | ✅ | ✅ (milik sendiri) | ❌ |
| Audit Log | ✅ (semua) | ✅ (milik sendiri) | ❌ |

---

## 3. 💼 Tier & Langganan (Subscription)

### Tier Plan
- Definisi tier oleh super_admin (Free, Basic, Pro, Enterprise, Custom)
- Setiap tier memiliki batasan:
  - Jumlah maksimal sesi/device WhatsApp
  - Jumlah maksimal API token
  - Rate limit pengiriman pesan (per menit/jam/hari)
  - Batas broadcast bulanan
  - Akses ke fitur tertentu (AI, channel, broadcast, dll)
  - Masa aktif langganan

### Manajemen Langganan
- Assign tier ke akun oleh super_admin
- Notifikasi saat penggunaan mencapai 80% dari batas kuota
- Notifikasi saat kuota habis (100%)
- Grace period setelah langganan habis
- Riwayat perubahan tier per akun
- Integrasi pembayaran (Midtrans / Xendit / Stripe) *(opsional)*

---

## 4. 🔑 API Token

- Generate API token per akun (jumlah token dibatasi oleh tier, maks default 10)
- Token berupa 48-char hex (`crypto.randomBytes(24).toString('hex')`)
- Beri nama/label tiap token (misal: "token-production", "token-staging")
- Plaintext token **hanya ditampilkan sekali** saat pembuatan; setelahnya hanya 8 karakter pertama (preview) yang tersimpan
- Token disimpan sebagai SHA-256 hash di database
- IP whitelist per token (opsional, kosong = semua IP diizinkan)
- Validasi format IPv4/IPv6 CIDR sebelum menyimpan whitelist
- Lihat `last_used_at` per token
- Revoke / hapus token kapan saja
- Rate limiting per token (default 300 req/menit, terpisah dari rate limit session cookie)
- Kuota pesan user pemilik token tetap dihitung saat token digunakan
- Akses via header `X-API-Key`

---

## 5. 📱 Manajemen Sesi / Device WhatsApp

- Tambah sesi baru dengan nama unik per akun
- Login via **QR Code scan** (real-time via Socket.IO)
- Login via **Pairing Code** (tanpa scan QR, cocok untuk server headless)
- QR code diperbarui otomatis jika expired sebelum di-scan
- Beri nama per sesi (misal: "CS-1", "Marketing", "Bot-Sales")
- Set sesi sebagai default
- Lihat status sesi real-time: `connected`, `disconnected`, `authenticating`, `logged_out`
- Reconnect sesi yang terputus (exponential backoff, maks 10 percobaan)
- Tidak ada auto-retry jika status `logged_out`
- Hapus / logout sesi (menghapus folder auth dan semua data terkait)
- Jumlah maksimal sesi dibatasi oleh tier akun
- Sesi aktif kembali otomatis saat server restart (kecuali yang `logged_out`)
- WarmingService: kirim sinyal kehadiran (presence) tiap ~5–10 menit untuk menjaga sesi tetap aktif
- Notifikasi real-time jika sesi terputus atau logout permanen (via Socket.IO & email)
- Notifikasi jika semua sesi user terputus sekaligus
- Dapatkan info WhatsApp Web version yang sedang berjalan (`getWWebVersion`)
- Dapatkan info device & state koneksi (`getState`)

---

## 6. ⚖️ Load Balancing

- Distribusi pengiriman pesan ke semua sesi aktif secara otomatis via mode `sessionId: "auto"`
- Strategi: **Round Robin** — bergiliran antar sesi, counter disimpan di Redis per user (`rr:{userId}`) agar konsisten lintas request
- Counter round-robin **sama** untuk pesan tunggal maupun broadcast (distribusi beban merata)
- Fallback otomatis ke sesi lain jika sesi yang dipilih gagal kirim
- Jika semua sesi gagal → error `ERR_NO_SESSIONS`
- Snapshot daftar sesi aktif diambil saat broadcast dimulai
- Monitor beban per sesi (jumlah pesan terkirim, antrian, dll) via dashboard

---

## 7. 📨 Pengiriman Pesan (Messaging)

### Pesan Teks
- Kirim pesan teks biasa ke satu nomor
- Formatting teks: **bold**, _italic_, ~~strikethrough~~, `monospace`
- Kirim pesan dengan mention (@seseorang) di grup
- Kirim pesan sebagai reply/quote dari pesan tertentu
- Edit pesan yang sudah dikirim
- Hapus pesan (delete for me / delete for everyone)
- Forward pesan ke nomor/grup lain
- Pin pesan di chat
- React pesan dengan emoji
- Normalisasi nomor otomatis: `0xxx` → `62xxx`, strip karakter non-digit
- Cek apakah nomor terdaftar di WhatsApp sebelum kirim (`isRegisteredUser`)
- Setiap pengiriman dicatat di message logs (status, sesi yang digunakan, error jika gagal)
- Retry pesan yang gagal
- Riwayat pesan dengan filter (status, sesi, halaman)

### Pesan Multimedia & File
- Kirim gambar, video, audio, dokumen, sticker (maks 50MB per file)
- Kirim media dengan caption
- Kirim voice note
- Kirim GIF
- Kirim lokasi (static & live location)
- Kirim kontak (vCard)
- Download / simpan media dari pesan yang diterima
- MIME type yang diizinkan:
  - Gambar: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
  - Video: `video/mp4`, `video/3gpp`
  - Audio: `audio/mpeg`, `audio/ogg`, `audio/mp4`
  - Dokumen: `application/pdf`, Office formats, `text/plain`
- Validasi MIME type dari magic bytes (bukan hanya ekstensi)

### Poll (Voting)
- Kirim pesan berupa poll/voting ke chat atau grup
- Dapatkan hasil vote secara real-time
- Event `vote_update` untuk memantau perubahan vote

### Pesan Terjadwal (Scheduler)
- Jadwalkan pesan untuk dikirim di waktu tertentu di masa depan
- Validasi: waktu jadwal harus di masa depan
- Sistem memeriksa jadwal setiap 60 detik
- Hanya dikirim jika sesi aktif; jika tidak, di-skip ke interval berikutnya
- Mendukung pengulangan: none / daily / weekly / monthly
- Batalkan / hapus pesan terjadwal
- Filter berdasarkan status (pending, sent, failed, cancelled)
- Semua waktu menggunakan timezone WIB (UTC+7)

### Broadcast Massal
- Kirim pesan ke banyak penerima sekaligus
- Sumber penerima: input manual, upload CSV, atau filter tag kontak
- Deduplication penerima sebelum dikirim
- Mendukung lampiran file (gambar, video, audio, dokumen)
- Jeda acak antar pesan: 1–3 detik (anti-spam / anti-ban WhatsApp)
- Antrian via BullMQ, maks 10 pesan/detik
- Maks 10.000 penerima per campaign
- Progress pengiriman real-time via Socket.IO
- Failover ke sesi lain jika sesi gagal di tengah broadcast
- Batalkan broadcast yang sedang berjalan
- File lampiran broadcast dihapus otomatis setelah selesai
- Batas broadcast bulanan per user sesuai tier

---

## 8. 📥 Inbox (Pesan Masuk)

- Semua pesan masuk tersimpan otomatis (hanya dari luar / `fromMe = false`)
- Mendukung tipe pesan masuk: teks, gambar, video, audio, dokumen, sticker, lokasi
- Notifikasi pesan baru real-time via Socket.IO
- Percakapan dikelompokkan per nomor/kontak, sorted by latest message
- Mendukung percakapan grup WhatsApp
- Balas pesan langsung dari inbox (menggunakan sesi yang sama dengan penerima pesan)
- Tandai pesan sebagai sudah dibaca / belum dibaca
- Filter inbox: unread, per JID
- Riwayat inbox tidak disinkronisasi ke belakang — hanya pesan yang masuk setelah sesi terhubung
- Deteksi status baca pesan yang dikirim (sent → delivered → read) via `message_ack`

---

## 9. 👥 Manajemen Grup

- Buat grup baru
- Tambah / hapus anggota grup
- Promosi / demosi admin grup
- Ubah nama & deskripsi grup
- Ubah foto profil grup
- Dapatkan info grup lengkap (anggota, admin, deskripsi, dll)
- Keluar dari grup
- Hapus grup
- Generate & revoke invite link grup
- Join grup via invite link
- Dapatkan info invite sebelum join (`getInviteInfo`)
- Approve / reject join request (untuk grup dengan fitur approval)
- Dapatkan daftar membership request yang pending
- Dapatkan daftar grup yang sama antara bot dan kontak tertentu (`getCommonGroups`)

---

## 10. 📣 Channel WhatsApp

- Buat channel baru
- Hapus channel
- Subscribe / unsubscribe ke channel
- Cari channel berdasarkan keyword
- Dapatkan daftar channel yang diikuti
- Get channel by invite code
- Kelola admin channel (undang, revoke, accept, demote)
- Transfer kepemilikan channel
- Kirim pesan ke channel
- Revoke / hapus status message di channel

---

## 11. 📡 Status & Presence

- Set status/bio akun
- Kirim WhatsApp Status/Story (teks, gambar, video)
- Revoke / hapus status yang sudah dikirim
- Detect typing indicator (sedang mengetik) dari kontak
- Detect online/offline status kontak
- Set presence: available / unavailable

---

## 12. 👤 Manajemen Kontak

### Kontak WhatsApp
- Dapatkan semua daftar kontak dari WhatsApp
- Cari kontak by ID atau nomor
- Cek apakah nomor terdaftar di WhatsApp (`isRegisteredUser`)
- Blokir / unblokir kontak
- Dapatkan semua kontak yang diblokir
- Dapatkan foto profil kontak
- Dapatkan jumlah device kontak
- Dapatkan formatted number & country code
- Dapatkan LID dan nomor telepon kontak (`getContactLidAndPhone`)

### Phonebook (Database Kontak Internal)
- Tambah, edit, hapus kontak di database internal
- Format nomor otomatis distandarisasi (`0xxx` → `62xxx`)
- Nomor duplikat per user ditolak
- Tag/label kontak untuk pengelompokan dan segmentasi
- Cari kontak (by nama, nomor, tag)
- Filter kontak by tag
- Pagination server-side (default 10, maks 100 per halaman)
- Import dari file CSV (skip duplikat, return `{ imported, skipped, errors }`)
- Import dari Google Contacts (OAuth → Google People API, hanya kontak dengan nomor)
- Export ke file CSV
- Hapus banyak kontak sekaligus (by ID atau by filter/selectAll)

---

## 13. 💬 Manajemen Chat

- Dapatkan semua daftar chat
- Dapatkan chat by ID
- Arsipkan / unarsipkan chat
- Mute / unmute chat (dengan tanggal unmute opsional)
- Pin / unpin chat
- Hapus chat
- Sync riwayat chat (`syncHistory`)
- Dapatkan pesan yang di-pin dalam suatu chat
- Dapatkan pesan by ID
- Cari pesan berdasarkan query & filter
- Tandai chat sebagai dibaca / belum dibaca

---

## 14. 👤 Profil Akun WhatsApp

- Set foto profil
- Hapus foto profil
- Set display name
- Set status/bio akun

---

## 15. 🏷️ Label (WhatsApp Business)

- Buat, edit, hapus label
- Dapatkan semua label
- Dapatkan label by ID
- Assign / remove label ke chat
- Dapatkan label dari suatu chat
- Dapatkan daftar chat berdasarkan label

---

## 16. 🗒️ Customer Note (WhatsApp Business)

- Tambah / edit catatan internal untuk pelanggan
- Dapatkan catatan pelanggan

---

## 17. 📅 Scheduled Event (WhatsApp)

- Kirim pesan berupa Scheduled Event (undangan/acara di WhatsApp)
- Kirim respons ke Scheduled Event yang diterima (accept/decline)

---

## 18. 📻 Broadcast List (WhatsApp Native)

- Dapatkan daftar broadcast list dari WhatsApp
- Dapatkan broadcast list by ID
- Kirim pesan ke broadcast list

---

## 19. 📞 Panggilan (Call)

- Detect dan tangani event panggilan masuk
- Buat call link untuk dibagikan
- Logging panggilan masuk (nomor, waktu, sesi)

---

## 20. 🤖 Auto Reply

- Buat aturan balas otomatis berdasarkan kata kunci
- Tipe pencocokan:
  - **Exact** — pesan sama persis dengan keyword
  - **Contains** — pesan mengandung keyword
  - **Regex** — pola ekspresi reguler (divalidasi saat penyimpanan)
  - **AI Smart** — dikirim ke Google Gemini, parse JSON `{ intent, reply, confidence }`
- Field **priority** per rule: urutan eksekusi, nilai lebih kecil = lebih diprioritaskan
- Hanya satu rule yang dieksekusi per pesan (setelah cocok, loop berhenti)
- Aktifkan / nonaktifkan rule
- Validasi regex tidak valid ditolak saat penyimpanan
- Rule AI di-skip jika Gemini tidak tersedia atau confidence di bawah threshold
- Proteksi loop: tidak membalas pesan dari bot/auto-reply lain

---

## 21. 🔄 Workflow Automation

- Buat workflow dengan trigger kata kunci (exact / contains / regex)
- Node yang tersedia:
  - **Kirim Pesan** — mengirim pesan ke pengirim
  - **Tunda (Delay)** — tunggu N detik (maks 3600 detik / 1 jam)
  - **Tambah Tag** — tambahkan tag ke kontak; jika kontak belum ada, buat kontak baru
- Maks 20 nodes per workflow
- Setiap eksekusi dicatat di workflow logs (status per node, error jika gagal)
- Cache workflow aktif di Redis (TTL 5 menit), invalidate saat ada perubahan
- Aktifkan / nonaktifkan workflow
- Lihat jumlah total eksekusi per workflow

---

## 22. 💧 Drip Campaign

- Buat drip campaign dengan trigger tag kontak
- Tambah langkah per hari (day_offset, jam pengiriman HH:MM, pesan)
- Tidak boleh ada dua langkah di hari yang sama
- Kontak dengan tag yang sesuai terdaftar otomatis (DripManager cek tiap 60 detik)
- Tidak ada duplikasi subscription kontak per campaign
- Placeholder `{name}` diganti nama kontak saat pengiriman
- Lacak progress per kontak (langkah terakhir yang sudah dikirim)
- Subscription otomatis selesai setelah semua langkah terkirim
- Batalkan subscription kontak secara manual
- Semua kalkulasi waktu menggunakan timezone WIB (UTC+7)
- Aktifkan / nonaktifkan drip campaign

---

## 23. 📝 Template Pesan

- Buat, edit, hapus template dengan nama unik per user
- Kategorisasi template
- Placeholder `{name}` dan `{date}` didukung
- Preview pesan real-time di UI (dengan contoh nilai placeholder)
- Penggantian placeholder dilakukan saat penggunaan, bukan saat penyimpanan
- Cache template di Redis (TTL 1 jam)

---

## 24. 🌐 REST API

- Autentikasi via Session Cookie (JWT HttpOnly) atau API Key (header `X-API-Key`)
- Dokumentasi API otomatis (Swagger / OpenAPI)
- Versioning API (`/api/v1/`)
- Response format standar JSON:
  - Sukses: `{ status: true, data: {...} }`
  - Gagal: `{ status: false, error: "...", code: "ERR_CODE" }`
  - List: `{ status: true, data: [...], meta: { total, page, limit, totalPages } }`
- Pagination untuk semua endpoint list
- Filter & sorting pada endpoint list
- Error code standar untuk semua error
- Sandbox/testing mode per token
- Endpoint `/health` tanpa autentikasi untuk monitoring eksternal

---

## 25. 🪝 Webhook

- Daftarkan webhook URL (global per akun)
- Event yang dikirim: setiap pesan masuk baru
- Payload: `{ event, session, from, name, text, type, timestamp }`
- Payload ditandatangani dengan HMAC-SHA256 (header `X-Hub-Signature`)
- Generate / regenerate webhook secret
- Test webhook langsung dari UI
- Retry otomatis dengan exponential backoff (maks 5 kali):
  - Retry 1: 1 menit / Retry 2: 5 menit / Retry 3: 15 menit / Retry 4: 1 jam / Retry 5: 6 jam
- Log history pengiriman webhook (sukses/gagal, last error)
- Antrian webhook via BullMQ (terpisah dari antrian broadcast)

---

## 26. 📬 Message Queue & Antrian

- Antrian pengiriman pesan berbasis BullMQ + Redis
- Queue broadcast dan queue webhook berjalan sebagai worker terpisah
- Jeda acak antar pesan broadcast (anti-spam)
- Retry otomatis jika pesan gagal terkirim
- Maks 10 pesan broadcast per detik (BullMQ rate limiter)
- Concurrency broadcast: 1 job sekaligus (tidak multi-thread untuk menghindari konflik sesi)
- Batalkan pesan yang masih dalam antrian
- Lihat status antrian (waiting, active, failed) per queue via dashboard

---

## 27. 🧠 AI Smart Reply (Google Gemini)

- Integrasi Google Gemini (model: `gemini-3-flash-preview`)
- API key dikonfigurasi via UI Settings atau environment variable (DB prioritas)
- Response selalu berformat JSON: `{ intent, reply, confidence }`
- Confidence threshold yang bisa dikonfigurasi (default 0.6)
- Jika confidence di bawah threshold → tidak membalas (skip rule)
- Timeout request ke Gemini: 10 detik
- API key tidak valid → AI dinonaktifkan otomatis, semua rule `ai_smart` di-skip
- AI aktif kembali otomatis setelah API key diperbarui di Settings
- Sistem tetap berjalan normal (degraded mode) jika Gemini tidak tersedia

---

## 28. 📊 Dashboard & Monitoring

- Overview statistik: total pesan terkirim, success rate, total broadcast, pesan ditangani AI
- Grafik pengiriman pesan per hari (7 hari terakhir, bisa diperluas hingga 30 hari)
- Status real-time setiap sesi WhatsApp
- Status sistem: uptime, memory usage, versi Node.js, ukuran database
- Status Redis: koneksi, memory usage
- Status antrian: panjang queue broadcast & webhook
- Live activity log (50 aktivitas terakhir, polling 3 detik)
- Statistik per campaign (success, failed, processed)
- Alert jika mendekati batas kuota (80% & 100%) via Socket.IO
- Alert jika sesi terputus, Redis disconnect, Gemini API bermasalah, disk hampir penuh

---

## 29. 📋 Riwayat & Log

- Riwayat pesan terkirim & diterima (dengan filter status, sesi, pagination)
- Log error & retry per pesan
- Export riwayat pengiriman pesan sebagai PDF
- Log aktivitas akun (audit log): login, logout, tambah sesi, generate token, start broadcast, update settings, enable/disable 2FA, kelola user
- Snapshot email pengguna di audit log (tidak berubah meski user dihapus)
- Log aktivitas webhook (sukses/gagal, error message)
- Log eksekusi workflow per node
- Export audit log sebagai PDF
- Filter audit log: by action, by tanggal
- Retensi log: message_logs & workflow_logs 30 hari, audit_logs 90 hari (bisa dikonfigurasi)
- CleanupService berjalan tiap 24 jam: hapus log lama, vacuum database, bersihkan file orphan

---

## 30. 🔔 Notifikasi Sistem

**In-app (Socket.IO real-time):**
- Sesi WA terputus / logout permanen
- Semua sesi user terputus sekaligus
- Kuota pesan harian mendekati batas (80%) atau habis (100%)
- Kuota broadcast bulanan mendekati batas (80%) atau habis (100%)
- Broadcast campaign selesai (jumlah sukses & gagal)
- AI dinonaktifkan (Gemini API key tidak valid)
- Redis terputus
- Disk hampir penuh (>80%)

**Email:**
- Sesi WA terputus / banned
- Token API mendekati expired
- Langganan hampir habis
- Login dari IP baru (peringatan keamanan)
- Webhook gagal berulang kali

---

## 31. 🏢 Workspace / Organisasi

- Satu akun Google bisa membuat/bergabung ke workspace
- Undang anggota ke workspace via email
- Berbagi sesi WhatsApp antar anggota workspace
- Permission granular per anggota (siapa boleh akses sesi mana)
- Billing terpusat per workspace

---

## 32. 🛡️ Keamanan

- HTTPS wajib di semua endpoint
- JWT disimpan di HttpOnly + SameSite=Strict cookie (tidak dapat diakses JavaScript)
- Semua endpoint `/api/*` memerlukan autentikasi valid
- Cek `is_active` per request (akun nonaktif langsung ditolak meski token masih valid)
- Rate limiting:
  - Endpoint auth (`/auth/*`): 10 req/menit per IP
  - Endpoint umum (session cookie): 100 req/menit per IP
  - Endpoint API Key: 300 req/menit per key
- Proteksi brute force pada login
- Request body dibatasi 1MB (kecuali endpoint upload file)
- IP whitelist per API token (validasi format IPv4/IPv6 CIDR)
- API token disimpan sebagai SHA-256 hash (plaintext hanya tampil sekali)
- `temp_token` 2FA one-time use: dihapus dari Redis setelah diverifikasi
- Webhook HMAC-SHA256 signature untuk verifikasi keaslian payload
- Validasi MIME type dari magic bytes (bukan hanya ekstensi file)
- File upload disimpan di luar document root (tidak bisa diakses via URL publik)
- Semua query DB menggunakan parameterized query (cegah SQL Injection)
- Input `push_name` dari WhatsApp disanitasi (strip HTML/script) sebelum disimpan
- Stack trace tidak bocor ke client di production
- Global error handler Express menangkap semua unhandled error
- Security headers standar (X-Frame-Options, HSTS, X-Content-Type-Options, dll)
- Semua aksi penting tercatat di audit log dengan IP address dan user agent
- 404 untuk resource orang lain (bukan 403) untuk mencegah enumerasi user
- Rotasi JWT Secret tanpa downtime (graceful re-sign)
- Session cookie invalidasi instan saat user dinonaktifkan

---

## 33. ⚙️ Pengaturan Sistem

### Admin / Super Admin
- Kelola semua user (lihat, edit role, aktifkan/nonaktifkan, hapus)
- Kelola batas kuota per user (pesan harian & broadcast bulanan)
- Kelola definisi tier & batasannya
- Konfigurasi global: batas pesan harian & broadcast bulanan default
- Paksa disconnect sesi tertentu
- Lihat semua sesi aktif di seluruh platform
- Broadcast pengumuman ke semua user
- Maintenance mode

### Pengaturan per User
- Konfigurasi URL webhook & generate webhook secret
- Perbarui API key Gemini
- Konfigurasi confidence threshold AI
- Setup dan nonaktifkan 2FA
- Kelola API token (buat, lihat, hapus)
- Set auto-download media: foto, video, audio, dokumen (terpisah per jenis)
- Set background sync

---

## 34. 🤖 Real-time Events (Socket.IO)

| Event | Keterangan |
|---|---|
| `qr` | QR code baru tersedia untuk login sesi |
| `code` | Pairing code tersedia untuk login sesi |
| `connection_update` | Status sesi WA berubah |
| `new_message` | Pesan masuk baru di inbox |
| `message_ack` | Update status centang pesan (terkirim / dibaca) |
| `message_edit` | Pesan diedit oleh pengirim |
| `message_reaction` | Pesan direact dengan emoji |
| `message_revoke_everyone` | Pesan dihapus untuk semua |
| `message_revoke_me` | Pesan dihapus untuk saya saja |
| `message_ciphertext` | Pesan terenkripsi yang belum bisa didekripsi |
| `media_uploaded` | Media selesai diupload ke WhatsApp |
| `vote_update` | Ada perubahan vote pada poll |
| `group_join` | Anggota baru masuk grup |
| `group_leave` | Anggota keluar dari grup |
| `group_admin_changed` | Perubahan admin grup |
| `group_update` | Perubahan info grup (nama, deskripsi, dll) |
| `group_membership_request` | Ada request masuk ke grup (approval mode) |
| `contact_changed` | Kontak berubah nomor |
| `chat_archived` | Chat diarsipkan |
| `chat_removed` | Chat dihapus |
| `change_state` | Perubahan state koneksi WA |
| `change_battery` | Perubahan baterai device (non-multi-device) |
| `incoming_call` | Panggilan masuk |
| `broadcast_progress` | Update progress pengiriman broadcast |
| `broadcast_complete` | Broadcast selesai |
| `system_alert` | Alert sistem (kuota, sesi, Redis, disk, AI) |

> Semua event hanya dikirim ke room milik user yang relevan, bukan broadcast ke semua client.

---

## 36. 🔌 Integrasi Eksternal *(Opsional / Future)*

- Integrasi Google Contacts (import kontak)
- Integrasi Zapier / Make (formerly Integromat)
- Integrasi CRM (HubSpot, Salesforce, dll)
- Integrasi helpdesk (Freshdesk, Zendesk, dll)
- Integrasi payment gateway (Midtrans, Xendit, Stripe)
- Integrasi S3-compatible storage untuk media (AWS S3, Cloudflare R2, MinIO)
- SDK resmi (Node.js)

---

## 37. 🚀 Deployment & Infrastruktur

- Berjalan di single-instance Node.js (PM2, 1 proses — Baileys tidak thread-safe)
- Graceful shutdown: tangkap `SIGTERM`/`SIGINT`, selesaikan job aktif sebelum exit
- Database migration menggunakan skrip bernomor (`001_init.sql`, `002_add_xxx.sql`, dst)
- Endpoint `/health` untuk monitoring eksternal (load balancer, UptimeRobot, dll)
- Environment variable validation saat startup — server menolak start jika variabel wajib tidak ada
- Backup database otomatis (SQLite online backup)
- Backup auth state Baileys (`auth_info/`) otomatis
- Reverse proxy Nginx dengan HTTPS + security headers
- Support Docker & Docker Compose untuk kemudahan deployment

---

## 38. 📦 Tech Stack

### Backend (Focus)
| Layer | Stack |
|---|---|
| Runtime | Node.js v20 LTS |
| Framework | NestJS (TypeScript) |
| WhatsApp | whatsapp-web.js + Puppeteer |
| Database | MySQL + Prisma ORM |
| Cache & Queue | Redis + BullMQ |
| Auth | Google OAuth 2.0 (Passport.js + passport-google-oauth20) |
| JWT | @nestjs/jwt + passport-jwt |
| OTP/MFA | Speakeasy (TOTP) |
| AI | Google Gemini API (`@google/genai`) |
| Real-time | Socket.IO (@nestjs/websockets) |
| Validasi | class-validator + class-transformer |
| Rate Limiting | @nestjs/throttler |
| Upload File | Multer + file-type (magic bytes) |
| PDF Export | PDFKit |
| Cron/Scheduler | @nestjs/schedule |
| HTTP Client | Axios (untuk webhook & Google API) |
| Storage Media | Lokal (`/storage`) |
| Process Manager | PM2 (1 instance — wajib, tidak boleh cluster) |
| Reverse Proxy | Nginx + Let's Encrypt (SSL) |
| Monitoring | PM2 + UptimeRobot |
| Testing | Jest + Supertest |
| Containerization | Docker + Docker Compose |
