/**
 * Admin Digital Book Management API (Single Book)
 * GET /api/admin/books/[id] - Get book by ID
 * PATCH /api/admin/books/[id] - Update book
 * DELETE /api/admin/books/[id] - Delete book
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    const book = await prisma.digitalBook.findUnique({
      where: { id },
      include: {
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    if (!book) {
      return notFoundResponse("Book", "Book not found");
    }

    return successResponse(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return errorResponse(
      "Error fetching book",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;
    const body = await req.json();

    // Check if book exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return notFoundResponse("Book", "Book not found");
    }

    // If slug is being updated, check uniqueness
    if (body.slug && body.slug !== existingBook.slug) {
      const slugExists = await prisma.digitalBook.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return errorResponse(
          "Book with this slug already exists",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.cover !== undefined) {
      // Normalize cover URL (extract original URL from Next.js optimization URLs)
      updateData.cover = normalizeImageUrl(body.cover);
    }
    if (body.publisher !== undefined) updateData.publisher = body.publisher;
    if (body.year !== undefined) updateData.year = body.year;
    if (body.pages !== undefined) updateData.pages = body.pages;
    if (body.isbn !== undefined) updateData.isbn = body.isbn;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.votes !== undefined) updateData.votes = body.votes;
    if (body.views !== undefined) updateData.views = body.views;
    if (body.downloads !== undefined) updateData.downloads = body.downloads;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.formats !== undefined) updateData.formats = body.formats;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.tagIds !== undefined) updateData.tagIds = body.tagIds;
    if (body.readingTime !== undefined) updateData.readingTime = body.readingTime;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl;
    if (body.audioUrl !== undefined) updateData.audioUrl = body.audioUrl;

    const updatedBook = await prisma.digitalBook.update({
      where: { id },
      data: updateData,
      include: {
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return successResponse(updatedBook, "Book updated successfully");
  } catch (error) {
    console.error("Error updating book:", error);
    return errorResponse(
      "Error updating book",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    // Check if book exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return notFoundResponse("Book", "Book not found");
    }

    // Delete book
    await prisma.digitalBook.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting book:", error);
    return errorResponse(
      "Error deleting book",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
