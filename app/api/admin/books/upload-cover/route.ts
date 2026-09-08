import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { saveFileToStorage } from "@/lib/services/storage-adapter";
import { randomSlug, sniffUpload } from "@/lib/upload-validation";

// تنظیمات برای آپلود کاور کتاب
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB — message below says 5MB

// Handle CORS preflight
export async function OPTIONS(_req: NextRequest) {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "دسترسی غیرمجاز",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }
    const formData = await req.formData();
    const file = formData.get("cover") as File | null;

    if (!file) {
      return validationError(
        { cover: "فایل تصویر الزامی است" },
        "فایل تصویر کاور الزامی است"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { cover: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 5 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic-byte sniff — file.type / extension are client-controlled.
    const detected = sniffUpload(buffer, ["image"]);
    if (!detected || detected.kind !== "image") {
      return validationError(
        { cover: "فقط فایل‌های تصویری مجاز هستند" },
        "فقط فرمت‌های JPG، PNG و WebP مجاز هستند"
      );
    }

    // ایجاد نام منحصر به فرد برای فایل — ext/mime from magic bytes.
    const timestamp = Date.now();
    const randomString = await randomSlug();
    const filename = `cover_${timestamp}_${randomString}.${detected.ext}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const coverUrl = await saveFileToStorage(
      buffer,
      `books/covers/${filename}`,
      detected.mime
    );

    return successResponse(
      {
        fileName: filename,
        fileUrl: coverUrl,
        fileSize: file.size,
        mimeType: detected.mime,
        uploadedAt: new Date().toISOString()
      },
      "تصویر کاور با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Cover upload error:", error);
    return errorResponse(
      "خطایی در آپلود تصویر کاور رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
