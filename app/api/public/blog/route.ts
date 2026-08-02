/**
 * GET /api/public/blog - Get all published blog posts
 */

import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const whereClause: Prisma.NewsArticleWhereInput = {
      published: true,
      publishedAt: {
        not: null,
        lte: new Date() // Only posts that are already published (not scheduled for future)
      }
    };

    if (search) {
      // No `mode: 'insensitive'` here - Prisma only supports it on PostgreSQL
      // and MongoDB. This schema is MySQL, whose default collation already
      // compares strings case-insensitively.
      whereClause.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { author: { contains: search } },
        { content: { contains: search } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          coverImage: true,
          author: true,
          category: true,
          publishedAt: true,
          createdAt: true,
          views: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip
      }),
      prisma.newsArticle.count({ where: whereClause })
    ]);

    return successResponse({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return errorResponse('خطا در بارگیری مقالات');
  }
}
