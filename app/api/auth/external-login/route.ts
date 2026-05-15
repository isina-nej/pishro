// app/api/auth/external-login/route.ts
// Local database login (no external API)

import { queryOne } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export interface LocalLoginResponse {
  data?: {
    id: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    name?: string;
    role: string;
  };
  meta: {
    status: boolean;
    message: string;
  };
  errors?: Record<string, string[]>;
}

function successLoginResponse(data: LocalLoginResponse['data']) {
  return NextResponse.json(
    {
      data,
      meta: {
        status: true,
        message: "ورود با موفقیت انجام شد",
      },
    },
    { status: 200 }
  );
}

function errorLoginResponse(message: string, statusCode: number = 401, errors?: Record<string, string[]>) {
  return NextResponse.json(
    {
      meta: {
        status: false,
        message,
      },
      ...(errors && { errors }),
    },
    { status: statusCode }
  );
}

export async function POST(req: Request) {
  try {
    const body: { username?: string; password?: string } = await req.json();
    const { username: phone, password } = body;

    if (!phone || !password) {
      return errorLoginResponse(
        "اطلاعات ناقص است",
        422,
        {
          username: !phone ? ["شماره تلفن الزامی است"] : [],
          password: !password ? ["رمز عبور الزامی است"] : [],
        }
      );
    }

    // Validate phone format
    if (!/^09\d{9}$/.test(phone)) {
      return errorLoginResponse(
        "فرمت شماره تلفن نامعتبر است",
        422,
        {
          username: ["فرمت شماره تلفن نامعتبر است. باید 09XXXXXXXXX باشد"],
        }
      );
    }

    console.log(`[Local Login] Authenticating user: ${phone}`);

    // Find user in database
    const user = await queryOne<any>(
      "SELECT id, phone, passwordHash, role, firstName, lastName, email, phoneVerified FROM `User` WHERE phone = ?",
      [phone]
    );

    if (!user) {
      console.log(`[Local Login] User not found: ${phone}`);
      return errorLoginResponse("شماره تلفن یا رمز عبور اشتباه است", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log(`[Local Login] Invalid password for user: ${phone}`);
      return errorLoginResponse("شماره تلفن یا رمز عبور اشتباه است", 401);
    }

    // Check if phone is verified
    if (!user.phoneVerified) {
      console.log(`[Local Login] Phone not verified for user: ${phone}`);
      return errorLoginResponse(
        "لطفا ابتدا شماره تلفن خود را تایید کنید",
        422,
        {
          username: ["شماره تلفن تایید نشده است"],
        }
      );
    }

    console.log(`[Local Login] ✅ Login successful for user: ${phone}`);

    // Return user data
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
    };

    return successLoginResponse(userData);
  } catch (error) {
    console.error("[Local Login] Error:", error);
    return errorLoginResponse(
      "خطایی در فرآیند ورود رخ داد",
      500
    );
  }
}
