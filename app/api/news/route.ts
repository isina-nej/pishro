import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  ErrorCodes,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const skip = (page - 1) * limit;

    // Filter parameters
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || "جدیدترین";
    const timeRange = searchParams.get("timeRange") || undefined;

    const andConditions: Prisma.NewsArticleWhereInput[] = [
      { published: true },
    ];

    const now = new Date();

    if (timeRange && timeRange !== "همه") {
      let diffDays = 30;
      if (timeRange === "امروز") diffDays = 1;
      else if (timeRange === "هفته") diffDays = 7;
      else if (timeRange === "ماه") diffDays = 30;
      else if (timeRange === "سال") diffDays = 365;

      const cutoff = new Date(now.getTime() - diffDays * 24 * 60 * 60 * 1000);
      andConditions.push({
        publishedAt: {
          gte: cutoff,
          lte: now,
        },
      });
    } else {
      andConditions.push({
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: now } },
        ],
      });
    }

    if (category && category !== "همه") {
      andConditions.push({
        OR: [
          { category: category },
          { categoryId: category },
          { relatedCategory: { title: category } },
        ],
      });
    }

    if (search && search.trim()) {
      const term = search.trim();
      andConditions.push({
        OR: [
          { title: { contains: term } },
          { excerpt: { contains: term } },
          { author: { contains: term } },
        ],
      });
    }

    const where: Prisma.NewsArticleWhereInput = {
      AND: andConditions,
    };

    let orderBy: Prisma.NewsArticleOrderByWithRelationInput[] = [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ];

    if (sort === "پربازدیدترین" || sort === "views") {
      orderBy = [{ views: "desc" }, { publishedAt: "desc" }];
    } else if (sort === "محبوب‌ترین" || sort === "likes") {
      orderBy = [{ likes: "desc" }, { publishedAt: "desc" }];
    }

    const [items, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          relatedCategory: { select: { id: true, title: true } },
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching news:", error);
    return errorResponse(
      "خطایی در دریافت اخبار رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
