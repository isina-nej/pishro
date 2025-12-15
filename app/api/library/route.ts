import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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
    const format = searchParams.get("format");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const isFeatured = searchParams.get("featured");

    // Build where clause
    const where: Prisma.DigitalBookWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (format) {
      where.formats = { has: format };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { publisher: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isFeatured === "true") {
      where.isFeatured = true;
    }

    // Build orderBy clause
    let orderBy: Prisma.DigitalBookOrderByWithRelationInput = {};
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "downloads":
        orderBy = { downloads: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Fetch books
    const [books, total] = await Promise.all([
      prisma.digitalBook.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.digitalBook.count({ where }),
    ]);

    return paginatedResponse(books, page, limit, total);
  } catch (error) {
    console.error("Error fetching books:", error);
    return errorResponse(
      "خطایی در دریافت کتاب‌ها رخ داد",
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
      author,
      description,
      cover,
      publisher,
      year,
      pages,
      isbn,
      language,
      category,
      formats,
      status,
      tags,
      readingTime,
      isFeatured,
      price,
      fileUrl,
      audioUrl,
    } = body;

    // Validation
    if (!title || !slug || !author || !description || !category || !year) {
      return errorResponse(
        "فیلدهای الزامی را پر کنید",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Check if slug already exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { slug },
    });

    if (existingBook) {
      return errorResponse(
        "این slug قبلاً استفاده شده است",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Create book
    const book = await prisma.digitalBook.create({
      data: {
        title,
        slug,
        author,
        description,
        cover,
        publisher,
        year,
        pages,
        isbn,
        language: language || "فارسی",
        category,
        formats: formats || [],
        status: status || [],
        tags: tags || [],
        readingTime,
        isFeatured: isFeatured || false,
        price,
        fileUrl,
        audioUrl,
      },
    });

    return successResponse(book, "کتاب با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating book:", error);
    return errorResponse(
      "خطایی در ایجاد کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
