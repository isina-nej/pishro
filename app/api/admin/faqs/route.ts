/**
 * Admin FAQs Management API
 * GET /api/admin/faqs - List all FAQs with pagination and filters
 * POST /api/admin/faqs - Create a new FAQ
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
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const faqCategory = searchParams.get("faqCategory");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");

    // Build where clause
    const where: Prisma.FAQWhereInput = {};

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { answer: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (faqCategory && ["GENERAL", "PAYMENT", "COURSES", "TECHNICAL"].includes(faqCategory)) {
      where.faqCategory = faqCategory as Prisma.EnumFAQCategoryNullableFilter;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }

    // Fetch FAQs
    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
      }),
      prisma.fAQ.count({ where }),
    ]);

    return paginatedResponse(faqs, page, limit, total);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return errorResponse(
      "Error fetching FAQs",
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
      question,
      answer,
      categoryId,
      faqCategory,
      order = 0,
      published = true,
      featured = false,
    } = body;

    // Validation
    if (!question || !answer) {
      return validationError({
        question: !question ? "Question is required" : "",
        answer: !answer ? "Answer is required" : "",
      });
    }

    // Create FAQ
    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        categoryId,
        faqCategory,
        order,
        published,
        featured,
      },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(faq, "FAQ created successfully");
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return errorResponse(
      "Error creating FAQ",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
