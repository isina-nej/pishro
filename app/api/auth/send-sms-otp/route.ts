// app/api/auth/send-sms-otp/route.ts
// Request to send SMS OTP via IPPanel Edge API
// When user has GA enabled but wants SMS instead
// Docs: https://edge.ippanel.com/v1/api/acl/auth/send_sms_otp

import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

const PAYAMAK_API_URL = process.env.PAYAMAK_API_URL || "https://edge.ippanel.com/v1";
const PAYAMAK_API_KEY = process.env.PAYAMAK_API_KEY;

export interface IPPanelSendSMSResponse {
  data?: {
    method: "sms";
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
    const body: { token?: string } = await req.json();
    const { token } = body;

    if (!token) {
      return validationError(
        { token: ["توکن الزامی است"] },
        "توکن ارائه نشده است"
      );
    }

    if (!PAYAMAK_API_KEY) {
      console.error("PAYAMAK_API_KEY is not configured");
      return errorResponse(
        "خطایی در سیستم رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Send SMS OTP] Requesting SMS OTP via IPPanel API`);

    const ipPanelResponse = await fetch(
      `${PAYAMAK_API_URL}/api/acl/auth/send_sms_otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PAYAMAK_API_KEY}`,
        },
        body: JSON.stringify({ token }),
      }
    );

    const ipPanelData: IPPanelSendSMSResponse = await ipPanelResponse.json();

    console.log(`[Send SMS OTP] IPPanel response:`, {
      status: ipPanelResponse.status,
      success: ipPanelData.meta?.status,
      message: ipPanelData.meta?.message,
    });

    if (!ipPanelResponse.ok || !ipPanelData.meta?.status) {
      console.error("[Send SMS OTP] Request failed:", ipPanelData);

      return errorResponse(
        ipPanelData.meta?.message || "خطا در درخواست پیامک",
        ErrorCodes.INVALID_INPUT,
        ipPanelData.errors,
        400
      );
    }

    if (!ipPanelData.data?.token) {
      console.error("[Send SMS OTP] No token in response:", ipPanelData);
      return errorResponse(
        "خطایی در دریافت توکن رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Send SMS OTP] ✅ SMS OTP sent successfully`);

    return successResponse(
      {
        token: ipPanelData.data.token,
        method: "sms",
      },
      ipPanelData.meta.message
    );
  } catch (error) {
    console.error("[Send SMS OTP] Error:", error);
    return errorResponse(
      "خطایی در ارسال درخواست رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
