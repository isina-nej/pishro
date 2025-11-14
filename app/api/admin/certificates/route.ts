/**
 * Admin Certificates Management API
 * GET /api/admin/certificates - List all certificates
 * POST /api/admin/certificates - Create a new certificate
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const aboutPageId = searchParams.get("aboutPageId");
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.CertificateWhereInput = {};

    if (aboutPageId) {
      where.aboutPageId = aboutPageId;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch certificates
    const [items, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          aboutPage: {
            select: {
              id: true,
              heroTitle: true,
            },
          },
        },
      }),
      prisma.certificate.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return errorResponse(
      "خطا در دریافت گواهینامه‌ها",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const body = await req.json();
    const {
      aboutPageId,
      title,
      description,
      image,
      order = 0,
      published = false,
    } = body;

    // Validation
    if (!aboutPageId || !title || !image) {
      return validationError({
        aboutPageId: !aboutPageId ? "شناسه صفحه درباره ما الزامی است" : "",
        title: !title ? "عنوان الزامی است" : "",
        image: !image ? "تصویر الزامی است" : "",
      });
    }

    // Check if about page exists
    const aboutPage = await prisma.aboutPage.findUnique({
      where: { id: aboutPageId },
    });

    if (!aboutPage) {
      return errorResponse(
        "صفحه درباره ما یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    }

    // Create certificate
    const item = await prisma.certificate.create({
      data: {
        aboutPageId,
        title,
        description,
        image,
        order,
        published,
      },
      include: {
        aboutPage: {
          select: {
            id: true,
            heroTitle: true,
          },
        },
      },
    });

    return createdResponse(item, "گواهینامه با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating certificate:", error);
    return errorResponse(
      "خطا در ایجاد گواهینامه",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
