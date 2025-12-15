/**
 * Admin Orders Management API
 * GET /api/admin/orders - List all orders with pagination and filters
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  ErrorCodes,
  forbiddenResponse,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;

    // Filters
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: Prisma.OrderWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (status && ["PENDING", "PAID", "FAILED"].includes(status)) {
      where.status = status as Prisma.EnumOrderStatusFilter;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Fetch orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              phone: true,
              firstName: true,
              lastName: true,
            },
          },
          orderItems: {
            include: {
              course: {
                select: {
                  id: true,
                  subject: true,
                  slug: true,
                },
              },
            },
          },
          transactions: {
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return paginatedResponse(orders, page, limit, total);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse(
      "Error fetching orders",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
