/**
 * CRM Customer Activity endpoint
 * POST /api/admin/crm/customers/[id]/activities - add a NOTE activity for a
 * customer, authored by the authenticated admin.
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { AddCustomerActivitySchema } from "@/lib/schemas/crm-customer-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const { id } = await params;

    const customer = await prisma.user.findUnique({ where: { id } });
    if (!customer) {
      return notFoundResponse("Customer", "مشتری مورد نظر یافت نشد");
    }

    const body = await req.json();
    const parsed = AddCustomerActivitySchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      return validationError(
        Object.fromEntries(
          Object.entries(fields).map(([key, messages]) => [key, messages?.[0] || ""])
        ),
        "اطلاعات ارسالی نامعتبر است"
      );
    }

    const activity = await prisma.activity.create({
      data: {
        type: "NOTE",
        content: parsed.data.content,
        customerId: id,
        adminId: adminUser.id,
      },
      include: {
        admin: { select: { id: true, name: true } },
      },
    });

    return createdResponse(activity, "یادداشت با موفقیت ثبت شد");
  } catch (error) {
    console.error("Error creating CRM customer activity:", error);
    return errorResponse(
      "خطایی در ثبت یادداشت رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
