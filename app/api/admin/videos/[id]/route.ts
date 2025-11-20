// @/app/api/admin/videos/[id]/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationError as _validationError,
  ErrorCodes,
} from "@/lib/api-response";
import {
  getVideoByVideoId,
  updateVideo,
  deleteVideo,
} from "@/lib/services/video-service";
import type { UpdateVideoInput } from "@/types/video";

/**
 * GET /api/admin/videos/[id]
 * دریافت اطلاعات یک ویدیو
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const { id } = await params;

    const video = await getVideoByVideoId(id);

    if (!video) {
      return notFoundResponse("ویدیو", "ویدیو یافت نشد");
    }

    return successResponse(video, "ویدیو با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/admin/videos/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت ویدیو رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * PUT /api/admin/videos/[id]
 * بروزرسانی اطلاعات یک ویدیو
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const { id } = await params;

    // بررسی وجود ویدیو
    const existingVideo = await getVideoByVideoId(id);
    if (!existingVideo) {
      return notFoundResponse("ویدیو", "ویدیو یافت نشد");
    }

    const body: UpdateVideoInput = await req.json();

    // بروزرسانی ویدیو
    const updatedVideo = await updateVideo(id, body);

    return successResponse(updatedVideo, "ویدیو با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("[PUT /api/admin/videos/[id]] error:", error);
    return errorResponse(
      "خطایی در بروزرسانی ویدیو رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * DELETE /api/admin/videos/[id]
 * حذف یک ویدیو
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const { id } = await params;

    // بررسی وجود ویدیو
    const existingVideo = await getVideoByVideoId(id);
    if (!existingVideo) {
      return notFoundResponse("ویدیو", "ویدیو یافت نشد");
    }

    // حذف ویدیو (شامل فایل‌ها از storage)
    await deleteVideo(id);

    return successResponse({ videoId: id }, "ویدیو با موفقیت حذف شد");
  } catch (error) {
    console.error("[DELETE /api/admin/videos/[id]] error:", error);
    return errorResponse(
      "خطایی در حذف ویدیو رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
