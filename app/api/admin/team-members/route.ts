/**
 * Admin Team Members Management API
 * GET /api/admin/team-members - List all team members
 * POST /api/admin/team-members - Create a new team member
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
    const where: Prisma.TeamMemberWhereInput = {};

    if (aboutPageId) {
      where.aboutPageId = aboutPageId;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch team members
    const [items, total] = await Promise.all([
      prisma.teamMember.findMany({
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
      prisma.teamMember.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return errorResponse(
      "خطا در دریافت اعضای تیم",
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
      name,
      role,
      image,
      education,
      description,
      specialties = [],
      linkedinUrl,
      emailUrl,
      twitterUrl,
      whatsappUrl,
      telegramUrl,
      order = 0,
      published = false,
    } = body;

    // Validation
    if (!aboutPageId || !name || !role) {
      return validationError({
        aboutPageId: !aboutPageId ? "شناسه صفحه درباره ما الزامی است" : "",
        name: !name ? "نام الزامی است" : "",
        role: !role ? "نقش الزامی است" : "",
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

    // Create team member
    const item = await prisma.teamMember.create({
      data: {
        aboutPageId,
        name,
        role,
        image,
        education,
        description,
        specialties,
        linkedinUrl,
        emailUrl,
        twitterUrl,
        whatsappUrl,
        telegramUrl,
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

    return createdResponse(item, "عضو تیم با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating team member:", error);
    return errorResponse(
      "خطا در ایجاد عضو تیم",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
