/**
 * Login API for CMS Admin Panel
 * POST /api/auth/login
 *
 * This endpoint allows the pishro-admin CMS to authenticate
 * and receive session credentials for subsequent API calls.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  successResponse,
  validationError,
  errorResponse,
  unauthorizedResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { signIn } from "@/auth";
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
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        passwordHash: true,
        role: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneVerified: true,
        avatarUrl: true,
      },
    });

    if (!user) {
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

    // Authenticate using Auth.js
    try {
      await signIn("credentials", {
        phone,
        password,
        redirect: false,
      });
    } catch (authError) {
      console.error("Auth.js sign-in error:", authError);
      const response = errorResponse(
        "خطا در احراز هویت",
        ErrorCodes.INTERNAL_ERROR
      );
      return addCorsHeaders(response, origin);
    }

    // Return user data (excluding sensitive info)
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
      avatarUrl: user.avatarUrl,
    };

    const response = successResponse(
      userData,
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
