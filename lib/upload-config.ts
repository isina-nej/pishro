/**
 * Upload Configuration
 * مسیرهای مرکزی برای ذخیره‌سازی فایل‌ها
 * 
 * برای تغییر مسیر: فقط UPLOAD_BASE_DIR را در .env تغییر بدهید
 * همه چیز خودکار تنظیم می‌شود
 */

import { join, resolve } from "path";
import { mkdir, access } from "fs/promises";
import { constants } from "fs";

/**
 * Base upload directory
 * این دایرکتوری خارج از پروژه است و برای persistence استفاده می‌شود
 * می‌توانید در .env تنظیم کنید: UPLOAD_BASE_DIR="D:\pishro_uploads"
 */
let BASE_UPLOAD_DIR = process.env.UPLOAD_BASE_DIR || join("D:", "pishro_uploads");

// تبدیل مسیر نسبی به مطلق
BASE_UPLOAD_DIR = resolve(BASE_UPLOAD_DIR);

// Log کردن مسیر فعلی (فقط یک بار در startup)
if (typeof globalThis !== "undefined" && !(globalThis as Record<string, unknown>).uploadConfigLogged) {
  console.log(`📁 Upload Base Directory: ${BASE_UPLOAD_DIR}`);
  (globalThis as Record<string, unknown>).uploadConfigLogged = true;
}

/**
 * Books upload paths
 */
export const BOOKS_UPLOAD_PATHS = {
  // PDF files
  pdfs: {
    dir: join(BASE_UPLOAD_DIR, "books", "pdfs"),
    url: "/api/uploads/books/pdfs",
  },
  // Cover images
  covers: {
    dir: join(BASE_UPLOAD_DIR, "books", "covers"),
    url: "/api/uploads/books/covers",
  },
  // Audio files
  audio: {
    dir: join(BASE_UPLOAD_DIR, "books", "audio"),
    url: "/api/uploads/books/audio",
  },
};

/**
 * Videos upload paths
 */
export const VIDEOS_UPLOAD_PATHS = {
  videos: {
    dir: join(BASE_UPLOAD_DIR, "videos"),
    url: "/api/uploads/videos",
  },
};

/**
 * Get all upload paths (مسیرهای کامل)
 */
export function getAllUploadPaths() {
  return {
    base: BASE_UPLOAD_DIR,
    books: BOOKS_UPLOAD_PATHS,
    videos: VIDEOS_UPLOAD_PATHS,
  };
}

/**
 * Helper function to ensure upload directory exists with silent fallback
 * اگر دایرکتوری ایجاد نتوانست، خودکار ایجاد می‌کند
 */
export async function ensureUploadDirExists(dirPath: string): Promise<void> {
  try {
    // بررسی اینکه دایرکتوری موجود است یا نه
    try {
      await access(dirPath, constants.W_OK);
      // اگر دایرکتوری موجود است، کاری نیست
      return;
    } catch {
      // دایرکتوری موجود نیست، ایجاد می‌کنیم
    }

    // ایجاد دایرکتوری
    await mkdir(dirPath, { recursive: true });
    console.log(`✅ Upload directory created: ${dirPath}`);
  } catch (err) {
    console.error(`⚠️  Could not ensure directory: ${dirPath}`, err);
    // ادامه می‌دهیم چون writeFile خود می‌تواند دایرکتوری ایجاد کند
  }
}

/**
 * Helper function to get full file path from URL
 */
export function getFilePathFromUrl(fileUrl: string): string {
  // fileUrl might be like: /api/downloads/books/pdfs/book_123456_abc.pdf
  // Extract filename and reconstruct full path
  const parts = fileUrl.split("/");
  const filename = parts[parts.length - 1];
  
  if (fileUrl.includes("books/pdfs")) {
    return join(BOOKS_UPLOAD_PATHS.pdfs.dir, filename);
  } else if (fileUrl.includes("books/covers")) {
    return join(BOOKS_UPLOAD_PATHS.covers.dir, filename);
  } else if (fileUrl.includes("books/audio")) {
    return join(BOOKS_UPLOAD_PATHS.audio.dir, filename);
  } else if (fileUrl.includes("videos")) {
    return join(VIDEOS_UPLOAD_PATHS.videos.dir, filename);
  }
  
  return "";
}

/**
 * Generate file URL from filename
 */
export function generateFileUrl(
  type: "pdf" | "cover" | "audio" | "video",
  filename: string
): string {
  switch (type) {
    case "pdf":
      return `${BOOKS_UPLOAD_PATHS.pdfs.url}/${filename}`;
    case "cover":
      return `${BOOKS_UPLOAD_PATHS.covers.url}/${filename}`;
    case "audio":
      return `${BOOKS_UPLOAD_PATHS.audio.url}/${filename}`;
    case "video":
      return `${VIDEOS_UPLOAD_PATHS.videos.url}/${filename}`;
    default:
      return "";
  }
}
