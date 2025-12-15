import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";
import {
  successResponse,
  unauthorizedResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// تنظیمات مجاز برای آپلود ویدیو
const MAX_FILE_SIZE = 256 * 1024 * 1024; // 256MB
const ALLOWED_TYPES = [
  "video/mp4",
  "video/quicktime", // MOV
  "video/x-msvideo", // AVI
  "video/x-matroska", // MKV
  "video/webm",
];
const ALLOWED_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "webm"];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // بررسی احراز هویت و نقش ادمین
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    if (session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز - فقط ادمین");
    }

    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return validationError(
        { video: "فایل ویدیو الزامی است" },
        "فایل ویدیو الزامی است"
      );
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { video: "فقط فایل‌های ویدیویی مجاز هستند" },
        "فقط فرمت‌های MP4، MOV، AVI، MKV و WebM مجاز هستند"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { video: "حجم فایل نباید بیشتر از 256 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 256 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";

    // بررسی اعتبار پسوند
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return validationError(
        { video: "پسوند فایل معتبر نیست" },
        "پسوند فایل معتبر نیست"
      );
    }

    const filename = `video_${timestamp}_${randomString}.${extension}`;

    // مسیر ذخیره فایل
    const uploadDir = join(process.cwd(), "public", "uploads", "videos");
    const filepath = join(uploadDir, filename);

    // ایجاد دایرکتوری اگر وجود ندارد
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
    }

    // ذخیره فایل
    await writeFile(filepath, buffer);

    // URL نسبی فایل
    const videoUrl = `/uploads/videos/${filename}`;

    return successResponse(
      {
        videoUrl,
        filename,
        fileSize: file.size,
        fileType: file.type,
      },
      "ویدیو با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Video upload error:", error);
    return errorResponse(
      "خطایی در آپلود ویدیو رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
