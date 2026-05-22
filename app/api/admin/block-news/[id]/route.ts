/**
 * DELETE /api/admin/block-news/[id] - Delete a news article
 */

import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from '@/lib/api-response';
import { getAdminAuth } from '@/lib/auth-simple';
import { deleteNews } from '@/lib/services/block-news-service';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[DELETE /admin/block-news/:id] Request start');

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

    const { id } = await params;
    console.log('[DELETE /admin/block-news/:id] Deleting news ID:', id);

    await deleteNews(id);

    return successResponse(
      { id },
      'خبر با موفقیت حذف شد'
    );
  } catch (error: unknown) {
    console.error('[DELETE /admin/block-news/:id] Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('یافت نشد') || error.message.includes('not found')) {
        return errorResponse(
          'خبر مورد نظر یافت نشد',
          ErrorCodes.NOT_FOUND,
          undefined,
          HttpStatus.NOT_FOUND
        );
      }
      
      return errorResponse(
        error.message || 'خطا در حذف خبر',
        ErrorCodes.INTERNAL_ERROR,
        undefined,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return errorResponse(
      'خطا در حذف خبر',
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
