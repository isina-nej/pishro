import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalNews, featured, thisMonth, viewsAggregate, categoriesRaw, dbCategories] =
      await Promise.all([
        prisma.newsArticle.count({
          where: {
            published: true,
            OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
          },
        }),
        prisma.newsArticle.count({
          where: {
            published: true,
            featured: true,
            OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
          },
        }),
        prisma.newsArticle.count({
          where: {
            published: true,
            publishedAt: { gte: startOfMonth, lte: now },
          },
        }),
        prisma.newsArticle.aggregate({
          where: {
            published: true,
            OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
          },
          _avg: { views: true },
        }),
        prisma.newsArticle.findMany({
          where: { published: true },
          select: { category: true },
          distinct: ["category"],
        }),
        prisma.category.findMany({
          select: { title: true },
        }),
      ]);

    const categorySet = new Set<string>();
    categorySet.add("همه");
    categoriesRaw.forEach((c) => {
      if (c.category && c.category.trim()) categorySet.add(c.category.trim());
    });
    dbCategories.forEach((c) => {
      if (c.title && c.title.trim()) categorySet.add(c.title.trim());
    });

    return successResponse({
      totalNews,
      featured,
      thisMonth,
      avgViews: Math.round(viewsAggregate._avg.views || 0),
      categories: Array.from(categorySet),
    });
  } catch (error) {
    console.error("Error fetching news stats:", error);
    return errorResponse(
      "خطایی در دریافت آمار اخبار رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
