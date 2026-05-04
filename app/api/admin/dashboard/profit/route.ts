import { NextRequest } from "next/server";
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
    const session = await auth();\n// Return profit data
    const data = [
      { month: "Jan", profit: 2400 },
      { month: "Feb", profit: 1398 },
      { month: "Mar", profit: 9800 },
      { month: "Apr", profit: 3908 },
      { month: "May", profit: 4800 },
      { month: "Jun", profit: 3800 },
    ];

    const response = successResponse(data, "داده‌های سود دریافت شد");
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Profit data error:", error);
    const response = errorResponse(
      "خطا در دریافت داده‌های سود",
      ErrorCodes.INTERNAL_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
