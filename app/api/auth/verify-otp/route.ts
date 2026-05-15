// app/api/auth/verify-otp/route.ts
// Verify OTP code from SMS or Google Authenticator
// Docs: https://edge.ippanel.com/v1/api/acl/auth/confirm_otp

import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

const PAYAMAK_API_URL = process.env.PAYAMAK_API_URL || "https://edge.ippanel.com/v1";
const PAYAMAK_API_KEY_RAW = process.env.PAYAMAK_API_KEY;
// Decode base64 API key if it exists
const PAYAMAK_API_KEY = PAYAMAK_API_KEY_RAW
  ? Buffer.from(PAYAMAK_API_KEY_RAW, 'base64').toString('utf-8')
  : undefined;

export interface IPPanelVerifyOTPResponse {
  data?: {
    token: string; // Final authentication token (valid for 10 hours)
    method: "login";
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
    const body: { token?: string; otp?: string } = await req.json();
    const { token, otp } = body;

    if (!token || !otp) {
      return validationError(
        {
          token: !token ? ["توکن الزامی است"] : [],
          otp: !otp ? ["کد OTP الزامی است"] : [],
        },
        "اطلاعات ناقص است"
      );
    }

    if (!/^\d{4,6}$/.test(otp)) {
      return validationError(
        { otp: ["کد OTP باید 4 تا 6 رقم باشد"] },
        "کد OTP نامعتبر است"
      );
    }

    if (!PAYAMAK_API_KEY) {
      console.error("PAYAMAK_API_KEY is not configured");
      return errorResponse(
        "خطایی در سیستم رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Verify OTP] Verifying OTP via IPPanel API`);

    const ipPanelResponse = await fetch(
      `${PAYAMAK_API_URL}/api/acl/auth/confirm_otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PAYAMAK_API_KEY}`,
        },
        body: JSON.stringify({ token, otp }),
      }
    );

    const ipPanelData: IPPanelVerifyOTPResponse = await ipPanelResponse.json();

    console.log(`[Verify OTP] IPPanel response:`, {
      status: ipPanelResponse.status,
      success: ipPanelData.meta?.status,
      message: ipPanelData.meta?.message,
    });

    if (!ipPanelResponse.ok || !ipPanelData.meta?.status) {
      console.error("[Verify OTP] Verification failed:", ipPanelData);

      return errorResponse(
        ipPanelData.meta?.message || "کد OTP نادرست است",
        ErrorCodes.UNAUTHORIZED,
        ipPanelData.errors,
        400
      );
    }

    if (!ipPanelData.data?.token) {
      console.error("[Verify OTP] No token in response:", ipPanelData);
      return errorResponse(
        "خطایی در دریافت توکن رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Verify OTP] ✅ OTP verified successfully, token issued (valid for 10 hours)`);

    return successResponse(
      {
        token: ipPanelData.data.token,
        expiresIn: 10 * 60 * 60 * 1000, // 10 hours in milliseconds
      },
      ipPanelData.meta.message
    );
  } catch (error) {
    console.error("[Verify OTP] Error:", error);
    return errorResponse(
      "خطایی در تایید کد رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
