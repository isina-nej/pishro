// @/lib/services/storage-adapter.ts
/**
 * Storage Adapter برای ذخیره‌سازی فایل‌ها
 * این adapter از environment variables برای تنظیم مسیر ذخیره‌سازی استفاده می‌کند
 */

import { writeFile, mkdir, unlink, rename } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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
  // مسیر پیش‌فرض: /var/www/uploads
  const storagePath =
    process.env.UPLOAD_STORAGE_PATH || "/var/www/uploads";

  // URL پایه پیش‌فرض: از domain اصلی با prefix /uploads
  const baseUrl =
    process.env.UPLOAD_BASE_URL || "https://www.pishrosarmaye.com/uploads";

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
  const fullPath = join(config.storagePath, relativePath);

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

/**
 * انتقال یا تغییر نام فایل در storage
 */
export async function moveFileInStorage(
  oldRelativePath: string,
  newRelativePath: string
): Promise<string> {
  const config = getStorageConfig();
  const oldFullPath = join(config.storagePath, oldRelativePath);
  const newFullPath = join(config.storagePath, newRelativePath);

  // ایجاد دایرکتوری مقصد در صورت عدم وجود
  const newDirectory = newFullPath.substring(0, newFullPath.lastIndexOf("/"));
  try {
    await mkdir(newDirectory, { recursive: true });
  } catch (err) {
    console.error("Error creating directory for move:", err);
    throw new Error(
      `خطا در ایجاد پوشه مقصد هنگام جابجایی فایل: ${err instanceof Error ? err.message : "خطای نامشخص"}`
    );
  }

  try {
    await rename(oldFullPath, newFullPath);
  } catch (err) {
    console.error("Error moving file:", err);
    throw new Error(
      `خطا در جابجایی فایل: ${err instanceof Error ? err.message : "خطای نامشخص"}`
    );
  }

  return `${config.baseUrl}/${newRelativePath}`;
}
