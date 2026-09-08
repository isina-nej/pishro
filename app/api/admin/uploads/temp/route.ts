import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { saveTempFileToStorage } from "@/lib/services/storage-adapter";
import {
  validateThumbnailFile,
  validateVideoFile,
} from "@/lib/schemas/course-management-schema";

export const runtime = "nodejs";

const MAX_MULTIPART_BODY_BYTES = 550 * 1024 * 1024;

/**
 * POST /api/admin/uploads/temp
 * Store upload as tmp/... until form commit
 */
export async function POST(req: NextRequest) {
  let errorDetails = "";
  try {
    // Accept Bearer header or httpOnly admin cookie (same as other admin routes).
    const adminUser = getAdminAuthFromHeaders(req.headers);

    if (!adminUser) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_MULTIPART_BODY_BYTES) {
      return errorResponse(
        "حجم فایل برای آپلود بسیار زیاد است",
        ErrorCodes.VALIDATION_ERROR,
        { maxSizeMb: 500 },
        413
      );
    }

    let formData;
    try {
      errorDetails = "FormData parsing";
      formData = await req.formData();
    } catch (fde) {
      console.error("[POST /api/admin/uploads/temp] FormData parsing error:", fde);
      return errorResponse(
        "درخواست آپلود ناقص یا نامعتبر است. لطفا فایل را دوباره انتخاب و ارسال کنید",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        400
      );
    }

    const file = formData.get("file");
    const kind = formData.get("kind"); // thumbnail | video

    if (!(file instanceof File)) {
      return errorResponse(
        "فایل الزامی است",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    const validationError =
      kind === "video"
        ? validateVideoFile({ type: file.type, size: file.size })
        : validateThumbnailFile({ type: file.type, size: file.size });

    if (validationError) {
      return errorResponse(
        validationError,
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      errorDetails = "Buffer conversion";
      const buffer = Buffer.from(await file.arrayBuffer());

      errorDetails = "File storage";
      const tempPath = await saveTempFileToStorage(buffer, file.name);

      return successResponse(
        { tempPath, fileName: file.name, mimeType: file.type },
        "فایل موقت ذخیره شد"
      );
    } catch (processError) {
      console.error(`[POST /api/admin/uploads/temp] Error during ${errorDetails}:`, processError);
      throw processError;
    }
  } catch (error) {
    console.error("[POST /api/admin/uploads/temp] error:", error);
    if (error instanceof Error) {
      if (error.message.includes("EACCES") || error.message.includes("permission denied")) {
        return errorResponse(
          "مسیر ذخیره‌سازی آپلود قابل نوشتن نیست. لطفا دسترسی UPLOAD_BASE_DIR را تنظیم کنید",
          ErrorCodes.INTERNAL_ERROR,
          { uploadBaseDir: process.env.UPLOAD_BASE_DIR || "/opt/uploade" },
          500
        );
      }
    }
    return errorResponse(
      `خطا در آپلود فایل${errorDetails ? ` (${errorDetails})` : ""}`,
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
