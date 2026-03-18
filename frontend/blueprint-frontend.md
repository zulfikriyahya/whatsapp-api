## File : `package.json`

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tanstack/react-query": "^5.91.0",
    "@tanstack/react-query-devtools": "^5.91.3",
    "@tanstack/react-table": "^8.21.3",
    "axios": "^1.13.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "date-fns-tz": "^3.2.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.577.0",
    "next": "16.2.0",
    "next-themes": "^0.4.6",
    "papaparse": "^5.5.3",
    "qrcode.react": "^4.2.0",
    "react": "19.2.4",
    "react-day-picker": "^9.14.0",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.71.2",
    "recharts": "^3.8.0",
    "socket.io-client": "^4.8.3",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "vaul": "^1.1.2",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.2",
    "@types/node": "^20.19.37",
    "@types/papaparse": "^5.5.2",
    "@types/qrcode": "^1.5.6",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "eslint": "^9.39.4",
    "eslint-config-next": "16.2.0",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "tailwindcss": "^4.2.2",
    "typescript": "^5.9.3"
  }
}
```
---

## File : `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```
---

## File : `next.config.ts`

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
}

export default nextConfig

```
---

## File : `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

```
---

## File : `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=WA Gateway
NEXT_PUBLIC_APP_URL=http://localhost:3001

```
---

## File : `.env.example`

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=WA Gateway
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com

```
---

## File : `.prettierrc`

```
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}

```
---

## File : `src/middleware.ts`

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/auth/2fa']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
}

```
---

## File : `src/app/layout.tsx`

```ts
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'WA Gateway', template: '%s — WA Gateway' },
  description: 'WhatsApp Gateway SaaS Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

```
---

## File : `src/app/globals.css`

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```
---

## File : `src/app/page.tsx`

```ts
import { redirect } from 'next/navigation'
export default function RootPage() { redirect('/dashboard') }

```
---

## File : `src/app/not-found.tsx`

```ts

```
---

## File : `src/app/error.tsx`

```ts

```
---

## File : `src/app/loading.tsx`

```ts

```
---

## File : `src/app/(auth)/layout.tsx`

```ts

```
---

## File : `src/app/(auth)/login/page.tsx`

```ts

```
---

## File : `src/app/(auth)/auth/2fa/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/layout.tsx`

```ts

```
---

## File : `src/app/(dashboard)/dashboard/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/sessions/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/messages/send/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/messages/logs/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/inbox/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/broadcast/campaigns/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/broadcast/campaigns/[id]/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/broadcast-list/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/contacts/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/auto-reply/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/workflows/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/drip-campaigns/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/drip-campaigns/[id]/subscribers/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/scheduler/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/scheduled-events/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/templates/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/chats/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/groups/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/groups/[sessionId]/[groupId]/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/channels/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/labels/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/calls/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/profile/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/analytics/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/audit/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/api-keys/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/workspaces/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/settings/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/settings/webhook/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/settings/ai/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/settings/security/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/admin/users/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/admin/users/[id]/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/admin/tiers/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/admin/audit/page.tsx`

```ts

```
---

## File : `src/app/(dashboard)/admin/settings/page.tsx`

```ts

```
---

## File : `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelative(date: string | Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function normalizePhone(phone: string): string {
  let num = phone.replace(/\D/g, '')
  if (num.startsWith('0')) num = '62' + num.slice(1)
  return num
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '...' : str
}

export function buildFileUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/v1/storage/uploads/${filename}`
}

```
---

## File : `src/lib/axios.ts`

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

```
---

## File : `src/lib/socket.ts`

```ts
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      withCredentials: true,
      auth: token ? { token } : undefined,
      autoConnect: false,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

```
---

## File : `src/lib/query-client.ts`

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
    mutations: { retry: 0 },
  },
})

```
---

## File : `src/lib/api-error.ts`

```ts
import type { AxiosError } from 'axios'
import { getErrorMessage } from '@/constants/error-codes'

export function parseApiError(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; code?: string; message?: string }>
  const data = axiosErr.response?.data
  if (data?.code) return getErrorMessage(data.code, data.error)
  if (data?.error) return data.error
  if (data?.message) return data.message
  return axiosErr.message ?? 'Terjadi kesalahan'
}

```
---

## File : `src/types/api.ts`

```ts
export interface ApiResponse<T = unknown> {
  status: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  status: boolean
  data: T[]
  meta: PaginationMeta
}

export interface PaginationParams {
  page?: number
  limit?: number
}

```
---

## File : `src/types/auth.ts`

```ts

```
---

## File : `src/types/socket.ts`

