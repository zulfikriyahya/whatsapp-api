#!/bin/bash

# =============================================================
#  WhatsApp API - Deploy Script
#  Ubuntu 22.04 LTS
# =============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
section() { echo -e "\n${BOLD}==============================${NC}\n${BOLD} $1${NC}\n${BOLD}==============================${NC}"; }

ask() {
  local prompt="$1" default="$2" varname="$3" input
  read -rp "$(echo -e "${YELLOW}?${NC} ${prompt} [${default}]: ")" input
  eval "$varname='${input:-$default}'"
}

ask_required() {
  local prompt="$1" varname="$2" input
  while true; do
    read -rp "$(echo -e "${YELLOW}?${NC} ${prompt}: ")" input
    [ -n "$input" ] && break
    warn "Tidak boleh kosong."
  done
  eval "$varname='$input'"
}

ask_yn() {
  local prompt="$1" default="$2" varname="$3" input
  read -rp "$(echo -e "${YELLOW}?${NC} ${prompt} (y/n) [${default}]: ")" input
  input="${input:-$default}"
  eval "$varname='${input,,}'"
}

ask_secret() {
  local prompt="$1" default="$2" varname="$3" input
  if [ -n "$default" ]; then
    read -rsp "$(echo -e "${YELLOW}?${NC} ${prompt} [tekan Enter pakai default]: ")" input
    echo
    eval "$varname='${input:-$default}'"
  else
    read -rsp "$(echo -e "${YELLOW}?${NC} ${prompt} (kosongkan jika tidak ada): ")" input
    echo
    eval "$varname='$input'"
  fi
}

# =============================================================
section "Konfigurasi Deployment"
# =============================================================

echo -e "\nJawab pertanyaan berikut. Tekan ${BOLD}Enter${NC} untuk pakai nilai default.\n"

# --- Instalasi ---
ask_yn  "Node.js sudah terinstall?"                  "n" SKIP_NODE
ask_yn  "MySQL sudah terinstall dan dikonfigurasi?"  "n" SKIP_MYSQL
ask_yn  "Redis sudah terinstall?"                    "n" SKIP_REDIS
ask_yn  "PM2 sudah terinstall?"                      "n" SKIP_PM2
ask_yn  "Nginx sudah terinstall?"                    "n" SKIP_NGINX

echo ""
echo -e "${BOLD}--- App ---${NC}"
ask     "Port aplikasi"                              "3000"                       APP_PORT
ask     "Timezone"                                   "Asia/Jakarta"               APP_TZ
ask     "URL frontend (CLIENT_URL)"                  "https://app.domain.com"     CLIENT_URL
ask     "Email admin"                                "admin@domain.com"           ADMIN_EMAIL
ask     "Storage path"                               "./storage"                  STORAGE_PATH
ask     "Backup path"                                "./storage/backups"          BACKUP_PATH
ask     "Max file size (MB)"                         "50"                         MAX_FILE_SIZE_MB
ask     "Default daily message limit"                "1000"                       DEFAULT_DAILY_MSG_LIMIT
ask     "Default monthly broadcast limit"            "10"                         DEFAULT_MONTHLY_BC_LIMIT
ask     "Log retention days"                         "30"                         LOG_RETENTION_DAYS
ask     "Audit log retention days"                   "90"                         AUDIT_LOG_RETENTION_DAYS

echo ""
echo -e "${BOLD}--- Database (MySQL) ---${NC}"
if [ "$SKIP_MYSQL" = "y" ]; then
  ask        "MySQL host"           "localhost"          DB_HOST
  ask        "MySQL port"           "3306"               DB_PORT
  ask        "MySQL database name"  "whatsapp_gateway"   DB_NAME
  ask        "MySQL username"       "whatsapp_user"      DB_USER
  ask_secret "MySQL password"       ""                   DB_PASS
else
  DB_HOST="localhost"; DB_PORT="3306"; DB_NAME="whatsapp_gateway"; DB_USER="whatsapp_user"
  ask_secret "Buat password untuk MySQL user baru"         "" DB_PASS
  ask_secret "Password root MySQL (untuk setup awal)"      "" DB_ROOT_PASS
fi

echo ""
echo -e "${BOLD}--- Redis ---${NC}"
ask        "Redis host"        "localhost" REDIS_HOST
ask        "Redis port"        "6379"      REDIS_PORT
ask_secret "Redis password"    ""          REDIS_PASS
ask        "Redis DB index"    "0"         REDIS_DB
ask        "Redis key prefix"  "wgw:"      REDIS_KEY_PREFIX

