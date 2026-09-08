import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { saveFileToStorage } from "@/lib/services/storage-adapter";
import { detectVideo, randomSlug } from "@/lib/upload-validation";

// تنظیمات مجاز برای آپلود ویدیو
const MAX_FILE_SIZE = 256 * 1024 * 1024; // 256MB

export async function POST(req: NextRequest) {
  try {

    const adminAuth = await getAdminAuth(req);
// بررسی احراز هویت و نقش ادمین
    if (!adminAuth) {
      return errorResponse(
        "لطفاً وارد حساب کاربری خود شوید",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return validationError(
        { video: "فایل ویدیو الزامی است" },
        "فایل ویدیو الزامی است"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { video: "حجم فایل نباید بیشتر از 256 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 256 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic-byte sniff — ftyp/EBML, not client type/extension.
    const detected = detectVideo(buffer);
    if (!detected) {
      return validationError(
        { video: "فقط فایل‌های ویدیویی مجاز هستند" },
        "فقط فرمت‌های MP4، MOV، MKV و WebM مجاز هستند"
      );
    }

    // ایجاد نام منحصر به فرد برای فایل — ext/mime from magic bytes.
    const timestamp = Date.now();
    const randomString = await randomSlug();
    const filename = `video_${timestamp}_${randomString}.${detected.ext}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const videoUrl = await saveFileToStorage(
      buffer,
      `videos/${filename}`,
      detected.mime
    );

    return successResponse(
      {
        videoUrl,
        filename,
        fileSize: file.size,
        fileType: detected.mime
      },
      "ویدیو با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Video upload error:", error);
    return errorResponse(
      "خطایی در آپلود ویدیو رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
