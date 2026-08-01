/**
 * Admin CRM Ticket Assignees API
 * GET /api/admin/crm/tickets/assignees - List active admin users for the assignee dropdown
 *
 * Small helper scoped to the tickets module: there is no existing generic
 * "list AdminUser" endpoint in the codebase, so this provides just enough
 * (id/name/email) for the ticket assignee <Select>.
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, ErrorCodes, successResponse } from "@/lib/api-response";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const admins = await prisma.adminUser.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });

    return successResponse(admins);
  } catch (error) {
    console.error("Error listing admin assignees:", error);
    return errorResponse("خطا در دریافت لیست ادمین‌ها", ErrorCodes.DATABASE_ERROR);
  }
}