echo ""
echo -e "${BOLD}--- JWT ---${NC}"
ask "JWT expires in" "7d" JWT_EXPIRES
# JWT_SECRET & COOKIE_SECRET di-generate otomatis

echo ""
echo -e "${BOLD}--- Google OAuth ---${NC}"
ask        "Google Client ID"     "" GOOGLE_CLIENT_ID
ask_secret "Google Client Secret" "" GOOGLE_CLIENT_SECRET

echo ""
echo -e "${BOLD}--- Gemini AI ---${NC}"
ask "Gemini API Key"              ""                   GEMINI_KEY
ask "Gemini Model"                "gemini-2.0-flash"   GEMINI_MODEL
ask "Gemini timeout (ms)"         "10000"              GEMINI_TIMEOUT_MS
ask "Gemini confidence threshold" "0.6"                GEMINI_CONFIDENCE

echo ""
echo -e "${BOLD}--- WhatsApp ---${NC}"
ask "WA auth path"             "./storage/sessions" WA_AUTH_PATH
ask "WA max reconnect retries" "10"                 WA_MAX_RECONNECT
ask "Warming interval min (ms)" "300000"            WARMING_MIN_MS
ask "Warming interval max (ms)" "600000"            WARMING_MAX_MS

echo ""
echo -e "${BOLD}--- Throttle / Rate Limit ---${NC}"
ask "Throttle TTL (detik)"       "60"  THROTTLE_TTL
ask "Throttle limit"             "100" THROTTLE_LIMIT
ask "Throttle auth limit"        "10"  THROTTLE_AUTH_LIMIT
ask "Throttle API key limit"     "300" THROTTLE_API_KEY_LIMIT

echo ""
echo -e "${BOLD}--- BullMQ Queue ---${NC}"
ask "Broadcast concurrency"         "1"    BC_CONCURRENCY
ask "Broadcast rate max"            "10"   BC_RATE_MAX
ask "Broadcast rate duration (ms)"  "1000" BC_RATE_MS
ask "Webhook concurrency"           "5"    WH_CONCURRENCY
ask "Webhook max retries"           "5"    WH_MAX_RETRIES

echo ""
echo -e "${BOLD}--- Cleanup Cron ---${NC}"
ask "Cleanup cron expression" "0 2 * * *" CLEANUP_CRON

echo ""
echo -e "${BOLD}--- SMTP Email (kosongkan host jika tidak dipakai) ---${NC}"
ask        "SMTP host"   "smtp.gmail.com"          SMTP_HOST
ask        "SMTP port"   "587"                     SMTP_PORT
ask        "SMTP user"   ""                        SMTP_USER
ask_secret "SMTP password (Gmail: App Password)"  "" SMTP_PASS
ask        "SMTP from"   "${SMTP_USER}"            SMTP_FROM

echo ""
echo -e "${BOLD}--- IP Whitelist (opsional) ---${NC}"
ask "Global IP whitelist (pisah koma, kosongkan jika tidak ada)" "" IP_WHITELIST

echo ""
echo -e "${BOLD}--- Domain & SSL ---${NC}"
ask_yn "Punya domain dan ingin setup SSL (Let's Encrypt)?" "n" USE_DOMAIN
if [ "$USE_DOMAIN" = "y" ]; then
  ask "Nama domain (contoh: api.domain.com)" "api.domain.com" DOMAIN
  ask "Email untuk Let's Encrypt"            "$ADMIN_EMAIL"   LE_EMAIL
  GOOGLE_CALLBACK="https://${DOMAIN}/api/v1/auth/google/callback"
  COOKIE_SECURE="true"
  COOKIE_DOMAIN="$DOMAIN"
else
  DOMAIN=""
  GOOGLE_CALLBACK="http://localhost:${APP_PORT}/api/v1/auth/google/callback"
  COOKIE_SECURE="false"
  COOKIE_DOMAIN="localhost"
fi

echo ""
echo -e "${BOLD}--- Repo & Server ---${NC}"
ask "URL repo git"            "https://github.com/zulfikriyahya/whatsapp-api.git" REPO_URL
ask "Branch"                  "main"                 REPO_BRANCH
ask "Direktori instalasi"     "/home/whatsapp/app"   APP_DIR
ask "System user untuk app"   "whatsapp"             APP_USER

