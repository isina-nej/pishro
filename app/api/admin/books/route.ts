/**
 * Admin Digital Books Management API
 * GET /api/admin/books - List all digital books with pagination and filters
 * POST /api/admin/books - Create a new digital book
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Unified authentication - supports NextAuth and Bearer token
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
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
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
        { publisher: { contains: search } },
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
            include: {
              tag: {
                select: {
                  id: true,
                  slug: true,
                  title: true
                }
              }
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
    // Unified authentication - supports NextAuth and Bearer token
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
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
      bookStatus = "DRAFT",
      tags = [],
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
      bookStatus,
      tags,
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
        bookStatus,
        tags,
        readingTime,
        isFeatured,
        price,
        fileUrl,
        audioUrl
      }
    });

    console.log("Book created successfully:", { bookId: book.id, fileUrl: book.fileUrl, cover: book.cover });

    // Fetch the book with related tags included
    const bookWithTags = await prisma.digitalBook.findUnique({
      where: { id: book.id },
      include: {
        relatedTags: {
          include: {
            tag: true
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
