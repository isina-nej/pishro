/**
 * Admin Login Page
 * Route: /admin/login
 * Displays admin login form with centered layout and dark mode support
 */

'use client';

import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-premium/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl md:p-10">
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
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>این بخش محدود و مخصوص مدیران سامانه است.</p>
        </div>
      </div>
    </div>
  );
}
