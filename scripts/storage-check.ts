/**
 * بررسی سلامت اتصال و تنظیمات فضای ابری
 *
 * اجرا:
 *   npm run storage:check
 *
 * چه چیزی را تست می‌کند:
 *   ۱. اتصال و اعتبار کلیدها
 *   ۲. آپلود/دانلود/حذف یک آبجکت آزمایشی
 *   ۳. اینکه فایل عمومی واقعاً بدون احراز هویت قابل خواندن است
 *   ۴. ⚠️ اینکه فایل خصوصی (ویدیو/بکاپ) از بیرون قابل دانلود **نیست**
 *
 * مورد ۴ حیاتی است: چون همه چیز در یک باکت مشترک است، اگر باکت را
 * به‌کلی public کرده باشید بکاپ دیتابیس و ویدیوی دوره‌ها لو می‌رود.
 */

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  getS3Client,
  getBucketName,
  buildPublicUrl,
  getPublicBaseUrl,
} from "@/lib/services/s3-client";
import { objectExistsInS3, isPrivateStoragePath } from "@/lib/services/storage-s3";

const PUBLIC_TEST_KEY = `images/.storage-check-public-${Date.now()}.txt`;
const PRIVATE_TEST_KEY = `backups/.storage-check-private-${Date.now()}.txt`;
const TEST_BODY = "pishro-storage-check";

let failures = 0;

function pass(message: string): void {
  console.log(`✅ ${message}`);
}

function fail(message: string): void {
  console.error(`❌ ${message}`);
  failures++;
}

function warn(message: string): void {
  console.warn(`⚠️  ${message}`);
}

/** آپلود آبجکت آزمایشی */
async function putTestObject(key: string, publicAcl: boolean): Promise<void> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      Body: TEST_BODY,
      ContentType: "text/plain",
      ...(publicAcl ? { ACL: "public-read" as const } : {}),
    })
  );
}

/** حذف آبجکت آزمایشی */
async function removeTestObject(key: string): Promise<void> {
  try {
    await getS3Client().send(
      new DeleteObjectCommand({ Bucket: getBucketName(), Key: key })
    );
  } catch {
    warn(`نتوانستم آبجکت آزمایشی را پاک کنم: ${key}`);
  }
}

/** خواندن یک URL بدون هیچ احراز هویتی */
async function fetchAnonymously(
  url: string
): Promise<{ status: number; body: string }> {
  const response = await fetch(url, { cache: "no-store" });
  return { status: response.status, body: await response.text() };
}

async function main(): Promise<void> {
  console.log("🔍 بررسی تنظیمات فضای ابری\n");

  // --- ۰. تنظیمات پایه ---
  const required = ["S3_ENDPOINT", "S3_BUCKET_NAME", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    fail(`متغیرهای محیطی تنظیم نشده: ${missing.join(", ")}`);
    process.exit(1);
  }
  pass(`تنظیمات پایه موجود است (باکت: ${getBucketName()})`);
  console.log(`   Endpoint:   ${process.env.S3_ENDPOINT}`);
  console.log(`   Public URL: ${getPublicBaseUrl()}\n`);

  // --- ۱. تست مسیرهای خصوصی ---
  const privateSamples = [
    "backups/mysql/dump.sql.gz",
    "videos/abc/lesson.mp4",
    "hls/abc/index.m3u8",
    "books/pdfs/book.pdf",
    "courses/1/lessons/2/video/a.mp4",
  ];
  const wronglyPublic = privateSamples.filter((p) => !isPrivateStoragePath(p));
  if (wronglyPublic.length > 0) {
    fail(`این مسیرها باید خصوصی شناخته می‌شدند: ${wronglyPublic.join(", ")}`);
  } else {
    pass("طبقه‌بندی مسیرهای خصوصی درست است");
  }

  // --- ۲. آپلود آبجکت عمومی ---
  try {
    await putTestObject(PUBLIC_TEST_KEY, true);
    pass("آپلود آبجکت عمومی موفق بود (کلیدها معتبرند)");
  } catch (error) {
    fail(
      `آپلود ناموفق: ${error instanceof Error ? error.message : String(error)}`
    );
    console.error("\nاتصال برقرار نشد؛ بقیه تست‌ها اجرا نمی‌شوند.");
    process.exit(1);
  }

  if (await objectExistsInS3(PUBLIC_TEST_KEY)) {
    pass("آبجکت با کلید معتبر قابل خواندن است");
  } else {
    fail("آبجکت آپلودشده پیدا نشد");
  }

  // --- ۳. خواندن عمومی بدون احراز هویت ---
  const publicUrl = buildPublicUrl(PUBLIC_TEST_KEY);
  try {
    const result = await fetchAnonymously(publicUrl);
    if (result.status === 200 && result.body.trim() === TEST_BODY) {
      pass(`فایل عمومی بدون احراز هویت قابل دانلود است\n   ${publicUrl}`);
    } else {
      fail(
        `فایل عمومی قابل دانلود نیست (کد ${result.status}).\n` +
          `   یعنی لینک مستقیم در دیتابیس کار نخواهد کرد.\n` +
          `   راه حل: در پنل پارس‌پک سطح دسترسی آبجکت‌ها را بررسی کنید،\n` +
          `   یا اگر provider از ACL پشتیبانی نمی‌کند S3_PUBLIC_ACL=false بگذارید\n` +
          `   و باکت را public کنید — ولی آن وقت باید ویدیو و بکاپ را به باکت دیگری ببرید.`
      );
    }
  } catch (error) {
    fail(`خطا در دانلود عمومی: ${error instanceof Error ? error.message : error}`);
  }

  // --- ۴. مهم‌ترین تست: فایل خصوصی نباید عمومی باشد ---
  try {
    await putTestObject(PRIVATE_TEST_KEY, false);
    const privateUrl = buildPublicUrl(PRIVATE_TEST_KEY);
    const result = await fetchAnonymously(privateUrl);

    if (result.status === 200 && result.body.trim() === TEST_BODY) {
      fail(
        `🚨 خطر امنیتی: فایل خصوصی از اینترنت قابل دانلود است!\n` +
          `   ${privateUrl}\n` +
          `   یعنی باکت به‌صورت کامل public است و بکاپ دیتابیس و ویدیوی دوره‌ها\n` +
          `   برای همه قابل دانلود می‌شود. باکت را در پنل پارس‌پک private کنید.`
      );
    } else {
      pass(`فایل خصوصی از بیرون قابل دسترسی نیست (کد ${result.status})`);
    }
  } catch (error) {
    warn(`تست دسترسی خصوصی کامل نشد: ${error instanceof Error ? error.message : error}`);
  }

  // --- پاکسازی ---
  await removeTestObject(PUBLIC_TEST_KEY);
  await removeTestObject(PRIVATE_TEST_KEY);

  console.log(
    failures === 0
      ? "\n🎉 همه بررسی‌ها موفق بود."
      : `\n💥 ${failures} مورد ایراد پیدا شد.`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("❌ اجرای بررسی شکست خورد:", error);
  process.exit(1);
});
