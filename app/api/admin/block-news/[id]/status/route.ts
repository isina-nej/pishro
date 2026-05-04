/**
 * PATCH /api/admin/block-news/[id]/status - Change news status (publish/archive)
 */

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
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return 'ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return 'دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as { status: 'PUBLISHED' | 'ARCHIVED' };

    if (!body.status || !['PUBLISHED', 'ARCHIVED'].includes(body.status)) {
      return validationError({
        status: 'وضعیت باید PUBLISHED یا ARCHIVED باشد'
      });
    }

    let news;
    if (body.status === 'PUBLISHED') {
      news = await publishNews(params.id);
    } else {
      news = await archiveNews(params.id);
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
