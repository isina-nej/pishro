import type { User, Otp, TempUser } from "@prisma/client";
import { query, execute } from "@/lib/db";
import {
  checkOtpVerifyAllowed,
  clearOtpFailures,
  recordOtpFailure,
} from "@/lib/otp";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { randomUUID } from "crypto";

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

    if (!/^\d{6}$/.test(String(code).trim())) {
      return validationError(
        { code: "کد تایید باید ۶ رقم باشد" },
        "کد تایید نامعتبر است"
      );
    }

    const gate = checkOtpVerifyAllowed(phone);
    if (!gate.allowed) {
      return errorResponse(
        "تلاش‌های ناموفق زیاد بود. لطفاً بعداً تلاش کنید",
        ErrorCodes.OTP_INVALID,
        { retryAfterMs: gate.retryAfterMs },
        429
      );
    }

    // Get signup OTP from database (reset codes never validate here)
    const otps = await query<Otp>(
      `SELECT * FROM Otp WHERE phone = ? AND purpose = 'signup' LIMIT 1`,
      [phone]
    );

    if (!otps || otps.length === 0 || otps[0].code !== code) {
      recordOtpFailure(phone);
      return validationError(
        { code: "کد تایید نامعتبر است" },
        "کد تایید اشتباه است"
      );
    }

    const otp = otps[0];
    if (new Date(otp.expiresAt) < new Date()) {
      recordOtpFailure(phone);
      return errorResponse("کد تایید منقضی شده است", ErrorCodes.OTP_EXPIRED);
    }
    clearOtpFailures(phone);

    // Get temp user
    const tempUsers = await query<TempUser>(
      `SELECT * FROM TempUser WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (!tempUsers || tempUsers.length === 0) {
      return validationError(
        { phone: "کاربر موقت یافت نشد" },
        "کاربر موقت یافت نشد"
      );
    }

    const tempUser = tempUsers[0];

    // Check if user already exists
    const existingUsers = await query<Pick<User, "id">>(
      `SELECT id FROM User WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (!existingUsers || existingUsers.length === 0) {
      // Create new user
      const userId = randomUUID();
      await execute(
        `INSERT INTO User (id, phone, passwordHash, phoneVerified, role, createdAt, updatedAt) 
         VALUES (?, ?, ?, true, 'USER', NOW(), NOW())`,
        [userId, phone, tempUser.passwordHash]
      );
    } else {
      // Update existing user to mark phone as verified
      await execute(
        `UPDATE User SET phoneVerified = true, updatedAt = NOW() WHERE phone = ?`,
        [phone]
      );
    }

    // Delete OTP and TempUser records
    await execute(`DELETE FROM Otp WHERE phone = ? AND purpose = 'signup'`, [
      phone,
    ]);
    await execute(`DELETE FROM TempUser WHERE phone = ?`, [phone]);

    return successResponse({ verified: true }, "شماره تلفن با موفقیت تایید شد");
  } catch (err) {
    console.error("otp verify error:", err);
    return errorResponse("خطایی در تایید کد رخ داد", ErrorCodes.INTERNAL_ERROR);
  }
}
