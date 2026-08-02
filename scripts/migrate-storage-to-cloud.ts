/**
 * مهاجرت فایل‌های موجود از دیسک محلی به فضای ابری
 *
 * اجرا:
 *   npm run storage:migrate           # فقط گزارش می‌دهد، چیزی تغییر نمی‌کند
 *   npm run storage:migrate -- --apply  # واقعاً آپلود و بروزرسانی می‌کند
 *
 * دو کار انجام می‌دهد:
 *   ۱. آپلود فایل‌های داخل UPLOAD_BASE_DIR و public/uploads به باکت
 *   ۲. بازنویسی آدرس‌های داخل دیتابیس به لینک مستقیم ابری
 *
 * ⚠️ فقط مقادیری بازنویسی می‌شوند که با /api/uploads/ یا /uploads/ شروع شوند.
 * هر مقدار دیگری (لینک خارجی، نام آیکون، آدرس شبکه اجتماعی) دست نمی‌خورد.
 *
 * فایل‌های محلی پس از آپلود حذف نمی‌شوند — بعد از اطمینان خودتان پاکشان کنید.
 */

import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import { join, relative, resolve } from "path";
import { prisma } from "@/lib/prisma";
import { getStorageConfig } from "@/lib/services/storage-adapter";
import {
  uploadFileStreamToS3,
  objectExistsInS3,
  isPrivateStoragePath,
} from "@/lib/services/storage-s3";
import { buildPublicUrl } from "@/lib/services/s3-client";

const APPLY = process.argv.includes("--apply");

/** ستون‌هایی که ممکن است آدرس فایل داشته باشند */
const MEDIA_FIELDS: Record<string, string[]> = {
  user: ["avatarUrl"],
  comment: ["userAvatar"],
  course: ["introVideoUrl"],
  lesson: ["thumbnail", "videoUrl"],
  newsArticle: ["coverImage"],
  digitalBook: ["cover", "fileUrl", "audioUrl"],
  category: ["coverImage", "heroImage", "aboutImage", "icon"],
  certificate: ["image"],
  teamMember: ["image"],
  businessConsulting: ["image"],
  investmentPlans: ["image"],
  investmentPlan: ["icon"],
  investmentModel: ["icon"],
  investmentTag: ["icon"],
  resumeItem: ["icon"],
  tag: ["icon"],
  homeSlide: ["imageUrl"],
  homeMiniSlider: ["imageUrl"],
  mobileScrollerStep: ["imageUrl", "coverImageUrl"],
  homeLanding: ["heroVideoUrl"],
  aboutPage: ["doctorIntroVideoUrl"],
  image: ["filePath"],
  userInvestmentPortfolio: ["excelFileUrl"],
};

/** پیمایش بازگشتی یک دایرکتوری */
async function walkDirectory(root: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  await walk(root);
  return results;
}

