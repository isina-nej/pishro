/**
 * GET /api/admin/block-news/[id]/blocks - List all blocks for a news article
 * POST /api/admin/block-news/[id]/blocks - Add new content block to news article
 */

import {
  successResponse,
  errorResponse,
  validationError,
  createdResponse
} from '@/lib/api-response';
import {
  getNews,
  addContentBlock
} from '@/lib/services/block-news-service';
import { BlockInputSchema } from '@/lib/schemas/block-news-schema';
import type { ContentBlockCreateRequest } from '@/lib/types/block-news';
import { auth } from '@/auth';

export async function GET(
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

    const news = await getNews(id);
    return successResponse(news.contentBlocks);
  } catch (error: unknown) {
    console.error('Error fetching blocks:', error);
    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }
    return errorResponse('خطا در بارگیری بلاک‌ها');
  }
}

export async function POST(
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

    const body = (await req.json()) as ContentBlockCreateRequest;

    // Validate input
    const validated = BlockInputSchema.parse(body);

    const block = await addContentBlock(id, validated);
    return createdResponse(block, 'بلاک با موفقیت اضافه شد');
  } catch (error: unknown) {
    console.error('Error adding block:', error);

    if (error instanceof Error && error.message.includes('یافت نشد')) {
      return errorResponse(error.message, 'NOT_FOUND');
    }

    return errorResponse('خطا در افزودن بلاک');
  }
}
