/**
 * CRM Customer-360 detail endpoint
 * GET /api/admin/crm/customers/[id] - composed customer view: profile +
 * orders + transactions + investment portfolios + enrollments + tags +
 * CRM activity feed.
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  notFoundResponse,
} from "@/lib/api-response";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        phoneVerified: true,
        role: true,
        firstName: true,
        lastName: true,
        email: true,
        nationalCode: true,
        birthDate: true,
        avatarUrl: true,
        cardNumber: true,
        shebaNumber: true,
        accountOwner: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return notFoundResponse("Customer", "مشتری مورد نظر یافت نشد");
    }

    const [orders, transactions, investmentPortfolios, enrollments, tagAssignments, activities] =
      await Promise.all([
        prisma.order.findMany({
          where: { userId: id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.transaction.findMany({
          where: { userId: id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.userInvestmentPortfolio.findMany({
          where: { userId: id },
          orderBy: { startDate: "desc" },
        }),
        prisma.enrollment.findMany({
          where: { userId: id },
          include: {
            course: { select: { id: true, subject: true } },
          },
        }),
        prisma.userTagAssignment.findMany({
          where: { userId: id },
          include: { tag: true },
        }),
        prisma.activity.findMany({
          where: { customerId: id },
          include: {
            admin: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    return successResponse({
      user,
      orders,
      transactions,
      investmentPortfolios,
      enrollments,
      tags: tagAssignments.map((assignment) => assignment.tag),
      activities,
    });
  } catch (error) {
    console.error("Error fetching CRM customer detail:", error);
    return errorResponse(
      "خطایی در دریافت اطلاعات مشتری رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
