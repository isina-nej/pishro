/**
 * Admin Books PDF Upload API
 * POST /api/admin/books/upload-pdf - Upload a PDF file for a digital book
 */

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
import { detectPdf, randomSlug } from "@/lib/upload-validation";

// تنظیمات مجاز برای آپلود PDF کتاب
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB — matches the error message

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
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return validationError(
        { pdf: "فایل PDF الزامی است" },
        "فایل PDF الزامی است"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { pdf: "حجم فایل نباید بیشتر از 100 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 100 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic-byte sniff — %PDF- header, not client type/extension.
    const detected = detectPdf(buffer);
    if (!detected) {
      return validationError(
        { pdf: "فقط فایل‌های PDF مجاز هستند" },
        "فقط فرمت PDF مجاز است"
      );
    }

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = await randomSlug();
    const filename = `book_${timestamp}_${randomString}.pdf`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const pdfUrl = await saveFileToStorage(
      buffer,
      `books/pdfs/${filename}`,
      detected.mime
    );

    return successResponse(
      {
        fileName: file.name,
        fileUrl: pdfUrl,
        fileSize: file.size,
        mimeType: detected.mime,
        uploadedAt: new Date().toISOString()
      },
      "فایل PDF با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return errorResponse(
      "خطا در آپلود فایل PDF:" + (error instanceof Error ? error.message : String(error)),
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
