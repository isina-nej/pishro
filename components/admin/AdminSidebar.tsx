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

export default function AdminSidebar({ user, children, currentPage }: AdminSidebarProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const isActive = (path: string) => currentPage === path;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 flex flex-col border-r border-gray-700`}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">پیشرو</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                isActive('dashboard')
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">📊</span>
              {sidebarOpen && <span>Dashboard</span>}
            </Link>

            {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
              <>
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition"
                >
                  <span className="text-lg">👥</span>
                  {sidebarOpen && <span>Users</span>}
                </a>
                <a
                  href="/admin/block-news"
                  className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                    isActive('block-news')
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">📝</span>
                  {sidebarOpen && <span>اخبار</span>}
                </a>
                <Link
                  href="/admin/courses"
                  className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                    isActive('courses')
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🎓</span>
                  {sidebarOpen && <span>دوره‌ها</span>}
                </Link>
              </>
            )}

            {user.role === 'ADMIN' && (
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition"
              >
                <span className="text-lg">⚙️</span>
                {sidebarOpen && <span>Settings</span>}
              </a>
            )}

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition"
            >
              <span className="text-lg">📈</span>
              {sidebarOpen && <span>Reports</span>}
            </a>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-gray-700 transition text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-end px-6">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
