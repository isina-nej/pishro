import { NextRequest } from "next/server";
import { getBookBySlug, updateBook, deleteBook, getBookById } from "@/lib/services/library-mysql";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to get by ID first, then by slug
    let book = await getBookById(id);
    const foundById = Boolean(book);
    
    if (!book) {
      book = await getBookBySlug(id);
    }

    if (!book) {
      return errorResponse(
        "کتاب یافت نشد",
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }

    if (!foundById && book.bookStatus && book.bookStatus !== "PUBLISHED") {
      return errorResponse(
        "این کتاب در دسترس عموم نیست",
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }

    return successResponse(book, "کتاب با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching book:", error);
    return errorResponse(
      "خطایی در دریافت کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      tags,
      readingTime,
      isFeatured,
      price,
      fileUrl,
      audioUrl,
    } = body;

    // Validation
    if (!title || !author || !category) {
      return errorResponse(
        "فیلدهای الزامی را پر کنید",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    // Update book
    const book = await updateBook(id, {
      title,
      slug: slug || title,
      author,
      description,
      cover,
      publisher,
      year: parseInt(year) || new Date().getFullYear(),
      pages: pages ? parseInt(pages) : undefined,
      isbn,
      language: language || "فارسی",
      category,
      formats: formats || [],
      isFeatured: isFeatured || false,
      price: price ? parseFloat(price) : undefined,
      fileUrl,
      audioUrl,
      tags: tags || [],
      readingTime,
    });

    return successResponse(book, "کتاب با موفقیت ویرایش شد");
  } catch (error) {
    console.error("Error updating book:", error);
    return errorResponse(
      "خطایی در ویرایش کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete book
    await deleteBook(id);

    return successResponse(
      null,
      "کتاب با موفقیت حذف شد"
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return errorResponse(
      "خطایی در حذف کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
