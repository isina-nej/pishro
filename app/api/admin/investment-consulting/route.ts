/**
 * Admin Investment Consulting Management API
 * GET /api/admin/investment-consulting - List all investment consulting pages
 * POST /api/admin/investment-consulting - Create a new investment consulting page
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
    const where: Prisma.InvestmentConsultingWhereInput = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch investment consulting pages
    const [items, total] = await Promise.all([
      prisma.investmentConsulting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.investmentConsulting.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching investment consulting pages:", error);
    return errorResponse(
      "خطا در دریافت صفحات مشاوره سرمایه‌گذاری",
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
      phoneNumber,
      telegramId,
      telegramLink,
      coursesLink,
      inPersonTitle,
      inPersonDescription,
      onlineTitle,
      onlineDescription,
      coursesTitle,
      coursesDescription,
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

    // Create investment consulting page
    const item = await prisma.investmentConsulting.create({
      data: {
        title,
        description,
        image,
        phoneNumber,
        telegramId,
        telegramLink,
        coursesLink,
        inPersonTitle,
        inPersonDescription,
        onlineTitle,
        onlineDescription,
        coursesTitle,
        coursesDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        published,
      },
    });

    return createdResponse(item, "صفحه مشاوره سرمایه‌گذاری با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating investment consulting page:", error);
    return errorResponse(
      "خطا در ایجاد صفحه مشاوره سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