/** آپلود فایل‌های یک ریشه محلی به باکت */
async function uploadLocalTree(
  root: string,
  keyPrefix = ""
): Promise<{ uploaded: number; skipped: number; failed: number; bytes: number }> {
  const stats = { uploaded: 0, skipped: 0, failed: 0, bytes: 0 };

  if (!existsSync(root)) {
    console.log(`   (وجود ندارد، رد شد: ${root})`);
    return stats;
  }

  const files = await walkDirectory(root);
  console.log(`   ${files.length} فایل پیدا شد`);

  for (const filePath of files) {
    const relativePath = relative(root, filePath).replace(/\\/g, "/");
    const key = keyPrefix ? `${keyPrefix}/${relativePath}` : relativePath;

    // فایل‌های موقت را منتقل نمی‌کنیم
    if (key.startsWith("tmp/") || key.startsWith("chunks/")) {
      stats.skipped++;
      continue;
    }

    try {
      if (await objectExistsInS3(key)) {
        stats.skipped++;
        continue;
      }

      const fileStat = await stat(filePath);

      if (APPLY) {
        await uploadFileStreamToS3(filePath, key);
      }

      stats.uploaded++;
      stats.bytes += fileStat.size;
      console.log(
        `   ${APPLY ? "⬆️ " : "[dry] "}${key} (${(fileStat.size / 1024).toFixed(0)} KB)`
      );
    } catch (error) {
      stats.failed++;
      console.error(
        `   ❌ ${key}: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  return stats;
}

/**
 * تبدیل آدرس محلی به آدرس نهایی
 * @returns آدرس جدید، یا null اگر نباید تغییر کند
 */
function rewriteUrl(value: string): string | null {
  if (typeof value !== "string" || value.length === 0) return null;

  let key: string | null = null;
  if (value.startsWith("/api/uploads/")) {
    key = value.slice("/api/uploads/".length);
  } else if (value.startsWith("/uploads/")) {
    key = value.slice("/uploads/".length);
  }

  if (!key) return null;

  // مسیرهای قدیمی public/uploads/articles و avatars را به ساختار جدید نگاشت می‌کنیم
  if (key.startsWith("articles/")) key = `news/${key.slice("articles/".length)}`;

  // فایل‌های خصوصی باید همچنان از اپ سرو شوند تا کنترل دسترسی حفظ شود
  if (isPrivateStoragePath(key)) {
    const canonical = `/api/uploads/${key}`;
    return canonical === value ? null : canonical;
  }

  return buildPublicUrl(key);
}

/** بازنویسی آدرس‌های دیتابیس */
async function migrateDatabaseUrls(): Promise<{ updated: number; scanned: number }> {
  let updated = 0;
  let scanned = 0;

  for (const [modelName, fields] of Object.entries(MEDIA_FIELDS)) {
    const model = (prisma as any)[modelName];
    if (!model?.findMany) {
      console.log(`   ⏭️  مدل ${modelName} پیدا نشد، رد شد`);
      continue;
    }

    let rows: any[];
    try {
      rows = await model.findMany({ select: { id: true, ...Object.fromEntries(fields.map((f) => [f, true])) } });
    } catch (error) {
      console.error(
        `   ❌ خواندن ${modelName}: ${error instanceof Error ? error.message : error}`
      );
      continue;
    }

    for (const row of rows) {
      scanned++;
      const changes: Record<string, string> = {};

      for (const field of fields) {
        const rewritten = rewriteUrl(row[field]);
        if (rewritten) changes[field] = rewritten;
      }

      if (Object.keys(changes).length === 0) continue;

      console.log(
        `   ${APPLY ? "✏️ " : "[dry] "}${modelName}#${row.id}: ${Object.entries(changes)
          .map(([f, v]) => `${f} → ${v}`)
          .join(", ")}`
      );

      if (APPLY) {
        try {
          await model.update({ where: { id: row.id }, data: changes });
        } catch (error) {
          console.error(
            `   ❌ بروزرسانی ${modelName}#${row.id}: ${error instanceof Error ? error.message : error}`
          );
          continue;
        }
      }
      updated++;
    }
  }

  return { updated, scanned };
}

async function main(): Promise<void> {
  if (!process.env.S3_ENDPOINT || !process.env.S3_BUCKET_NAME) {
    throw new Error("تنظیمات S3 ناقص است (S3_ENDPOINT / S3_BUCKET_NAME)");
  }

  console.log(
    APPLY
      ? "🚀 حالت اجرا — تغییرات واقعاً اعمال می‌شود\n"
      : "🔍 حالت آزمایشی — هیچ تغییری اعمال نمی‌شود (برای اجرا: -- --apply)\n"
  );

  // --- مرحله ۱: آپلود فایل‌ها ---
  const storageRoot = getStorageConfig().storagePath;
  console.log(`📁 آپلود از ${storageRoot}`);
  const main1 = await uploadLocalTree(storageRoot);

  const publicUploads = resolve(process.cwd(), "public", "uploads");
  console.log(`\n📁 آپلود از ${publicUploads}`);
  // public/uploads/articles → news/ ، public/uploads/avatars → avatars/
  const main2 = await uploadLocalTree(publicUploads);

  const totalBytes = main1.bytes + main2.bytes;
  console.log(
    `\n📊 فایل‌ها: ${main1.uploaded + main2.uploaded} آپلود، ` +
      `${main1.skipped + main2.skipped} رد شد، ` +
      `${main1.failed + main2.failed} ناموفق، ` +
      `${(totalBytes / 1024 / 1024).toFixed(1)} MB`
  );

  // --- مرحله ۲: بازنویسی دیتابیس ---
  console.log("\n🗄️  بازنویسی آدرس‌های دیتابیس");
  const db = await migrateDatabaseUrls();
  console.log(
    `\n📊 دیتابیس: ${db.updated} رکورد از ${db.scanned} رکورد بروزرسانی شد`
  );

  if (!APPLY) {
    console.log(
      "\n💡 برای اعمال واقعی: npm run storage:migrate -- --apply"
    );
  } else {
    console.log(
      "\n✅ مهاجرت تمام شد. فایل‌های محلی حذف نشدند — بعد از اطمینان خودتان پاکشان کنید."
    );
  }

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error("❌ مهاجرت شکست خورد:", error instanceof Error ? error.message : error);
  await prisma.$disconnect();
  process.exit(1);
});
