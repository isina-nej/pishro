import { NextRequest } from "next/server";
import { errorResponse, ErrorCodes, successResponse } from "@/lib/api-response";

interface RouteParams {
  id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params;
    
    // Placeholder implementation
    return successResponse({
      id,
      message: "Comment detail endpoint",
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return errorResponse(
      "خطایی در دریافت نظر رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
