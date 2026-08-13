import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import {
  ensureCryptoMarketWarmer,
  getCryptoMarketData,
  parseCryptoMarketQuery,
} from '@/lib/services/crypto-market-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureCryptoMarketWarmer();
    const data = await getCryptoMarketData(
      parseCryptoMarketQuery(request.nextUrl.searchParams)
    );
    const response = successResponse(data);
    // Clients read our cache; foreign APIs are only hit by the server warmer.
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=120'
    );
    return response;
  } catch (error) {
    console.error('[crypto] Market API failed:', error);
    return errorResponse(
      'اطلاعات بازار رمزارزها در دسترس نیست',
      'EXTERNAL_SERVICE_ERROR',
      undefined,
      503
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: 'GET, OPTIONS' } });
}
