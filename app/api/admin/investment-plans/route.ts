/**
 * Admin Investment Plans Management API
 * GET /api/admin/investment-plans - List all investment plans pages
 * POST /api/admin/investment-plans - Create a new investment plans page
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getAllInvestmentPlansForAdmin,
  createInvestmentPlans,
} from "@/lib/services/investment-plans-service";
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

    // Fetch investment plans pages
    const result = await getAllInvestmentPlansForAdmin({
      page,
      limit,
      published,
    });

    return paginatedResponse(result.items, page, limit, result.total);
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
      plansIntroCards = [],
      minAmount = 10,
      maxAmount = 10000,
      amountStep = 10,
      metaTitle,
      metaDescription,
      metaKeywords = [],
      published = false,
    } = body;

    // Validation
    const errors: { [key: string]: string } = {};

    if (!title || title.trim().length < 3) {
      errors.title = "عنوان الزامی است و باید حداقل 3 کاراکتر باشد";
    }

    if (!description || description.trim().length < 10) {
      errors.description = "توضیحات الزامی است و باید حداقل 10 کاراکتر باشد";
    }

    if (minAmount < 0) {
      errors.minAmount = "حداقل مبلغ باید مثبت باشد";
    }

    if (maxAmount <= minAmount) {
      errors.maxAmount = "حداکثر مبلغ باید بیشتر از حداقل مبلغ باشد";
    }

    if (amountStep <= 0) {
      errors.amountStep = "مقدار قدم باید مثبت باشد";
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    // Create investment plans page
    const item = await createInvestmentPlans({
      title: title.trim(),
      description: description.trim(),
      image,
      plansIntroCards,
      minAmount,
      maxAmount,
      amountStep,
      metaTitle,
      metaDescription,
      metaKeywords,
      published,
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
