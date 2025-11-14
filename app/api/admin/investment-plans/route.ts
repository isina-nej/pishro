/**
 * Admin Investment Plans Management API
 * GET /api/admin/investment-plans - List all investment plans pages
 * POST /api/admin/investment-plans - Create a new investment plans page
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
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.InvestmentPlansWhereInput = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch investment plans pages
    const [items, total] = await Promise.all([
      prisma.investmentPlans.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          plans: true,
          tags: true,
        },
      }),
      prisma.investmentPlans.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching investment plans pages:", error);
    return errorResponse(
      "خطا در دریافت صفحات سبدهای سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      minAmount = 10,
      maxAmount = 10000,
      amountStep = 10,
      metaTitle,
      metaDescription,
      metaKeywords = [],
      published = false,
    } = body;

    // Validation
    if (!title || !description) {
      return validationError({
        title: !title ? "عنوان الزامی است" : "",
        description: !description ? "توضیحات الزامی است" : "",
      });
    }

    // Create investment plans page
    const item = await prisma.investmentPlans.create({
      data: {
        title,
        description,
        image,
        minAmount,
        maxAmount,
        amountStep,
        metaTitle,
        metaDescription,
        metaKeywords,
        published,
      },
      include: {
        plans: true,
        tags: true,
      },
    });

    return createdResponse(item, "صفحه سبدهای سرمایه‌گذاری با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating investment plans page:", error);
    return errorResponse(
      "خطا در ایجاد صفحه سبدهای سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
