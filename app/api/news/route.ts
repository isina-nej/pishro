import { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  successResponse,
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
    const published = searchParams.get("published");

    let publishedFilter: boolean | undefined;
    if (published === "false") {
      publishedFilter = false;
    } else if (published === "true" || published === null) {
      publishedFilter = true;
    }

    const where: Prisma.NewsArticleWhereInput = {};

    if (publishedFilter !== undefined) {
      where.published = publishedFilter;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
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
        published: published ?? false,
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
