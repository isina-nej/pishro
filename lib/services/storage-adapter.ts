// @/lib/services/storage-adapter.ts
/**
 * Storage Adapter برای ذخیره‌سازی فایل‌ها
 *
 * این فایل façade واحد ذخیره‌سازی است و بین دو درایور سوییچ می‌کند:
 *   STORAGE_DRIVER=local  → دیسک محلی (پیش‌فرض، برای توسعه)
 *   STORAGE_DRIVER=s3     → فضای ابری پارس‌پک / هر S3 سازگار
 *
 * همه روت‌های آپلود باید از این فایل استفاده کنند، نه از fs مستقیم.
 */

import { writeFile, mkdir, unlink, rename } from "fs/promises";
import { dirname, isAbsolute, relative, resolve } from "path";
import { existsSync } from "fs";
import crypto from "crypto";
import {
  saveFileToS3,
  deleteFileFromS3,
  promoteTempFileInS3,
  isPrivateStoragePath,
  guessContentType,
} from "@/lib/services/storage-s3";
import { getPublicBaseUrl } from "@/lib/services/s3-client";

export interface StorageConfig {
  // مسیر فیزیکی ذخیره‌سازی فایل‌ها (در سرور)
  storagePath: string;
  // URL پایه برای دسترسی به فایل‌ها
  baseUrl: string;
}

export type StorageDriver = "local" | "s3";

/** ریشهٔ پیش‌فرض خارج از فولدر کد — روی سرور پروداکشن */
export const DEFAULT_UPLOAD_ROOT = "/opt/uploade";
const DEFAULT_UPLOAD_BASE_URL = "/api/uploads";

/** درایور فعال ذخیره‌سازی */
export function getStorageDriver(): StorageDriver {
  return (process.env.STORAGE_DRIVER || "local").toLowerCase() === "s3"
    ? "s3"
    : "local";
}

function normalizeRelativePath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

/**
 * آیا مسیر `candidate` داخل `parent` (یا خود آن) است؟
 */
export function isPathInsideDir(candidate: string, parent: string): boolean {
  const resolvedParent = resolve(parent);
  const resolvedCandidate = resolve(candidate);
  const rel = relative(resolvedParent, resolvedCandidate);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

/**
 * ریشهٔ دیسک محلی برای آپلودها.
 * همیشه خارج از فولدر پروژه resolve می‌شود تا deploy/git فایل‌های ادمین را نبرد.
 */
export function resolveUploadRoot(
  configured?: string | null,
  projectRoot: string = process.cwd()
): string {
  const raw =
    (configured ??
      process.env.UPLOAD_BASE_DIR ??
      process.env.UPLOAD_STORAGE_PATH ??
      DEFAULT_UPLOAD_ROOT)
      .trim() || DEFAULT_UPLOAD_ROOT;

  let storagePath: string;
  if (isAbsolute(raw)) {
    storagePath = resolve(raw);
  } else {
    console.warn(
      `[storage] مسیر نسبی آپلود (${raw}) نادیده گرفته شد؛ از ${DEFAULT_UPLOAD_ROOT} استفاده می‌شود.`
    );
    storagePath = DEFAULT_UPLOAD_ROOT;
  }

  if (isPathInsideDir(storagePath, projectRoot)) {
    console.warn(
      `[storage] UPLOAD_BASE_DIR (${storagePath}) داخل فولدر کد است؛ به ${DEFAULT_UPLOAD_ROOT} منتقل شد.`
    );
    return DEFAULT_UPLOAD_ROOT;
  }

  return storagePath;
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
  const baseUrl =
    process.env.UPLOAD_BASE_URL || DEFAULT_UPLOAD_BASE_URL;

  return {
    storagePath: resolveUploadRoot(),
    baseUrl,
  };
}

/**
 * ذخیره فایل در storage
 * @returns آدرس قابل استفاده فایل (URL مستقیم ابری برای فایل‌های عمومی)
 */
export async function saveFileToStorage(
  buffer: Buffer,
  relativePath: string,
  contentType?: string
): Promise<string> {
  const normalizedPath = normalizeRelativePath(relativePath);

  if (getStorageDriver() === "s3") {
    return saveFileToS3(
      buffer,
      normalizedPath,
      contentType || guessContentType(normalizedPath)
    );
  }

  const config = getStorageConfig();
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
  const normalizedPath = normalizeRelativePath(relativePath);

  if (getStorageDriver() === "s3") {
    try {
      await deleteFileFromS3(normalizedPath);
    } catch (error) {
      console.error("Error deleting file from object storage:", error);
      throw new Error(
        `خطا در حذف فایل: ${error instanceof Error ? error.message : "خطای نامشخص"}`
      );
    }
    return;
  }

  const config = getStorageConfig();
  const fullPath = assertSafeStoragePath(config.storagePath, normalizedPath);

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
 *
 * سه شکل ورودی را پشتیبانی می‌کند:
 *   https://c773651.parspack.net/images/x.jpg  → images/x.jpg   (URL مستقیم ابری)
 *   /api/uploads/images/x.jpg                  → images/x.jpg   (مسیر اپ)
 *   images/x.jpg                               → images/x.jpg   (از قبل نسبی)
 */
export function getRelativePathFromUrl(url: string): string {
  const config = getStorageConfig();
  const baseUrl = config.baseUrl.replace(/\/+$/, "");
  const publicBase = getPublicBaseUrl();
  let pathValue = url;

  // آدرس مستقیم فضای ابری
  if (publicBase && url.startsWith(`${publicBase}/`)) {
    return normalizeRelativePath(url.slice(publicBase.length + 1));
  }

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
  const tempRelative = normalizeRelativePath(tempRelativePath);
  const permanentRelative = normalizeRelativePath(permanentRelativePath);

  if (getStorageDriver() === "s3") {
    return promoteTempFileInS3(tempRelative, permanentRelative);
  }

  const config = getStorageConfig();
  const tempFull = assertSafeStoragePath(config.storagePath, tempRelative);
  const permanentFull = assertSafeStoragePath(config.storagePath, permanentRelative);
  const directory = dirname(permanentFull);
  await mkdir(directory, { recursive: true });
  await rename(tempFull, permanentFull);
  return `${config.baseUrl}/${permanentRelative}`;
}

/**
 * مسیر مطلق فایل در storage محلی
 * ⚠️ فقط در حالت درایور local معنا دارد.
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

export { isPrivateStoragePath };
