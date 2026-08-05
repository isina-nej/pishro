/**
 * Upload Configuration
 * مسیرهای مرکزی برای ذخیره‌سازی فایل‌ها
 *
 * ریشه همیشه از storage-adapter گرفته می‌شود تا خارج از فولدر کد باشد.
 * برای تغییر مسیر: فقط UPLOAD_BASE_DIR را در .env به یک مسیر مطلق خارج از پروژه بگذارید
 * (پیش‌فرض: /opt/uploade) یا STORAGE_DRIVER=s3 برای فضای ابری.
 */

import { join } from "path";
import { mkdir, access } from "fs/promises";
import { constants } from "fs";
import { getStorageConfig } from "@/lib/services/storage-adapter";

function getBaseUploadDir(): string {
  return getStorageConfig().storagePath;
}

/**
 * Books upload paths
 */
export const BOOKS_UPLOAD_PATHS = {
  pdfs: {
    get dir() {
      return join(getBaseUploadDir(), "books", "pdfs");
    },
    url: "/api/uploads/books/pdfs",
  },
  covers: {
    get dir() {
      return join(getBaseUploadDir(), "books", "covers");
    },
    url: "/api/uploads/books/covers",
  },
  audio: {
    get dir() {
      return join(getBaseUploadDir(), "books", "audio");
    },
    url: "/api/uploads/books/audio",
  },
};

export const COURSES_UPLOAD_PATHS = {
  root: {
    get dir() {
      return join(getBaseUploadDir(), "courses");
    },
    url: "/api/uploads/courses",
  },
  covers: {
    get dir() {
      return join(getBaseUploadDir(), "courses", "<courseId>", "cover");
    },
    url: "/api/uploads/courses/<courseId>/cover",
  },
  trailers: {
    get dir() {
      return join(getBaseUploadDir(), "courses", "<courseId>", "trailer");
    },
    url: "/api/uploads/courses/<courseId>/trailer",
  },
  lessons: {
    get dir() {
      return join(
        getBaseUploadDir(),
        "courses",
        "<courseId>",
        "lessons",
        "<lessonId>"
      );
    },
    url: "/api/uploads/courses/<courseId>/lessons/<lessonId>",
  },
};

export const IMAGES_UPLOAD_PATHS = {
  root: {
    get dir() {
      return join(getBaseUploadDir(), "images");
    },
    url: "/api/uploads/images",
  },
};

export const TEMP_UPLOAD_PATHS = {
  get dir() {
    return join(getBaseUploadDir(), "tmp");
  },
  url: "/api/uploads/tmp",
};

/**
 * Videos upload paths
 */
export const VIDEOS_UPLOAD_PATHS = {
  videos: {
    get dir() {
      return join(getBaseUploadDir(), "videos");
    },
    url: "/api/uploads/videos",
  },
};

/**
 * Get all upload paths (مسیرهای کامل)
 */
export function getAllUploadPaths() {
  return {
    base: getBaseUploadDir(),
    temp: TEMP_UPLOAD_PATHS,
    books: BOOKS_UPLOAD_PATHS,
    courses: COURSES_UPLOAD_PATHS,
    images: IMAGES_UPLOAD_PATHS,
    videos: VIDEOS_UPLOAD_PATHS,
  };
}

/**
 * Helper function to ensure upload directory exists with silent fallback
 * اگر دایرکتوری ایجاد نتوانست، خودکار ایجاد می‌کند
 */
export async function ensureUploadDirExists(dirPath: string): Promise<void> {
  try {
    try {
      await access(dirPath, constants.W_OK);
      return;
    } catch {
      // دایرکتوری موجود نیست، ایجاد می‌کنیم
    }

    await mkdir(dirPath, { recursive: true });
    console.log(`✅ Upload directory created: ${dirPath}`);
  } catch (err) {
    console.error(`⚠️  Could not ensure directory: ${dirPath}`, err);
  }
}

/**
 * Helper function to get full file path from URL
 */
export function getFilePathFromUrl(fileUrl: string): string {
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
