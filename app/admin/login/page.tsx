/**
 * Admin Login Page
 * Route: /admin/login
 * Displays admin login form with centered layout and dark mode support
 */

'use client';

import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 backdrop-blur-xl">
          <AdminLoginForm
            onSuccess={() => {
              // Form handles redirect after successful login
            }}
            onError={(error) => {
              console.error('Login error:', error);
            }}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>For security reasons, this is a restricted admin area.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
