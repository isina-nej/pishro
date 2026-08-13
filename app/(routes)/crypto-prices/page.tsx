import type { Metadata } from 'next';
import CryptoPricesPage from '@/components/crypto/CryptoPricesPage';
import { ensureCryptoMarketWarmer } from '@/lib/services/crypto-market-service';

export const metadata: Metadata = {
  title: 'قیمت لحظه‌ای ارزهای دیجیتال | پیشرو',
  description: 'مشاهده قیمت، نوسان و اطلاعات بازار ارزهای دیجیتال در پیشرو',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * شِل صفحه را فوری می‌فرستیم؛ داده بازار فقط سمت کلاینت و تدریجی لود می‌شود
 * تا کاربر پشت لودینگ SSR گیر نکند.
 */
export default function PublicCryptoPricesPage() {
  ensureCryptoMarketWarmer();
  return <CryptoPricesPage />;
}
