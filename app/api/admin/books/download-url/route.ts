// @/app/api/admin/books/download-url/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";
import { generateSignedDownloadUrl } from "@/lib/services/object-storage-service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const body = await req.json();
    const { filePath, expiresIn } = body;

    if (!filePath) {
      return validationError({ filePath: "مسیر فایل الزامی است" });
    }

    const url = await generateSignedDownloadUrl(filePath, expiresIn || 300);
    return successResponse({ url }, "Signed download URL generated");
  } catch (error) {
    console.error("[POST /api/admin/books/download-url] error:", error);
    return errorResponse("خطا در تولید URL دانلود", ErrorCodes.INTERNAL_ERROR);
  }
}
