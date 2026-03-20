import type { TierFeatureKey } from '@/types/tier'
import {
  LayoutDashboard,
  Smartphone,
  Inbox,
  Send,
  History,
  Megaphone,
  List,
  Reply,
  GitBranch,
  Droplets,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  Users2,
  Radio,
  Tag,
  Phone,
  User,
  Building2,
  Key,
  BarChart2,
  ClipboardList,
  Settings,
  UserCog,
  Layers,
  Globe,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  feature?: TierFeatureKey
  badge?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
  adminOnly?: boolean
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Utama',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Sesi WhatsApp', href: '/sessions', icon: Smartphone },
      { label: 'Inbox', href: '/inbox', icon: Inbox },
    ],
  },
  {
    title: 'Pesan',
    items: [
      { label: 'Kirim Pesan', href: '/messages/send', icon: Send },
      { label: 'Riwayat Pesan', href: '/messages/logs', icon: History },
      {
        label: 'Broadcast',
        href: '/broadcast/campaigns',
        icon: Megaphone,
        feature: 'broadcast',
      },
      { label: 'Broadcast List', href: '/broadcast-list', icon: List },
    ],
  },
  {
    title: 'Otomatisasi',
    items: [
      {
        label: 'Auto Reply',
        href: '/auto-reply',
        icon: Reply,
        feature: 'auto_reply',
      },
      {
        label: 'Workflow',
        href: '/workflows',
        icon: GitBranch,
        feature: 'workflow',
      },
      {
        label: 'Drip Campaign',
        href: '/drip-campaigns',
        icon: Droplets,
        feature: 'drip_campaign',
      },
      {
        label: 'Scheduler',
        href: '/scheduler',
        icon: Clock,
        feature: 'scheduler',
      },
      { label: 'Scheduled Event', href: '/scheduled-events', icon: Calendar },
    ],
  },
  {
    title: 'Manajemen',
    items: [
      { label: 'Kontak', href: '/contacts', icon: Users2 },
      { label: 'Template', href: '/templates', icon: FileText },
      { label: 'Grup', href: '/groups', icon: MessageSquare },
      { label: 'Channel', href: '/channels', icon: Radio, feature: 'channels' },
      { label: 'Label', href: '/labels', icon: Tag, feature: 'labels' },
      { label: 'Panggilan', href: '/calls', icon: Phone },
    ],
  },
  {
    title: 'Akun',
    items: [
      { label: 'Profil WA', href: '/profile', icon: User },
      { label: 'Workspace', href: '/workspaces', icon: Building2 },
      {
        label: 'API Keys',
        href: '/api-keys',
        icon: Key,
        feature: 'api_access',
      },
      {
        label: 'Webhook',
        href: '/settings/webhook',
        icon: Globe,
        feature: 'webhook',
      },
    ],
  },
  {
    title: 'Laporan',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart2 },
      { label: 'Audit Log', href: '/audit', icon: ClipboardList },
    ],
  },
  {
    title: 'Pengaturan',
    items: [{ label: 'Settings', href: '/settings', icon: Settings }],
  },
  {
    title: 'Admin',
    adminOnly: true,
    items: [
      { label: 'Kelola User', href: '/admin/users', icon: UserCog },
      { label: 'Kelola Tier', href: '/admin/tiers', icon: Layers },
      { label: 'Audit Log', href: '/admin/audit', icon: ClipboardList },
      { label: 'Pengaturan Global', href: '/admin/settings', icon: Settings },
    ],
  },
]
