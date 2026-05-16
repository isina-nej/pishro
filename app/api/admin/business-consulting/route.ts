/**
 * Admin Investment Consulting Management API
 * GET /api/admin/business-consulting - List all investment consulting pages
 * POST /api/admin/business-consulting - Create a new investment consulting page
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { auth } from "@/auth";
import { getAdminAuth } from "@/lib/auth-simple";
import { Prisma } from "@prisma/client";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (!adminAuth) {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.BusinessConsultingWhereInput = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch investment consulting pages
    const [items, total] = await Promise.all([
      prisma.businessConsulting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.businessConsulting.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching investment consulting pages:", error);
    return errorResponse(
      "خطا در دریافت صفحات مشاوره سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (!adminAuth) {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
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
      published = false
    } = body;

    // Validation
    if (!title || !description) {
      return validationError({
        title: !title ? "عنوان الزامی است" : "",
        description: !description ? "توضیحات الزامی است" : ""
      });
    }

    // Create investment consulting page
    const item = await prisma.businessConsulting.create({
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
        published
      }
    });

    return createdResponse(
      item,
      "صفحه مشاوره سرمایه‌ گذاری با موفقیت ایجاد شد"
    );
  } catch (error) {
    console.error("Error creating investment consulting page:", error);
    return errorResponse(
      "خطا در ایجاد صفحه مشاوره سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
