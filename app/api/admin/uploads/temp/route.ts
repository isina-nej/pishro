import { NextRequest } from "next/server";
import { verifyAdminAccessToken } from "@/lib/admin-auth";
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
  let errorDetails = "";
  try {
    // Verify admin access token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error("[POST /api/admin/uploads/temp] Missing Authorization header");
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const token = authHeader.slice(7);
    const adminUser = verifyAdminAccessToken(token);
    
    if (!adminUser) {
      console.error("[POST /api/admin/uploads/temp] Invalid or expired token");
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    console.log("[POST /api/admin/uploads/temp] Auth successful for admin:", adminUser.id);

    let formData;
    try {
      errorDetails = "FormData parsing";
      console.log("[POST /api/admin/uploads/temp] Attempting to parse FormData");
      formData = await req.formData();
      console.log("[POST /api/admin/uploads/temp] FormData parsed successfully");
    } catch (fde) {
      console.error("[POST /api/admin/uploads/temp] FormData parsing error:", fde);
      errorDetails = `FormData parsing failed: ${fde instanceof Error ? fde.message : String(fde)}`;
      throw fde;
    }

    const file = formData.get("file");
    const kind = formData.get("kind"); // thumbnail | video

    console.log("[POST /api/admin/uploads/temp] File:", file instanceof File ? file.name : "Not a file", "Kind:", kind);

    if (!(file instanceof File)) {
      console.error("[POST /api/admin/uploads/temp] File validation failed - not a File");
      return errorResponse("فایل الزامی است", ErrorCodes.VALIDATION_ERROR);
    }

    const validationError =
      kind === "video"
        ? validateVideoFile({ type: file.type, size: file.size })
        : validateThumbnailFile({ type: file.type, size: file.size });

    if (validationError) {
      console.error("[POST /api/admin/uploads/temp] Validation error:", validationError);
      return errorResponse(validationError, ErrorCodes.VALIDATION_ERROR);
    }

    try {
      errorDetails = "Buffer conversion";
      console.log("[POST /api/admin/uploads/temp] Converting file to buffer");
      const buffer = Buffer.from(await file.arrayBuffer());
      
      errorDetails = "File storage";
      console.log("[POST /api/admin/uploads/temp] Saving temp file");
      const tempPath = await saveTempFileToStorage(buffer, file.name);
      
      console.log("[POST /api/admin/uploads/temp] File saved successfully:", tempPath);

      return successResponse(
        { tempPath, fileName: file.name, mimeType: file.type },
        "فایل موقت ذخیره شد"
      );
    } catch (processError) {
      console.error(`[POST /api/admin/uploads/temp] Error during ${errorDetails}:`, processError);
      throw processError;
    }
  } catch (error) {
    console.error("[POST /api/admin/uploads/temp] Caught error:", error);
    if (error instanceof Error) {
      console.error("[POST /api/admin/uploads/temp] Error message:", error.message);
      console.error("[POST /api/admin/uploads/temp] Error name:", error.name);
      console.error("[POST /api/admin/uploads/temp] Error stack:", error.stack);
    }
    return errorResponse(
      `خطا در آپلود فایل${errorDetails ? ` (${errorDetails})` : ""}`,
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
