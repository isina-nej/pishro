/**
 * Admin Login Page
 * Route: /admin/login
 * Displays admin login form with centered layout and dark mode support
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      // Redirect to dashboard if already logged in
      router.push('/admin/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-8">
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
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            For security reasons, this is a restricted admin area.
          </p>
        </div>
      </div>
    </div>
  );
}
