/**
 * GET /api/admin/block-news/[id]/blocks/[blockId] - Get single content block
 * PATCH /api/admin/block-news/[id]/blocks/[blockId] - Update content block
 * DELETE /api/admin/block-news/[id]/blocks/[blockId] - Delete content block
 */

import { auth } from '@/auth';
import {
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  errorResponse,
} from '@/lib/api-response';
import {
  updateContentBlock,
  deleteContentBlock,
} from '@/lib/services/block-news-service';
import { BlockInputSchema } from '@/lib/schemas/block-news-schema';
import type { ContentBlockUpdateRequest } from '@/lib/types/block-news';

export async function GET(
  req: Request,
  { params }: { params: { id: string; blockId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse('دسترسی منحصر به مدیران است');
    }

    // TODO: Implement getContentBlock service function
    return errorResponse('درخواست پشتیبانی نمی‌شود');
  } catch (error) {
    console.error('Error fetching block:', error);
    return errorResponse('خطا در بارگیری بلاک');
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; blockId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse('دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as ContentBlockUpdateRequest;

    const block = await updateContentBlock(params.id, params.blockId, body);
    return successResponse(block, 'بلاک با موفقیت به‌روز شد');
  } catch (error: unknown) {
    console.error('Error updating block:', error);

    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }

    return errorResponse('خطا در به‌روز کردن بلاک');
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; blockId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse('دسترسی منحصر به مدیران است');
    }

    const result = await deleteContentBlock(params.id, params.blockId);
    return successResponse(result);
  } catch (error: unknown) {
    console.error('Error deleting block:', error);

    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }

    return errorResponse('خطا در حذف بلاک');
  }
}