```ts
export interface QrPayload { sessionId: string; qr: string }
export interface CodePayload { sessionId: string; code: string }
export interface ConnectionUpdatePayload {
  sessionId: string
  status: 'connected' | 'disconnected' | 'authenticating' | 'logged_out'
  phoneNumber?: string
}
export interface NewMessagePayload {
  message: { id: string; from: string; body: string; type: string; sessionId: string }
}
export interface MessageAckPayload { sessionId: string; msgId: string; ack: 'sent' | 'delivered' | 'read' }
export interface GroupNotificationPayload { sessionId: string; notification: unknown }
export interface IncomingCallPayload {
  sessionId: string
  call: { id: string; from: string; isVideo: boolean; timestamp: number }
}
export interface BroadcastProgressPayload {
  campaignId: string; current: number; total: number
  percentage: number; successCount: number; failedCount: number
}
export interface BroadcastCompletePayload { campaignId: string; successCount: number; failedCount: number }
export interface SystemAlertPayload { type: string; message: string; data?: unknown }

```
---

## File : `src/types/session.ts`

```ts

```
---

## File : `src/types/message.ts`

```ts

```
---

## File : `src/types/broadcast.ts`

```ts

```
---

## File : `src/types/broadcast-list.ts`

```ts

```
---

## File : `src/types/inbox.ts`

```ts

```
---

## File : `src/types/contact.ts`

```ts

```
---

## File : `src/types/customer-note.ts`

```ts

```
---

## File : `src/types/auto-reply.ts`

```ts

```
---

## File : `src/types/workflow.ts`

```ts

```
---

## File : `src/types/drip.ts`

```ts

```
---

## File : `src/types/scheduler.ts`

```ts

```
---

## File : `src/types/scheduled-event.ts`

```ts

```
---

## File : `src/types/template.ts`

```ts

```
---

## File : `src/types/webhook.ts`

```ts

```
---

## File : `src/types/api-key.ts`

```ts

```
---

## File : `src/types/settings.ts`

```ts

```
---

## File : `src/types/analytics.ts`

```ts

```
---

## File : `src/types/audit.ts`

```ts

```
---

## File : `src/types/tier.ts`

```ts
export type TierFeatureKey =
  | 'broadcast' | 'auto_reply' | 'workflow' | 'drip_campaign'
  | 'ai_smart_reply' | 'channels' | 'labels' | 'customer_note'
  | 'scheduler' | 'webhook' | 'api_access'

export interface Tier {
  id: string; name: string; description?: string
  maxSessions: number; maxApiKeys: number; maxDailyMessages: number
  maxMonthlyBroadcasts: number; maxBroadcastRecipients: number
  maxWorkflows: number; maxDripCampaigns: number; maxTemplates: number
  maxContacts: number; rateLimitPerMinute: number
  features: TierFeatureKey[]; price?: string; isActive: boolean
  createdAt: string; updatedAt: string
}

export interface UserTier {
  id: string; userId: string; tierId: string
  startedAt: string; expiresAt?: string; isGrace: boolean
  tier: Tier
}

```
---

## File : `src/types/user.ts`

```ts

```
---

## File : `src/types/workspace.ts`

```ts

```
---

## File : `src/types/profile.ts`

```ts

```
---

## File : `src/types/chat.ts`

```ts

```
---

## File : `src/types/group.ts`

```ts

```
---

## File : `src/types/channel.ts`

```ts

```
---

## File : `src/types/label.ts`

```ts

```
---

## File : `src/types/status.ts`

```ts

```
---

## File : `src/types/call.ts`

```ts

```
---

## File : `src/types/storage.ts`

```ts

```
---

## File : `src/types/admin.ts`

```ts

```
---

## File : `src/types/health.ts`

```ts

```
---

## File : `src/store/auth.store.ts`

```ts
import { create } from 'zustand'
import type { TierFeatureKey } from '@/types/tier'

export type Role = 'user' | 'admin' | 'super_admin'

export interface AuthUser {
  id: string
  email: string
  name: string
  picture?: string
  role: Role
  twoFaEnabled: boolean
  tier?: {
    name: string
    features: TierFeatureKey[]
    isGrace: boolean
    expiresAt?: string
  }
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (v: boolean) => void
  isAdmin: () => boolean
  hasFeature: (feature: TierFeatureKey) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  isAdmin: () => {
    const role = get().user?.role
    return role === 'admin' || role === 'super_admin'
  },
  hasFeature: (feature) => {
    const u = get().user
    if (!u) return false
    if (u.role === 'admin' || u.role === 'super_admin') return true
    return u.tier?.features?.includes(feature) ?? false
  },
}))

```
---

## File : `src/store/session.store.ts`

```ts
import { create } from 'zustand'

export type SessionStatus = 'disconnected' | 'authenticating' | 'connected' | 'logged_out'

interface SessionState {
  activeQr: { sessionId: string; qr: string } | null
  activePairing: { sessionId: string; code: string } | null
  sessionStatuses: Record<string, SessionStatus>
  setActiveQr: (data: { sessionId: string; qr: string } | null) => void
  setActivePairing: (data: { sessionId: string; code: string } | null) => void
  updateStatus: (sessionId: string, status: SessionStatus) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  activeQr: null,
  activePairing: null,
  sessionStatuses: {},
  setActiveQr: (activeQr) => set({ activeQr }),
  setActivePairing: (activePairing) => set({ activePairing }),
  updateStatus: (sessionId, status) =>
    set((s) => ({ sessionStatuses: { ...s.sessionStatuses, [sessionId]: status } })),
}))

```
---

