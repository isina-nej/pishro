import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { saveTempFileToStorage } from "@/lib/services/storage-adapter";
import {
  validateThumbnailFile,
  validateVideoFile,
} from "@/lib/schemas/course-management-schema";

/**
 * POST /api/admin/uploads/temp
 * Store upload as tmp/... until form commit
 */
export async function POST(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const kind = formData.get("kind"); // thumbnail | video

    if (!(file instanceof File)) {
      return errorResponse("فایل الزامی است", ErrorCodes.VALIDATION_ERROR);
    }

    const validationError =
      kind === "video"
        ? validateVideoFile({ type: file.type, size: file.size })
        : validateThumbnailFile({ type: file.type, size: file.size });

    if (validationError) {
      return errorResponse(validationError, ErrorCodes.VALIDATION_ERROR);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = await saveTempFileToStorage(buffer, file.name);

    return successResponse(
      { tempPath, fileName: file.name, mimeType: file.type },
      "فایل موقت ذخیره شد"
    );
  } catch (error) {
    console.error("[POST /api/admin/uploads/temp] error:", error);
    return errorResponse(
      "خطا در آپلود فایل",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
