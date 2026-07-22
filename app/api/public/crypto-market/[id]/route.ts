import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import { getCryptoAssetDetail } from '@/lib/services/crypto-asset-detail-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || id.length > 100) return errorResponse('شناسه ارز نامعتبر است', 'INVALID_INPUT', undefined, 400);
    const data = await getCryptoAssetDetail(id);
    const response = successResponse(data);
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('[crypto] Asset detail API failed:', error);
    return errorResponse('تحلیل این ارز در دسترس نیست', 'EXTERNAL_SERVICE_ERROR', undefined, 503);
  }
}
