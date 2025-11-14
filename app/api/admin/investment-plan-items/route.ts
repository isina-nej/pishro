/**
 * Admin Investment Plan Items Management API
 * GET /api/admin/investment-plan-items - List all investment plan items
 * POST /api/admin/investment-plan-items - Create a new investment plan item
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
    const investmentPlansId = searchParams.get("investmentPlansId");
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.InvestmentPlanWhereInput = {};

    if (investmentPlansId) {
      where.investmentPlansId = investmentPlansId;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch investment plan items
    const [items, total] = await Promise.all([
      prisma.investmentPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          investmentPlans: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.investmentPlan.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching investment plan items:", error);
    return errorResponse(
      "خطا در دریافت آیتم‌های سبد سرمایه‌گذاری",
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
      investmentPlansId,
      label,
      icon,
      description,
      order = 0,
      published = false,
    } = body;

    // Validation
    if (!investmentPlansId || !label) {
      return validationError({
        investmentPlansId: !investmentPlansId ? "شناسه صفحه سبدهای سرمایه‌گذاری الزامی است" : "",
        label: !label ? "برچسب الزامی است" : "",
      });
    }

    // Check if investment plans exists
    const investmentPlans = await prisma.investmentPlans.findUnique({
      where: { id: investmentPlansId },
    });

    if (!investmentPlans) {
      return errorResponse(
        "صفحه سبدهای سرمایه‌گذاری یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    }

    // Create investment plan item
    const item = await prisma.investmentPlan.create({
      data: {
        investmentPlansId,
        label,
        icon,
        description,
        order,
        published,
      },
      include: {
        investmentPlans: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(item, "آیتم سبد سرمایه‌گذاری با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating investment plan item:", error);
    return errorResponse(
      "خطا در ایجاد آیتم سبد سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
