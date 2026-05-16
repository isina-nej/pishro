/**
 * GET /api/admin/block-news/[id] - Get single news article
 * PATCH /api/admin/block-news/[id] - Update news article metadata
 * DELETE /api/admin/block-news/[id] - Delete news article
 */

import {
  successResponse,
  errorResponse,
  validationError
} from '@/lib/api-response';
import {
  getNews,
  updateNewsMetadata,
  deleteNews
} from '@/lib/services/block-news-service';
import { UpdateNewsSchema } from '@/lib/schemas/block-news-schema';
import { getAdminAuth } from "@/lib/auth-simple";
import type { UpdateNewsRequest } from '@/lib/types/block-news';
import { getAdminAuth } from "@/lib/auth-simple";
import { auth } from '@/auth';
import { getAdminAuth } from "@/lib/auth-simple";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminAuth = await getAdminAuth(req);
    if (!session?.user) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const news = await getNews(id);
    return successResponse(news);
  } catch (error: unknown) {
    console.error('Error fetching news:', error);
    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }
    return errorResponse('خطا در بارگیری خبر');
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminAuth = await getAdminAuth(req);
    if (!session?.user) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as UpdateNewsRequest;

    // Validate input
    const validated = UpdateNewsSchema.parse(body);

    const news = await updateNewsMetadata(id, validated);
    return successResponse(news, 'خبر با موفقیت به‌روز شد');
  } catch (error: unknown) {
    console.error('Error updating news:', error);

    if (error instanceof Error) {
      if (error.message.includes('یافت نشد')) {
        return errorResponse(error.message, 'NOT_FOUND');
      }
      if (error.message.includes('آدرس')) {
        return validationError({ slug: error.message });
      }
    }

    return errorResponse('خطا در به‌روز کردن خبر');
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminAuth = await getAdminAuth(req);
    if (!session?.user) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const result = await deleteNews(id);
    return successResponse(result);
  } catch (error: unknown) {
    console.error('Error deleting news:', error);
    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }
    return errorResponse('خطا در حذف خبر');
  }
}
