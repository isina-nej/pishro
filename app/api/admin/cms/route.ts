/**
 * Admin CMS Studio API
 * GET /api/admin/cms - Get all pages metadata, defaults, current overrides, and stats
 * PATCH /api/admin/cms - Save page content overrides (all pages or single page)
 */

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";
import {
  PUBLIC_CONTENT_PAGES,
  getPublicContentDefaults,
  validatePublicContentPage,
  type PublicContentOverrides,
} from "@/lib/site/public-content";
import {
  getPublicContent,
  getRawPublicContent,
  updatePublicContent,
  updatePublicContentPage,
} from "@/lib/services/settings-service";

/**
 * GET /api/admin/cms
 * Returns full CMS content, factory defaults, page definitions, and statistics.
 */
export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin) {
      return unauthorizedResponse("لطفاً ابتدا وارد حساب مدیریت شوید");
    }

    const [resolvedContent, rawOverrides] = await Promise.all([
      getPublicContent(),
      getRawPublicContent(),
    ]);

    const defaults = getPublicContentDefaults();

    // Calculate editing statistics
    let totalFields = 0;
    let editedFields = 0;

    for (const page of PUBLIC_CONTENT_PAGES) {
      const pageFields = page.sections.flatMap((s) => s.fields);
      totalFields += pageFields.length;
      const pageOverrides = rawOverrides[page.id] || {};
      for (const field of pageFields) {
        if (
          pageOverrides[field.key] !== undefined &&
          pageOverrides[field.key] !== field.defaultValue
        ) {
          editedFields++;
        }
      }
    }

    return successResponse(
      {
        content: resolvedContent,
        rawOverrides,
        defaults,
        pages: PUBLIC_CONTENT_PAGES,
        stats: {
          totalPages: PUBLIC_CONTENT_PAGES.length,
          totalSections: PUBLIC_CONTENT_PAGES.reduce((sum, p) => sum + p.sections.length, 0),
          totalFields,
          editedFields,
        },
      },
      "اطلاعات CMS با موفقیت دریافت شد"
    );
  } catch (error) {
    console.error("[GET /api/admin/cms] error:", error);
    return errorResponse("خطا در دریافت اطلاعات CMS", ErrorCodes.DATABASE_ERROR);
  }
}

/**
 * PATCH /api/admin/cms
 * Save public content modifications
 * Body can be either:
 * 1. { content: PublicContentOverrides } - Save entire site content
 * 2. { pageId: string, values: Record<string, string> } - Save single page
 */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin) {
      return unauthorizedResponse("لطفاً ابتدا وارد حساب مدیریت شوید");
    }

    if (admin.role !== "ADMIN" && admin.role !== "MODERATOR") {
      return forbiddenResponse("دسترسی فقط برای مدیران سامانه مجاز است");
    }

    const body = await req.json();

    // Mode 1: Single page update
    if (body.pageId && typeof body.pageId === "string") {
      const { pageId, values } = body;
      const validated = validatePublicContentPage(pageId, values);
      if (!validated) {
        return validationError(
          { pageId: `محتوای ارسالی برای صفحه «${pageId}» نامعتبر است` },
          "اعتبارسنجی فیلدهای صفحه با شکست مواجه شد"
        );
      }

      const updated = await updatePublicContentPage(pageId, validated);
      revalidatePath("/", "layout");

      return successResponse(
        { content: updated, pageId },
        `محتوای صفحه «${pageId}» با موفقیت ذخیره شد`
      );
    }

    // Mode 2: Multi-page update { content: PublicContentOverrides }
    const content = body.content || body;
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      return validationError(
        { content: "ساختار داده‌های ارسالی محتوا معتبر نیست" },
        "داده‌های ارسالی ناقص یا نامعتبر است"
      );
    }

    const validatedOverrides: PublicContentOverrides = {};
    for (const [pageId, values] of Object.entries(content)) {
      if (values && typeof values === "object" && !Array.isArray(values)) {
        const validated = validatePublicContentPage(pageId, values);
        if (!validated) {
          return validationError(
            { [pageId]: `فیلدهای صفحه «${pageId}» نامعتبر است` },
            `خطا در اعتبارسنجی صفحه ${pageId}`
          );
        }
        validatedOverrides[pageId] = validated;
      }
    }

    const updated = await updatePublicContent(validatedOverrides);

    // Invalidate public site cache
    revalidatePath("/", "layout");

    return successResponse(
      { content: updated },
      "تمام تغییرات محتوا با موفقیت ذخیره و در سایت عمومی اعمال شد"
    );
  } catch (error) {
    console.error("[PATCH /api/admin/cms] error:", error);
    return errorResponse("خطا در ذخیره تغییرات CMS", ErrorCodes.DATABASE_ERROR);
  }
}