## File : `src/store/notification.store.ts`

```ts
import { create } from 'zustand'

export interface AppNotification {
  id: string
  type: string
  message: string
  data?: unknown
  timestamp: Date
  read: boolean
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  add: (n: Pick<AppNotification, 'type' | 'message' | 'data'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  add: (n) => {
    const notif: AppNotification = {
      ...n, id: crypto.randomUUID(), timestamp: new Date(), read: false,
    }
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    }))
  },
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 })),
  clear: () => set({ notifications: [], unreadCount: 0 }),
}))

```
---

## File : `src/store/broadcast.store.ts`

```ts
import { create } from 'zustand'

export interface BroadcastProgress {
  campaignId: string
  current: number
  total: number
  percentage: number
  successCount: number
  failedCount: number
  done: boolean
}

interface BroadcastState {
  progress: Record<string, BroadcastProgress>
  setProgress: (campaignId: string, data: Omit<BroadcastProgress, 'done'>) => void
  setDone: (campaignId: string, successCount: number, failedCount: number) => void
  clear: (campaignId: string) => void
}

export const useBroadcastStore = create<BroadcastState>((set) => ({
  progress: {},
  setProgress: (campaignId, data) =>
    set((s) => ({ progress: { ...s.progress, [campaignId]: { ...data, done: false } } })),
  setDone: (campaignId, successCount, failedCount) =>
    set((s) => ({
      progress: {
        ...s.progress,
        [campaignId]: { ...s.progress[campaignId], successCount, failedCount, done: true },
      },
    })),
  clear: (campaignId) =>
    set((s) => {
      const { [campaignId]: _, ...rest } = s.progress
      return { progress: rest }
    }),
}))

```
---

## File : `src/store/inbox.store.ts`

```ts
import { create } from 'zustand'

interface InboxState {
  unreadTotal: number
  increment: () => void
  reset: () => void
}

export const useInboxStore = create<InboxState>((set) => ({
  unreadTotal: 0,
  increment: () => set((s) => ({ unreadTotal: s.unreadTotal + 1 })),
  reset: () => set({ unreadTotal: 0 }),
}))

```
---

## File : `src/store/ui.store.ts`

```ts
import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

```
---

## File : `src/constants/routes.ts`

```ts

```
---

## File : `src/constants/query-keys.ts`

```ts

```
---

## File : `src/constants/tier-features.ts`

```ts

```
---

## File : `src/constants/nav-items.ts`

```ts

```
---

## File : `src/constants/error-codes.ts`

```ts
export const ERROR_CODES: Record<string, string> = {
  ERR_UNAUTHORIZED: 'Sesi tidak valid, silakan login ulang',
  ERR_FORBIDDEN: 'Anda tidak memiliki akses',
  ERR_ACCOUNT_DISABLED: 'Akun Anda dinonaktifkan',
  ERR_IP_NOT_WHITELISTED: 'IP Anda tidak diizinkan',
  ERR_NOT_FOUND: 'Data tidak ditemukan',
  ERR_VALIDATION: 'Data tidak valid',
  ERR_INVALID_PHONE: 'Format nomor telepon tidak valid',
  ERR_INVALID_REGEX: 'Pola regex tidak valid',
  ERR_INVALID_IP_FORMAT: 'Format IP/CIDR tidak valid',
  ERR_INVALID_TIME_FORMAT: 'Format waktu harus HH:MM',
  ERR_SCHEDULE_PAST: 'Waktu jadwal sudah lewat',
  ERR_DUPLICATE_SESSION_NAME: 'Nama sesi sudah digunakan',
  ERR_DUPLICATE_CONTACT: 'Kontak sudah ada',
  ERR_DUPLICATE_TEMPLATE_NAME: 'Nama template sudah digunakan',
  ERR_DUPLICATE_DRIP_DAY: 'Day offset sudah ada di step lain',
  ERR_SESSION_NOT_CONNECTED: 'Sesi WhatsApp tidak terhubung',
  ERR_SESSION_LOGGED_OUT: 'Sesi logout permanen, scan ulang QR',
  ERR_SESSION_NOT_FOUND: 'Sesi tidak ditemukan',
  ERR_NO_SESSIONS: 'Tidak ada sesi WhatsApp aktif',
  ERR_NO_RECIPIENTS: 'Tidak ada penerima broadcast',
  ERR_QUOTA_DAILY_EXCEEDED: 'Kuota pesan harian habis',
  ERR_QUOTA_MONTHLY_EXCEEDED: 'Kuota broadcast bulanan habis',
  ERR_RATE_LIMIT: 'Terlalu banyak request, coba lagi nanti',
  ERR_2FA_INVALID_CODE: 'Kode 2FA tidak valid',
  ERR_2FA_SESSION_EXPIRED: 'Sesi 2FA kadaluarsa, ulangi login',
  ERR_2FA_ALREADY_ENABLED: '2FA sudah aktif',
  ERR_2FA_NOT_ENABLED: '2FA belum diaktifkan',
  ERR_CAMPAIGN_NOT_CANCELLABLE: 'Campaign tidak dapat dibatalkan',
  ERR_MESSAGE_ALREADY_SENT: 'Pesan sudah terkirim',
  ERR_WEBHOOK_NOT_CONFIGURED: 'URL webhook belum dikonfigurasi',
  ERR_FEATURE_NOT_AVAILABLE: 'Fitur ini tidak tersedia di tier Anda',
  ERR_AI_DISABLED: 'AI Smart Reply sedang tidak aktif',
  ERR_SEND_FAILED: 'Gagal mengirim pesan ke WhatsApp',
  ERR_FILE_TOO_LARGE: 'Ukuran file melebihi batas 50MB',
  ERR_FILE_TYPE_NOT_ALLOWED: 'Tipe file tidak diizinkan',
  ERR_WORKFLOW_TOO_MANY_NODES: 'Workflow maksimal 20 node',
  ERR_DELAY_TOO_LONG: 'Delay maksimal 3600 detik',
  ERR_CANNOT_DELETE_SELF: 'Tidak bisa menghapus akun sendiri',
  ERR_MAINTENANCE: 'Server sedang dalam maintenance',
  ERR_INTERNAL: 'Terjadi kesalahan internal server',
}

export function getErrorMessage(code?: string, fallback?: string): string {
  if (!code) return fallback ?? 'Terjadi kesalahan'
  return ERROR_CODES[code] ?? fallback ?? code
}

```
---

