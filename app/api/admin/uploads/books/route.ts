import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  createdResponse,
  validationError,
  forbiddenResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { uploadBookFile } from "@/lib/services/book-file-service";
import { BookFileType } from "@/lib/services/book-file-service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as BookFileType) || "file";
    const desiredFileName = (formData.get("fileName") as string) || undefined;

    if (!file) {
      return validationError({ file: "فایل الزامی است" });
    }

    if (!["image", "file", "audio"].includes(type)) {
      return validationError({ type: "نوع فایل نامعتبر است" });
    }

    try {
      const result = await uploadBookFile({ file, type, desiredFileName });
      return createdResponse(result, "فایل با موفقیت آپلود شد");
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      const message = uploadError instanceof Error ? uploadError.message : "خطا در آپلود فایل";
      return errorResponse(message, ErrorCodes.EXTERNAL_SERVICE_ERROR);
    }
  } catch (error) {
    console.error("Error in book upload endpoint:", error);
    return errorResponse("خطا در آپلود فایل کتاب", ErrorCodes.INTERNAL_ERROR);
  }
}
