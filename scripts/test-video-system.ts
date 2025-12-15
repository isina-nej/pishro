// @/scripts/test-video-system.ts
/**
 * اسکریپت تست سیستم پردازش ویدیو
 * این اسکریپت تمام اجزای سیستم را بررسی می‌کند
 *
 * استفاده:
 * npx tsx scripts/test-video-system.ts
 */

import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";

// رنگ‌ها برای console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  header: (msg: string) =>
    console.log(`\n${colors.cyan}${colors.bright}━━━ ${msg} ━━━${colors.reset}\n`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

/**
 * بررسی وجود متغیرهای محیطی
 */
async function checkEnvironmentVariables(): Promise<boolean> {
  log.header("بررسی متغیرهای محیطی");

  const requiredVars = [
    "DATABASE_URL",
    "S3_ENDPOINT",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_BUCKET_NAME",
  ];

  const optionalVars = ["S3_REGION", "S3_PUBLIC_URL", "TEMP_DIR", "NODE_ENV"];

  let allPresent = true;

  // بررسی متغیرهای الزامی
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log.success(`${varName}: موجود است`);
    } else {
      log.error(`${varName}: یافت نشد (الزامی)`);
      allPresent = false;
    }
  }

  // بررسی متغیرهای اختیاری
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      log.success(`${varName}: موجود است`);
    } else {
      log.warning(`${varName}: یافت نشد (اختیاری)`);
    }
  }

  return allPresent;
}

/**
 * بررسی وجود FFmpeg
 */
async function checkFFmpeg(): Promise<boolean> {
  log.header("بررسی FFmpeg");

  const checkCommand = (command: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const process = spawn(command, ["-version"]);

      let output = "";
      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          // استخراج نسخه از خط اول
          const firstLine = output.split("\n")[0];
          log.success(`${command} نصب شده است: ${firstLine}`);
          resolve(true);
        } else {
          log.error(`${command} یافت نشد`);
          resolve(false);
        }
      });

      process.on("error", () => {
        log.error(`${command} یافت نشد`);
        resolve(false);
      });
    });
  };

  const [ffmpegOk, ffprobeOk] = await Promise.all([
    checkCommand("ffmpeg"),
    checkCommand("ffprobe"),
  ]);

  return ffmpegOk && ffprobeOk;
}

/**
 * بررسی دایرکتوری موقت
 */
async function checkTempDirectory(): Promise<boolean> {
  log.header("بررسی دایرکتوری موقت");

  const tempDir = process.env.TEMP_DIR || "/tmp/video-processing";

  try {
    // بررسی وجود دایرکتوری
    try {
      await fs.access(tempDir);
      log.success(`دایرکتوری موجود است: ${tempDir}`);
    } catch {
      log.warning(`دایرکتوری وجود ندارد، در حال ایجاد...`);
      await fs.mkdir(tempDir, { recursive: true });
      log.success(`دایرکتوری ایجاد شد: ${tempDir}`);
    }

    // بررسی دسترسی نوشتن
    const testFile = path.join(tempDir, ".test-write");
    await fs.writeFile(testFile, "test");
    await fs.unlink(testFile);
    log.success("دسترسی نوشتن: OK");

    // بررسی فضای خالی
    const stat = await fs.stat(tempDir);
    log.info(`دایرکتوری: ${tempDir}`);

    return true;
  } catch (error) {
    log.error(`خطا در بررسی دایرکتوری موقت: ${error}`);
    return false;
  }
}

/**
 * بررسی اتصال به MongoDB
 */
async function checkDatabaseConnection(): Promise<boolean> {
  log.header("بررسی اتصال به دیتابیس");

  const prisma = new PrismaClient();

  try {
    // تست اتصال
    await prisma.$connect();
    log.success("اتصال به MongoDB موفقیت‌آمیز بود");

    // شمارش تعداد ویدیوها
    const videoCount = await prisma.video.count();
    log.info(`تعداد ویدیوها در دیتابیس: ${videoCount}`);

    // شمارش ویدیوهای در حال انتظار
    const pendingCount = await prisma.video.count({
      where: { processingStatus: "UPLOADED" },
    });
    log.info(`تعداد ویدیوهای منتظر پردازش: ${pendingCount}`);

    await prisma.$disconnect();
    return true;
  } catch (error) {
    log.error(`خطا در اتصال به دیتابیس: ${error}`);
    await prisma.$disconnect();
    return false;
  }
}

