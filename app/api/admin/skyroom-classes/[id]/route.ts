// @/app/api/admin/skyroom-classes/[id]/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  getSkyRoomClassById,
  updateSkyRoomClass,
  deleteSkyRoomClass,
} from "@/lib/services/skyroom-service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/skyroom-classes/[id]
 * دریافت یک لینک همایش (برای ادمین)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;
    const skyRoomClass = await getSkyRoomClassById(id);

    if (!skyRoomClass) {
      return notFoundResponse("لینک همایش مورد نظر یافت نشد");
    }

    return successResponse(skyRoomClass, "لینک همایش با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت لینک همایش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * PATCH /api/admin/skyroom-classes/[id]
 * به‌روزرسانی لینک همایش (برای ادمین)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;
    const body = await req.json();

    // Validation
    const errors: { [key: string]: string } = {};

    if (body.meetingLink !== undefined && body.meetingLink.trim().length === 0) {
      errors.meetingLink = "لینک همایش نمی‌تواند خالی باشد";
    } else if (body.meetingLink) {
      // Validate URL format
      try {
        new URL(body.meetingLink);
      } catch {
        errors.meetingLink = "فرمت لینک همایش معتبر نیست";
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.meetingLink !== undefined) updateData.meetingLink = body.meetingLink.trim();
    if (body.published !== undefined) updateData.published = body.published;

    const skyRoomClass = await updateSkyRoomClass(id, updateData);

    return successResponse(skyRoomClass, "لینک همایش با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("[PATCH /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در به‌روزرسانی لینک همایش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * DELETE /api/admin/skyroom-classes/[id]
 * حذف یک لینک همایش (برای ادمین)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;

    // Check if class exists
    const skyRoomClass = await getSkyRoomClassById(id);
    if (!skyRoomClass) {
      return notFoundResponse("لینک همایش مورد نظر یافت نشد");
    }

    await deleteSkyRoomClass(id);

    return successResponse(null, "لینک همایش با موفقیت حذف شد");
  } catch (error) {
    console.error("[DELETE /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در حذف لینک همایش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
