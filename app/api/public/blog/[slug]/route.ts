/**
 * GET /api/public/blog/[slug] - Get single published blog post
 */

import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.newsArticle.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        author: true,
        category: true,
        published: true,
        publishedAt: true,
        views: true,
        likes: true,
        createdAt: true,
      }
    });

    if (!post) {
      return errorResponse('این مقاله پیدا نشد', 'NOT_FOUND');
    }

    // Only serve published posts
    if (!post.published && !post.publishedAt) {
      return errorResponse('این مقاله هنوز منتشر نشده است', 'NOT_FOUND');
    }

    // Increment view count
    await prisma.newsArticle.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return successResponse(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return errorResponse('خطا در بارگیری مقاله');
  }
}