/**
 * بررسی اتصال به Object Storage (S3)
 */
async function checkS3Connection(): Promise<boolean> {
  log.header("بررسی اتصال به Object Storage");

  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "default";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    log.error("اطلاعات S3 کامل نیست");
    return false;
  }

  log.info(`Endpoint: ${endpoint}`);
  log.info(`Region: ${region}`);
  log.info(`Bucket: ${bucketName}`);

  try {
    // ایجاد کلاینت S3
    const s3Client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // برای سازگاری با Object Storage های مختلف
    });

    // تست 1: لیست کردن buckets
    try {
      const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
      log.success("اتصال به S3 موفقیت‌آمیز بود");
      log.info(`تعداد buckets: ${listBucketsResponse.Buckets?.length || 0}`);

      // نمایش buckets
      if (listBucketsResponse.Buckets && listBucketsResponse.Buckets.length > 0) {
        listBucketsResponse.Buckets.forEach((bucket) => {
          const indicator = bucket.Name === bucketName ? "✓" : " ";
          log.info(`  [${indicator}] ${bucket.Name}`);
        });
      }
    } catch (error) {
      log.warning("لیست buckets دریافت نشد، اما ادامه می‌دهیم...");
    }

    // تست 2: آپلود یک فایل تستی
    try {
      const testKey = `.test/health-check-${Date.now()}.txt`;
      const testContent = `Test file - ${new Date().toISOString()}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: testKey,
          Body: testContent,
          ContentType: "text/plain",
        })
      );

      log.success(`فایل تستی آپلود شد: ${testKey}`);

      // محاسبه URL عمومی
      const publicUrl = process.env.S3_PUBLIC_URL || `${endpoint}/${bucketName}`;
      log.info(`URL عمومی: ${publicUrl}/${testKey}`);

      return true;
    } catch (error) {
      log.error(`خطا در آپلود فایل تستی: ${error}`);
      return false;
    }
  } catch (error) {
    log.error(`خطا در اتصال به S3: ${error}`);
    return false;
  }
}

/**
 * خلاصه نتایج
 */
function printSummary(results: Record<string, boolean>) {
  log.header("خلاصه نتایج");

  let allPassed = true;

  for (const [test, passed] of Object.entries(results)) {
    if (passed) {
      log.success(test);
    } else {
      log.error(test);
      allPassed = false;
    }
  }

  console.log("");

  if (allPassed) {
    console.log(
      `${colors.green}${colors.bright}🎉 همه تست‌ها موفقیت‌آمیز بودند! سیستم آماده است.${colors.reset}`
    );
  } else {
    console.log(
      `${colors.red}${colors.bright}❌ برخی تست‌ها ناموفق بودند. لطفاً مشکلات را برطرف کنید.${colors.reset}`
    );
  }

  console.log("");
}

/**
 * تابع اصلی
 */
async function main() {
  console.log(`${colors.cyan}${colors.bright}`);
  console.log("╔════════════════════════════════════════╗");
  console.log("║  🎬 Video System Health Check 🎬      ║");
  console.log("║  سیستم پردازش ویدیو پیشرو            ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(colors.reset);

  const results: Record<string, boolean> = {};

  try {
    // اجرای تست‌ها
    results["متغیرهای محیطی"] = await checkEnvironmentVariables();
    results["FFmpeg و ffprobe"] = await checkFFmpeg();
    results["دایرکتوری موقت"] = await checkTempDirectory();
    results["اتصال به MongoDB"] = await checkDatabaseConnection();
    results["اتصال به Object Storage"] = await checkS3Connection();

    // نمایش خلاصه
    printSummary(results);

    // خروج با کد مناسب
    const allPassed = Object.values(results).every((v) => v);
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    log.error(`خطای غیرمنتظره: ${error}`);
    process.exit(1);
  }
}

// اجرای اسکریپت
main();
