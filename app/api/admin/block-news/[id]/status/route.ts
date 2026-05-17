/**
 * PATCH /api/admin/block-news/[id]/status - Change news status (publish/archive)
 */
import { getAdminAuth } from "@/lib/auth-simple";

import {
  successResponse,
  errorResponse,
  validationError
} from '@/lib/api-response';
import {
  publishNews,
  archiveNews
} from '@/lib/services/block-news-service';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (adminAuth.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as { status: 'PUBLISHED' | 'ARCHIVED' };

    if (!body.status || !['PUBLISHED', 'ARCHIVED'].includes(body.status)) {
      return validationError({
        status: 'وضعیت باید PUBLISHED یا ARCHIVED باشد'
      });
    }

    let news;
    if (body.status === 'PUBLISHED') {
      news = await publishNews(id);
    } else {
      news = await archiveNews(id);
    }

    return successResponse(news, 'وضعیت خبر با موفقیت تغییر یافت');
  } catch (error: unknown) {
    console.error('Error changing news status:', error);

    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }

    return errorResponse('خطا در تغییر وضعیت خبر');
  }
}
