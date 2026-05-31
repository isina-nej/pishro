'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/lib/hooks/useAdminAuth';

interface AdminSidebarProps {
  user: AdminUser;
  children: React.ReactNode;
  currentPage?: string;
  onLogout?: () => void;
}

const menuItems = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: Home, key: 'dashboard', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
  { href: '/admin/block-news', label: 'اخبار', icon: FileText, key: 'block-news', roles: ['ADMIN', 'MODERATOR'] },
  { href: '/admin/library', label: 'کتابخانه', icon: BookOpen, key: 'library', roles: ['ADMIN', 'MODERATOR'] },
  { href: '/admin/courses', label: 'دوره‌ها', icon: GraduationCap, key: 'courses', roles: ['ADMIN', 'MODERATOR'] },
  { href: '/admin/users', label: 'کاربران', icon: Users, key: 'users', roles: ['ADMIN', 'MODERATOR'], disabled: true },
  { href: '/admin/reports', label: 'گزارش‌ها', icon: BarChart3, key: 'reports', roles: ['ADMIN', 'MODERATOR', 'VIEWER'], disabled: true },
  { href: '/admin/settings', label: 'تنظیمات', icon: Settings, key: 'settings', roles: ['ADMIN'], disabled: true },
];

export default function AdminSidebar({ user, children, currentPage, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isActive = (key: string, href: string) => currentPage === key || pathname?.startsWith(href);
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));
  const initials = user.name?.slice(0, 1) || user.email.slice(0, 1);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col ${
          desktopSidebarOpen ? 'md:w-64' : 'md:w-20'
        } border-l border-slate-200 bg-white text-slate-950 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white`}
      >
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <button
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle sidebar"
          >
            {desktopSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {desktopSidebarOpen && (
            <div className="text-right">
              <h1 className="text-lg font-bold text-slate-950 dark:text-white">پیشرو</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">پنل مدیریت</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.key, item.href);
              const content = (
                <>
                  {desktopSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  <Icon className="h-5 w-5" />
                </>
              );

              if (item.disabled) {
                return (
                  <div
                    key={item.key}
                    className="flex cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-3 text-slate-400 dark:text-slate-600"
                    title="به‌زودی"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition',
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  )}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
          {desktopSidebarOpen && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            {desktopSidebarOpen && <span className="text-sm font-medium">خروج</span>}
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 md:hidden bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 text-white transition-transform duration-300 transform z-50 md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Logo/Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-gray-700 rounded transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            پیشرو
          </h1>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.key}
                    className="flex cursor-not-allowed items-center justify-end gap-3 rounded-lg px-4 py-3 text-gray-500"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <Icon className="h-5 w-5" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-end gap-3 rounded-lg px-4 py-3 transition duration-200 ${
                    isActive(item.key, item.href)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile User Section */}
        <div className="border-t border-gray-700/50 p-4 space-y-3">
          <div className="px-2 py-2">
            <p className="text-xs text-gray-400">کاربر فعلی</p>
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-end gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-600/20 transition text-red-400 hover:text-red-300"
          >
            <span className="text-sm font-medium">خروج</span>
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">پیشرو</h1>
          <div className="w-10" />
        </header>

        {/* Scrollable Content */}
        <div className="w-full flex-1 overflow-auto">
          <div className="min-h-full w-full p-3 sm:p-4 lg:p-5 xl:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
