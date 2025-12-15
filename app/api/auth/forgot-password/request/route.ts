// app/api/auth/forgot-password/request/route.ts
import { prisma } from "@/lib/prisma";
import { sendSmsMelipayamak } from "@/lib/sms";
import {
  successResponse,
  validationError,
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
    const { phone } = await req.json();

    if (!phone || !/^09\d{9}$/.test(phone)) {
      return validationError(
        { phone: "شماره تلفن معتبر نیست" },
        "شماره تلفن باید با فرمت 09XXXXXXXXX باشد"
      );
    }

    // بررسی اینکه کاربر با این شماره وجود دارد یا نه
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return validationError(
        { phone: "کاربری با این شماره یافت نشد" },
        "کاربری با این شماره یافت نشد"
      );
    }

    const code = generateOtpDigits(4);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // ذخیره یا بروزرسانی OTP
    const existingOtp = await prisma.otp.findFirst({ where: { phone } });

    if (existingOtp) {
      await prisma.otp.update({
        where: { id: existingOtp.id },
        data: { code, expiresAt, createdAt: new Date() },
      });
    } else {
      await prisma.otp.create({
        data: { phone, code, expiresAt },
      });
    }
    console.log("code: ", code);

    // Prepare SMS text
    const text = `کد بازیابی رمز عبور: ${code}\nاین کد تا ۲ دقیقه معتبر است.`;

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

    return successResponse({ expiresAt }, "کد بازیابی با موفقیت ارسال شد");
  } catch (err) {
    console.error("Forgot password request error:", err);
    return errorResponse(
      "خطایی در ارسال کد بازیابی رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
