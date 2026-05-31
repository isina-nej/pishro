// @/lib/services/storage-adapter.ts
/**
 * Storage Adapter برای ذخیره‌سازی فایل‌ها
 * این adapter از environment variables برای تنظیم مسیر ذخیره‌سازی استفاده می‌کند
 */

import { writeFile, mkdir, unlink, rename } from "fs/promises";
import { dirname, join, relative, resolve } from "path";
import { existsSync } from "fs";
import crypto from "crypto";

export interface StorageConfig {
  // مسیر فیزیکی ذخیره‌سازی فایل‌ها (در سرور)
  storagePath: string;
  // URL پایه برای دسترسی به فایل‌ها
  baseUrl: string;
}

const DEFAULT_UPLOAD_ROOT = "/opt/uploade";
const DEFAULT_UPLOAD_BASE_URL = "/api/uploads";

function normalizeRelativePath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

export function assertSafeStoragePath(
  storageRoot: string,
  relativePath: string
): string {
  const root = resolve(storageRoot);
  const target = resolve(root, normalizeRelativePath(relativePath));
  const rel = relative(root, target);

  if (rel.startsWith("..") || rel === ".." || rel.startsWith(`..${"/"}`)) {
    throw new Error("Invalid storage path");
  }

  return target;
}

/**
 * دریافت تنظیمات storage از environment variables
 */
export function getStorageConfig(): StorageConfig {
  let storagePath =
    process.env.UPLOAD_BASE_DIR ||
    process.env.UPLOAD_STORAGE_PATH ||
    DEFAULT_UPLOAD_ROOT;

  if (!storagePath.startsWith("/")) {
    storagePath = join(process.cwd(), storagePath);
  }

  const baseUrl =
    process.env.UPLOAD_BASE_URL || DEFAULT_UPLOAD_BASE_URL;

  return {
    storagePath: resolve(storagePath),
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
  const normalizedPath = normalizeRelativePath(relativePath);
  const fullPath = assertSafeStoragePath(config.storagePath, normalizedPath);

  // ایجاد دایرکتوری اگر وجود ندارد
  const directory = dirname(fullPath);

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
  return `${config.baseUrl}/${normalizedPath}`;
}

/**
 * حذف فایل از storage
 */
export async function deleteFileFromStorage(
  relativePath: string
): Promise<void> {
  const config = getStorageConfig();
  const fullPath = assertSafeStoragePath(config.storagePath, relativePath);

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
  const baseUrl = config.baseUrl.replace(/\/+$/, "");
  let pathValue = url;

  try {
    if (url.includes("://")) {
      pathValue = new URL(url).pathname;
    }
  } catch {
    pathValue = url;
  }

  if (pathValue.startsWith(`${baseUrl}/`)) {
    return normalizeRelativePath(pathValue.slice(baseUrl.length + 1));
  }

  return normalizeRelativePath(pathValue);
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
  return saveFileToStorage(buffer, relativePath);
}

/**
 * انتقال فایل موقت به مسیر دائمی
 */
export async function promoteTempFileToStorage(
  tempRelativePath: string,
  permanentRelativePath: string
): Promise<string> {
  const config = getStorageConfig();
  const tempRelative = normalizeRelativePath(tempRelativePath);
  const permanentRelative = normalizeRelativePath(permanentRelativePath);
  const tempFull = assertSafeStoragePath(config.storagePath, tempRelative);
  const permanentFull = assertSafeStoragePath(config.storagePath, permanentRelative);
  const directory = dirname(permanentFull);
  await mkdir(directory, { recursive: true });
  await rename(tempFull, permanentFull);
  return `${config.baseUrl}/${permanentRelative}`;
}

/**
 * مسیر مطلق فایل در storage محلی
 */
export function getAbsoluteStoragePath(relativePath: string): string {
  const config = getStorageConfig();
  return assertSafeStoragePath(config.storagePath, relativePath);
}

/**
 * آیا مسیر، فایل موقت است؟
 */
export function isTempStoragePath(relativePath: string): boolean {
  return relativePath.startsWith(`${TMP_PREFIX}/`);
}
