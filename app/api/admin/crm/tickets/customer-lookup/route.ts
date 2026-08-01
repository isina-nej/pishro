/**
 * Admin CRM Customer Lookup API (for ticket creation)
 * GET /api/admin/crm/tickets/customer-lookup?phone=... - Look up an existing User by phone
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, ErrorCodes, notFoundResponse, successResponse } from "@/lib/api-response";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const phone = req.nextUrl.searchParams.get("phone")?.trim();
    if (!phone) {
      return errorResponse("شماره تلفن الزامی است", ErrorCodes.INVALID_INPUT, undefined, 400);
    }

    const customer = await prisma.user.findUnique({
      where: { phone },
      select: { id: true, firstName: true, lastName: true, phone: true, email: true },
    });

    if (!customer) {
      return notFoundResponse("Customer", "مشتری با این شماره تلفن یافت نشد");
    }

    return successResponse(customer);
  } catch (error) {
    console.error("Error looking up customer:", error);
    return errorResponse("خطا در جستجوی مشتری", ErrorCodes.DATABASE_ERROR);
  }
}