# Generate secrets
JWT_SECRET=$(openssl rand -hex 32)
COOKIE_SECRET=$(openssl rand -hex 32)

# =============================================================
section "Ringkasan Konfigurasi"
# =============================================================

echo -e "
  Node.js skip   : ${SKIP_NODE}    | MySQL skip  : ${SKIP_MYSQL}
  Redis skip     : ${SKIP_REDIS}   | PM2 skip    : ${SKIP_PM2}
  Nginx skip     : ${SKIP_NGINX}   | Domain/SSL  : ${USE_DOMAIN} ${DOMAIN}
  App port       : ${APP_PORT}     | Timezone    : ${APP_TZ}
  App dir        : ${APP_DIR}      | App user    : ${APP_USER}
  DB             : ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}
  Redis          : ${REDIS_HOST}:${REDIS_PORT} db=${REDIS_DB}
  Client URL     : ${CLIENT_URL}   | Admin email : ${ADMIN_EMAIL}
  Gemini model   : ${GEMINI_MODEL}
  SMTP host      : ${SMTP_HOST:-'(tidak dipakai)'}
"

ask_yn "Lanjutkan deployment?" "y" CONFIRM
[ "$CONFIRM" != "y" ] && { warn "Deployment dibatalkan."; exit 0; }

# =============================================================
section "1. Update Sistem"
# =============================================================

sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
success "Sistem diupdate"

# =============================================================
section "2. Node.js"
# =============================================================

if [ "$SKIP_NODE" = "n" ]; then
  info "Mendeteksi versi Node.js LTS terbaru..."
  LATEST_NODE_MAJOR=$(curl -fsSL https://nodejs.org/dist/index.json | grep -o '"version":"v[0-9]*' | grep -o '[0-9]*' | sort -rn | head -1)
  info "Menginstall Node.js ${LATEST_NODE_MAJOR}.x (latest LTS)..."
  curl -fsSL "https://deb.nodesource.com/setup_${LATEST_NODE_MAJOR}.x" | sudo -E bash -
  sudo apt install -y nodejs
  success "Node.js $(node -v) terinstall"
else
  info "Melewati instalasi Node.js — $(node -v)"
fi

if ! command -v pnpm &>/dev/null; then
  info "Menginstall pnpm..."
  sudo npm install -g pnpm
  success "pnpm terinstall"
fi

# =============================================================
section "3. Chromium / Puppeteer Dependencies"
# =============================================================

info "Menginstall dependensi Chromium..."
sudo apt install -y \
  ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 \
  libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
  libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 \
  libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
  libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
  libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  lsb-release wget xdg-utils
success "Dependensi Chromium terinstall"

# =============================================================
section "4. MySQL"
# =============================================================

if [ "$SKIP_MYSQL" = "n" ]; then
  info "Menginstall MySQL..."
  sudo apt install -y mysql-server
  sudo systemctl start mysql
  sudo systemctl enable mysql
  info "Membuat database dan user..."
  sudo mysql -u root -p"$DB_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'${DB_HOST}' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'${DB_HOST}';
FLUSH PRIVILEGES;
EOF
  success "MySQL siap: '${DB_NAME}' / '${DB_USER}'"
else
  info "Melewati instalasi MySQL"
fi

# =============================================================
section "5. Redis"
# =============================================================

if [ "$SKIP_REDIS" = "n" ]; then
  info "Menginstall Redis..."
  sudo apt install -y redis-server
  sudo sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
  if [ -n "$REDIS_PASS" ]; then
    sudo sed -i "s/^# requirepass .*/requirepass ${REDIS_PASS}/" /etc/redis/redis.conf
    grep -q "^requirepass" /etc/redis/redis.conf || echo "requirepass ${REDIS_PASS}" | sudo tee -a /etc/redis/redis.conf
  fi
  sudo systemctl restart redis-server
  sudo systemctl enable redis-server
  redis-cli ${REDIS_PASS:+-a "$REDIS_PASS"} ping | grep -q PONG && success "Redis berjalan" || error "Redis gagal start"
else
  info "Melewati instalasi Redis"
fi

# =============================================================
section "6. PM2"
# =============================================================

if [ "$SKIP_PM2" = "n" ]; then
  sudo npm install -g pm2
  success "PM2 terinstall"
else
  info "Melewati instalasi PM2"
fi

# =============================================================
section "7. Nginx"
# =============================================================

if [ "$SKIP_NGINX" = "n" ]; then
  sudo apt install -y nginx
  sudo systemctl start nginx
  sudo systemctl enable nginx
  success "Nginx terinstall"
else
  info "Melewati instalasi Nginx"
fi

# =============================================================
section "8. Clone & Setup Aplikasi"
# =============================================================

if ! id "$APP_USER" &>/dev/null; then
  sudo useradd -m -s /bin/bash "$APP_USER"
  success "User '${APP_USER}' dibuat"
fi

sudo mkdir -p "$(dirname "$APP_DIR")"

if [ -d "$APP_DIR/.git" ]; then
  info "Repo sudah ada, melakukan git pull..."
  sudo -u "$APP_USER" git -C "$APP_DIR" pull origin "$REPO_BRANCH"
else
  info "Clone repo..."
  sudo -u "$APP_USER" git clone -b "$REPO_BRANCH" "$REPO_URL" "$APP_DIR"
fi

info "Install dependencies..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm install --no-frozen-lockfile"

info "Membuat direktori storage & logs..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm run storage:init 2>/dev/null || \
  mkdir -p storage/sessions storage/uploads storage/exports \
           storage/backups/database storage/backups/sessions \
           storage/broadcasts/tmp logs"

# =============================================================
section "9. Konfigurasi .env"
# =============================================================

ENV_FILE="$APP_DIR/.env"
info "Menulis .env..."

sudo -u "$APP_USER" tee "$ENV_FILE" > /dev/null <<EOF
# ─────────────────────────────────────────────────────────────
# APP
# ─────────────────────────────────────────────────────────────
NODE_ENV=production
PORT=${APP_PORT}
TZ=${APP_TZ}
CLIENT_URL=${CLIENT_URL}
COOKIE_SECRET=${COOKIE_SECRET}
COOKIE_SECURE=${COOKIE_SECURE}
COOKIE_DOMAIN=${COOKIE_DOMAIN}
ADMIN_EMAIL=${ADMIN_EMAIL}
STORAGE_PATH=${STORAGE_PATH}
MAX_FILE_SIZE_MB=${MAX_FILE_SIZE_MB}
DEFAULT_DAILY_MESSAGE_LIMIT=${DEFAULT_DAILY_MSG_LIMIT}
DEFAULT_MONTHLY_BROADCAST_LIMIT=${DEFAULT_MONTHLY_BC_LIMIT}
LOG_RETENTION_DAYS=${LOG_RETENTION_DAYS}
AUDIT_LOG_RETENTION_DAYS=${AUDIT_LOG_RETENTION_DAYS}
BACKUP_PATH=${BACKUP_PATH}

# ─────────────────────────────────────────────────────────────
# DATABASE (MySQL)
# ─────────────────────────────────────────────────────────────
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# ─────────────────────────────────────────────────────────────
# REDIS
# ─────────────────────────────────────────────────────────────
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASS}
REDIS_DB=${REDIS_DB}
REDIS_KEY_PREFIX=${REDIS_KEY_PREFIX}

