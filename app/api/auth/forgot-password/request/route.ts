// app/api/auth/forgot-password/request/route.ts
import { query, execute } from "@/lib/db";
import { randomUUID } from "crypto";
import { sendSms } from "@/lib/sms";
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

    // Check if user with this phone exists
    const users = await query<any>(
      `SELECT id FROM User WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (!users || users.length === 0) {
      return validationError(
        { phone: "کاربری با این شماره یافت نشد" },
        "کاربری با این شماره یافت نشد"
      );
    }

    const code = generateOtpDigits(4);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Check if OTP exists for this phone
    const otps = await query<any>(
      `SELECT id FROM Otp WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (otps && otps.length > 0) {
      // Update existing OTP
      await execute(
        `UPDATE Otp SET code = ?, expiresAt = ?, createdAt = NOW() WHERE phone = ?`,
        [code, expiresAt, phone]
      );
    } else {
      // Create new OTP with ID
      const otpId = randomUUID();
      await execute(
        `INSERT INTO Otp (id, phone, code, expiresAt, createdAt) VALUES (?, ?, ?, ?, NOW())`,
        [otpId, phone, code, expiresAt]
      );
    }

    console.log("code: ", code);

    // Prepare SMS text
    const text = `کد بازیابی رمز عبور: ${code}\nاین کد تا ۲ دقیقه معتبر است.`;

    // Send SMS asynchronously (don't block on it)
    sendSms(phone, text).catch((err) => {
      // Silent fail - user can always retry
      console.error("SMS background send failed:", {
        phone,
        error: err instanceof Error ? err.message : String(err),
      });
    });

    return successResponse({ expiresAt }, "کد بازیابی با موفقیت ارسال شد");
  } catch (err) {
    console.error("Forgot password request error:", err);
    return errorResponse(
      "خطایی در ارسال کد بازیابی رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
