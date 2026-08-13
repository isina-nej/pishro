/**
 * Admin custom palette by id
 * GET / PATCH / DELETE /api/admin/palettes/[id]
 */

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import {
  deleteCustomPalette,
  getCustomPaletteById,
  updateCustomPalette,
} from "@/lib/services/custom-palette-service";
import { getSettings, updateSettings } from "@/lib/services/settings-service";
import { isValidEditableColors, toCustomPaletteId } from "@/lib/theme/custom-palette";
import { DEFAULT_PALETTE_ID } from "@/lib/theme/landing-palettes";

type RouteContext = { params: Promise<{ id: string }> };

async function requireAdmin(req: NextRequest) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return {
      error: errorResponse(
        "لطفا وارد شوید",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      ),
    };
  }
  if (adminAuth.role !== "ADMIN") {
    return {
      error: errorResponse(
        "فقط ادمین می‌تواند پالت را مدیریت کند",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      ),
    };
  }
  return { adminAuth };
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth && auth.error) return auth.error;

    const { id } = await context.params;
    const item = await getCustomPaletteById(id);
    if (!item) {
      return errorResponse(
        "پالت پیدا نشد",
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }
    return successResponse(item, "پالت سفارشی");
  } catch (error) {
    console.error("Error fetching custom palette:", error);
    return errorResponse("خطا در دریافت پالت", ErrorCodes.DATABASE_ERROR);
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth && auth.error) return auth.error;

    const { id } = await context.params;
    const body = await req.json();

    if (body.lightColors !== undefined && !isValidEditableColors(body.lightColors)) {
      return validationError(
        { lightColors: "رنگ‌های لایت معتبر نیستند" },
        "رنگ‌های لایت نامعتبرند"
      );
    }
    if (body.darkColors !== undefined && !isValidEditableColors(body.darkColors)) {
      return validationError(
        { darkColors: "رنگ‌های دارک معتبر نیستند" },
        "رنگ‌های دارک نامعتبرند"
      );
    }

    const updated = await updateCustomPalette(id, {
      name: typeof body.name === "string" ? body.name : undefined,
      nameFa: typeof body.nameFa === "string" ? body.nameFa : undefined,
      description:
        typeof body.description === "string" ? body.description : undefined,
      lightColors: body.lightColors,
      darkColors: body.darkColors,
    });

    revalidatePath("/", "layout");
    return successResponse(updated, "پالت به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating custom palette:", error);
    const message = error instanceof Error ? error.message : "خطا در به‌روزرسانی";
    if (message.includes("پیدا نشد")) {
      return errorResponse(message, ErrorCodes.NOT_FOUND, undefined, HttpStatus.NOT_FOUND);
    }
    return errorResponse(message, ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth && auth.error) return auth.error;

    const { id } = await context.params;
    const existing = await getCustomPaletteById(id);
    if (!existing) {
      return errorResponse(
        "پالت پیدا نشد",
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }

    await deleteCustomPalette(id);

    // If the deleted palette was active, fall back to default builtin.
    try {
      const settings = await getSettings();
      if (settings.paletteId === toCustomPaletteId(id)) {
        await updateSettings({ paletteId: DEFAULT_PALETTE_ID });
      }
    } catch {
      /* ignore */
    }

    revalidatePath("/", "layout");
    return successResponse({ id }, "پالت حذف شد");
  } catch (error) {
    console.error("Error deleting custom palette:", error);
    return errorResponse("خطا در حذف پالت", ErrorCodes.DATABASE_ERROR);
  }
}