## File : `src/constants/socket-events.ts`

```ts
export const SOCKET_EVENTS = {
  QR: 'qr',
  CODE: 'code',
  CONNECTION_UPDATE: 'connection_update',
  NEW_MESSAGE: 'new_message',
  MESSAGE_ACK: 'message_ack',
  MESSAGE_EDIT: 'message_edit',
  MESSAGE_REACTION: 'message_reaction',
  MESSAGE_REVOKE_EVERYONE: 'message_revoke_everyone',
  MESSAGE_REVOKE_ME: 'message_revoke_me',
  MEDIA_UPLOADED: 'media_uploaded',
  VOTE_UPDATE: 'vote_update',
  GROUP_JOIN: 'group_join',
  GROUP_LEAVE: 'group_leave',
  GROUP_ADMIN_CHANGED: 'group_admin_changed',
  GROUP_UPDATE: 'group_update',
  GROUP_MEMBERSHIP_REQUEST: 'group_membership_request',
  CONTACT_CHANGED: 'contact_changed',
  CHAT_ARCHIVED: 'chat_archived',
  CHAT_REMOVED: 'chat_removed',
  CHANGE_STATE: 'change_state',
  CHANGE_BATTERY: 'change_battery',
  INCOMING_CALL: 'incoming_call',
  BROADCAST_PROGRESS: 'broadcast_progress',
  BROADCAST_COMPLETE: 'broadcast_complete',
  SYSTEM_ALERT: 'system_alert',
} as const

export const SYSTEM_ALERT_TYPES = {
  QUOTA_WARNING: 'quota_warning',
  QUOTA_EXCEEDED: 'quota_exceeded',
  SESSION_DISCONNECTED: 'session_disconnected',
  SESSION_LOGGED_OUT: 'session_logged_out',
  ALL_SESSIONS_DOWN: 'all_sessions_down',
  AI_DISABLED: 'ai_disabled',
  DISK_WARNING: 'disk_warning',
  REDIS_DISCONNECTED: 'redis_disconnected',
  BROADCAST_COMPLETE: 'broadcast_complete',
  ANNOUNCEMENT: 'announcement',
} as const

```
---

## File : `src/validators/auth.schema.ts`

```ts

```
---

## File : `src/validators/session.schema.ts`

```ts

```
---

## File : `src/validators/message.schema.ts`

```ts

```
---

## File : `src/validators/broadcast.schema.ts`

```ts

```
---

## File : `src/validators/contact.schema.ts`

```ts

```
---

## File : `src/validators/customer-note.schema.ts`

```ts

```
---

## File : `src/validators/auto-reply.schema.ts`

```ts

```
---

## File : `src/validators/workflow.schema.ts`

```ts

```
---

## File : `src/validators/drip.schema.ts`

```ts

```
---

## File : `src/validators/scheduler.schema.ts`

```ts

```
---

## File : `src/validators/scheduled-event.schema.ts`

```ts

```
---

## File : `src/validators/template.schema.ts`

```ts

```
---

## File : `src/validators/webhook.schema.ts`

```ts

```
---

## File : `src/validators/api-key.schema.ts`

```ts

```
---

## File : `src/validators/settings.schema.ts`

```ts

```
---

## File : `src/validators/tier.schema.ts`

```ts

```
---

## File : `src/validators/workspace.schema.ts`

```ts

```
---

## File : `src/validators/user.schema.ts`

```ts

```
---

