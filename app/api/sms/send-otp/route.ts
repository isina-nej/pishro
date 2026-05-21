import { NextResponse } from "next/server";
import { sendOtpViaPattern } from "@/lib/sms";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

/**
 * POST /api/sms/send-otp
 * Send OTP via IPPanel Pattern API
 * Request body: { to: "09123456789", code: "1234" }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, code } = body;

    if (!to || !code) {
      return errorResponse(
        "شماره تلفن و کد الزامی هستند",
        ErrorCodes.INVALID_INPUT,
        {
          to: !to ? ["شماره تلفن الزامی است"] : [],
          code: !code ? ["کد الزامی است"] : [],
        },
        400
      );
    }

    console.log(`[SMS API] Sending OTP to ${to}`);

    // Use the shared OTP sending function
    await sendOtpViaPattern(to, code);

    return successResponse(
      { sent: true, to },
      "کد تایید با موفقیت ارسال شد"
    );
  } catch (error) {
    console.error("[SMS API] Error:", error);
    return errorResponse(
      "خطایی در ارسال پیامک رخ داد",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
