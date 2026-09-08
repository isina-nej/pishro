import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  successResponse,
  unauthorizedResponse,
  validationError,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";

// ✅ Update avatar — kept for backward compat; prefer POST /api/user/upload-avatar.
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { avatarUrl } = await req.json();

    if (typeof avatarUrl !== "string" || !avatarUrl.trim()) {
      return validationError(
        { avatarUrl: "آدرس تصویر الزامی است" },
        "آدرس تصویر معتبر نیست"
      );
    }

    const cleanUrl = avatarUrl.trim();
    if (
      cleanUrl.length > 500 ||
      (!cleanUrl.startsWith("/") && !cleanUrl.startsWith("https://"))
    ) {
      return validationError(
        { avatarUrl: "آدرس تصویر معتبر نیست" },
        "آدرس تصویر معتبر نیست"
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: cleanUrl },
    });

    return successResponse(
      { avatarUrl: user.avatarUrl },
      "تصویر پروفایل با موفقیت به‌روز شد"
    );
  } catch (error) {
    console.error("Avatar update error:", error);
    return errorResponse(
      "خطایی در به‌روزرسانی تصویر رخ داد",
      ErrorCodes.DATABASE_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
