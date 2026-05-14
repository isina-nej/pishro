// app/api/auth/external-login/route.ts
// External login via IPPanel Edge API
// Docs: https://edge.ippanel.com/v1/api/acl/auth/login

import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

const PAYAMAK_API_URL = process.env.PAYAMAK_API_URL || "https://edge.ippanel.com/v1";
const PAYAMAK_API_KEY = process.env.PAYAMAK_API_KEY;

export interface IPPanelLoginResponse {
  data?: {
    method: "ga" | "sms" | "login"; // "ga" (Google Authenticator), "sms" (SMS OTP), "login" (direct)
    token: string;
  };
  meta: {
    status: boolean;
    message: string;
    message_code: string;
    message_parameters?: string[];
  };
  errors?: Record<string, string[]>;
}

export async function POST(req: Request) {
  try {
    const body: { username?: string; password?: string } = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return validationError(
        {
          username: !username ? ["نام کاربری الزامی است"] : [],
          password: !password ? ["رمز عبور الزامی است"] : [],
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

    // Call IPPanel Edge API
    console.log(`[External Login] Calling IPPanel API for user: ${username}`);
    console.log(`[External Login] API URL: ${PAYAMAK_API_URL}/api/acl/auth/login`);
    console.log(`[External Login] API Key present: ${!!PAYAMAK_API_KEY}`);
    
    const ipPanelResponse = await fetch(`${PAYAMAK_API_URL}/api/acl/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PAYAMAK_API_KEY}`,
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const ipPanelData: IPPanelLoginResponse = await ipPanelResponse.json();
    
    console.log(`[External Login] IPPanel response:`, {
      status: ipPanelResponse.status,
      statusText: ipPanelResponse.statusText,
      success: ipPanelData.meta?.status,
      method: ipPanelData.data?.method,
      message: ipPanelData.meta?.message,
      fullData: JSON.stringify(ipPanelData, null, 2),
    });

    if (!ipPanelResponse.ok || !ipPanelData.meta?.status) {
      console.error("[External Login] Authentication failed:", ipPanelData);
      
      return errorResponse(
        ipPanelData.meta?.message || "نام کاربری یا رمز عبور اشتباه است",
        ErrorCodes.UNAUTHORIZED,
        ipPanelData.errors,
        422
      );
    }

    // Success - return the token and method from IPPanel
    if (!ipPanelData.data?.token) {
      console.error("[External Login] No token in response:", ipPanelData);
      return errorResponse(
        "خطایی در دریافت توکن رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[External Login] ✅ Login successful for user: ${username}, method: ${ipPanelData.data.method}`);

    return successResponse(
      {
        token: ipPanelData.data.token,
        method: ipPanelData.data.method, // "ga", "sms", or "login"
      },
      ipPanelData.meta.message
    );
  } catch (error) {
    console.error("[External Login] Error:", error);
    return errorResponse(
      "خطایی در ثبت‌نام رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
