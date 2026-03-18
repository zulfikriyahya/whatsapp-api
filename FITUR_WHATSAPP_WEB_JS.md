# Fitur Lengkap whatsapp-web.js (v1.34.6)

---

## Pesan (Messaging)
- Kirim pesan teks (biasa & formatting: bold, italic, strikethrough, monospace)
- Kirim pesan dengan mention (@seseorang)
- Kirim pesan reply/quote
- Edit pesan
- Hapus pesan (delete for me / delete for everyone)
- Forward pesan
- Pin pesan
- Dapatkan semua pesan yang di-pin (`getPinnedMessages`)
- React pesan dengan emoji
- Tandai pesan sebagai dibaca (`sendSeen`)
- Tandai chat sebagai belum dibaca (`markChatUnread`)
- Cari pesan berdasarkan query & filter (`searchMessages`)
- Dapatkan pesan by ID (`getMessageById`)

---

## Poll
- Kirim pesan berupa Poll (voting)
- Dapatkan hasil vote (`getPollVotes`)
- Event `vote_update` untuk memantau perubahan vote secara real-time

---

## Media & File
- Kirim gambar, video, audio, dokumen, sticker
- Kirim media dengan caption
- Kirim voice note
- Kirim GIF
- Download media dari pesan yang diterima
- Kirim lokasi (static & live location)
- Kirim kontak (vCard)
- Setting auto-download foto, video, audio, dan dokumen secara terpisah

---

## Grup
- Buat grup baru
- Tambah / hapus anggota grup
- Promosi / demosi admin grup
- Ubah nama & deskripsi grup
- Ubah foto grup
- Dapatkan info grup (anggota, admin, dll)
- Keluar dari grup
- Hapus grup
- Generate & revoke invite link grup
- Join grup via invite link
- Dapatkan info invite (`getInviteInfo`)
- Approve / reject join request (grup dengan approval)
- Dapatkan daftar membership request (`getGroupMembershipRequests`)
- Dapatkan grup yang sama dengan kontak tertentu (`getCommonGroups`)

---

## Channel (Fitur Baru)
- Buat channel baru (`createChannel`)
- Hapus channel (`deleteChannel`)
- Subscribe / unsubscribe ke channel
- Cari channel (`searchChannels`)
- Dapatkan daftar channel (`getChannels`)
- Get channel by invite code
- Kelola admin channel (invite, revoke, accept, demote)
- Transfer kepemilikan channel (`transferChannelOwnership`)
- Kirim pesan ke channel
- Revoke status message di channel

---

## Status & Presence
- Set status/bio akun (`setStatus`)
- Kirim & lihat WhatsApp Status/Story
- Revoke status message (`revokeStatusMessage`)
- Detect typing indicator (sedang mengetik)
- Detect online/offline status kontak
- Set presence available / unavailable

---

## Kontak
- Dapatkan semua daftar kontak (`getContacts`)
- Cari kontak by ID (`getContactById`)
- Cek apakah nomor terdaftar di WhatsApp (`isRegisteredUser`)
- Blokir / unblokir kontak
- Dapatkan semua kontak yang diblokir (`getBlockedContacts`)
- Dapatkan foto profil kontak (`getProfilePicUrl`)
- Dapatkan jumlah device kontak (`getContactDeviceCount`)
- Dapatkan formatted number (`getFormattedNumber`)
- Dapatkan country code (`getCountryCode`)
- Dapatkan nomor & LID kontak (`getContactLidAndPhone`)
- Simpan / edit kontak di address book (`saveOrEditAddressbookContact`)
- Hapus kontak dari address book (`deleteAddressbookContact`)

---

## Chat
- Dapatkan semua daftar chat (`getChats`)
- Dapatkan chat by ID (`getChatById`)
- Arsipkan / unarsipkan chat
- Mute / unmute chat
- Pin / unpin chat
- Hapus chat
- Sync riwayat chat (`syncHistory`)

---

## Profil Akun
- Set foto profil (`setProfilePicture`)
- Hapus foto profil (`deleteProfilePicture`)
- Set display name (`setDisplayName`)
- Set status/bio (`setStatus`)

---

## Login & Autentikasi
- Login via scan QR Code
- Login via **Pairing Code** (tanpa scan QR, cocok untuk server headless) (`requestPairingCode`)
- Simpan sesi agar tidak perlu scan QR ulang
- Auth strategy: `LocalAuth`, `RemoteAuth`, `NoAuth`
- `RemoteAuth` bisa disimpan ke database (MongoDB, dll)
- Logout (`logout`)
- Reset state (`resetState`)
- Destroy client (`destroy`)

---

## Label (Khusus WhatsApp Business)
- Buat, edit, hapus label
- Dapatkan semua label (`getLabels`)
- Dapatkan label by ID (`getLabelById`)
- Assign / remove label ke chat (`addOrRemoveLabels`)
- Dapatkan label dari suatu chat (`getChatLabels`)
- Dapatkan daftar chat berdasarkan label (`getChatsByLabelId`)

---

## Customer Note (Khusus WhatsApp Business)
- Tambah / edit catatan untuk pelanggan (`addOrEditCustomerNote`)
- Dapatkan catatan pelanggan (`getCustomerNote`)

---

## Scheduled Event
- Kirim pesan berupa Scheduled Event
- Kirim respons ke scheduled event (`sendResponseToScheduledEvent`)

---

## Broadcast
- Dapatkan daftar broadcast (`getBroadcasts`)
- Dapatkan broadcast by ID (`getBroadcastById`)

---

##  Panggilan (Call)
- Detect event panggilan masuk (`incoming_call`)
- Buat call link (`createCallLink`)

---

## Konfigurasi & Utilitas
- Dapatkan versi WhatsApp Web yang berjalan (`getWWebVersion`)
- Dapatkan state koneksi (`getState`)
- Set background sync (`setBackgroundSync`)
- Dapatkan info client (`info`)
- Akses langsung ke Puppeteer browser & page (`pupBrowser`, `pupPage`)

---

## Events Lengkap
| Event | Keterangan |
|---|---|
| `qr` | QR code untuk login |
| `code` | Pairing code untuk login |
| `authenticated` | Sesi berhasil diotentikasi |
| `auth_failure` | Autentikasi gagal |
| `ready` | Client siap digunakan |
| `disconnected` | Client terputus |
| `change_state` | Perubahan state koneksi |
| `change_battery` | Perubahan baterai device |
| `message` | Pesan masuk |
| `message_create` | Setiap pesan dibuat (termasuk pesan sendiri) |
| `message_edit` | Pesan diedit |
| `message_ack` | Update status centang pesan (terkirim/dibaca) |
| `message_reaction` | Pesan direact dengan emoji |
| `message_revoke_everyone` | Pesan dihapus untuk semua |
| `message_revoke_me` | Pesan dihapus untuk saya saja |
| `message_ciphertext` | Pesan terenkripsi yang belum bisa didekripsi |
| `media_uploaded` | Media selesai diupload |
| `vote_update` | Perubahan vote pada poll |
| `contact_changed` | Kontak berubah nomor |
| `chat_archived` | Chat diarsipkan |
| `chat_removed` | Chat dihapus |
| `group_join` | Anggota masuk grup |
| `group_leave` | Anggota keluar grup |
| `group_admin_changed` | Perubahan admin grup |
| `group_update` | Perubahan info grup |
| `group_membership_request` | Ada request masuk ke grup |
| `incoming_call` | Panggilan masuk |