# ─────────────────────────────────────────────────────────────
# JWT
# ─────────────────────────────────────────────────────────────
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES}

# ─────────────────────────────────────────────────────────────
# GOOGLE OAUTH
# ─────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK}

# ─────────────────────────────────────────────────────────────
# GEMINI AI
# ─────────────────────────────────────────────────────────────
GEMINI_API_KEY=${GEMINI_KEY}
GEMINI_MODEL=${GEMINI_MODEL}
GEMINI_TIMEOUT_MS=${GEMINI_TIMEOUT_MS}
GEMINI_CONFIDENCE_THRESHOLD=${GEMINI_CONFIDENCE}

# ─────────────────────────────────────────────────────────────
# WHATSAPP (whatsapp-web.js)
# ─────────────────────────────────────────────────────────────
WA_AUTH_PATH=${WA_AUTH_PATH}
WA_HEADLESS=true
WA_MAX_RECONNECT_RETRIES=${WA_MAX_RECONNECT}
WARMING_INTERVAL_MIN_MS=${WARMING_MIN_MS}
WARMING_INTERVAL_MAX_MS=${WARMING_MAX_MS}

# ─────────────────────────────────────────────────────────────
# THROTTLE / RATE LIMIT
# ─────────────────────────────────────────────────────────────
THROTTLE_TTL=${THROTTLE_TTL}
THROTTLE_LIMIT=${THROTTLE_LIMIT}
THROTTLE_AUTH_LIMIT=${THROTTLE_AUTH_LIMIT}
THROTTLE_API_KEY_LIMIT=${THROTTLE_API_KEY_LIMIT}

