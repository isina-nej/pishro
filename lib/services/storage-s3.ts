// @/lib/services/storage-s3.ts
/**
 * پیاده‌سازی ذخیره‌سازی روی S3 (ParsPack و سایر providerهای سازگار)
 *
 * این فایل لایه پایین است و مستقیماً در روت‌ها استفاده نمی‌شود؛
 * از `storage-adapter.ts` (façade) صدا زده می‌شود.
 *
 * ⚠️ نکته امنیتی: همه فایل‌ها در یک باکت مشترک قرار می‌گیرند.
 * بنابراین باکت باید در پنل پارس‌پک **خصوصی** بماند و فقط آبجکت‌های عمومی
 * با ACL `public-read` آپلود شوند. اگر باکت را کلاً public کنید،
 * ویدیوی دوره‌ها و بکاپ دیتابیس هم برای همه قابل دانلود می‌شود.
 */

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream } from "fs";
import { extname } from "path";
import {
  getS3Client,
  getBucketName,
  buildPublicUrl,
} from "@/lib/services/s3-client";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".ogg": "audio/ogg",
  ".mp3": "audio/mpeg",
  ".pdf": "application/pdf",
  ".epub": "application/epub+zip",
  ".zip": "application/zip",
  ".gz": "application/gzip",
  ".json": "application/json",
  ".txt": "text/plain",
};

/** حدس Content-Type از روی پسوند فایل */
export function guessContentType(filePath: string): string {
  return MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
}

/**
 * مسیرهایی که **نباید** عمومی باشند.
 * این‌ها همیشه از طریق اپلیکیشن و با کنترل دسترسی سرو می‌شوند.
 */
const PRIVATE_PATH_PATTERNS: RegExp[] = [
  /^backups\//i, // بکاپ دیتابیس
  /^videos\//i, // ویدیوی خام دوره‌ها
  /^hls\//i, // خروجی HLS
  /^tmp\//i, // فایل‌های موقت قبل از commit
  /^books\/pdfs\//i, // فایل کتاب (محتوای خریداری‌شده)
  /^books\/audio\//i, // کتاب صوتی (محتوای خریداری‌شده)
  /^courses\/[^/]+\/lessons\/[^/]+\/video\//i, // ویدیوی درس
  /^courses\/[^/]+\/trailer\//i, // تریلر هم تا زمان انتشار خصوصی است
];

/** آیا این مسیر باید خصوصی بماند؟ */
export function isPrivateStoragePath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return PRIVATE_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

/** آیا ACL عمومی روی آبجکت‌ها ست شود؟ (بعضی providerها ACL را رد می‌کنند) */
function shouldSetPublicAcl(): boolean {
  return (process.env.S3_PUBLIC_ACL || "true").toLowerCase() !== "false";
}

/**
 * آپلود فایل به S3
 * @returns آدرس نهایی فایل — برای عمومی‌ها URL مستقیم پارس‌پک، برای خصوصی‌ها مسیر اپ
 */
export async function saveFileToS3(
  buffer: Buffer,
  relativePath: string,
  contentType?: string
): Promise<string> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const isPrivate = isPrivateStoragePath(key);

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      Body: buffer,
      ContentType: contentType || guessContentType(key),
      CacheControl: isPrivate
        ? "private, no-store"
        : "public, max-age=31536000, immutable",
      ...(!isPrivate && shouldSetPublicAcl() ? { ACL: "public-read" as const } : {}),
    })
  );

  return isPrivate ? `/api/uploads/${key}` : buildPublicUrl(key);
}

/**
 * آپلود استریمی فایل بزرگ از روی دیسک به S3 (multipart)
 *
 * برای فایل‌هایی مثل PDF یک گیگابایتی یا ویدیو استفاده می‌شود تا
 * کل فایل در حافظه بارگذاری نشود.
 *
 * @param localFilePath مسیر مطلق فایل روی دیسک
 * @param relativePath  کلید مقصد در باکت
 */