## File : `src/validators/profile.schema.ts`

```ts

```
---

## File : `src/validators/groups.schema.ts`

```ts

```
---

## File : `src/api/auth.api.ts`

```ts

```
---

## File : `src/api/users.api.ts`

```ts

```
---

## File : `src/api/sessions.api.ts`

```ts

```
---

## File : `src/api/messages.api.ts`

```ts

```
---

## File : `src/api/broadcast.api.ts`

```ts

```
---

## File : `src/api/broadcast-list.api.ts`

```ts

```
---

## File : `src/api/inbox.api.ts`

```ts

```
---

## File : `src/api/contacts.api.ts`

```ts

```
---

## File : `src/api/customer-note.api.ts`

```ts

```
---

## File : `src/api/auto-reply.api.ts`

```ts

```
---

## File : `src/api/workflow.api.ts`

```ts

```
---

## File : `src/api/drip.api.ts`

```ts

```
---

## File : `src/api/scheduler.api.ts`

```ts

```
---

## File : `src/api/scheduled-event.api.ts`

```ts

```
---

## File : `src/api/templates.api.ts`

```ts

```
---

## File : `src/api/webhook.api.ts`

```ts

```
---

## File : `src/api/api-keys.api.ts`

```ts

```
---

## File : `src/api/settings.api.ts`

```ts

```
---

## File : `src/api/analytics.api.ts`

```ts

```
---

## File : `src/api/audit.api.ts`

```ts

```
---

## File : `src/api/tiers.api.ts`

```ts

```
---

## File : `src/api/workspace.api.ts`

```ts

```
---

## File : `src/api/profile.api.ts`

```ts

```
---

## File : `src/api/chats.api.ts`

```ts

```
---

## File : `src/api/groups.api.ts`

```ts

```
---

## File : `src/api/channels.api.ts`

```ts

```
---

## File : `src/api/labels.api.ts`

```ts

```
---

## File : `src/api/status.api.ts`

```ts

```
---

## File : `src/api/calls.api.ts`

```ts

```
---

## File : `src/api/storage.api.ts`

```ts

```
---

## File : `src/api/admin.api.ts`

```ts

```
---

## File : `src/api/health.api.ts`

```ts

```
---

## File : `src/hooks/use-auth.ts`

```ts

```
---

## File : `src/hooks/use-socket.ts`

```ts

```
---

## File : `src/hooks/use-qr-listener.ts`

```ts

```
---

## File : `src/hooks/use-pairing-listener.ts`

```ts

```
---

## File : `src/hooks/use-connection-listener.ts`

```ts

```
---

## File : `src/hooks/use-broadcast-progress.ts`

```ts

```
---

## File : `src/hooks/use-inbox-realtime.ts`

```ts

```
---

## File : `src/hooks/use-system-alerts.ts`

```ts

```
---

## File : `src/hooks/use-message-ack.ts`

```ts

```
---

## File : `src/hooks/use-incoming-call.ts`

```ts

```
---

## File : `src/hooks/use-tier-features.ts`

```ts

```
---

## File : `src/hooks/use-quota.ts`

```ts

```
---

## File : `src/hooks/use-session-status.ts`

```ts

```
---

## File : `src/hooks/use-debounce.ts`

```ts

```
---

## File : `src/hooks/use-media-query.ts`

```ts

```
---

## File : `src/hooks/use-copy-to-clipboard.ts`

```ts

```
---

## File : `src/hooks/use-pagination.ts`

```ts

```
---

## File : `src/hooks/use-file-upload.ts`

```ts

```
---

## File : `src/providers/query-provider.tsx`

```ts
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

```
---

## File : `src/providers/theme-provider.tsx`

```ts
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

```
---

## File : `src/providers/socket-provider.tsx`

```ts

```
---

## File : `src/providers/auth-provider.tsx`

```ts

```
---

## File : `src/components/layout/app-shell.tsx`

```ts

```
---

## File : `src/components/layout/sidebar.tsx`

```ts

```
---

## File : `src/components/layout/sidebar-nav.tsx`

```ts

```
---

## File : `src/components/layout/sidebar-nav-item.tsx`

```ts

```
---

## File : `src/components/layout/sidebar-section.tsx`

```ts

```
---

## File : `src/components/layout/header.tsx`

```ts

```
---

## File : `src/components/layout/breadcrumb.tsx`

```ts

```
---

## File : `src/components/layout/mobile-nav.tsx`

```ts

```
---

## File : `src/components/layout/user-menu.tsx`

```ts

```
---

## File : `src/components/layout/notification-bell.tsx`

```ts

```
---

## File : `src/components/layout/theme-toggle.tsx`

```ts

```
---

## File : `src/components/layout/impersonation-banner.tsx`

```ts

```
---

## File : `src/components/layout/maintenance-banner.tsx`

```ts

```
---

## File : `src/components/layout/quota-warning-banner.tsx`

```ts

```
---

## File : `src/components/common/page-header.tsx`

```ts

```
---

## File : `src/components/common/data-table.tsx`

