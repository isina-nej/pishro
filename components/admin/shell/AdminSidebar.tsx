'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bitcoin,
  BookOpen,
  Contact,
  FileText,
  GraduationCap,
  Handshake,
  Home,
  LogOut,
  Menu,
  PieChart,
  ScrollText,
  Ticket,
  TrendingUp,
  LayoutTemplate,
  MessageSquareQuote,
  Users,
  UsersRound,
  X,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/lib/hooks/useAdminAuth';
import AdminTopbar from './AdminTopbar';
import CommandPalette from './CommandPalette';

export interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  key: string;
  roles: Array<AdminUser['role']>;
  disabled?: boolean;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    items: [
      { href: '/admin/dashboard', label: 'داشبورد', icon: Home, key: 'dashboard', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/admin/crm/customers', label: 'مشتریان', icon: UsersRound, key: 'crm-customers', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
      { href: '/admin/crm/leads', label: 'سرنخ‌ها', icon: Contact, key: 'crm-leads', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
      { href: '/admin/crm/deals', label: 'فرصت‌های فروش', icon: Handshake, key: 'crm-deals', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
      { href: '/admin/crm/tickets', label: 'تیکت‌های پشتیبانی', icon: Ticket, key: 'crm-tickets', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
      { href: '/admin/crm/segments', label: 'بخش‌بندی مشتریان', icon: PieChart, key: 'crm-segments', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
    ],
  },
  {
    label: 'محتوا',
    items: [
      { href: '/admin/crypto-prices', label: 'قیمت رمزارزها', icon: Bitcoin, key: 'crypto-prices', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
      { href: '/admin/block-news', label: 'اخبار', icon: FileText, key: 'block-news', roles: ['ADMIN', 'MODERATOR'] },
      { href: '/admin/library', label: 'کتابخانه', icon: BookOpen, key: 'library', roles: ['ADMIN', 'MODERATOR'] },
      { href: '/admin/courses', label: 'دوره‌ها', icon: GraduationCap, key: 'courses', roles: ['ADMIN', 'MODERATOR'] },
      { href: '/admin/investment-funds', label: 'صندوق‌های سرمایه‌گذاری', icon: TrendingUp, key: 'investment-funds', roles: ['ADMIN', 'MODERATOR'] },
      { href: '/admin/landing', label: 'لندینگ / CMS', icon: LayoutTemplate, key: 'landing', roles: ['ADMIN', 'MODERATOR'] },
      { href: '/admin/comments', label: 'نظرات کاربران', icon: MessageSquareQuote, key: 'comments', roles: ['ADMIN', 'MODERATOR'] },
    ],
  },
  {
    items: [
      { href: '/admin/users', label: 'کاربران', icon: Users, key: 'users', roles: ['ADMIN', 'MODERATOR'] },
      { href: '/admin/reports', label: 'گزارش‌ها', icon: BarChart3, key: 'reports', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
      // فقط ADMIN: گزارش نشان می‌دهد چه کسی چه کرده، و روت /api/admin/logs هم
      // همین محدودیت را دارد — منو نباید چیزی را نشان دهد که API رد می‌کند.
      { href: '/admin/logs', label: 'گزارش فعالیت‌ها', icon: ScrollText, key: 'logs', roles: ['ADMIN'] },
      { href: '/admin/settings', label: 'ظاهر سایت', icon: Palette, key: 'settings', roles: ['ADMIN'] },
    ],
  },
];

interface AdminSidebarProps {
  user: AdminUser;
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function AdminSidebar({ user, children, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(user.role)),
    }))
    .filter((section) => section.items.length > 0);
  const initials = user.name?.slice(0, 1) || user.email.slice(0, 1);

  function renderNavList(collapsed: boolean, onNavigate?: () => void) {
    return (
      <div className="space-y-4">
        {visibleSections.map((section, sectionIdx) => (
          <div key={section.label ?? `section-${sectionIdx}`} className="space-y-1">
            {section.label && !collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.disabled) {
                return (
                  <div
                    key={item.key}
                    className={cn(
                      'flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground/50',
                      collapsed ? 'justify-center' : 'justify-between'
                    )}
                    title="به‌زودی"
                  >
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    collapsed ? 'justify-center' : 'justify-between',
                    active
                      ? 'bg-navActiveBg text-primary font-medium shadow-sm'
                      : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  <Icon className={cn('h-5 w-5 shrink-0', active && 'text-iconBrand')} />
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex md:flex-col border-l border-border bg-card shadow-sm transition-all duration-300',
          desktopOpen ? 'md:w-64' : 'md:w-20'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle sidebar"
          >
            {desktopOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {desktopOpen ? (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <h1 className="text-lg font-bold">پیشرو</h1>
                <p className="text-xs text-muted-foreground">پنل مدیریت</p>
              </div>
              <Image
                src="/logo/logo-square.png"
                alt="پیشرو"
                width={36}
                height={36}
                className="shrink-0 rounded-lg object-cover"
              />
            </div>
          ) : (
            <Image
              src="/logo/logo-square.png"
              alt="پیشرو"
              width={32}
              height={32}
              className="shrink-0 rounded-lg object-cover"
            />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">{renderNavList(!desktopOpen)}</nav>

        <div className="space-y-3 border-t border-border p-4">
          {desktopOpen && (
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {initials}
              </div>
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-destructive transition hover:bg-destructive/10',
              desktopOpen ? 'justify-between' : 'justify-center'
            )}
          >
            {desktopOpen && <span className="text-sm font-medium">خروج</span>}
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-screen w-72 transform bg-card text-foreground transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-accent"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">پیشرو</h1>
            <Image
              src="/logo/logo-square.png"
              alt="پیشرو"
              width={32}
              height={32}
              className="shrink-0 rounded-lg object-cover"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {renderNavList(false, () => setMobileOpen(false))}
        </nav>
        <div className="border-t border-border p-4 space-y-3">
          <div className="px-2 py-2 text-right">
            <p className="text-xs text-muted-foreground">کاربر فعلی</p>
            <p className="text-sm font-semibold truncate">{user.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-destructive transition hover:bg-destructive/10"
          >
            <span className="text-sm font-medium">خروج</span>
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar
          onOpenMobileNav={() => setMobileOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <div className="w-full flex-1 overflow-auto">
          <div className="min-h-full w-full p-3 sm:p-4 lg:p-5 xl:p-6">{children}</div>
        </div>
      </main>

      <CommandPalette user={user} open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
}
