/**
 * Public site chrome
 * GET /api/site-chrome — logo, favicon, OG, hidden pages, site name
 */

import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { getPublicSiteChrome } from "@/lib/services/settings-service";

export async function GET() {
  try {
    const chrome = await getPublicSiteChrome();
    return successResponse(chrome, "برندینگ و نمایش سایت");
  } catch (error) {
    console.error("Error fetching site chrome:", error);
    return errorResponse(
      "خطا در دریافت تنظیمات نمایش سایت",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
