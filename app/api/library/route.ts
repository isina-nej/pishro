import { NextRequest } from "next/server";
import { getBooks, getBookBySlug, createBook as createBookDb } from "@/lib/services/library-mysql";
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

    // Filter parameters
    const category = searchParams.get("category") || undefined;
    const format = searchParams.get("format") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = (searchParams.get("sort") || "newest") as
      | "newest"
      | "oldest"
      | "rating"
      | "popular"
      | "downloads";
    const isFeatured = searchParams.get("featured") === "true";

    const result = await getBooks({
      page,
      limit,
      category,
      format,
      search,
      sort,
      featured: isFeatured,
      publicOnly: true, // Only show PUBLISHED books on public API
    });

    return paginatedResponse(
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
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
    const existingBook = await getBookBySlug(slug);

    if (existingBook) {
      return errorResponse(
        "این slug قبلاً استفاده شده است",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Create book
    const book = await createBookDb({
      title,
      slug,
      author,
      description,
      cover,
      publisher,
      year: parseInt(year),
      pages: pages ? parseInt(pages) : undefined,
      isbn,
      language: language || "فارسی",
      category,
      formats: formats || [],
      status: status || [],
      tags: tags || [],
      readingTime,
      isFeatured: isFeatured || false,
      price: price ? parseFloat(price) : undefined,
      fileUrl,
      audioUrl,
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