```ts

```
---

## File : `src/components/common/data-table-pagination.tsx`

```ts

```
---

## File : `src/components/common/data-table-toolbar.tsx`

```ts

```
---

## File : `src/components/common/data-table-column-header.tsx`

```ts

```
---

## File : `src/components/common/confirm-dialog.tsx`

```ts

```
---

## File : `src/components/common/empty-state.tsx`

```ts

```
---

## File : `src/components/common/error-state.tsx`

```ts

```
---

## File : `src/components/common/loading-spinner.tsx`

```ts

```
---

## File : `src/components/common/loading-skeleton.tsx`

```ts

```
---

## File : `src/components/common/error-boundary.tsx`

```ts

```
---

## File : `src/components/common/copy-button.tsx`

```ts

```
---

## File : `src/components/common/status-badge.tsx`

```ts

```
---

## File : `src/components/common/file-uploader.tsx`

```ts

```
---

## File : `src/components/common/phone-input.tsx`

```ts

```
---

## File : `src/components/common/date-picker.tsx`

```ts

```
---

## File : `src/components/common/date-range-picker.tsx`

```ts

```
---

## File : `src/components/common/search-input.tsx`

```ts

```
---

## File : `src/components/common/stats-card.tsx`

```ts

```
---

## File : `src/components/common/tier-gate.tsx`

```ts

```
---

## File : `src/components/common/role-gate.tsx`

```ts

```
---

## File : `src/components/common/quota-bar.tsx`

```ts

```
---

## File : `src/components/common/export-pdf-button.tsx`

```ts

```
---

## File : `src/components/common/session-selector.tsx`

```ts

```
---

## File : `src/components/common/api-error-alert.tsx`

```ts

```
---

## File : `src/components/auth/google-login-button.tsx`

```ts

```
---

## File : `src/components/auth/two-factor-form.tsx`

```ts

```
---

## File : `src/components/auth/setup-2fa-dialog.tsx`

```ts

```
---

## File : `src/components/auth/backup-codes-dialog.tsx`

```ts

```
---

## File : `src/components/auth/disable-2fa-dialog.tsx`

```ts

```
---

## File : `src/components/session/session-list.tsx`

```ts

```
---

## File : `src/components/session/session-card.tsx`

```ts

```
---

## File : `src/components/session/session-status-badge.tsx`

```ts

```
---

## File : `src/components/session/add-session-dialog.tsx`

```ts

```
---

## File : `src/components/session/session-qr-dialog.tsx`

```ts

```
---

## File : `src/components/session/session-pairing-dialog.tsx`

```ts

```
---

## File : `src/components/session/session-info-dialog.tsx`

```ts

```
---

## File : `src/components/session/reconnect-button.tsx`

```ts

```
---

## File : `src/components/messages/message-type-tabs.tsx`

```ts

```
---

## File : `src/components/messages/send-message-form.tsx`

```ts

```
---

## File : `src/components/messages/send-media-form.tsx`

```ts

```
---

## File : `src/components/messages/send-location-form.tsx`

```ts

```
---

## File : `src/components/messages/send-live-location-form.tsx`

```ts

```
---

## File : `src/components/messages/send-poll-form.tsx`

```ts

```
---

## File : `src/components/messages/send-contact-form.tsx`

```ts

```
---

## File : `src/components/messages/send-voice-note-form.tsx`

```ts

```
---

## File : `src/components/messages/message-log-table.tsx`

```ts

```
---

## File : `src/components/messages/message-status-badge.tsx`

```ts

```
---

## File : `src/components/messages/check-number-form.tsx`

```ts

```
---

## File : `src/components/broadcast/campaign-table.tsx`

```ts

```
---

## File : `src/components/broadcast/campaign-card.tsx`

```ts

```
---

## File : `src/components/broadcast/campaign-status-badge.tsx`

```ts

```
---

## File : `src/components/broadcast/create-broadcast-dialog.tsx`

```ts

```
---

## File : `src/components/broadcast/recipients-tab.tsx`

```ts

```
---

## File : `src/components/broadcast/csv-upload-tab.tsx`

```ts

```
---

## File : `src/components/broadcast/tag-filter-tab.tsx`

```ts

```
---

## File : `src/components/broadcast/broadcast-progress-dialog.tsx`

```ts

```
---

## File : `src/components/broadcast/broadcast-stats-cards.tsx`

```ts

```
---

## File : `src/components/broadcast/cancel-broadcast-button.tsx`

```ts

```
---

## File : `src/components/broadcast-list/broadcast-list-table.tsx`

```ts

```
---

## File : `src/components/broadcast-list/send-to-list-dialog.tsx`

```ts

```
---

## File : `src/components/inbox/conversation-list.tsx`

```ts

```
---

## File : `src/components/inbox/conversation-item.tsx`

```ts

```
---

## File : `src/components/inbox/message-thread.tsx`

```ts

```
---

## File : `src/components/inbox/message-bubble.tsx`

```ts

```
---

## File : `src/components/inbox/reply-form.tsx`