export async function uploadFileStreamToS3(
  localFilePath: string,
  relativePath: string,
  contentType?: string
): Promise<string> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const isPrivate = isPrivateStoragePath(key);

  const upload = new Upload({
    client: getS3Client(),
    params: {
      Bucket: getBucketName(),
      Key: key,
      Body: createReadStream(localFilePath),
      ContentType: contentType || guessContentType(key),
      CacheControl: isPrivate
        ? "private, no-store"
        : "public, max-age=31536000, immutable",
      ...(!isPrivate && shouldSetPublicAcl() ? { ACL: "public-read" as const } : {}),
    },
    // ۱۰ مگابایت در هر part — تعادل بین تعداد درخواست و مصرف حافظه
    partSize: 10 * 1024 * 1024,
    queueSize: 3,
  });

  await upload.done();

  return isPrivate ? `/api/uploads/${key}` : buildPublicUrl(key);
}

/** حذف فایل از S3 */
export async function deleteFileFromS3(relativePath: string): Promise<void> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  await getS3Client().send(
    new DeleteObjectCommand({ Bucket: getBucketName(), Key: key })
  );
}

/** بررسی وجود آبجکت */
export async function objectExistsInS3(relativePath: string): Promise<boolean> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  try {
    await getS3Client().send(
      new HeadObjectCommand({ Bucket: getBucketName(), Key: key })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * انتقال فایل موقت به مسیر دائمی (S3 حرکت مستقیم ندارد: copy + delete)
 */
export async function promoteTempFileInS3(
  tempRelativePath: string,
  permanentRelativePath: string
): Promise<string> {
  const bucket = getBucketName();
  const source = tempRelativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const target = permanentRelativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const isPrivate = isPrivateStoragePath(target);

  await getS3Client().send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${source}`,
      Key: target,
      MetadataDirective: "REPLACE",
      ContentType: guessContentType(target),
      CacheControl: isPrivate
        ? "private, no-store"
        : "public, max-age=31536000, immutable",
      ...(!isPrivate && shouldSetPublicAcl() ? { ACL: "public-read" as const } : {}),
    })
  );

  await deleteFileFromS3(source);

  return isPrivate ? `/api/uploads/${target}` : buildPublicUrl(target);
}

/**
 * گرفتن آبجکت برای استریم کردن از داخل اپ (فایل‌های خصوصی)
 */
export async function getS3ObjectStream(
  relativePath: string,
  range?: string
): Promise<{
  body: ReadableStream;
  contentType: string;
  contentLength?: number;
  contentRange?: string;
} | null> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");

  try {
    const result = await getS3Client().send(
      new GetObjectCommand({
        Bucket: getBucketName(),
        Key: key,
        ...(range ? { Range: range } : {}),
      })
    );

    if (!result.Body) return null;

    return {
      body: result.Body.transformToWebStream(),
      contentType: result.ContentType || guessContentType(key),
      contentLength: result.ContentLength,
      contentRange: result.ContentRange,
    };
  } catch {
    return null;
  }
}

/**
 * ساخت لینک امضاشده موقت برای دانلود فایل خصوصی
 * @param expiresIn مدت اعتبار به ثانیه (پیش‌فرض ۱ ساعت)
 */
export async function getSignedReadUrl(
  relativePath: string,
  expiresIn = 3600
): Promise<string> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: getBucketName(), Key: key }),
    { expiresIn }
  );
}

/**
 * لیست کردن آبجکت‌های یک prefix (برای retention بکاپ و ابزارهای مدیریتی)
 */
export async function listObjectsInS3(
  prefix: string
): Promise<{ key: string; size: number; lastModified?: Date }[]> {
  const client = getS3Client();
  const bucket = getBucketName();
  const results: { key: string; size: number; lastModified?: Date }[] = [];
  let continuationToken: string | undefined;

  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const item of page.Contents || []) {
      if (item.Key) {
        results.push({
          key: item.Key,
          size: item.Size || 0,
          lastModified: item.LastModified,
        });
      }
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  return results;
}
