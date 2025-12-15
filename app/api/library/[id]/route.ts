import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const book = await prisma.digitalBook.findUnique({
      where: { id },
    });

    if (!book) {
      return errorResponse("کتاب یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Increment views
    await prisma.digitalBook.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return successResponse(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return errorResponse(
      "خطایی در دریافت کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
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
      status,
      tags,
      readingTime,
      isFeatured,
      price,
      fileUrl,
      audioUrl,
    } = body;

    // Check if book exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return errorResponse("کتاب یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingBook.slug) {
      const slugExists = await prisma.digitalBook.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return errorResponse(
          "این slug قبلاً استفاده شده است",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Update book
    const updatedBook = await prisma.digitalBook.update({
      where: { id },
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
      },
    });

    return successResponse(updatedBook, "کتاب با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating book:", error);
    return errorResponse(
      "خطایی در به‌روزرسانی کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if book exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return errorResponse("کتاب یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Delete book
    await prisma.digitalBook.delete({
      where: { id },
    });

    return successResponse(null, "کتاب با موفقیت حذف شد");
  } catch (error) {
    console.error("Error deleting book:", error);
    return errorResponse(
      "خطایی در حذف کتاب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
