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
    return null;
  }

  return (
    <AdminSidebar user={user} onLogout={logout}>
      {children}
    </AdminSidebar>
  );
}
