'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

interface AdminSidebarProps {
  user: AdminUser;
  children: React.ReactNode;
  currentPage?: string;
}

const menuItems = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: '📊', key: 'dashboard', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
  { href: '#', label: 'کاربران', icon: '👥', key: 'users', roles: ['ADMIN', 'MODERATOR'] },
  { href: '/admin/block-news', label: 'اخبار', icon: '📝', key: 'block-news', roles: ['ADMIN', 'MODERATOR'] },
  { href: '/admin/library', label: 'کتابخانه', icon: '📚', key: 'library', roles: ['ADMIN', 'MODERATOR'] },
  { href: '/admin/courses', label: 'دوره‌ها', icon: '🎓', key: 'courses', roles: ['ADMIN', 'MODERATOR'] },
  { href: '#', label: 'گزارش‌ها', icon: '📈', key: 'reports', roles: ['ADMIN', 'MODERATOR', 'VIEWER'] },
  { href: '#', label: 'تنظیمات', icon: '⚙️', key: 'settings', roles: ['ADMIN'] },
];

export default function AdminSidebar({ user, children, currentPage }: AdminSidebarProps) {
  const router = useRouter();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    }
  };

  const isActive = (key: string) => currentPage === key;
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col ${
          desktopSidebarOpen ? 'md:w-64' : 'md:w-20'
        } bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 text-white transition-all duration-300 border-r border-gray-700 shadow-lg`}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          <button
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded transition"
            aria-label="Toggle sidebar"
          >
            {desktopSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {desktopSidebarOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              پیشرو
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center justify-end gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive(item.key)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'hover:bg-gray-700/50 text-gray-200 hover:text-white'
                }`}
              >
                {desktopSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                <span className="text-lg">{item.icon}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-700/50 p-4 space-y-3">
          {desktopSidebarOpen && (
            <div className="px-2 py-2">
              <p className="text-xs text-gray-400">کاربر فعلی</p>
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-end gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-600/20 transition text-red-400 hover:text-red-300"
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
            {visibleMenuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-end gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive(item.key)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'hover:bg-gray-700/50 text-gray-200 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-lg">{item.icon}</span>
              </Link>
            ))}
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
            onClick={handleLogout}
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
        <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 shadow-md">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">پیشرو</h1>
          <div className="w-10" />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto w-full">
          <div className="w-full p-4 md:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
