import { NextRequest } from 'next/server';
import { getNewsBySlug } from '@/lib/services/news-mysql';
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getNewsBySlug(slug);
    if (!article) {
      return errorResponse('خبر پیدا نشد', ErrorCodes.NOT_FOUND, undefined, 404);
    }

    return successResponse(article, 'خبر با موفقیت بارگذاری شد');
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return errorResponse(
      'خطا در دریافت جزئیات خبر',
      ErrorCodes.DATABASE_ERROR
    );
  }
}
