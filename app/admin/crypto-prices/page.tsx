'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import CryptoPricesPage from '@/components/crypto/CryptoPricesPage';
import { AdminLoadingState } from '@/components/admin/AdminPageShell';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function AdminCryptoPricesPage() {
  const { user, isLoading, logout } = useAdminAuth();

  if (isLoading) {
    return <AdminLoadingState label="در حال آماده‌سازی بازار رمزارزها..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminSidebar user={user} currentPage="crypto-prices" onLogout={logout}>
      <div className="overflow-hidden rounded-3xl">
        <CryptoPricesPage admin />
      </div>
    </AdminSidebar>
  );
}
