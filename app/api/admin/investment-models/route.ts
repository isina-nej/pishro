/**
 * Admin Investment Models Management API
 * GET /api/admin/investment-models - List all investment models
 * POST /api/admin/investment-models - Create a new investment model (NOT IMPLEMENTED)
 */

import { NextRequest } from "next/server";
import {
  // createInvestmentModel // TODO: Implement this function
} from "@/lib/services/investment-models-service";
import {
  errorResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";

/*
export async function POST(req: NextRequest) {
  // TODO: Implement createInvestmentModel function
  return errorResponse("Not implemented", ErrorCodes.NOT_FOUND);
}
*/
