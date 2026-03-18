## Kebutuhan Server

VPS minimal: **2 vCPU, 2GB RAM, 20GB SSD** (Ubuntu 22.04 LTS).

Puppeteer butuh RAM, jadi 2GB adalah minimum. Rekomendasi 4GB jika mengelola lebih dari 3 sesi WhatsApp.

---

## 1. Setup Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependencies sistem
sudo apt install -y curl git build-essential

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi
node -v  # harus v20.x.x
npm -v
```

---

## 2. Install Chromium untuk Puppeteer

```bash
sudo apt install -y \
  chromium-browser \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

---

## 3. Install MySQL

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Amankan instalasi
sudo mysql_secure_installation

# Buat database dan user
sudo mysql -u root -p
```

```sql
CREATE DATABASE whatsapp_gateway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wgw_user'@'localhost' IDENTIFIED BY 'PASSWORD_KUAT_DI_SINI';
GRANT ALL PRIVILEGES ON whatsapp_gateway.* TO 'wgw_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. Install Redis

```bash
sudo apt install -y redis-server

# Edit config
sudo nano /etc/redis/redis.conf
# Ubah: supervised no  →  supervised systemd
# Tambah password (opsional tapi disarankan):
# requirepass PASSWORD_REDIS_DI_SINI

sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Verifikasi
redis-cli ping  # harus PONG
```

---

## 5. Install PM2

```bash
sudo npm install -g pm2

# Setup PM2 agar auto-start saat reboot
pm2 startup
# Jalankan perintah yang muncul dari output di atas, contoh:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

---

## 6. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 7. Clone dan Setup Aplikasi

```bash
# Buat user khusus (lebih aman daripada root)
sudo useradd -m -s /bin/bash wgw
sudo su - wgw

# Clone repo
git clone https://github.com/USERNAME/REPO_NAME.git app
cd app

# Install dependencies
npm install

# Buat folder storage
npm run storage:init

# Buat folder logs
mkdir -p logs

# Setup environment
cp .env.example .env
nano .env
```

Isi `.env` dengan nilai production:

```bash
NODE_ENV=production
PORT=3000
TZ=Asia/Jakarta

DATABASE_URL="mysql://wgw_user:PASSWORD_KUAT@localhost:3306/whatsapp_gateway"

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=PASSWORD_REDIS_JIKA_ADA

JWT_SECRET=ISI_DENGAN_HASIL_openssl_rand_hex_32
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=ISI_DARI_GOOGLE_CONSOLE
GOOGLE_CLIENT_SECRET=ISI_DARI_GOOGLE_CONSOLE
GOOGLE_CALLBACK_URL=https://DOMAIN_ANDA/api/v1/auth/google/callback

ADMIN_EMAIL=email_admin@domain.com

COOKIE_SECRET=ISI_DENGAN_HASIL_openssl_rand_hex_32
COOKIE_SECURE=true
COOKIE_DOMAIN=DOMAIN_ANDA

CLIENT_URL=https://DOMAIN_FRONTEND_ANDA

GEMINI_API_KEY=ISI_API_KEY_GEMINI
GEMINI_MODEL=gemini-3-flash-preview

WA_AUTH_PATH=./storage/sessions
WA_HEADLESS=true
WA_MAX_RECONNECT_RETRIES=10

STORAGE_PATH=./storage
MAX_FILE_SIZE_MB=50
```

---

## 8. Build dan Migrate Database

```bash
# Generate Prisma client
npm run prisma:generate

# Jalankan migrasi database
npm run prisma:migrate:prod

# Seed data awal (tier dan admin)
npm run prisma:seed

# Build aplikasi
npm run build
```

---

## 9. Jalankan dengan PM2

```bash
# Start aplikasi
npm run pm2:start

# Verifikasi berjalan
pm2 status
pm2 logs wgw-api --lines 50

# Simpan konfigurasi PM2
pm2 save
```

---

## 10. Setup Nginx sebagai Reverse Proxy

```bash
# Keluar dari user wgw kembali ke sudo user
exit

sudo nano /etc/nginx/sites-available/wgw-api
```

Isi konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name wgw.local;

    client_max_body_size 55M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
    }
}
```

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/wgw-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 11. Setup SSL dengan Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d DOMAIN_ANDA

# Verifikasi auto-renewal
sudo certbot renew --dry-run
```

Setelah certbot, Nginx otomatis diupdate untuk redirect HTTP ke HTTPS.

---

## 12. Verifikasi Deployment

```bash
# Cek health endpoint
curl https://DOMAIN_ANDA/api/v1/health

# Harusnya dapat response:
# {"status":"ok","redis":"ok","timestamp":"..."}

# Cek logs PM2
pm2 logs wgw-api --lines 100

# Cek status semua service
sudo systemctl status nginx
sudo systemctl status mysql
sudo systemctl status redis-server
pm2 status
```

---

## 13. Update Aplikasi (untuk deployment berikutnya)

```bash
sudo su - wgw
cd app

# Pull perubahan terbaru
git pull origin main

# Install dependencies baru jika ada
npm install

# Jalankan migrasi jika ada perubahan schema
npm run prisma:migrate:prod

# Build ulang
npm run build

# Restart tanpa downtime
npm run pm2:restart
```

---

## Troubleshooting Umum

**Puppeteer gagal launch:**
```bash
# Pastikan chromium terinstall
which chromium-browser

# Tambahkan ke .env jika perlu
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Permission error di storage:**
```bash
sudo chown -R wgw:wgw /home/wgw/app/storage
chmod -R 755 /home/wgw/app/storage
```

**Port 3000 sudah terpakai:**
```bash
sudo lsof -i :3000
# Kill proses yang menggunakan port tersebut atau ganti PORT di .env
```

**Redis connection refused:**
```bash
sudo systemctl status redis-server
sudo systemctl restart redis-server
```

**MySQL connection refused:**
```bash
sudo systemctl status mysql
sudo systemctl restart mysql
```
