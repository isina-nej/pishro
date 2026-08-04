import { NextRequest } from "next/server";
import { FAQCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  ErrorCodes,
} from "@/lib/api-response";

const FAQ_CATEGORIES = new Set<string>(Object.values(FAQCategory));

/**
 * Public FAQs API
 * GET /api/faqs — published FAQs only
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
    const skip = (page - 1) * limit;
    const faqCategory = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured");

    const where: Prisma.FAQWhereInput = {
      published: true,
    };

    if (faqCategory && FAQ_CATEGORIES.has(faqCategory)) {
      where.faqCategory = faqCategory as FAQCategory;
    }
    if (featured === "true") {
      where.featured = true;
    }

    const [items, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true,
          question: true,
          answer: true,
          faqCategory: true,
          featured: true,
          order: true,
        },
      }),
      prisma.fAQ.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching public FAQs:", error);
    return errorResponse(
      "Error fetching FAQs",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
