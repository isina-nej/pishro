import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/auth";
import { saveFileToStorage } from "@/lib/services/storage-adapter";
import { detectImageType } from "@/lib/upload-validation";
import {
  successResponse,
  unauthorizedResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// تنظیمات مجاز برای آپلود
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return validationError(
        { avatar: "فایل تصویر الزامی است" },
        "فایل تصویر الزامی است"
      );
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { avatar: "فقط فایل‌های تصویری مجاز هستند" },
        "فقط فرمت‌های JPG، PNG و WebP مجاز هستند"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { avatar: "حجم فایل نباید بیشتر از 2 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 2 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic-byte check: blocks svg/type-spoof — content-type alone is spoofable.
    const detected = detectImageType(buffer);
    if (!detected) {
      return validationError(
        { avatar: "فقط فرمت‌های JPG، PNG و WebP مجاز هستند" },
        "فایل تصویر معتبر نیست"
      );
    }

    // ایجاد نام منحصر به فرد برای فایل — extension از magic bytes، نه نام فایل.
    const timestamp = Date.now();
    const randomString = randomBytes(8).toString("hex");
    const filename = `${session.user.id}_${timestamp}_${randomString}.${detected.ext}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const avatarUrl = await saveFileToStorage(
      buffer,
      `avatars/${filename}`,
      detected.mime
    );

    // بروزرسانی آواتار کاربر در دیتابیس
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
    });

    return successResponse(
      { avatarUrl: user.avatarUrl },
      "تصویر پروفایل با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Avatar upload error:", error);
    return errorResponse(
      "خطایی در آپلود تصویر رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
