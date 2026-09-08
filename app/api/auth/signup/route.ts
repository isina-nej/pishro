// app/api/auth/signup/route.ts
import type { User, Otp, TempUser } from "@prisma/client";
import { query, execute } from "@/lib/db";
import {
  checkOtpResendCooldown,
  generateOtpCode,
  recordOtpSend,
} from "@/lib/otp";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sendOtpViaPattern } from "@/lib/sms";
import {
  successResponse,
  validationError,
  conflictResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

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

    // Check if user already verified
    const users = await query<Pick<User, "phoneVerified">>(
      `SELECT phoneVerified FROM User WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (users && users.length > 0 && users[0].phoneVerified) {
      return conflictResponse("User", "این شماره قبلاً ثبت شده است");
    }

    const cooldown = checkOtpResendCooldown(phone);
    if (!cooldown.allowed) {
      return errorResponse(
        "لطفاً کمی صبر کنید و دوباره تلاش کنید",
        ErrorCodes.OTP_SEND_FAILED,
        { retryAfterMs: cooldown.retryAfterMs },
        429
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const code = generateOtpCode(6);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Check if signup OTP exists for this phone
    const otps = await query<Pick<Otp, "id">>(
      `SELECT id FROM Otp WHERE phone = ? AND purpose = 'signup' LIMIT 1`,
      [phone]
    );

    if (otps && otps.length > 0) {
      // Update existing OTP
      await execute(
        `UPDATE Otp SET code = ?, expiresAt = ?, createdAt = NOW() WHERE phone = ? AND purpose = 'signup'`,
        [code, expiresAt, phone]
      );
    } else {
      // Create new OTP with ID
      const otpId = randomUUID();
      await execute(
        `INSERT INTO Otp (id, phone, purpose, code, expiresAt, createdAt) VALUES (?, ?, 'signup', ?, ?, NOW())`,
        [otpId, phone, code, expiresAt]
      );
    }

    // Check if TempUser exists for this phone
    const tempUsers = await query<Pick<TempUser, "id">>(
      `SELECT id FROM TempUser WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (tempUsers && tempUsers.length > 0) {
      // Update existing TempUser
      await execute(
        `UPDATE TempUser SET passwordHash = ?, createdAt = NOW() WHERE phone = ?`,
        [hashedPassword, phone]
      );
    } else {
      // Create new TempUser with ID
      const tempUserId = randomUUID();
      await execute(
        `INSERT INTO TempUser (id, phone, passwordHash, createdAt) VALUES (?, ?, ?, NOW())`,
        [tempUserId, phone, hashedPassword]
      );
    }

    recordOtpSend(phone);

    // Send OTP via IPPanel Pattern API asynchronously (don't block on it)
    // Pattern templates are instant and don't need approval
    sendOtpViaPattern(phone, code).catch((err) => {
      // Silent fail - user is already registered, SMS delay won't block their signup
      console.error("OTP send failed (will retry):", {
        phone,
        error: err instanceof Error ? err.message : String(err),
      });
    });

    return successResponse({ sent: true }, "کد تایید ارسال شد");
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse(
      "خطایی در ثبت‌نام رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
