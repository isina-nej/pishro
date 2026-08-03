// @/lib/services/s3-client.ts
/**
 * کلاینت مشترک S3 برای همه سرویس‌های ذخیره‌سازی ابری
 *
 * سازگار با ParsPack، Arvan Cloud، Liara و هر provider سازگار با S3.
 *
 * نکته مهم درباره ParsPack: در پارس‌پک، خودِ هاست نام باکت است.
 * یعنی اگر End Point URL برابر `c773651.parspack.net` باشد، نام باکت هم `c773651` است.
 * - مسیر API (با امضا):   https://c773651.parspack.net/c773651/<key>   ← forcePathStyle
 * - مسیر عمومی (CDN):     https://c773651.parspack.net/<key>           ← باکت از روی هاست حدس زده می‌شود
 */

import { S3Client } from "@aws-sdk/client-s3";

/** آیا ذخیره‌سازی ابری فعال است؟ */
export function isObjectStorageEnabled(): boolean {
  return (
    (process.env.STORAGE_DRIVER || "local").toLowerCase() === "s3" ||
    Boolean(process.env.S3_ENDPOINT && process.env.S3_BUCKET_NAME)
  );
}

/** نام باکت */
export function getBucketName(): string {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME تنظیم نشده است");
  }
  return bucket;
}

/**
 * آدرس پایه برای دسترسی عمومی به فایل‌ها.
 * پیش‌فرض همان S3_ENDPOINT است، چون در پارس‌پک هاست خودش باکت را مشخص می‌کند.
 */
export function getPublicBaseUrl(): string {
  const explicit = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "";
  return explicit.replace(/\/+$/, "");
}

/** ساخت URL عمومی از روی key */
export function buildPublicUrl(key: string): string {
  const base = getPublicBaseUrl();
  const normalized = key.replace(/^\/+/, "");
  return `${base}/${normalized}`;
}

let cachedClient: S3Client | null = null;

/**
 * کلاینت S3 (singleton).
 * region عمداً پیش‌فرض دارد چون پارس‌پک آن را اعتبارسنجی نمی‌کند،
 * ولی AWS SDK بدون region اصلاً درخواست نمی‌سازد.
 */
export function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;

  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) {
    throw new Error("S3_ENDPOINT تنظیم نشده است");
  }

  cachedClient = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    endpoint,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    // پارس‌پک از virtual-hosted style پشتیبانی نمی‌کند (wildcard DNS/TLS ندارد)
    forcePathStyle: true,
  });

  return cachedClient;
}
