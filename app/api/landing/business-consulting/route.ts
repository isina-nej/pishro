// @/app/api/landing/business-consulting/route.ts

import { NextRequest } from "next/server";
import { getInvestmentConsultingData } from "@/lib/services/landing-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  try {
    const data = await getInvestmentConsultingData();

    if (!data) {
      return errorResponse(
        "داده‌های صفحه مشاوره سرمایه‌گذاری یافت نشد",
        "INVESTMENT_CONSULTING_NOT_FOUND",
        404
      );
    }

    return successResponse(data);
  } catch (error) {
    console.error("Error in GET /api/landing/business-consulting:", error);
    return errorResponse(
      "خطا در دریافت اطلاعات مشاوره سرمایه‌گذاری",
      "DATABASE_ERROR"
    );
  }
}
