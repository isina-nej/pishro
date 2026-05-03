/**
 * Admin Digital Book Management API (Single Book)
 * GET /api/admin/books/[id] - Get book by ID
 * PATCH /api/admin/books/[id] - Update book
 * DELETE /api/admin/books/[id] - Delete book
 */

import { NextRequest } from "next/server";
import { unlink } from "fs/promises";
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
import { getFilePathFromUrl } from "@/lib/upload-config";

/**
 * Helper function to delete a file from the filesystem
 */
async function deleteFileFromDisk(fileUrl: string | null): Promise<void> {
  if (!fileUrl) return;

  try {
    // Get the full file path using the upload config helper
    const filePath = getFilePathFromUrl(fileUrl);
    if (filePath) {
      await unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error deleting file ${fileUrl}:`, err);
    // Continue deletion even if file doesn't exist
  }
}

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
    });

    if (!book) {
      return notFoundResponse("Book", "Book not found");
    }

    // Fetch with relations
    const bookWithRelations = await prisma.digitalBook.findUnique({
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

    return successResponse(bookWithRelations);
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

    // Handle file replacements - delete old files if new ones are provided
    console.log("Checking for file updates...");

    // If PDF file is being replaced
    if (body.fileUrl !== undefined && body.fileUrl !== existingBook.fileUrl) {
      if (existingBook.fileUrl) {
        console.log("Deleting old PDF file...");
        await deleteFileFromDisk(existingBook.fileUrl);
      }
    }

    // If cover image is being replaced
    if (body.cover !== undefined && body.cover !== existingBook.cover) {
      if (existingBook.cover) {
        console.log("Deleting old cover image...");
        await deleteFileFromDisk(existingBook.cover);
      }
    }

    // If audio file is being replaced
    if (body.audioUrl !== undefined && body.audioUrl !== existingBook.audioUrl) {
      if (existingBook.audioUrl) {
        console.log("Deleting old audio file...");
        await deleteFileFromDisk(existingBook.audioUrl);
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

    await prisma.digitalBook.update({
      where: { id },
      data: updateData,
    });

    // Fetch the complete book with relations
    const completeBook = await prisma.digitalBook.findUnique({
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

    return successResponse(completeBook, "Book updated successfully");
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

    // Delete associated files from disk
    console.log("Deleting book files...");
    
    // Delete PDF file
    if (existingBook.fileUrl) {
      await deleteFileFromDisk(existingBook.fileUrl);
    }

    // Delete cover image
    if (existingBook.cover) {
      await deleteFileFromDisk(existingBook.cover);
    }

    // Delete audio file
    if (existingBook.audioUrl) {
      await deleteFileFromDisk(existingBook.audioUrl);
    }

    // Delete book from database
    await prisma.digitalBook.delete({
      where: { id },
    });

    console.log(`Book and all associated files deleted: ${id}`);
    return noContentResponse();
  } catch (error) {
    console.error("Error deleting book:", error);
    return errorResponse(
      "Error deleting book",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
