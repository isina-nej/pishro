/**
 * Admin Mobile Scroller Steps Management API
 * GET /api/admin/mobile-scroller-steps - List all mobile scroller steps
 * POST /api/admin/mobile-scroller-steps - Create a new mobile scroller step
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
    const where: Prisma.MobileScrollerStepWhereInput = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch mobile scroller steps
    const [items, total] = await Promise.all([
      prisma.mobileScrollerStep.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.mobileScrollerStep.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching mobile scroller steps:", error);
    return errorResponse(
      "خطا در دریافت مراحل اسکرولر موبایل",
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
      stepNumber,
      title,
      description,
      imageUrl,
      gradient,
      cards = [],
      order = 0,
      published = false,
    } = body;

    // Validation
    if (!stepNumber || !title || !description) {
      return validationError({
        stepNumber: !stepNumber ? "شماره مرحله الزامی است" : "",
        title: !title ? "عنوان الزامی است" : "",
        description: !description ? "توضیحات الزامی است" : "",
      });
    }

    // Create mobile scroller step
    const item = await prisma.mobileScrollerStep.create({
      data: {
        stepNumber,
        title,
        description,
        imageUrl,
        gradient,
        cards,
        order,
        published,
      },
    });

    return createdResponse(item, "مرحله اسکرولر موبایل با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating mobile scroller step:", error);
    return errorResponse(
      "خطا در ایجاد مرحله اسکرولر موبایل",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
