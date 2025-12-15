// app/api/auth/signup/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendSmsMelipayamak } from "@/lib/sms";
import {
  successResponse,
  validationError,
  conflictResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

function generateOtpDigits(length = 4) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export async function POST(req: Request) {
  try {
    const body: { phone?: string; password?: string } = await req.json();
    const phone = body.phone;
    const password = body.password;

    if (!phone || !password) {
      return validationError(
        {
          phone: !phone ? ["شماره تلفن الزامی است"] : [],
          password: !password ? ["رمز عبور الزامی است"] : [],
        },
        "اطلاعات ناقص است"
      );
    }

    // بررسی: آیا کاربر تاییدشده وجود دارد؟
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser?.phoneVerified) {
      return conflictResponse("User", "این شماره قبلاً ثبت شده است");
    }

    // هش کردن رمز و ذخیره موقت در جدول temp
    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP جدید بساز
    const code = generateOtpDigits(4);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // دو دقیقه
    console.log("code: ", code);

    // ❌ استفاده از phone در where مجاز نیست، باید ابتدا id بگیریم
    const existingOtp = await prisma.otp.findFirst({ where: { phone } });

    if (existingOtp) {
      await prisma.otp.update({
        where: { id: existingOtp.id }, // حتما id برای update استفاده می‌کنیم
        data: { code, expiresAt, createdAt: new Date() },
      });
    } else {
      await prisma.otp.create({
        data: { phone, code, expiresAt },
      });
    }

    // ذخیره موقت کاربر (اگر نبود)
    const existingTempUser = await prisma.tempUser.findFirst({
      where: { phone },
    });
    if (existingTempUser) {
      await prisma.tempUser.update({
        where: { id: existingTempUser.id },
        data: { passwordHash: hashedPassword, createdAt: new Date() },
      });
    } else {
      await prisma.tempUser.create({
        data: { phone, passwordHash: hashedPassword },
      });
    }
    // Prepare SMS text
    const text = `کد تایید شما: ${code}\nاین کد تا ۲ دقیقه معتبر است.`;

    // Send SMS
    try {
      const response = await sendSmsMelipayamak(phone, text);
      console.log("SMS sent:", response);
    } catch (err) {
      console.error("SMS send failed:", err);
      return errorResponse(
        "ارسال پیامک با خطا مواجه شد",
        ErrorCodes.SMS_SEND_FAILED
      );
    }

    return successResponse({ sent: true }, "کد تایید ارسال شد");
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse(
      "خطایی در ثبت‌نام رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
