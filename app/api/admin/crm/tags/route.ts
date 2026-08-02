/**
 * CRM Customer Tags endpoint
 * GET /api/admin/crm/tags - list all customer tags
 * POST /api/admin/crm/tags - create a new customer tag
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  successResponse,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { CreateCustomerTagSchema } from "@/lib/schemas/crm-customer-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(req: NextRequest) {
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

    const tags = await prisma.customerTag.findMany({
      orderBy: { name: "asc" },
    });

    return successResponse(tags);
  } catch (error) {
    console.error("Error fetching CRM tags:", error);
    return errorResponse(
      "خطایی در دریافت برچسب‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const parsed = CreateCustomerTagSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      return validationError(
        Object.fromEntries(
          Object.entries(fields).map(([key, messages]) => [key, messages?.[0] || ""])
        ),
        "اطلاعات ارسالی نامعتبر است"
      );
    }

    const existing = await prisma.customerTag.findUnique({
      where: { name: parsed.data.name },
    });
    if (existing) {
      return validationError(
        { name: "برچسبی با این نام قبلا ثبت شده است" },
        "برچسب تکراری است"
      );
    }

    const tag = await prisma.customerTag.create({
      data: {
        name: parsed.data.name,
        color: parsed.data.color ?? null,
      },
    });

    return createdResponse(tag, "برچسب با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating CRM tag:", error);
    return errorResponse(
      "خطایی در ایجاد برچسب رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
