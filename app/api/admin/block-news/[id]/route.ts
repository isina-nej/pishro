/**
 * GET /api/admin/block-news/[id] - Fetch a single news article
 * PATCH /api/admin/block-news/[id] - Update a news article metadata
 * DELETE /api/admin/block-news/[id] - Delete a news article
 */

import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from '@/lib/api-response';
import { getAdminAuth } from '@/lib/auth-simple';
import { deleteNews, getNews, updateNewsMetadata } from '@/lib/services/block-news-service';
import type { UpdateNewsRequest } from '@/lib/types/block-news';

export async function GET(
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

    const { id } = await params;
    const news = await getNews(id);
    
    return successResponse(news, 'خبر با موفقیت بارگذاری شد');
  } catch (error: unknown) {
    console.error('[GET /admin/block-news/:id] Error:', error);
    
    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(
        'خبر مورد نظر یافت نشد',
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }

    return errorResponse(
      'خطا در بارگیری خبر',
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

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

    const { id } = await params;
    const body = (await req.json()) as UpdateNewsRequest;

    const news = await updateNewsMetadata(id, body);

    return successResponse(news, 'خبر با موفقیت به‌روزرسانی شد');
  } catch (error: unknown) {
    console.error('[PATCH /admin/block-news/:id] Error:', error);
    
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
        error.message || 'خطا در به‌روزرسانی خبر',
        ErrorCodes.INTERNAL_ERROR,
        undefined,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return errorResponse(
      'خطا در به‌روزرسانی خبر',
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export async function DELETE(
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

    const { id } = await params;

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
