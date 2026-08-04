/**
 * POST /api/admin/comments/upload-avatar
 * Upload a profile photo for a home testimonial / comment.
 */

import { NextRequest } from "next/server";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  validationError,
} from "@/lib/api-response";
import { requireAdminUser } from "@/lib/admin/landing-cms-api";
import { saveFileToStorage } from "@/lib/services/storage-adapter";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const { response } = requireAdminUser(req);
    if (response) return response;

    const formData = await req.formData();
    const file = (formData.get("avatar") || formData.get("file")) as File | null;

    if (!file) {
      return validationError({ avatar: "فایل تصویر پروفایل الزامی است" });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { avatar: "فرمت نامعتبر" },
        "فقط JPG، PNG و WebP مجاز است"
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { avatar: "حجم زیاد" },
        "حجم فایل نباید بیشتر از ۵ مگابایت باشد"
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `avatar_${timestamp}_${random}.${extension}`;
    const url = await saveFileToStorage(
      buffer,
      `comments/avatars/${filename}`,
      file.type
    );

    return createdResponse({ url, fileName: filename }, "عکس پروفایل آپلود شد");
  } catch (error) {
    console.error("Error uploading comment avatar:", error);
    return errorResponse(
      "خطا در آپلود عکس پروفایل",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
