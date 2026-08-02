/**
 * بکاپ‌گیری از دیتابیس MySQL و آپلود به فضای ابری
 *
 * اجرا:
 *   npm run backup:db
 *
 * متغیرهای محیطی:
 *   DATABASE_URL            اتصال دیتابیس (اجباری)
 *   S3_*                    تنظیمات فضای ابری (اجباری)
 *   BACKUP_RETENTION_DAYS   نگهداری بکاپ‌ها به روز (پیش‌فرض ۱۴)
 *   BACKUP_PREFIX           پیشوند مسیر در باکت (پیش‌فرض backups/mysql)
 *
 * جریان کار: mysqldump → gzip → آپلود مستقیم به باکت (بدون فایل موقت روی دیسک)
 * بکاپ‌ها با prefix خصوصی ذخیره می‌شوند و از بیرون قابل دانلود نیستند.
 */

import { spawn } from "child_process";
import { createGzip } from "zlib";
import { PassThrough } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getS3Client, getBucketName } from "@/lib/services/s3-client";
import { listObjectsInS3 } from "@/lib/services/storage-s3";

interface DbConnection {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}

/** استخراج اطلاعات اتصال از DATABASE_URL */
function parseDatabaseUrl(databaseUrl: string): DbConnection {
  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: url.port || "3306",
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  };
}

/** نام فایل بکاپ بر اساس زمان UTC */
function buildBackupKey(database: string): string {
  const prefix = (process.env.BACKUP_PREFIX || "backups/mysql").replace(
    /\/+$/,
    ""
  );
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${prefix}/${database}-${stamp}.sql.gz`;
}

/** حذف بکاپ‌های قدیمی‌تر از بازه نگهداری */
async function pruneOldBackups(): Promise<number> {
  const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 14);
  if (!Number.isFinite(retentionDays) || retentionDays <= 0) {
    console.log("⏭️  Retention غیرفعال است، حذف بکاپ قدیمی انجام نشد");
    return 0;
  }

  const prefix = (process.env.BACKUP_PREFIX || "backups/mysql").replace(
    /\/+$/,
    ""
  );
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  const objects = await listObjectsInS3(`${prefix}/`);
  const expired = objects.filter(
    (obj) => obj.lastModified && obj.lastModified.getTime() < cutoff
  );

  if (expired.length === 0) return 0;

  // DeleteObjects حداکثر ۱۰۰۰ کلید در هر درخواست می‌پذیرد
  for (let i = 0; i < expired.length; i += 1000) {
    const batch = expired.slice(i, i + 1000);
    await getS3Client().send(
      new DeleteObjectsCommand({
        Bucket: getBucketName(),
        Delete: { Objects: batch.map((obj) => ({ Key: obj.key })) },
      })
    );
  }

  return expired.length;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL تنظیم نشده است");
  }
  if (!process.env.S3_ENDPOINT || !process.env.S3_BUCKET_NAME) {
    throw new Error("تنظیمات S3 ناقص است (S3_ENDPOINT / S3_BUCKET_NAME)");
  }

  const db = parseDatabaseUrl(databaseUrl);
  const key = buildBackupKey(db.database);

  console.log(`🗄️  شروع بکاپ از دیتابیس «${db.database}»`);
  console.log(`☁️  مقصد: ${getBucketName()}/${key}`);

  // رمز عبور از طریق متغیر محیطی داده می‌شود تا در لیست پروسه‌ها دیده نشود
  const dump = spawn(
    "mysqldump",
    [
      `--host=${db.host}`,
      `--port=${db.port}`,
      `--user=${db.user}`,
      "--single-transaction", // بکاپ سازگار از InnoDB بدون قفل کردن جداول
      "--quick", // ردیف‌به‌ردیف، مصرف حافظه پایین
      "--routines", // stored procedureها
      "--triggers",
      "--events",
      "--default-character-set=utf8mb4",
      db.database,
    ],
    { env: { ...process.env, MYSQL_PWD: db.password } }
  );

  let dumpStderr = "";
  dump.stderr.on("data", (chunk) => {
    dumpStderr += chunk.toString();
  });

  const gzip = createGzip({ level: 9 });
  const body = new PassThrough();

  dump.stdout.pipe(gzip).pipe(body);

  // اگر mysqldump شکست بخورد، استریم آپلود هم باید خطا بدهد
  const dumpExit = new Promise<void>((resolve, reject) => {
    dump.on("error", reject);
    dump.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const error = new Error(
          `mysqldump با کد ${code} خارج شد: ${dumpStderr.trim()}`
        );
        body.destroy(error);
        reject(error);
      }
    });
  });

  const upload = new Upload({
    client: getS3Client(),
    params: {
      Bucket: getBucketName(),
      Key: key,
      Body: body,
      ContentType: "application/gzip",
      CacheControl: "private, no-store",
    },
    partSize: 10 * 1024 * 1024,
    queueSize: 3,
  });

  const [, ] = await Promise.all([upload.done(), dumpExit]);

  // تأیید اینکه بکاپ واقعاً نوشته شده و خالی نیست
  const written = await listObjectsInS3(key);
  const size = written.find((obj) => obj.key === key)?.size ?? 0;
  if (size <= 0) {
    throw new Error("بکاپ آپلود شد ولی حجم آن صفر است");
  }

  console.log(`✅ بکاپ کامل شد (${(size / 1024 / 1024).toFixed(2)} MB)`);

  const pruned = await pruneOldBackups();
  if (pruned > 0) {
    console.log(`🧹 ${pruned} بکاپ قدیمی حذف شد`);
  }
}

main().catch((error) => {
  console.error("❌ بکاپ ناموفق بود:", error instanceof Error ? error.message : error);
  process.exit(1);
});
