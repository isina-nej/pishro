/**
 * Login API for external CMS Admin Panel (legacy pishro-admin frontend)
 * POST /api/auth/login
 *
 * NOTE: The in-repo Next.js login (/login) uses /api/auth/external-login.
 * This endpoint is kept only for the external CMS client that talks to this
 * backend cross-origin (hence the CORS headers below). Do not point new
 * in-repo callers here — no in-repo fetch references this path.
 */

import type { User } from "@prisma/client";

/** Columns selected for the credentials check below */
type AuthUserRow = Pick<
  User,
  "id" | "phone" | "passwordHash" | "role" | "firstName" | "lastName" | "email" | "phoneVerified"
>;
import { NextRequest } from "next/server";
import { queryOne } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth-simple";
import {
  successResponse,
  validationError,
  errorResponse,
  unauthorizedResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const body = await req.json();
    const { phone, password } = body;

    // Validation
    if (!phone || !password) {
      const response = validationError(
        {
          phone: !phone ? "شماره تلفن الزامی است" : "",
          password: !password ? "رمز عبور الزامی است" : "",
        },
        "اطلاعات ورود ناقص است"
      );
      return addCorsHeaders(response, origin);
    }

    // Validate phone format
    if (!/^09\d{9}$/.test(phone)) {
      const response = validationError(
        { phone: "فرمت شماره تلفن نامعتبر است. باید 09XXXXXXXXX باشد" },
        "فرمت شماره تلفن نامعتبر است"
      );
      return addCorsHeaders(response, origin);
    }

    // Validate password length
    if (password.length < 8) {
      const response = validationError(
        { password: "رمز عبور باید حداقل 8 کاراکتر باشد" },
        "رمز عبور نامعتبر است"
      );
      return addCorsHeaders(response, origin);
    }

    // Find user
    const user = await queryOne<AuthUserRow>(
      "SELECT id, phone, passwordHash, role, firstName, lastName, email, phoneVerified FROM `User` WHERE phone = ?",
      [phone]
    );

    if (!user) {
      const response = unauthorizedResponse("شماره تلفن یا رمز عبور اشتباه است");
      return addCorsHeaders(response, origin);
    }

    // Null-hash guard: bcrypt.compare throws on null and leaks via 500.
    if (!user.passwordHash) {
      const response = unauthorizedResponse("شماره تلفن یا رمز عبور اشتباه است");
      return addCorsHeaders(response, origin);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const response = unauthorizedResponse("شماره تلفن یا رمز عبور اشتباه است");
      return addCorsHeaders(response, origin);
    }

    // Check if phone is verified
    if (!user.phoneVerified) {
      const response = validationError(
        { phone: "شماره تلفن تایید نشده است" },
        "لطفا ابتدا شماره تلفن خود را تایید کنید"
      );
      return addCorsHeaders(response, origin);
    }

    // Check if user is ADMIN (required for this endpoint)
    if (user.role !== 'ADMIN') {
      const response = unauthorizedResponse(
        "دسترسی فقط برای مدیران سیستم است"
      );
      return addCorsHeaders(response, origin);
    }

    // Return user data with JWT token (excluding sensitive info)
    const userData = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null,
      email: user.email,
      phoneVerified: user.phoneVerified,
    };

    // Generate JWT token for Bearer authentication
    const token = createToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    const response = successResponse(
      { ...userData, token },
      "ورود با موفقیت انجام شد"
    );
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Login error:", error);
    const response = errorResponse(
      "خطایی در فرآیند ورود رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
