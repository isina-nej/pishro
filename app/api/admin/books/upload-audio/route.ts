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
import { detectAudio, randomSlug } from "@/lib/upload-validation";

// تنظیمات برای آپلود صوت کتاب
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB — matches the error message

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
    const file = formData.get("audio") as File | null;

    if (!file) {
      return validationError(
        { audio: "فایل صوتی الزامی است" },
        "فایل صوتی الزامی است"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { audio: "حجم فایل نباید بیشتر از 500 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 500 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic-byte sniff — ID3/frame-sync/OggS/ftyp, not client type.
    const detected = detectAudio(buffer);
    if (!detected) {
      return validationError(
        { audio: "فقط فایل‌های صوتی مجاز هستند" },
        "فرمت‌های مجاز: MP3, WAV, OGG, M4A"
      );
    }

    // ایجاد نام منحصر به فرد برای فایل — ext/mime from magic bytes.
    const timestamp = Date.now();
    const randomString = await randomSlug();
    const filename = `audio_${timestamp}_${randomString}.${detected.ext}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const audioUrl = await saveFileToStorage(
      buffer,
      `books/audio/${filename}`,
      detected.mime
    );

    return successResponse(
      {
        fileName: filename,
        fileUrl: audioUrl,
        fileSize: file.size,
        mimeType: detected.mime,
        uploadedAt: new Date().toISOString()
      },
      "فایل صوتی با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Audio upload error:", error);
    return errorResponse(
      "خطایی در آپلود فایل صوتی رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
