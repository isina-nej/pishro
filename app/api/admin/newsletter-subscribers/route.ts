/**
 * Admin Newsletter Subscribers Management API
 * GET /api/admin/newsletter-subscribers - List all newsletter subscribers with pagination
 */

import { NextRequest } from "next/server";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  ErrorCodes
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();\nif (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");

    // Build where clause
    const where: Prisma.NewsletterSubscriberWhereInput = {};

    if (search) {
      where.phone = { contains: search };
    }

    // Fetch subscribers
    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return paginatedResponse(subscribers, page, limit, total);
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return errorResponse(
      "Error fetching newsletter subscribers",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
