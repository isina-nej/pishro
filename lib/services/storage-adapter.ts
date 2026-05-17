// @/lib/services/storage-adapter.ts
/**
 * Storage Adapter برای ذخیره‌سازی فایل‌ها
 * این adapter از environment variables برای تنظیم مسیر ذخیره‌سازی استفاده می‌کند
 */

import { writeFile, mkdir, unlink, rename } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import crypto from "crypto";

export interface StorageConfig {
  // مسیر فیزیکی ذخیره‌سازی فایل‌ها (در سرور)
  storagePath: string;
  // URL پایه برای دسترسی به فایل‌ها
  baseUrl: string;
}

/**
 * دریافت تنظیمات storage از environment variables
 */
export function getStorageConfig(): StorageConfig {
  // مسیر پیش‌فرض: UPLOAD_BASE_DIR برای local development
  // یا UPLOAD_STORAGE_PATH برای production
  const storagePath =
    process.env.UPLOAD_BASE_DIR ||
    process.env.UPLOAD_STORAGE_PATH ||
    "/var/www/uploads";

  // URL پایه پیش‌فرض: استفاده از /api/uploads endpoint
  // این endpoint فایل‌ها را از UPLOAD_BASE_DIR سرو می‌کند
  const baseUrl =
    process.env.UPLOAD_BASE_URL || "/api/uploads";

  return {
    storagePath,
    baseUrl,
  };
}

/**
 * ذخیره فایل در storage
 */
export async function saveFileToStorage(
  buffer: Buffer,
  relativePath: string
): Promise<string> {
  const config = getStorageConfig();
  // Normalize path to use forward slashes consistently
  const normalizedPath = relativePath.replace(/\\/g, "/");
  const fullPath = join(config.storagePath, normalizedPath).replace(/\\/g, "/");

  // ایجاد دایرکتوری اگر وجود ندارد
  const directory = fullPath.substring(0, fullPath.lastIndexOf("/"));

  try {
    await mkdir(directory, { recursive: true });
  } catch (err) {
    console.error("Error creating directory:", err);
    throw new Error(
      `خطا در ایجاد پوشه آپلود: ${err instanceof Error ? err.message : "خطای نامشخص"}`
    );
  }

  // ذخیره فایل
  try {
    await writeFile(fullPath, buffer);
  } catch (err) {
    console.error("Error writing file:", err);
    throw new Error(
      `خطا در ذخیره فایل: ${err instanceof Error ? err.message : "خطای نامشخص"}`
    );
  }

  // برگرداندن URL کامل
  return `${config.baseUrl}/${relativePath}`;
}

/**
 * حذف فایل از storage
 */
export async function deleteFileFromStorage(
  relativePath: string
): Promise<void> {
  const config = getStorageConfig();
  const fullPath = join(config.storagePath, relativePath);

  // بررسی وجود فایل قبل از حذف
  if (existsSync(fullPath)) {
    try {
      await unlink(fullPath);
    } catch (error) {
      console.error("Error deleting file from storage:", error);
      throw new Error(
        `خطا در حذف فایل: ${error instanceof Error ? error.message : "خطای نامشخص"}`
      );
    }
  }
}

/**
 * تبدیل URL به relative path
 */
export function getRelativePathFromUrl(url: string): string {
  const config = getStorageConfig();
  // حذف base URL از ابتدای لینک
  return url.replace(`${config.baseUrl}/`, "");
}

const TMP_PREFIX = "tmp";

/**
 * مسیر نسبی فایل موقت
 */
export function buildTempRelativePath(fileName: string): string {
  return `${TMP_PREFIX}/${crypto.randomBytes(8).toString("hex")}/${fileName}`;
}

/**
 * ذخیره فایل موقت (قبل از commit فرم)
 */
export async function saveTempFileToStorage(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const relativePath = buildTempRelativePath(fileName);
  await saveFileToStorage(buffer, relativePath);
  return relativePath;
}

/**
 * انتقال فایل موقت به مسیر دائمی
 */
export async function promoteTempFileToStorage(
  tempRelativePath: string,
  permanentRelativePath: string
): Promise<string> {
  const config = getStorageConfig();
  const tempFull = join(config.storagePath, tempRelativePath.replace(/\\/g, "/"));
  const permanentFull = join(
    config.storagePath,
    permanentRelativePath.replace(/\\/g, "/")
  );
  const directory = permanentFull.substring(0, permanentFull.lastIndexOf("/"));
  await mkdir(directory, { recursive: true });
  await rename(tempFull, permanentFull);
  return `${config.baseUrl}/${permanentRelativePath}`;
}

/**
 * مسیر مطلق فایل در storage محلی
 */
export function getAbsoluteStoragePath(relativePath: string): string {
  const config = getStorageConfig();
  return join(config.storagePath, relativePath.replace(/\\/g, "/"));
}

/**
 * آیا مسیر، فایل موقت است؟
 */
export function isTempStoragePath(relativePath: string): boolean {
  return relativePath.startsWith(`${TMP_PREFIX}/`);
}
