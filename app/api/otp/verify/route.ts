import { prisma } from "@/lib/prisma";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return validationError(
        {
          phone: !phone ? "شماره تلفن الزامی است" : [],
          code: !code ? "کد تایید الزامی است" : [],
        },
        "اطلاعات ناقص است"
      );
    }

    const otp = await prisma.otp.findUnique({ where: { phone } });

    if (!otp || otp.code !== code) {
      return validationError(
        { code: "کد تایید نامعتبر است" },
        "کد تایید اشتباه است"
      );
    }

    if (otp.expiresAt < new Date()) {
      return errorResponse("کد تایید منقضی شده است", ErrorCodes.OTP_EXPIRED);
    }

    // کاربر موقت را پیدا کن
    const temp = await prisma.tempUser.findUnique({ where: { phone } });

    if (!temp) {
      return validationError(
        { phone: "کاربر موقت یافت نشد" },
        "کاربر موقت یافت نشد"
      );
    }

    // بررسی اینکه آیا کاربر واقعی قبلاً ساخته شده یا نه
    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          phone,
          passwordHash: temp.passwordHash,
          phoneVerified: true,
        },
      });
    } else {
      await prisma.user.update({
        where: { phone },
        data: { phoneVerified: true },
      });
    }

    // پاکسازی رکوردهای موقت
    await prisma.otp.delete({ where: { phone } });
    await prisma.tempUser.delete({ where: { phone } });

    return successResponse({ verified: true }, "شماره تلفن با موفقیت تایید شد");
  } catch (err) {
    console.error("otp verify error:", err);
    return errorResponse("خطایی در تایید کد رخ داد", ErrorCodes.INTERNAL_ERROR);
  }
}
