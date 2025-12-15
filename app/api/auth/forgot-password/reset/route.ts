// app/api/auth/forgot-password/reset/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const { phone, code, newPassword } = await req.json();

    // Validation
    if (!phone || !code || !newPassword) {
      return validationError(
        {
          phone: !phone ? "شماره تلفن الزامی است" : [],
          code: !code ? "کد تایید الزامی است" : [],
          newPassword: !newPassword ? "رمز عبور جدید الزامی است" : [],
        },
        "اطلاعات ناقص است"
      );
    }

    // بررسی فرمت شماره تلفن
    if (!/^09\d{9}$/.test(phone)) {
      return validationError(
        { phone: "شماره تلفن معتبر نیست" },
        "شماره تلفن باید با فرمت 09XXXXXXXXX باشد"
      );
    }

    // بررسی طول رمز عبور
    if (newPassword.length < 8) {
      return validationError(
        { newPassword: "رمز عبور باید حداقل 8 کاراکتر باشد" },
        "رمز عبور باید حداقل 8 کاراکتر باشد"
      );
    }

    // بررسی OTP
    const otp = await prisma.otp.findFirst({ where: { phone } });

    if (!otp || otp.code !== code) {
      return validationError(
        { code: "کد تایید نامعتبر است" },
        "کد تایید اشتباه است"
      );
    }

    if (otp.expiresAt < new Date()) {
      return errorResponse("کد تایید منقضی شده است", ErrorCodes.OTP_EXPIRED);
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return validationError(
        { phone: "کاربری با این شماره یافت نشد" },
        "کاربری با این شماره یافت نشد"
      );
    }

    // هش کردن رمز عبور جدید
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // بروزرسانی رمز عبور کاربر
    await prisma.user.update({
      where: { phone },
      data: { passwordHash: hashedPassword },
    });

    // پاکسازی OTP
    await prisma.otp.delete({ where: { id: otp.id } });

    return successResponse(
      { success: true },
      "رمز عبور با موفقیت تغییر یافت"
    );
  } catch (err) {
    console.error("Password reset error:", err);
    return errorResponse(
      "خطایی در تغییر رمز عبور رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
