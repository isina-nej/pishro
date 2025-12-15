// @/app/api/landing/about/route.ts

import { NextRequest } from "next/server";
import { getAboutPageData } from "@/lib/services/landing-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  try {
    const aboutPage = await getAboutPageData();

    if (!aboutPage) {
      return errorResponse(
        "داده‌های صفحه درباره ما یافت نشد",
        "ABOUT_PAGE_NOT_FOUND",
        404
      );
    }

    return successResponse(aboutPage);
  } catch (error) {
    console.error("Error in GET /api/landing/about:", error);
    return errorResponse(
      "خطا در دریافت اطلاعات صفحه درباره ما",
      "DATABASE_ERROR"
    );
  }
}
