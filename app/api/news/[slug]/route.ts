import { NextRequest } from 'next/server';
import { getNewsBySlug } from '@/lib/services/news-mysql';
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Try to find by slug first
    let article = await getNewsBySlug(slug);
    
    // If not found, try to find by ID (for admin panel)
    if (!article) {
      article = await prisma.newsArticle.findUnique({
        where: { id: slug },
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          coverImage: true,
          categoryId: true,
          slug: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }
    
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
 * Update a news article (for admin panel using ID)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, description, content, thumbnail, categoryId } = body;

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
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        categoryId: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(article, 'خبر با موفقیت به‌روزرسانی شد');
  } catch (error: any) {
    console.error('Error updating article:', error);
    if (error.code === 'P2025') {
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
