import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const session = await auth();
    // Return payment data
    const data = [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 2000 },
      { month: "Apr", revenue: 2780 },
      { month: "May", revenue: 1890 },
      { month: "Jun", revenue: 2390 },
    ];

    const response = successResponse(data, "داده‌های پرداخت دریافت شد");
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Payment data error:", error);
    const response = errorResponse(
      "خطا در دریافت داده‌های پرداخت",
      ErrorCodes.INTERNAL_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
