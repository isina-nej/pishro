/**
 * GET /api/admin/block-news - List all block-based news articles (paginated)
 * POST /api/admin/block-news - Create new block-based news article
 */

import { auth } from '@/auth';
import {
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  paginatedResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';
import {
  getNewsList,
  createNews,
} from '@/lib/services/block-news-service';
import { CreateNewsSchema } from '@/lib/schemas/block-news-schema';
import type { NewsListResponse, CreateNewsRequest, NewsDetailResponse } from '@/lib/types/block-news';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse('دسترسی منحصر به مدیران است');
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
        page: 'صفحه و تعداد باید بزرگتر از 0 باشند',
      });
    }

    const result = await getNewsList(page, limit, {
      status: status || undefined,
      categoryId: categoryId || undefined,
      search: search || undefined,
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
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse('ورود به سیستم الزامی است');
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse('دسترسی منحصر به مدیران است');
    }

    const body = (await req.json()) as CreateNewsRequest;

    // Validate input
    const validated = CreateNewsSchema.parse({
      ...body,
      authorId: session.user.id,
    });

    const news = await createNews(validated);

    return createdResponse(news, 'خبر با موفقیت ایجاد شد');
  } catch (error: unknown) {
    console.error('Error creating news:', error);

    if (error instanceof Error) {
      if (error.message.includes('آدرس')) {
        return validationError({ slug: error.message });
      }
    }

    return errorResponse('خطا در ایجاد خبر');
  }
}
