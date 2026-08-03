import { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  errorResponse,
  paginatedResponse,
  ErrorCodes,
} from "@/lib/api-response";

const prisma = new PrismaClient();

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

    const where: Prisma.NewsArticleWhereInput = {
      published: true, // Only show published articles
    };

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
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