```ts

```
---

## File : `src/components/inbox/inbox-filters.tsx`

```ts

```
---

## File : `src/components/inbox/unread-badge.tsx`

```ts

```
---

## File : `src/components/contacts/contact-table.tsx`

```ts

```
---

## File : `src/components/contacts/contact-form.tsx`

```ts

```
---

## File : `src/components/contacts/import-csv-dialog.tsx`

```ts

```
---

## File : `src/components/contacts/import-google-dialog.tsx`

```ts

```
---

## File : `src/components/contacts/bulk-actions-bar.tsx`

```ts

```
---

## File : `src/components/contacts/contact-tag-badge.tsx`

```ts

```
---

## File : `src/components/contacts/export-button.tsx`

```ts

```
---

## File : `src/components/customer-note/note-dialog.tsx`

```ts

```
---

## File : `src/components/auto-reply/rule-table.tsx`

```ts

```
---

## File : `src/components/auto-reply/rule-form-dialog.tsx`

```ts

```
---

## File : `src/components/auto-reply/match-type-badge.tsx`

```ts

```
---

## File : `src/components/auto-reply/toggle-switch.tsx`

```ts

```
---

## File : `src/components/workflow/workflow-list.tsx`

```ts

```
---

## File : `src/components/workflow/workflow-card.tsx`

```ts

```
---

## File : `src/components/workflow/workflow-form-dialog.tsx`

```ts

```
---

## File : `src/components/workflow/trigger-condition-form.tsx`

```ts

```
---

## File : `src/components/workflow/node-editor.tsx`

```ts

```
---

## File : `src/components/workflow/node-card.tsx`

```ts

```
---

## File : `src/components/workflow/node-type-selector.tsx`

```ts

```
---

## File : `src/components/drip/drip-list.tsx`

```ts

```
---

## File : `src/components/drip/drip-card.tsx`

```ts

```
---

## File : `src/components/drip/drip-form-dialog.tsx`

```ts

```
---

## File : `src/components/drip/step-editor.tsx`

```ts

```
---

## File : `src/components/drip/step-form.tsx`

```ts

```
---

## File : `src/components/drip/subscriber-table.tsx`

```ts

```
---

## File : `src/components/drip/subscription-status-badge.tsx`

```ts

```
---

## File : `src/components/drip/cancel-subscription-button.tsx`

```ts

```
---

## File : `src/components/scheduler/scheduled-table.tsx`

```ts

```
---

## File : `src/components/scheduler/create-scheduled-dialog.tsx`

```ts

```
---

## File : `src/components/scheduler/recurrence-select.tsx`

```ts

```
---

## File : `src/components/scheduler/scheduled-status-badge.tsx`

```ts

```
---

## File : `src/components/scheduled-event/send-event-dialog.tsx`

```ts

```
---

## File : `src/components/scheduled-event/respond-event-dialog.tsx`

```ts

```
---

## File : `src/components/templates/template-list.tsx`

```ts

```
---

## File : `src/components/templates/template-card.tsx`

```ts

```
---

## File : `src/components/templates/template-form-dialog.tsx`

```ts

```
---

## File : `src/components/templates/template-picker.tsx`

```ts

```
---

## File : `src/components/webhook/webhook-config-form.tsx`

```ts

```
---

## File : `src/components/webhook/webhook-secret-card.tsx`

```ts

```
---

## File : `src/components/webhook/test-webhook-button.tsx`

```ts

```
---

## File : `src/components/api-keys/api-key-table.tsx`

```ts

```
---

## File : `src/components/api-keys/create-key-dialog.tsx`

```ts

```
---

## File : `src/components/api-keys/key-reveal-dialog.tsx`

```ts

```
---

## File : `src/components/api-keys/sandbox-badge.tsx`

```ts

```
---

## File : `src/components/api-keys/ip-whitelist-input.tsx`

```ts

```
---

## File : `src/components/settings/user-settings-form.tsx`

```ts

```
---

## File : `src/components/settings/ai-settings-form.tsx`

```ts

```
---

## File : `src/components/settings/security-settings.tsx`

```ts

```
---

## File : `src/components/settings/global-settings-form.tsx`

```ts

```
---

## File : `src/components/settings/maintenance-toggle.tsx`

```ts

```
---

## File : `src/components/settings/announcement-form.tsx`

```ts

```
---

## File : `src/components/analytics/summary-cards.tsx`

```ts

```
---

## File : `src/components/analytics/message-chart.tsx`

```ts

```
---

## File : `src/components/analytics/recent-campaigns.tsx`

```ts

```
---

## File : `src/components/analytics/recent-logs.tsx`

```ts

```
---

## File : `src/components/analytics/system-status-card.tsx`

```ts

```
---

## File : `src/components/analytics/sessions-status-card.tsx`

```ts

```
---

## File : `src/components/analytics/queue-status-card.tsx`

```ts

```
---

## File : `src/components/analytics/days-filter.tsx`

```ts

```
---

## File : `src/components/audit/audit-table.tsx`

