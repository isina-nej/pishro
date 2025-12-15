/**
 * Admin Digital Books Management API
 * GET /api/admin/books - List all digital books with pagination and filters
 * POST /api/admin/books - Create a new digital book
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
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
              title: true,
            },
          },
        },
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
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
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
      audioUrl,
    } = body;

    // Validation
    if (!title || !slug || !author || !description || !year || !category) {
      return validationError({
        title: !title ? "Title is required" : "",
        slug: !slug ? "Slug is required" : "",
        author: !author ? "Author is required" : "",
        description: !description ? "Description is required" : "",
        year: !year ? "Year is required" : "",
        category: !category ? "Category is required" : "",
      });
    }

    // Check if slug already exists
    const existingBook = await prisma.digitalBook.findUnique({
      where: { slug },
    });

    if (existingBook) {
      return errorResponse(
        "Book with this slug already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Normalize cover URL (extract original URL from Next.js optimization URLs)
    const normalizedCover = normalizeImageUrl(cover);

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
        tagIds,
        readingTime,
        isFeatured,
        price,
        fileUrl,
        audioUrl,
      },
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

    return createdResponse(book, "Book created successfully");
  } catch (error) {
    console.error("Error creating book:", error);
    return errorResponse(
      "Error creating book",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
