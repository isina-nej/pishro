import type { User, Otp, TempUser } from "@prisma/client";
import { query, execute } from "@/lib/db";
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

    // Get OTP from database
    const otps = await query<Otp>(
      `SELECT * FROM Otp WHERE phone = ? LIMIT 1`,
      [phone]
    );

    if (!otps || otps.length === 0 || otps[0].code !== code) {
      return validationError(
        { code: "کد تایید نامعتبر است" },
        "کد تایید اشتباه است"
      );
    }

    const otp = otps[0];
    if (new Date(otp.expiresAt) < new Date()) {
      return errorResponse("کد تایید منقضی شده است", ErrorCodes.OTP_EXPIRED);
    }

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
        `UPDATE User SET phoneVerified = true, updatedAt NOW() WHERE phone ?`,
        [phone]
      );
    }

    // Delete OTP and TempUser records
    await execute(`DELETE FROM Otp WHERE phone = ?`, [phone]);
    await execute(`DELETE FROM TempUser WHERE phone = ?`, [phone]);

    return successResponse({ verified: true }, "شماره تلفن با موفقیت تایید شد");
  } catch (err) {
    console.error("otp verify error:", err);
    return errorResponse("خطایی در تایید کد رخ داد", ErrorCodes.INTERNAL_ERROR);
  }
}
