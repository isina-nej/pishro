import type { Metadata } from 'next';
import CryptoPricesPage from '@/components/crypto/CryptoPricesPage';

export const metadata: Metadata = {
  title: 'قیمت لحظه‌ای ارزهای دیجیتال | پیشرو',
  description: 'مشاهده قیمت، نوسان و اطلاعات بازار ارزهای دیجیتال در پیشرو',
};

export default function PublicCryptoPricesPage() {
  return <CryptoPricesPage />;
}
