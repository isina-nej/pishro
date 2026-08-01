'use client';

import CryptoPricesPage from '@/components/crypto/CryptoPricesPage';
import { AdminLoadingState } from '@/components/admin/AdminPageShell';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function AdminCryptoPricesPage() {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return <AdminLoadingState label="در حال آماده‌سازی بازار رمزارزها..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-3xl">
      <CryptoPricesPage admin />
    </div>
  );
}
