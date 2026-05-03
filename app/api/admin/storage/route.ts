/**
 * Migration API - فایل‌ها را بین دایرکتوری‌های مختلف منتقل کند
 * POST /api/admin/storage/migrate - مهاجرت فایل‌ها
 * GET /api/admin/storage/paths - دیدن مسیرهای فعلی
 */

import { NextRequest } from "next/server";
import { copyFile, readdir, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { getAllUploadPaths } from "@/lib/upload-config";

export async function GET(_req: NextRequest) {
  try {
    // فقط ادمین می‌تواند این endpoint را دیده‌ها را ببیند
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("فقط ادمین می‌تواند این اطلاعات را ببیند");
    }

    const paths = getAllUploadPaths();
    return successResponse(
      {
        currentBase: paths.base,
        booksPath: paths.books,
        videosPath: paths.videos,
        environment: {
          uploadBaseDirEnv: process.env.UPLOAD_BASE_DIR || "Not set",
        },
      },
      "مسیرهای فعلی آپلود"
    );
  } catch (error) {
    console.error("Error getting storage paths:", error);
    return errorResponse(
      "خطا در دریافت مسیرهای ذخیره‌سازی",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // فقط ادمین می‌تواند مهاجرت انجام دهد
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("فقط ادمین می‌تواند مهاجرت انجام دهد");
    }

    const body = await req.json();
    const { fromPath, toPath, dryRun = true } = body;

    if (!fromPath || !toPath) {
      return errorResponse(
        "fromPath و toPath الزامی هستند",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // مهاجرت فایل‌ها
    const result = await migrateFiles(fromPath, toPath, dryRun);

    if (dryRun) {
      return successResponse(
        result,
        "این یک تست بود. برای انجام واقعی، dryRun: false ارسال کنید"
      );
    }

    return successResponse(result, "فایل‌ها با موفقیت منتقل شدند");
  } catch (error) {
    console.error("Migration error:", error);
    return errorResponse(
      "خطا در مهاجرت: " + (error instanceof Error ? error.message : String(error)),
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

/**
 * Migrate files from one directory to another
 */
async function migrateFiles(
  fromPath: string,
  toPath: string,
  dryRun: boolean = true
): Promise<{
  dryRun: boolean;
  fromPath: string;
  toPath: string;
  totalFiles: number;
  copiedFiles: number;
  failedFiles: number;
  failedList: string[];
}> {
  const results = {
    dryRun,
    fromPath,
    toPath,
    totalFiles: 0,
    copiedFiles: 0,
    failedFiles: 0,
    failedList: [] as string[],
  };

  try {
    // بررسی اینکه مسیر منبع موجود است
    const files = await readdir(fromPath, { recursive: true });
    results.totalFiles = files.length;

    if (dryRun) {
      console.log(`[DRY RUN] Will migrate ${files.length} files from ${fromPath} to ${toPath}`);
      results.copiedFiles = files.length;
      return results;
    }

    // ایجاد دایرکتوری مقصد
    await mkdir(toPath, { recursive: true });

    // کپی کردن فایل‌ها
    for (const file of files) {
      try {
        const sourceFile = join(fromPath, file);
        const destFile = join(toPath, file);

        // ایجاد دایرکتوری مقصد اگر موجود نباشد
        const destDir = join(toPath, ...file.split("/").slice(0, -1));
        if (destDir !== toPath) {
          await mkdir(destDir, { recursive: true });
        }

        // کپی فایل
        await copyFile(sourceFile, destFile);
        results.copiedFiles++;
      } catch (err) {
        results.failedFiles++;
        results.failedList.push(file);
        console.error(`Failed to copy ${file}:`, err);
      }
    }

    console.log(`Migration completed: ${results.copiedFiles}/${results.totalFiles} files`);
  } catch (err) {
    console.error("Migration error:", err);
    throw err;
  }

  return results;
}
