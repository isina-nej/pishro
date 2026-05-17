/**
 * Admin Dashboard
 * Route: /admin/dashboard
 * Main admin panel landing page (stub for Phase 2 features)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastLogin, setLastLogin] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Fetch current user
        const response = await fetch('/api/admin/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('admin_access_token');
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
        
        // Get user info from localStorage
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
          setLastLogin(new Date().toLocaleString());
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          {sidebarOpen && (
            <h1 className="text-xl font-bold">پیشرو</h1>
          )}
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
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              <span className="text-lg">📊</span>
              {sidebarOpen && <span>Dashboard</span>}
            </a>
            
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
                  className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition"
                >
                  <span className="text-lg">📝</span>
                  {sidebarOpen && <span>اخبار</span>}
                </a>
                <a
                  href="/admin/courses"
                  className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition"
                >
                  <span className="text-lg">🎓</span>
                  {sidebarOpen && <span>دوره‌ها</span>}
                </a>
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
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          
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
        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back, {user.name}! 👋
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Last Login</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{lastLogin || 'Just now'}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Your Role</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{user.role}</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white text-sm">{user.email}</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                🚀 <strong>Coming Soon:</strong> More admin features and management tools will be available soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
