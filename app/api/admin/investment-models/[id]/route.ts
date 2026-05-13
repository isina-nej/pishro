/**
 * Admin Investment Models Management API (Single Item)
 * GET /api/admin/investment-models/[id] - Get investment model by ID
 * PATCH /api/admin/investment-models/[id] - Update investment model (NOT IMPLEMENTED)
 * DELETE /api/admin/investment-models/[id] - Delete investment model (NOT IMPLEMENTED)
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getInvestmentModelById,
  // updateInvestmentModel, // TODO: Implement these functions
  // deleteInvestmentModel
} from "@/lib/services/investment-models-service";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const item = await getInvestmentModelById(id);

    if (!item) {
      return notFoundResponse("InvestmentModel", "مدل سرمایه‌ گذاری یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment model:", error);
    return errorResponse(
      "خطا در دریافت مدل سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/*
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // NOT IMPLEMENTED - updateInvestmentModel function not available
  return errorResponse("Not implemented", ErrorCodes.NOT_FOUND);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // NOT IMPLEMENTED - deleteInvestmentModel function not available
  return errorResponse("Not implemented", ErrorCodes.NOT_FOUND);
}
*/
