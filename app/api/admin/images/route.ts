/**
 * Admin Images Management API
 * GET /api/admin/images - List all images with pagination and filters
 * POST /api/admin/images - Upload a new image (multipart/form-data)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";
import { getUserImages, uploadImage } from "@/lib/services/image-service";
import { ImageCategory } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

    // Filters
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") as ImageCategory | undefined;

    // Fetch images
    const result = await getUserImages({
      userId: session.user.id,
      category,
      search,
      page,
      limit,
    });

    return paginatedResponse(
      result.images,
      result.page,
      result.limit,
      result.total
    );
  } catch (error) {
    console.error("Error fetching images:", error);
    return errorResponse(
      "خطا در دریافت تصاویر",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as ImageCategory) || "OTHER";
    const title = (formData.get("title") as string) || undefined;
    const description = (formData.get("description") as string) || undefined;
    const alt = (formData.get("alt") as string) || undefined;
    const tagsString = (formData.get("tags") as string) || "";
    const tags = tagsString ? tagsString.split(",").map((t) => t.trim()) : [];

    // Validation
    if (!file) {
      return validationError({
        file: "فایل الزامی است",
      });
    }

    if (!Object.values(ImageCategory).includes(category)) {
      return validationError({
        category: "دسته‌بندی نامعتبر است",
      });
    }

    // Upload image
    try {
      const result = await uploadImage({
        userId: session.user.id,
        file,
        category,
        title,
        description,
        alt,
        tags,
      });

      return createdResponse(result, "تصویر با موفقیت آپلود شد");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "خطا در آپلود تصویر";
      return errorResponse(message, ErrorCodes.EXTERNAL_SERVICE_ERROR);
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return errorResponse(
      "خطا در آپلود تصویر",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
