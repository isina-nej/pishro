import type { Metadata } from 'next';
import CryptoPricesPage from '@/components/crypto/CryptoPricesPage';
import {
  ensureCryptoMarketWarmer,
  getCryptoMarketData,
} from '@/lib/services/crypto-market-service';
import type { CryptoMarketResponse } from '@/types/crypto-market';

export const metadata: Metadata = {
  title: 'قیمت لحظه‌ای ارزهای دیجیتال | پیشرو',
  description: 'مشاهده قیمت، نوسان و اطلاعات بازار ارزهای دیجیتال در پیشرو',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicCryptoPricesPage() {
  ensureCryptoMarketWarmer();
  let initialData: CryptoMarketResponse | null = null;
  try {
    initialData = await getCryptoMarketData({ limit: 20, page: 1 });
  } catch (error) {
    console.warn(
      '[crypto] SSR market preload failed:',
      error instanceof Error ? error.message : error
    );
  }

  return <CryptoPricesPage initialData={initialData} />;
}
