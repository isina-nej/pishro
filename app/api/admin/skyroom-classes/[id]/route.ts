// @/app/api/admin/skyroom-classes/[id]/route.ts
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { auth } from "@/auth";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  getSkyRoomClassById,
  // updateSkyRoomClass, // TODO: Implement
  // deleteSkyRoomClass  // TODO: Implement
} from "@/lib/services/skyroom-service";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationError,
  ErrorCodes
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/skyroom-classes/[id]
 * دریافت یک لینک همایش (برای ادمین)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const skyRoomClass = await getSkyRoomClassById(id);

    if (!skyRoomClass) {
      return notFoundResponse("لینک همایش مورد نظر یافت نشد");
    }

    return successResponse(skyRoomClass, "لینک همایش با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت لینک همایش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/*
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  // NOT IMPLEMENTED - updateSkyRoomClass function not available
  return errorResponse("Not implemented", ErrorCodes.NOT_FOUND);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  // NOT IMPLEMENTED - deleteSkyRoomClass function not available
  return errorResponse("Not implemented", ErrorCodes.NOT_FOUND);
}
*/
