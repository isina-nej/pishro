// @/app/api/landing/investment-plans/route.ts

import { NextRequest } from "next/server";
import { getInvestmentPlansData } from "@/lib/services/landing-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  try {
    const data = await getInvestmentPlansData();

    if (!data) {
      return errorResponse(
        "داده‌های صفحه سبدهای سرمایه‌ گذاری یافت نشد",
        "INVESTMENT_PLANS_NOT_FOUND",
        404
      );
    }

    return successResponse(data);
  } catch (error) {
    console.error("Error in GET /api/landing/investment-plans:", error);
    return errorResponse(
      "خطا در دریافت اطلاعات سبدهای سرمایه‌ گذاری",
      "DATABASE_ERROR"
    );
  }
}
