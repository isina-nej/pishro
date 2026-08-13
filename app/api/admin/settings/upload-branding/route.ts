/**
 * POST /api/admin/settings/upload-branding
 * Upload site logo / favicon / OG image.
 * Form fields: file (or image), kind: logo | favicon | og
 */

import { NextRequest } from "next/server";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  validationError,
} from "@/lib/api-response";
import { requireAdminUser } from "@/lib/admin/landing-cms-api";
import { saveFileToStorage } from "@/lib/services/storage-adapter";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/svg+xml",
];

const KINDS = new Set(["logo", "favicon", "og"]);

export async function POST(req: NextRequest) {
  try {
    const { response, admin } = requireAdminUser(req);
    if (response) return response;
    if (admin?.role !== "ADMIN") {
      return errorResponse(
        "فقط ادمین می‌تواند برندینگ را تغییر دهد",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const formData = await req.formData();
    const file = (formData.get("file") ||
      formData.get("image") ||
      formData.get("logo")) as File | null;
    const kindRaw = String(formData.get("kind") || "logo").toLowerCase();

    if (!file) {
      return validationError({ file: "فایل تصویر الزامی است" });
    }
    if (!KINDS.has(kindRaw)) {
      return validationError(
        { kind: "نوع نامعتبر" },
        "kind باید logo، favicon یا og باشد"
      );
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith(".ico")) {
      return validationError(
        { file: "فرمت نامعتبر" },
        "فقط JPG، PNG، WebP، SVG یا ICO مجاز است"
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { file: "حجم زیاد" },
        "حجم فایل نباید بیشتر از ۵ مگابایت باشد"
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `${kindRaw}_${timestamp}_${random}.${extension}`;
    const url = await saveFileToStorage(
      buffer,
      `branding/${filename}`,
      file.type || "image/png"
    );

    return createdResponse(
      { url, fileName: filename, kind: kindRaw },
      "تصویر برندینگ آپلود شد"
    );
  } catch (error) {
    console.error("Error uploading branding asset:", error);
    return errorResponse(
      "خطا در آپلود تصویر برندینگ",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
