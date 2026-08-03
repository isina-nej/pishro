import { NextRequest } from 'next/server';
import { getNewsBySlug } from '@/lib/services/news-mysql';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from '@/lib/api-response';
import { getAdminAuth } from '@/lib/auth-simple';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * GET /api/news/[slug]
 * دریافت خبر منتشرشده بر اساس slug (عمومی)
 *
 * جستجوی جایگزین بر اساس شناسه (ID) عمداً حذف شده است: آن مسیر فیلتر
 * `published` را دور می‌زد و پیش‌نویس‌ها و خبرهای زمان‌بندی‌شده را برای
 * هر کاربر ناشناسی که شناسه خبر را داشت قابل خواندن می‌کرد.
 * پنل ادمین باید از `GET /api/admin/block-news/[id]` استفاده کند.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await getNewsBySlug(slug);

    if (!article) {
      return errorResponse('خبر پیدا نشد', ErrorCodes.NOT_FOUND, undefined, 404);
    }

    return successResponse(article, 'خبر با موفقیت بارگذاری شد');
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return errorResponse(
      'خطا در دریافت جزئیات خبر',
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * PUT /api/news/[slug]
 * به‌روزرسانی خبر (پنل ادمین، با شناسه خبر)
 *
 * این مسیر زیرمجموعه `/api/admin/*` نیست، بنابراین `middleware.ts` آن را
 * محافظت نمی‌کند و احراز هویت باید صریحاً در خود هندلر انجام شود.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(request);
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

    const { slug } = await params;
    const body = await request.json();
    const { title, description, content, thumbnail, categoryId, author } = body;

    if (!title || title.trim().length === 0) {
      return errorResponse('عنوان الزامی است', ErrorCodes.VALIDATION_ERROR, undefined, 400);
    }

    // The slug param is actually the article ID when called from admin panel
    const article = await prisma.newsArticle.update({
      where: { id: slug },
      data: {
        title,
        excerpt: description,
        content,
        coverImage: thumbnail,
        categoryId,
        author,
        updatedAt: new Date(),
      },
    });

    return successResponse(article, 'خبر با موفقیت به‌روزرسانی شد');
  } catch (error: unknown) {
    console.error('Error updating article:', error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return errorResponse('خبر پیدا نشد', ErrorCodes.NOT_FOUND, undefined, 404);
    }
    return errorResponse(
      'خطا در به‌روزرسانی خبر',
      ErrorCodes.DATABASE_ERROR,
      undefined,
      500
    );
  }
}
