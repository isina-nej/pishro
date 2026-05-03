/**
 * Admin Digital Books Management API
 * GET /api/admin/books - List all digital books with pagination and filters
 * POST /api/admin/books - Create a new digital book
 */

import { NextRequest } from "next/server";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    if (!session?.user) {
      return "Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return "Access denied. Admin only.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");

    // Build where clause
    const where: Prisma.DigitalBookWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { publisher: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isFeatured === "true") {
      where.isFeatured = true;
    } else if (isFeatured === "false") {
      where.isFeatured = false;
    }

    // Fetch books
    const [books, total] = await Promise.all([
      prisma.digitalBook.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          relatedTags: {
            select: {
              id: true,
              slug: true,
              title: true
            }
          }
        }
      }),
      prisma.digitalBook.count({ where }),
    ]);

    return paginatedResponse(books, page, limit, total);
  } catch (error) {
    console.error("Error fetching books:", error);
    return errorResponse(
      "Error fetching books",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!session?.user) {
      return "Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return "Access denied. Admin only.");
    }

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
      language = "فارسی",
      rating = 0,
      votes = 0,
      views = 0,
      downloads = 0,
      category,
      formats = [],
      status = [],
      tags = [],
      tagIds = [],
      readingTime,
      isFeatured = false,
      price,
      fileUrl,
      audioUrl
    } = body;

    // Validation
    const validationErrors: { [key: string]: string } = {};
    if (!title) validationErrors.title = "Title is required";
    if (!slug) validationErrors.slug = "Slug is required";
    if (!author) validationErrors.author = "Author is required";
    if (!description) validationErrors.description = "Description is required";
    if (!year) validationErrors.year = "Year is required";
    if (!category) validationErrors.category = "Category is required";

    if (Object.keys(validationErrors).length > 0) {
      return validationError(validationErrors);
    }

    // Validate and filter tagIds to only valid MongoDB ObjectIds
    let validTagIds: string[] = [];
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      validTagIds = tagIds.filter((id) => {
        // MongoDB ObjectId is a 24-character hex string
        return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
      });
    }

    console.log("Creating book with tagIds:", { provided: tagIds, validated: validTagIds });

    // Check if slug already exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { slug }
    });

    if (existingBook) {
      return errorResponse(
        "Book with this slug already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Normalize cover URL (extract original URL from Next.js optimization URLs)
    const normalizedCover = normalizeImageUrl(cover);

    // Log request data for debugging
    console.log("Creating book with data:", {
      title,
      slug,
      author,
      description,
      cover: normalizedCover,
      year,
      pages,
      category,
      formats,
      status,
      tags,
      tagIds: validTagIds,
      fileUrl,
      audioUrl
    });

    // Create book
    const book = await prisma.digitalBook.create({
      data: {
        title,
        slug,
        author,
        description,
        cover: normalizedCover,
        publisher,
        year,
        pages,
        isbn,
        language,
        rating,
        votes,
        views,
        downloads,
        category,
        formats,
        status,
        tags,
        readingTime,
        isFeatured,
        price,
        fileUrl,
        audioUrl,
        // Set tagIds for the relation
        ...(validTagIds.length > 0 && { tagIds: validTagIds })
      }
    });

    console.log("Book created successfully:", { bookId: book.id, fileUrl: book.fileUrl, cover: book.cover });

    // Fetch the book with related tags included
    const bookWithTags = await prisma.digitalBook.findUnique({
      where: { id: book.id },
      include: {
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        }
      }
    });

    console.log("Book with tags:", bookWithTags);
    return createdResponse(bookWithTags, "Book created successfully");
  } catch (error) {
    console.error("Error creating book - Full error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: errorMessage,
      cause: error instanceof Error && error.cause ? String(error.cause) : undefined
    });
    return errorResponse(
      `Error creating book: ${errorMessage}`,
      ErrorCodes.DATABASE_ERROR
    );
  }
}
