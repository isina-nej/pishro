import { NextRequest } from "next/server";
// storage-adapter used for writing files (respects env variables)
import { saveFileToStorage } from "@/lib/services/storage-adapter";
import { auth } from "@/auth";
import {
  successResponse,
  unauthorizedResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// Allowed types and sizes
const MAX_BOOK_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_AUDIO_SIZE = 200 * 1024 * 1024; // 200MB
const MAX_COVER_SIZE = 10 * 1024 * 1024; // 10MB

const BOOK_TYPES = ["application/pdf", "application/epub+zip", "application/octet-stream"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/m4a", "audio/wav", "audio/webm", "audio/ogg"];
const IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export async function POST(req: NextRequest) {
  try {
    // Auth - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }
    if (session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const formData = await req.formData();
    // We'll accept 'book' for the main file, 'audio' for audio, and 'cover' for image
    const bookFile = formData.get("book") as File | null;
    const audioFile = formData.get("audio") as File | null;
    const coverFile = formData.get("cover") as File | null;

    if (!bookFile && !audioFile && !coverFile) {
      return validationError({ file: "فایل آپلود نشده است" }, "File is required");
    }

    // Helper to save a file
      async function saveFile(file: File, subdir: string, maxSize: number, allowedTypes: string[]) {
      if (!allowedTypes.includes(file.type)) {
        throw new Error("INVALID_TYPE");
      }
      if (file.size > maxSize) {
        throw new Error("MAX_SIZE_EXCEEDED");
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const filename = `${subdir}_${timestamp}_${randomString}.${extension}`;
      const relativePath = `books/${subdir}/${filename}`;
      // Use storage adapter to save (supports env UPLOAD_STORAGE_PATH/UPLOAD_BASE_URL)
      const url = await saveFileToStorage(buffer, relativePath);
      return { url, filename, size: file.size, type: file.type };
    }

    interface UploadResult {
      field: "fileUrl" | "audioUrl" | "cover";
      url: string;
      filename: string;
    }

    const results: UploadResult[] = [];
    if (bookFile) {
      try {
        const saved = await saveFile(bookFile, "files", MAX_BOOK_SIZE, BOOK_TYPES);
        results.push({ field: "fileUrl", url: saved.url, filename: saved.filename });
      } catch (err) {
        if (err instanceof Error && err.message === "INVALID_TYPE") {
          return validationError({ book: "فرمت فایل کتاب معتبر نیست" }, "invalid file type");
        }
        if (err instanceof Error && err.message === "MAX_SIZE_EXCEEDED") {
          return validationError({ book: "حجم فایل کتاب خیلی بزرگ است" }, "file too large");
        }
        throw err;
      }
    }

    if (audioFile) {
      try {
        const saved = await saveFile(audioFile, "audios", MAX_AUDIO_SIZE, AUDIO_TYPES);
        results.push({ field: "audioUrl", url: saved.url, filename: saved.filename });
      } catch (err) {
        if (err instanceof Error && err.message === "INVALID_TYPE") {
          return validationError({ audio: "فرمت فایل صوتی معتبر نیست" }, "invalid audio file type");
        }
        if (err instanceof Error && err.message === "MAX_SIZE_EXCEEDED") {
          return validationError({ audio: "حجم فایل صوتی خیلی بزرگ است" }, "audio too large");
        }
        throw err;
      }
    }

    if (coverFile) {
      try {
        const saved = await saveFile(coverFile, "covers", MAX_COVER_SIZE, IMAGE_TYPES);
        results.push({ field: "cover", url: saved.url, filename: saved.filename });
      } catch (err) {
        if (err instanceof Error && err.message === "INVALID_TYPE") {
          return validationError({ cover: "فرمت تصویر معتبر نیست" }, "invalid image type");
        }
        if (err instanceof Error && err.message === "MAX_SIZE_EXCEEDED") {
          return validationError({ cover: "حجم تصویر خیلی بزرگ است" }, "image too large");
        }
        throw err;
      }
    }

    return successResponse({ uploads: results }, "فایل(ها) با موفقیت آپلود شد");
  } catch (error) {
    console.error("Books upload error:", error);
    return errorResponse("خطایی در آپلود فایل رخ داد", ErrorCodes.INTERNAL_ERROR);
  }
}

export const dynamic = "force-dynamic";
