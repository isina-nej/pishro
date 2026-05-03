import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { getSkyRoomMeetingLink } from "@/lib/services/skyroom-service";

export async function GET() {
  try {
    const classes = await getSkyRoomMeetingLink();
    return successResponse(classes);
  } catch (error) {
    console.error("Error fetching skyroom classes:", error);
    return errorResponse(
      "خطایی در دریافت کلاس‌های اسکای‌روم رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
