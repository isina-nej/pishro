import {
  successResponse,
  errorResponse,
  validationError,
  ErrorCodes,
  HttpStatus,
} from '@/lib/api-response';
import { getAdminAuth } from '@/lib/auth-simple';
import { publishNews, archiveNews } from '@/lib/services/block-news-service';

type ChangeNewsStatusBody = {
  status: 'PUBLISHED' | 'ARCHIVED';
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        'ورود به سیستم الزامی است',
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (adminAuth.role !== 'ADMIN') {
      return errorResponse(
        'دسترسی منحصر به مدیران است',
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const body = (await req.json()) as ChangeNewsStatusBody;
    if (!body || !body.status) {
      return validationError({ status: 'وضعیت خبر باید مشخص شود' });
    }

    const status = body.status;
    const { id } = await params;
    let updatedNews;

    if (status === 'PUBLISHED') {
      updatedNews = await publishNews(id);
    } else if (status === 'ARCHIVED') {
      updatedNews = await archiveNews(id);
    } else {
      return validationError({ status: 'وضعیت نامعتبر است' });
    }

    const message =
      status === 'PUBLISHED'
        ? 'خبر با موفقیت منتشر شد'
        : 'خبر با موفقیت آرشیو شد';

    return successResponse(updatedNews, message);
  } catch (error: unknown) {
    console.error('[PATCH /admin/block-news/:id/status] Error:', error);
    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(
        'خبر مورد نظر یافت نشد',
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }
    return errorResponse('خطا در تغییر وضعیت خبر');
  }
}
