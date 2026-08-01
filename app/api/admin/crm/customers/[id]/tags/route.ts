/**
 * CRM Customer Tag Assignment endpoint
 * POST /api/admin/crm/customers/[id]/tags - assign a tag to a customer
 * DELETE /api/admin/crm/customers/[id]/tags - unassign a tag from a customer
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  conflictResponse,
  createdResponse,
  errorResponse,
  ErrorCodes,
  noContentResponse,
  notFoundResponse,
  validationError,
} from "@/lib/api-response";
import { AssignCustomerTagSchema } from "@/lib/schemas/crm-customer-schema";

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
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const body = await req.json();
    const parsed = AssignCustomerTagSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      return validationError(
        Object.fromEntries(
          Object.entries(fields).map(([key, messages]) => [key, messages?.[0] || ""])
        ),
        "اطلاعات ارسالی نامعتبر است"
      );
    }

    const [customer, tag] = await Promise.all([
      prisma.user.findUnique({ where: { id } }),
      prisma.customerTag.findUnique({ where: { id: parsed.data.tagId } }),
    ]);

    if (!customer) {
      return notFoundResponse("Customer", "مشتری مورد نظر یافت نشد");
    }
    if (!tag) {
      return notFoundResponse("Tag", "برچسب مورد نظر یافت نشد");
    }

    try {
      const assignment = await prisma.userTagAssignment.create({
        data: { userId: id, tagId: parsed.data.tagId },
        include: { tag: true },
      });
      return createdResponse(assignment, "برچسب با موفقیت به مشتری اضافه شد");
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return conflictResponse("Tag", "این برچسب قبلا به مشتری اختصاص داده شده است");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error assigning CRM tag to customer:", error);
    return errorResponse(
      "خطایی در اختصاص برچسب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    let tagId = req.nextUrl.searchParams.get("tagId");
    if (!tagId) {
      const body = await req.json().catch(() => null);
      tagId = body?.tagId ?? null;
    }

    const parsed = AssignCustomerTagSchema.safeParse({ tagId });
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      return validationError(
        Object.fromEntries(
          Object.entries(fields).map(([key, messages]) => [key, messages?.[0] || ""])
        ),
        "اطلاعات ارسالی نامعتبر است"
      );
    }

    const assignment = await prisma.userTagAssignment.findUnique({
      where: {
        userId_tagId: { userId: id, tagId: parsed.data.tagId },
      },
    });

    if (!assignment) {
      return notFoundResponse("Tag assignment", "این برچسب به مشتری اختصاص داده نشده است");
    }

    await prisma.userTagAssignment.delete({ where: { id: assignment.id } });

    return noContentResponse();
  } catch (error) {
    console.error("Error unassigning CRM tag from customer:", error);
    return errorResponse(
      "خطایی در حذف برچسب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
