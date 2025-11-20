/**
 * Admin Single Video Management API (by database ID)
 * GET /api/admin/videos/[id] - Get a single video by database ID
 * PATCH /api/admin/videos/[id] - Update video metadata
 * DELETE /api/admin/videos/[id] - Delete a video
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  ErrorCodes,
  forbiddenResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  getVideoById,
  deleteVideo,
  updateVideo,
} from "@/lib/services/video-service";
import type { UpdateVideoInput } from "@/types/video";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    const { id } = await params;

    const video = await getVideoById(id);

    if (!video) {
      return notFoundResponse("Video", "ویدیو یافت نشد");
    }

    return successResponse(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return errorResponse(
      "خطا در دریافت ویدیو",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    const { id } = await params;

    // بررسی وجود ویدیو
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
      return notFoundResponse("Video", "ویدیو یافت نشد");
    }

    const body: UpdateVideoInput = await req.json();

    try {
      // بروزرسانی با استفاده از videoId
      const updatedVideo = await updateVideo(existingVideo.videoId, body);

      return successResponse(updatedVideo, "ویدیو با موفقیت بروزرسانی شد");
    } catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "خطا در بروزرسانی ویدیو";

      if (message.includes("یافت نشد")) {
        return notFoundResponse("Video", message);
      }

      return errorResponse(message, ErrorCodes.DATABASE_ERROR);
    }
  } catch (error) {
    console.error("Error updating video:", error);
    return errorResponse(
      "خطا در بروزرسانی ویدیو",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    const { id } = await params;

    // بررسی وجود ویدیو
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
      return notFoundResponse("Video", "ویدیو یافت نشد");
    }

    try {
      // حذف با استفاده از videoId
      await deleteVideo(existingVideo.videoId);
      return successResponse(
        { deleted: true },
        "ویدیو با موفقیت حذف شد"
      );
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "خطا در حذف ویدیو";

      if (message.includes("یافت نشد")) {
        return notFoundResponse("Video", message);
      }

      return errorResponse(message, ErrorCodes.DATABASE_ERROR);
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    return errorResponse(
      "خطا در حذف ویدیو",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
