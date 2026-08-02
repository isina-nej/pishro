// app/api/auth/check-token/route.ts
// Check token validity
// Docs: https://edge.ippanel.com/v1/api/acl/auth/check_token

import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";

const PAYAMAK_API_URL = process.env.PAYAMAK_API_URL || "https://edge.ippanel.com/v1";
const PAYAMAK_API_KEY_RAW = process.env.PAYAMAK_API_KEY;
// Decode base64 API key if it exists
const PAYAMAK_API_KEY = PAYAMAK_API_KEY_RAW
  ? Buffer.from(PAYAMAK_API_KEY_RAW, 'base64').toString('utf-8')
  : undefined;

export interface IPPanelCheckTokenResponse {
  data?: {
    user_name: string;
    user_id: number;
    document_block: boolean;
    is_reseller: boolean;
    send_block: boolean;
    name: string;
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
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return errorResponse(
        "توکن الزامی است",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!PAYAMAK_API_KEY) {
      console.error("PAYAMAK_API_KEY is not configured");
      return errorResponse(
        "خطایی در سیستم رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Check Token] Validating token`);

    const ipPanelResponse = await fetch(
      `${PAYAMAK_API_URL}/api/acl/auth/check_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PAYAMAK_API_KEY}`,
        },
        body: JSON.stringify({ token }),
      }
    );

    const ipPanelData: IPPanelCheckTokenResponse = await ipPanelResponse.json();

    console.log(`[Check Token] IPPanel response:`, {
      status: ipPanelResponse.status,
      success: ipPanelData.meta?.status,
      message: ipPanelData.meta?.message,
    });

    if (!ipPanelResponse.ok || !ipPanelData.meta?.status) {
      console.error("[Check Token] Token invalid or expired:", ipPanelData);

      return errorResponse(
        ipPanelData.meta?.message || "توکن نامعتبر یا منقضی است",
        ErrorCodes.UNAUTHORIZED,
        ipPanelData.errors,
        401
      );
    }

    if (!ipPanelData.data) {
      console.error("[Check Token] No user data in response:", ipPanelData);
      return errorResponse(
        "خطایی در دریافت اطلاعات کاربر رخ داد",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    console.log(`[Check Token] ✅ Token valid for user: ${ipPanelData.data.user_name}`);

    return successResponse(ipPanelData.data, ipPanelData.meta.message);
  } catch (error) {
    console.error("[Check Token] Error:", error);
    return errorResponse(
      "خطایی در بررسی توکن رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
