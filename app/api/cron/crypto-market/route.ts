import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import {
  ensureCryptoMarketWarmer,
  getCryptoMarketData,
} from '@/lib/services/crypto-market-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Background refresh endpoint for VPS crontab / external ping.
 * Example: * * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" https://site/api/cron/crypto-market
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const queryToken = request.nextUrl.searchParams.get('token') || '';
    if (token !== secret && queryToken !== secret) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', undefined, 401);
    }
  }

  try {
    ensureCryptoMarketWarmer();
    const data = await getCryptoMarketData({
      limit: 100,
      page: 1,
      forceRefresh: true,
    });
    return successResponse({
      ok: true,
      generatedAt: data.generatedAt,
      assets: data.assets.length,
      providers: data.providers,
    });
  } catch (error) {
    console.error('[crypto] Cron refresh failed:', error);
    return errorResponse(
      'به‌روزرسانی بازار ناموفق بود',
      'EXTERNAL_SERVICE_ERROR',
      undefined,
      503
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: 'GET, OPTIONS' },
  });
}
