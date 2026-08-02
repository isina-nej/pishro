import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { saveFileToStorage } from "@/lib/services/storage-adapter";
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

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${session.user.id}_${timestamp}_${randomString}.${extension}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const avatarUrl = await saveFileToStorage(
      buffer,
      `avatars/${filename}`,
      file.type
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
