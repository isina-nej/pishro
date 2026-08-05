/**
 * GET /api/admin/block-news - List all block-based news articles (paginated)
 * POST /api/admin/block-news - Create new block-based news article
 */

import {
  paginatedResponse,
  createdResponse,
  validationError,
  errorResponse
} from '@/lib/api-response';
import {
  getNewsList,
  createNews
} from '@/lib/services/block-news-service';
import { CreateNewsSchema } from '@/lib/schemas/block-news-schema';
import { getAdminAuth } from "@/lib/auth-simple";
import type { CreateNewsRequest } from '@/lib/types/block-news';

export async function GET(req: Request) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (adminAuth.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const status = url.searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null;
    const categoryId = url.searchParams.get('categoryId');
    const search = url.searchParams.get('search');

    // Validate pagination
    if (page < 1 || limit < 1) {
      return validationError({
        page: 'صفحه و تعداد باید بزرگتر از 0 باشند'
      });
    }

    const result = await getNewsList(page, limit, {
      status: status || undefined,
      categoryId: categoryId || undefined,
      search: search || undefined
    });

    return paginatedResponse(
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  } catch (error) {
    console.error('Error fetching news list:', error);
    return errorResponse('خطا در بارگیری لیست خبرها');
  }
}

export async function POST(req: Request) {
  try {
    const adminAuth = await getAdminAuth(req);

    if (!adminAuth) {
      return errorResponse('ورود به سیستم الزامی است');
    }

    if (adminAuth.role !== 'ADMIN') {
      return errorResponse('دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as CreateNewsRequest;

    // Validate input
    const validated = CreateNewsSchema.parse({
      ...body,
      authorId: adminAuth.id
    });

    const news = await createNews(validated);

    const response = createdResponse(news, 'خبر با موفقیت ایجاد شد');
    return response;
  } catch (error: unknown) {
    console.error('[POST /admin/block-news] ===== ERROR =====');
    console.error('[POST /admin/block-news] Unexpected error:', error);
    
    if (error instanceof Error) {
      console.error('[POST /admin/block-news] Error message:', error.message);
      console.error('[POST /admin/block-news] Error stack:', error.stack);
      
      if (error.message.includes('آدرس')) {
        return validationError({ slug: error.message });
      }
    }

    console.error('[POST /admin/block-news] ===== ERROR END =====');
    return errorResponse('خطا در ایجاد خبر');
  }
}
