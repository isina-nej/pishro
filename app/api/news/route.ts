import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
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
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.NewsArticleWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    // Only show published articles by default
    if (published === "false") {
      where.published = false;
    } else if (published === "true" || published === null) {
      where.published = true;
    }

    // Fetch articles
    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          author: true,
          category: true,
          tags: true,
          published: true,
          publishedAt: true,
          views: true,
          createdAt: true,
          _count: {
            select: { comments: true },
          },
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return paginatedResponse(articles, page, limit, total);
  } catch (error) {
    console.error("Error fetching news:", error);
    return errorResponse(
      "خطایی در دریافت اخبار رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      published,
      publishedAt,
    } = body;

    // Validation
    if (!title || !slug || !excerpt || !content || !category) {
      return errorResponse(
        "فیلدهای الزامی را پر کنید",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Check if slug already exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return errorResponse(
        "این slug قبلاً استفاده شده است",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Create article
    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags: tags || [],
        published: published || false,
        publishedAt: published ? publishedAt || new Date() : null,
      },
    });

    return successResponse(article, "مقاله با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating news article:", error);
    return errorResponse(
      "خطایی در ایجاد مقاله رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
