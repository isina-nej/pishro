/**
 * Admin Investment Models Page Management API
 * GET /api/admin/investment-models-page - List all investment models pages
 * POST /api/admin/investment-models-page - Create a new investment models page
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getAllInvestmentModelsPagesForAdmin,
  createInvestmentModelsPage,
} from "@/lib/services/investment-models-service";
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

    // Filters
    const publishedParam = searchParams.get("published");
    let published: boolean | null = null;

    if (publishedParam === "true") {
      published = true;
    } else if (publishedParam === "false") {
      published = false;
    }

    // Fetch investment models pages
    const result = await getAllInvestmentModelsPagesForAdmin({
      page,
      limit,
      published,
    });

    return paginatedResponse(result.items, page, limit, result.total);
  } catch (error) {
    console.error("Error fetching investment models pages:", error);
    return errorResponse(
      "خطا در دریافت صفحات مدل‌های سرمایه‌ گذاری",
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
      additionalInfoTitle,
      additionalInfoContent,
      published = true,
    } = body;

    // Validation
    const errors: { [key: string]: string } = {};

    // No required fields for now, but can add validation if needed

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    // Create investment models page
    const item = await createInvestmentModelsPage({
      additionalInfoTitle,
      additionalInfoContent,
      published,
    });

    return createdResponse(
      item,
      "صفحه مدل‌های سرمایه‌ گذاری با موفقیت ایجاد شد"
    );
  } catch (error) {
    console.error("Error creating investment models page:", error);
    return errorResponse(
      "خطا در ایجاد صفحه مدل‌های سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
