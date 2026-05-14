// app/api/auth/forgot-password/route.ts
// Request password reset via IPPanel Edge API
// Docs: https://edge.ippanel.com/v1/api/acl/auth/forgot_password

import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

const PAYAMAK_API_URL = process.env.PAYAMAK_API_URL || "https://edge.ippanel.com/v1";
const PAYAMAK_API_KEY = process.env.PAYAMAK_API_KEY;

export interface IPPanelForgotPasswordResponse {
  data?: {
    token: string;
  };
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
  errors?: Record<string, string[]>;
}

export async function POST(req: Request) {
  try {
    const body: { username?: string; mobile?: string } = await req.json();
    const { username, mobile } = body;

    if (!username || !mobile) {
      return validationError(
        {
          username: !username ? ["نام کاربری الزامی است"] : [],
          mobile: !mobile ? ["شماره موبایل الزامی است"] : [],
        },
        "اطلاعات ناقص است"
      );
    }

    if (!PAYAMAK_API_KEY) {
      console.error("PAYAMAK_API_KEY is not configured");
      return errorResponse(
        "خطایی در سیستم رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Forgot Password] Requesting password reset for user: ${username}`);

    const ipPanelResponse = await fetch(
      `${PAYAMAK_API_URL}/api/acl/auth/forgot_password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PAYAMAK_API_KEY}`,
        },
        body: JSON.stringify({ username, mobile }),
      }
    );

    const ipPanelData: IPPanelForgotPasswordResponse = await ipPanelResponse.json();

    console.log(`[Forgot Password] IPPanel response:`, {
      status: ipPanelResponse.status,
      success: ipPanelData.meta?.status,
      message: ipPanelData.meta?.message,
    });

    if (!ipPanelResponse.ok || !ipPanelData.meta?.status) {
      console.error("[Forgot Password] Request failed:", ipPanelData);

      return errorResponse(
        ipPanelData.meta?.message || "نام کاربری یا شماره موبایل اشتباه است",
        ErrorCodes.INVALID_INPUT,
        ipPanelData.errors,
        400
      );
    }

    if (!ipPanelData.data?.token) {
      console.error("[Forgot Password] No token in response:", ipPanelData);
      return errorResponse(
        "خطایی در دریافت توکن رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Forgot Password] ✅ Password reset OTP sent to mobile`);

    return successResponse(
      {
        token: ipPanelData.data.token,
        expiresIn: 2 * 60 * 1000, // 2 minutes
      },
      "کد بازیابی رمز عبور به شماره موبایل ارسال شد"
    );
  } catch (error) {
    console.error("[Forgot Password] Error:", error);
    return errorResponse(
      "خطایی در درخواست بازیابی رمز عبور رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
