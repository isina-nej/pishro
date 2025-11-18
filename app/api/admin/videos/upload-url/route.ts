// @/app/api/admin/videos/upload-url/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";
import {
  generateVideoId,
  generateUniqueFileName,
  generateSignedUploadUrl,
  getVideoStoragePath,
} from "@/lib/services/object-storage-service";
import type { RequestUploadUrlInput } from "@/types/video";

/**
 * POST /api/admin/videos/upload-url
 * دریافت Signed Upload URL برای آپلود مستقیم ویدیو از مرورگر
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const body: RequestUploadUrlInput = await req.json();
    const { fileName, fileSize, fileFormat, title, description } = body;

    // Validation
    if (!fileName || !fileSize || !fileFormat || !title) {
      return validationError({
        fileName: !fileName ? "نام فایل الزامی است" : "",
        fileSize: !fileSize ? "حجم فایل الزامی است" : "",
        fileFormat: !fileFormat ? "فرمت فایل الزامی است" : "",
        title: !title ? "عنوان ویدیو الزامی است" : "",
      });
    }

    // بررسی فرمت فایل
    const allowedFormats = ["mp4", "mov", "avi", "mkv", "webm"];
    if (!allowedFormats.includes(fileFormat.toLowerCase())) {
      return validationError({
        fileFormat: `فرمت فایل باید یکی از موارد زیر باشد: ${allowedFormats.join(", ")}`,
      });
    }

    // بررسی حجم فایل (حداکثر 5GB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
    if (fileSize > MAX_FILE_SIZE) {
      return validationError({
        fileSize: "حجم فایل نباید بیشتر از 5 گیگابایت باشد",
      });
    }

    // تولید videoId یکتا
    const videoId = generateVideoId();

    // تولید نام فایل یکتا
    const uniqueFileName = generateUniqueFileName(videoId, fileName);

    // محاسبه مسیر فایل در storage
    const storagePath = getVideoStoragePath(videoId, uniqueFileName);

    // تولید content-type
    const contentType = `video/${fileFormat.toLowerCase()}`;

    // تولید Signed Upload URL (معتبر برای 1 ساعت)
    const uploadUrl = await generateSignedUploadUrl(
      videoId,
      uniqueFileName,
      contentType,
      3600 // 1 ساعت
    );

    const expiresAt = Date.now() + 3600 * 1000;

    return successResponse(
      {
        uploadUrl,
        videoId,
        storagePath,
        uniqueFileName,
        expiresAt,
        metadata: {
          title,
          description,
          fileSize,
          fileFormat,
        },
      },
      "URL آپلود با موفقیت ایجاد شد"
    );
  } catch (error) {
    console.error("[POST /api/admin/videos/upload-url] error:", error);
    return errorResponse(
      "خطایی در ایجاد URL آپلود رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
