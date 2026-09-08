/**
 * Admin CMS Reset API
 * POST /api/admin/cms/reset - Reset a single page or all pages to factory defaults
 */

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { resetPublicContent } from "@/lib/services/settings-service";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin) {
      return unauthorizedResponse("لطفاً ابتدا وارد حساب مدیریت شوید");
    }

    if (admin.role !== "ADMIN") {
      return forbiddenResponse("فقط ادمین کل مجاز به بازگردانی تنظیمات به حالت کارخانه است");
    }

    let pageId: string | undefined;
    try {
      const body = await req.json();
      pageId = body?.pageId;
    } catch {
      // Empty body allowed — means reset all
    }

    const updated = await resetPublicContent(pageId);
    revalidatePath("/", "layout");

    const message = pageId && pageId !== "all"
      ? `تنظیمات صفحه «${pageId}» با موفقیت به مقادیر پیش‌فرض کارخانه بازگشت`
      : "تمام صفحات عمومی با موفقیت به مقادیر پیش‌فرض کارخانه بازگردانده شدند";

    return successResponse({ content: updated, pageId: pageId || "all" }, message);
  } catch (error) {
    console.error("[POST /api/admin/cms/reset] error:", error);
    return errorResponse("خطا در بازگردانی به پیش‌فرض", ErrorCodes.DATABASE_ERROR);
  }
}
