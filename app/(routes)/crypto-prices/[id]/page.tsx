import type { Metadata } from 'next';
import CryptoAssetAnalysisPage from '@/components/crypto/CryptoAssetAnalysisPage';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `تحلیل ${id} | بازار رمزارز پیشرو`,
    description: `قیمت، نمودار و شاخص‌های تحلیلی رمزارز ${id}`,
  };
}

export default async function CryptoAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CryptoAssetAnalysisPage id={id} />;
}