# ─────────────────────────────────────────────────────────────
# BULLMQ — Broadcast & Webhook Queue
# ─────────────────────────────────────────────────────────────
BROADCAST_CONCURRENCY=${BC_CONCURRENCY}
BROADCAST_RATE_MAX=${BC_RATE_MAX}
BROADCAST_RATE_DURATION_MS=${BC_RATE_MS}
WEBHOOK_CONCURRENCY=${WH_CONCURRENCY}
WEBHOOK_MAX_RETRIES=${WH_MAX_RETRIES}

# ─────────────────────────────────────────────────────────────
# CLEANUP CRON
# ─────────────────────────────────────────────────────────────
CLEANUP_CRON=${CLEANUP_CRON}

# ─────────────────────────────────────────────────────────────
# SMTP EMAIL
# ─────────────────────────────────────────────────────────────
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_FROM}

# ─────────────────────────────────────────────────────────────
# GLOBAL IP WHITELIST (opsional)
# ─────────────────────────────────────────────────────────────
$([ -n "$IP_WHITELIST" ] && echo "GLOBAL_IP_WHITELIST=${IP_WHITELIST}" || echo "# GLOBAL_IP_WHITELIST=127.0.0.1,192.168.1.0/24")
EOF

sudo chmod 600 "$ENV_FILE"
success ".env ditulis di ${ENV_FILE}"

# =============================================================
section "10. Build & Migrate"
# =============================================================

info "Generate Prisma client..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm run prisma:generate"

info "Migrasi database..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm run prisma:migrate:prod"

info "Seed data awal..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm run prisma:seed"

info "Build aplikasi..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm run build"
success "Build selesai"

# =============================================================
section "11. Start PM2"
# =============================================================

sudo -u "$APP_USER" bash -c "cd $APP_DIR && pnpm run pm2:start"

PM2_STARTUP=$(sudo -u "$APP_USER" pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER" | grep "sudo env")
[ -n "$PM2_STARTUP" ] && eval "$PM2_STARTUP"

sudo -u "$APP_USER" pm2 save
success "PM2 berjalan"

# =============================================================
section "12. Konfigurasi Nginx"
# =============================================================

SERVER_NAME="${DOMAIN:-_}"
NGINX_CONF="/etc/nginx/sites-available/whatsapp-api"

sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    client_max_body_size ${MAX_FILE_SIZE_MB}M;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
    }
}
EOF

sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/whatsapp-api
sudo nginx -t && sudo systemctl reload nginx
success "Nginx dikonfigurasi"

# =============================================================
section "13. SSL (Let's Encrypt)"
# =============================================================

if [ "$USE_DOMAIN" = "y" ]; then
  sudo apt install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d "$DOMAIN" --email "$LE_EMAIL" --agree-tos --non-interactive
  sudo certbot renew --dry-run
  success "SSL aktif untuk ${DOMAIN}"
else
  info "Melewati setup SSL"
fi

# =============================================================
section "14. Verifikasi"
# =============================================================

sleep 3

info "Status services:"
sudo systemctl is-active --quiet nginx        && success "Nginx  : running" || warn "Nginx  : not running"
sudo systemctl is-active --quiet mysql        && success "MySQL  : running" || warn "MySQL  : not running"
sudo systemctl is-active --quiet redis-server && success "Redis  : running" || warn "Redis  : not running"
sudo -u "$APP_USER" pm2 list

BASE_URL="http://localhost:${APP_PORT}"
[ "$USE_DOMAIN" = "y" ] && BASE_URL="https://${DOMAIN}"

info "Cek health endpoint..."
sleep 2
curl -sf "${BASE_URL}/api/v1/health" && echo "" || warn "Health check gagal — jalankan: pm2 logs whatsapp-api"

# =============================================================
section "Deployment Selesai!"
# =============================================================

echo -e "
${GREEN}${BOLD}Aplikasi berhasil di-deploy!${NC}

  URL           : ${BASE_URL}
  App dir       : ${APP_DIR}
  .env          : ${ENV_FILE}
  PM2 logs      : pm2 logs whatsapp-api

${YELLOW}JWT_SECRET    : ${JWT_SECRET}${NC}
${YELLOW}COOKIE_SECRET : ${COOKIE_SECRET}${NC}
${RED}Simpan kedua secret di atas di tempat aman!${NC}
"