```ts

```
---

## File : `src/components/audit/audit-filters.tsx`

```ts

```
---

## File : `src/components/audit/audit-action-badge.tsx`

```ts

```
---

## File : `src/components/audit/export-pdf-button.tsx`

```ts

```
---

## File : `src/components/tiers/tier-list.tsx`

```ts

```
---

## File : `src/components/tiers/tier-card.tsx`

```ts

```
---

## File : `src/components/tiers/tier-badge.tsx`

```ts

```
---

## File : `src/components/tiers/tier-feature-list.tsx`

```ts

```
---

## File : `src/components/tiers/tier-form-dialog.tsx`

```ts

```
---

## File : `src/components/tiers/assign-tier-dialog.tsx`

```ts

```
---

## File : `src/components/tiers/tier-history-table.tsx`

```ts

```
---

## File : `src/components/tiers/grace-period-banner.tsx`

```ts

```
---

## File : `src/components/users/user-table.tsx`

```ts

```
---

## File : `src/components/users/user-detail-card.tsx`

```ts

```
---

## File : `src/components/users/update-user-dialog.tsx`

```ts

```
---

## File : `src/components/users/quota-editor.tsx`

```ts

```
---

## File : `src/components/users/delete-user-dialog.tsx`

```ts

```
---

## File : `src/components/users/user-tier-badge.tsx`

```ts

```
---

## File : `src/components/workspace/workspace-list.tsx`

```ts

```
---

## File : `src/components/workspace/workspace-card.tsx`

```ts

```
---

## File : `src/components/workspace/create-workspace-dialog.tsx`

```ts

```
---

## File : `src/components/workspace/member-table.tsx`

```ts

```
---

## File : `src/components/workspace/invite-member-dialog.tsx`

```ts

```
---

## File : `src/components/workspace/permission-editor.tsx`

```ts

```
---

## File : `src/components/workspace/remove-member-button.tsx`

```ts

```
---

## File : `src/components/profile/wa-profile-card.tsx`

```ts

```
---

## File : `src/components/profile/set-display-name-form.tsx`

```ts

```
---

## File : `src/components/profile/set-status-form.tsx`

```ts

```
---

## File : `src/components/profile/profile-photo-upload.tsx`

```ts

```
---

## File : `src/components/profile/wa-contacts-table.tsx`

```ts

```
---

## File : `src/components/profile/contact-profile-photo.tsx`

```ts

```
---

## File : `src/components/profile/block-unblock-button.tsx`

```ts

```
---

## File : `src/components/profile/blocked-contacts-list.tsx`

```ts

```
---

## File : `src/components/chats/chat-list.tsx`

```ts

```
---

## File : `src/components/chats/chat-list-item.tsx`

```ts

```
---

## File : `src/components/chats/chat-actions-menu.tsx`

```ts

```
---

## File : `src/components/chats/search-messages.tsx`

```ts

```
---

## File : `src/components/groups/group-list.tsx`

```ts

```
---

## File : `src/components/groups/group-info-card.tsx`

```ts

```
---

## File : `src/components/groups/create-group-dialog.tsx`

```ts

```
---

## File : `src/components/groups/manage-participants-dialog.tsx`

```ts

```
---

## File : `src/components/groups/membership-requests-list.tsx`

```ts

```
---

## File : `src/components/groups/invite-link-card.tsx`

```ts

```
---

## File : `src/components/groups/common-groups-list.tsx`

```ts

```
---

## File : `src/components/channels/channel-list.tsx`

```ts

```
---

## File : `src/components/channels/channel-card.tsx`

```ts

```
---

## File : `src/components/channels/channel-search-dialog.tsx`

```ts

```
---

## File : `src/components/channels/subscribe-button.tsx`

```ts

```
---

## File : `src/components/channels/send-to-channel-dialog.tsx`

```ts

```
---

## File : `src/components/channels/manage-admin-dialog.tsx`

```ts

```
---

## File : `src/components/channels/transfer-ownership-dialog.tsx`

```ts

```
---

## File : `src/components/labels/label-list.tsx`

```ts

```
---

## File : `src/components/labels/label-badge.tsx`

```ts

```
---

## File : `src/components/labels/assign-label-dialog.tsx`

```ts

```
---

## File : `src/components/labels/chats-by-label.tsx`

```ts

```
---

## File : `src/components/status/set-bio-form.tsx`

```ts

```
---

## File : `src/components/status/send-status-form.tsx`

```ts

```
---

## File : `src/components/status/presence-toggle.tsx`

```ts

```
---

## File : `src/components/calls/call-log-table.tsx`

```ts

```
---

## File : `src/components/calls/call-type-badge.tsx`

```ts

```
---

## File : `src/components/calls/call-status-badge.tsx`

```ts

```
---

## File : `src/components/calls/create-call-link-dialog.tsx`

```ts

```
---

## File : `src/components/admin/impersonation-dialog.tsx`

```ts

```
---

## File : `src/components/admin/exit-impersonation-button.tsx`

```ts

```
---

