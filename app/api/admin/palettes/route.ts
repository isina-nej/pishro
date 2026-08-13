/**
 * Admin custom palettes API
 * GET  /api/admin/palettes — list
 * POST /api/admin/palettes — create
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
  createdResponse,
} from "@/lib/api-response";
import {
  createCustomPalette,
  listCustomPalettes,
} from "@/lib/services/custom-palette-service";
import { isValidEditableColors } from "@/lib/theme/custom-palette";

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

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth && auth.error) return auth.error;

    const items = await listCustomPalettes();
    return successResponse(items, "پالت‌های سفارشی");
  } catch (error) {
    console.error("Error listing custom palettes:", error);
    return errorResponse("خطا در دریافت پالت‌ها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth && auth.error) return auth.error;

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name : "";
    const nameFa = typeof body.nameFa === "string" ? body.nameFa : "";
    const description =
      typeof body.description === "string" ? body.description : "";

    if (!name.trim() || !nameFa.trim()) {
      return validationError(
        { name: "نام و نام فارسی الزامی است" },
        "نام پالت ناقص است"
      );
    }
    if (!isValidEditableColors(body.lightColors)) {
      return validationError(
        { lightColors: "رنگ‌های لایت معتبر نیستند" },
        "رنگ‌های لایت ناقص یا نامعتبرند"
      );
    }
    if (!isValidEditableColors(body.darkColors)) {
      return validationError(
        { darkColors: "رنگ‌های دارک معتبر نیستند" },
        "رنگ‌های دارک ناقص یا نامعتبرند"
      );
    }

    const created = await createCustomPalette({
      name,
      nameFa,
      description,
      lightColors: body.lightColors,
      darkColors: body.darkColors,
    });

    revalidatePath("/", "layout");
    return createdResponse(created, "پالت سفارشی ساخته شد");
  } catch (error) {
    console.error("Error creating custom palette:", error);
    return errorResponse(
      error instanceof Error ? error.message : "خطا در ساخت پالت",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
