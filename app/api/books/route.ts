/**
 * Public Digital Books API
 * GET /api/books - List all public digital books with pagination and filters
 */

import { NextRequest } from "next/server";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
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
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const isFeatured = searchParams.get("featured");

    // Build where clause
    const where: Prisma.DigitalBookWhereInput = {};

    if (category) {
      where.category = category;
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

    // Fetch books (without DateTime fields due to Prisma MongoDB adapter issue)
    const [books, total] = await Promise.all([
      prisma.digitalBook.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort === "newest" ? "id" : sort]: "desc" },
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

