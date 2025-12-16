import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  validationError,
  forbiddenResponse,
  createdResponse,
} from "@/lib/api-response";
import { renameBookFile } from "@/lib/services/book-file-service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedResponse("لطفا وارد شوید");
    if (session.user.role !== "ADMIN") return forbiddenResponse("دسترسی محدود به ادمین");

    const body = await req.json();
    const { url, newFileName } = body || {};

    if (!url) return validationError({ url: "آدرس فایل الزامی است" });
    if (!newFileName) return validationError({ newFileName: "نام جدید فایل الزامی است" });

    try {
      const result = await renameBookFile(url, newFileName);
      return createdResponse(result, "نام فایل با موفقیت تغییر یافت");
    } catch (err) {
      console.error("Rename error:", err);
      return errorResponse("خطا در تغییر نام فایل");
    }
  } catch (error) {
    console.error("Error in rename endpoint:", error);
    return errorResponse("خطا در تغییر نام فایل");
  }
}
