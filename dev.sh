#!/bin/bash

# =============================================================
#  WhatsApp Gateway SaaS — Dev Runner
#  Jalankan backend + frontend bersamaan
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

# ── Konfigurasi direktori ─────────────────────────────────────
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

# Auto-detect jika dijalankan dari root project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -d "$SCRIPT_DIR/backend" ]  && BACKEND_DIR="$SCRIPT_DIR/backend"
[ -d "$SCRIPT_DIR/frontend" ] && FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Override via argumen jika perlu:
# ./dev.sh --backend /path/backend --frontend /path/frontend
while [[ $# -gt 0 ]]; do
  case $1 in
    --backend)  BACKEND_DIR="$2";  shift 2 ;;
    --frontend) FRONTEND_DIR="$2"; shift 2 ;;
    *) shift ;;
  esac
done

# ── Validasi direktori ────────────────────────────────────────
[ -d "$BACKEND_DIR" ]  || error "Direktori backend tidak ditemukan: $BACKEND_DIR"
[ -d "$FRONTEND_DIR" ] || error "Direktori frontend tidak ditemukan: $FRONTEND_DIR"

# ── Trap: matikan semua child process saat Ctrl+C ─────────────
cleanup() {
  echo ""
  warn "Menghentikan semua proses..."
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM

# ── Jalankan Backend ──────────────────────────────────────────
run_backend() {
  echo -e "\n${BOLD}${CYAN}════════════════════════════════${NC}"
  echo -e "${BOLD}${CYAN}  BACKEND${NC}"
  echo -e "${BOLD}${CYAN}════════════════════════════════${NC}\n"

  cd "$BACKEND_DIR"

  info "Mengupdate dependencies backend..."
  pnpm update

  info "Menjalankan backend..."
  pnpm run start 2>&1 | sed "s/^/${CYAN}[BE]${NC} /"
}

# ── Jalankan Frontend ─────────────────────────────────────────
run_frontend() {
  echo -e "\n${BOLD}${GREEN}════════════════════════════════${NC}"
  echo -e "${BOLD}${GREEN}  FRONTEND${NC}"
  echo -e "${BOLD}${GREEN}════════════════════════════════${NC}\n"

  cd "$FRONTEND_DIR"

  info "Mengupdate dependencies frontend..."
  pnpm update

  info "Menjalankan frontend..."
  pnpm run dev 2>&1 | sed "s/^/${GREEN}[FE]${NC} /"
}

# ── Main ──────────────────────────────────────────────────────
echo -e "\n${BOLD}WhatsApp Gateway SaaS — Dev Runner${NC}"
echo -e "Backend  → ${CYAN}${BACKEND_DIR}${NC}"
echo -e "Frontend → ${GREEN}${FRONTEND_DIR}${NC}\n"

# Jalankan keduanya secara paralel sebagai background process
run_backend  &
BE_PID=$!

run_frontend &
FE_PID=$!

# Tunggu keduanya selesai (atau sampai Ctrl+C)
wait $BE_PID $FE_PID
