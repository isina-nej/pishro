// @/app/api/admin/books/upload-url/route.ts
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
  generateFileId,
  generateUniqueFileName,
  generateSignedUploadUrlForPath,
  getStoragePath,
} from "@/lib/services/object-storage-service";

/**
 * POST /api/admin/books/upload-url
 * دریافت Signed Upload URL برای آپلود مستقیم فایل‌های کتاب (كاور / فایل کتاب / صوت)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const body = await req.json();
    const { fileName, fileSize, fileFormat, title, resourceType } = body;

    if (!fileName || !fileSize || !fileFormat || !resourceType) {
      return validationError({
        fileName: !fileName ? "نام فایل الزامی است" : "",
        fileSize: !fileSize ? "حجم فایل الزامی است" : "",
        fileFormat: !fileFormat ? "فرمت فایل الزامی است" : "",
        resourceType: !resourceType ? "نوع منبع الزامی است" : "",
      });
    }

    // تعیین فولدر مقصد بر اساس نوع منبع
    let folder = "books/files";
    const allowedFormats: Record<string, string[]> = {
      cover: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
      file: ["pdf", "epub", "mobi", "azw3", "zip"],
      audio: ["mp3", "aac", "wav", "ogg", "m4a"],
    };

    const MAX_SIZES: Record<string, number> = {
      cover: 100 * 1024 * 1024, // 100MB
      file: 20 * 1024 * 1024 * 1024, // 20GB
      audio: 5 * 1024 * 1024 * 1024, // 5GB
    };

    if (!Object.keys(allowedFormats).includes(resourceType)) {
      return validationError({ resourceType: "resourceType نامعتبر است" });
    }

    if (resourceType === "cover") folder = "books/covers";
    if (resourceType === "audio") folder = "books/audios";

    // بررسی فرمت فایل
    const extension = fileFormat.toLowerCase();
    if (!allowedFormats[resourceType].includes(extension)) {
      return validationError({
        fileFormat: `فرمت فایل نامعتبر است. فرمت‌های مجاز: ${allowedFormats[resourceType].join(", ")}`,
      });
    }

    // بررسی حجم فایل
    const max = MAX_SIZES[resourceType];
    if (fileSize > max) {
      return validationError({ fileSize: `حجم فایل نباید بیشتر از ${Math.floor(max / (1024 * 1024))}MB باشد` });
    }

    const fileId = generateFileId();
    const uniqueFileName = generateUniqueFileName(fileId, fileName);
    const storagePath = getStoragePath(folder, fileId, uniqueFileName);
    // Try to map extension to common content-type
    const extensionToContentType: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      epub: 'application/epub+zip',
      mobi: 'application/x-mobipocket-ebook',
      azw3: 'application/vnd.amazon.ebook',
      zip: 'application/zip',
      mp3: 'audio/mpeg',
      aac: 'audio/aac',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4',
    };

    const contentType = extensionToContentType[extension] || (resourceType === 'cover' ? `image/${extension}` : resourceType === 'audio' ? `audio/${extension}` : `application/${extension}`);

    const uploadUrl = await generateSignedUploadUrlForPath(storagePath, contentType, 3600);
    const expiresAt = Date.now() + 3600 * 1000;

    return successResponse(
      {
        uploadUrl,
        fileId,
        storagePath,
        uniqueFileName,
        expiresAt,
        metadata: { title, fileSize, fileFormat, resourceType },
      },
      "URL آپلود با موفقیت ایجاد شد"
    );
  } catch (error) {
    console.error("[POST /api/admin/books/upload-url] error:", error);
    return errorResponse("خطایی در ایجاد URL آپلود رخ داد", ErrorCodes.INTERNAL_ERROR);
  }
}
