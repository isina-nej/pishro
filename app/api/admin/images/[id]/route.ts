/**
 * Admin Single Image Management API
 * GET /api/admin/images/[id] - Get a single image by ID
 * PATCH /api/admin/images/[id] - Update image metadata
 * DELETE /api/admin/images/[id] - Delete an image
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
  validationError,
} from "@/lib/api-response";
import {
  getImageById,
  deleteImage,
  updateImage,
} from "@/lib/services/image-service";
import { ImageCategory } from "@prisma/client";

export async function GET(
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

    const image = await getImageById(id, session.user.id);

    if (!image) {
      return notFoundResponse("Image", "تصویر یافت نشد");
    }

    return successResponse(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    return errorResponse(
      "خطا در دریافت تصویر",
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
    const body = await req.json();

    const { title, description, alt, tags, category, published } = body;

    // Validation
    if (category && !Object.values(ImageCategory).includes(category)) {
      return validationError({
        category: "دسته‌بندی نامعتبر است",
      });
    }

    try {
      const updatedImage = await updateImage({
        imageId: id,
        userId: session.user.id,
        title,
        description,
        alt,
        tags,
        category,
        published,
      });

      return successResponse(updatedImage, "تصویر با موفقیت به‌روزرسانی شد");
    } catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "خطا در به‌روزرسانی تصویر";

      if (message.includes("یافت نشد")) {
        return notFoundResponse("Image", message);
      }

      return errorResponse(message, ErrorCodes.DATABASE_ERROR);
    }
  } catch (error) {
    console.error("Error updating image:", error);
    return errorResponse(
      "خطا در به‌روزرسانی تصویر",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

export async function DELETE(
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

    try {
      await deleteImage(id, session.user.id);
      return successResponse(
        { deleted: true },
        "تصویر با موفقیت حذف شد"
      );
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "خطا در حذف تصویر";

      if (message.includes("یافت نشد")) {
        return notFoundResponse("Image", message);
      }

      return errorResponse(message, ErrorCodes.DATABASE_ERROR);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return errorResponse(
      "خطا در حذف تصویر",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
