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
import { randomSlug, sniffUpload } from "@/lib/upload-validation";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const KINDS = new Set(["logo", "favicon", "og"]);

// favicon .ico magic: 00 00 01 00
function isIco(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x00 &&
    buffer[1] === 0x00 &&
    buffer[2] === 0x01 &&
    buffer[3] === 0x00
  );
}

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
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { file: "حجم زیاد" },
        "حجم فایل نباید بیشتر از ۵ مگابایت باشد"
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Magic-byte sniff — file.type / extension are client-controlled.
    // SVG allowed here (logos) but stored only for ADMIN role above.
    let ext: string;
    let mime: string;
    if (isIco(buffer)) {
      ext = "ico";
      mime = "image/x-icon";
    } else if (
      buffer.length >= 5 &&
      buffer.toString("utf8", 0, 5).trimStart().startsWith("<svg")
    ) {
      ext = "svg";
      mime = "image/svg+xml";
    } else {
      const detected = sniffUpload(buffer, ["image"]);
      if (!detected || detected.kind !== "image") {
        return validationError(
          { file: "فرمت نامعتبر" },
          "فقط JPG، PNG، WebP، SVG یا ICO مجاز است"
        );
      }
      ext = detected.ext;
      mime = detected.mime;
    }

    const timestamp = Date.now();
    const random = await randomSlug(5);
    const filename = `${kindRaw}_${timestamp}_${random}.${ext}`;
    const url = await saveFileToStorage(buffer, `branding/${filename}`, mime);

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
