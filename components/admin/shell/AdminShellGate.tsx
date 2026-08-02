'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { AdminLoadingState } from '@/components/admin/AdminPageShell';
import AdminSidebar from './AdminSidebar';

const UNSHELLED_ROUTES = ['/admin/login'];

/**
 * Single shared admin shell, rendered once from app/admin/layout.tsx.
 * Replaces the previous pattern where every admin page individually imported
 * and wrapped itself in <AdminSidebar>. Also centralizes the auth
 * loading/redirect gate that every page used to duplicate.
 */
export default function AdminShellGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAdminAuth();

  const isUnshelled = UNSHELLED_ROUTES.some((route) => pathname === route);
  if (isUnshelled) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <AdminLoadingState label="در حال بررسی دسترسی..." />;
  }

  if (!user) {
    // useAdminAuth has already kicked off a redirect to /admin/login by now.
    // Render an explicit escape hatch rather than `null`: a blank shell has no
    // sidebar and therefore no logout button, so anything that stalls the
    // redirect strands the user on an empty black page with no way out.
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950" dir="rtl">
        <a
          href="/admin/login"
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm text-white transition-colors hover:bg-blue-700"
        >
          ورود به پنل مدیریت
        </a>
      </div>
    );
  }

  return (
    <AdminSidebar user={user} onLogout={logout}>
      {children}
    </AdminSidebar>
  );
}
