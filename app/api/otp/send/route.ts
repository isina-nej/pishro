// app/api/otp/send/route.ts
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

    const code = generateOtpDigits(4);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // valid for 2 minutes

    // Save OTP to DB (using Prisma)
    await prisma.otp.create({
      data: { phone, code, expiresAt },
    });

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

    return successResponse({ expiresAt }, "کد تایید با موفقیت ارسال شد");
  } catch (err) {
    console.error("OTP send error:", err);
    return errorResponse(
      "خطایی در ارسال کد تایید رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
