/**
 * PATCH /api/admin/block-news/[id]/blocks/reorder - Reorder content blocks
 */

import {
  successResponse,
  errorResponse,
  validationError
} from '@/lib/api-response';
import { reorderBlocks } from '@/lib/services/block-news-service';
import { ReorderBlocksSchema } from '@/lib/schemas/block-news-schema';
import type { ReorderBlocksRequest } from '@/lib/types/block-news';
import { auth } from '@/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as ReorderBlocksRequest;

    // Validate input
    const validated = ReorderBlocksSchema.parse(body.blocks);

    const blocks = await reorderBlocks(id, validated);
    return successResponse(blocks, 'ترتیب بلاک‌ها با موفقیت تغییر یافت');
  } catch (error: unknown) {
    console.error('Error reordering blocks:', error);

    if (error instanceof Error) {
      if (error.message.includes('یافت نشد')) {
        return errorResponse(error.message, 'NOT_FOUND');
      }
      if (error.message.includes('ترتیب') || error.message.includes('تعداد')) {
        return validationError({ blocks: error.message });
      }
    }

    return errorResponse('خطا در تغییر ترتیب بلاک‌ها');
  }
}
