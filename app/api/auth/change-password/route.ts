// app/api/auth/change-password/route.ts
// Change password using token from forgot_password
// Docs: https://edge.ippanel.com/v1/api/acl/auth/change_password_by_token

import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

const PAYAMAK_API_URL = process.env.PAYAMAK_API_URL || "https://edge.ippanel.com/v1";
const PAYAMAK_API_KEY = process.env.PAYAMAK_API_KEY;

export interface IPPanelChangePasswordResponse {
  data?: null;
  meta: {
    status: boolean;
    message: string;
    message_code: string;
  };
  errors?: Record<string, string[]>;
}

export async function POST(req: Request) {
  try {
    const body: { token?: string; otp?: string; password?: string } =
      await req.json();
    const { token, otp, password } = body;

    if (!token || !otp || !password) {
      return validationError(
        {
          token: !token ? ["توکن الزامی است"] : [],
          otp: !otp ? ["کد OTP الزامی است"] : [],
          password: !password ? ["رمز عبور جدید الزامی است"] : [],
        },
        "اطلاعات ناقص است"
      );
    }

    if (password.length < 8) {
      return validationError(
        { password: ["رمز عبور باید حداقل 8 کاراکتر باشد"] },
        "رمز عبور ضعیف است"
      );
    }

    if (!PAYAMAK_API_KEY) {
      console.error("PAYAMAK_API_KEY is not configured");
      return errorResponse(
        "خطایی در سیستم رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Change Password] Changing password via IPPanel API`);

    const ipPanelResponse = await fetch(
      `${PAYAMAK_API_URL}/api/acl/auth/change_password_by_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PAYAMAK_API_KEY}`,
        },
        body: JSON.stringify({ token, otp, password }),
      }
    );

    const ipPanelData: IPPanelChangePasswordResponse = await ipPanelResponse.json();

    console.log(`[Change Password] IPPanel response:`, {
      status: ipPanelResponse.status,
      success: ipPanelData.meta?.status,
      message: ipPanelData.meta?.message,
    });

    if (!ipPanelResponse.ok || !ipPanelData.meta?.status) {
      console.error("[Change Password] Request failed:", ipPanelData);

      return errorResponse(
        ipPanelData.meta?.message || "خطا در تغییر رمز عبور",
        ErrorCodes.INVALID_INPUT,
        ipPanelData.errors,
        400
      );
    }

    console.log(`[Change Password] ✅ Password changed successfully`);

    return successResponse(null, "رمز عبور با موفقیت تغییر کرد");
  } catch (error) {
    console.error("[Change Password] Error:", error);
    return errorResponse(
      "خطایی در تغییر رمز عبور رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
