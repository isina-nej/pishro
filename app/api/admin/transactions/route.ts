/**
 * Admin Transactions Management API
 * GET /api/admin/transactions - List all transactions with pagination and filters
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
    const orderId = searchParams.get("orderId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: Prisma.TransactionWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (type && ["PAYMENT", "REFUND", "WITHDRAWAL"].includes(type)) {
      where.type = type as Prisma.EnumTransactionTypeFilter;
    }

    if (status && ["PENDING", "SUCCESS", "FAILED"].includes(status)) {
      where.status = status as Prisma.EnumTransactionStatusFilter;
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

    // Fetch transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
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
          order: {
            select: {
              id: true,
              total: true,
              status: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return paginatedResponse(transactions, page, limit, total);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return errorResponse(
      "Error fetching transactions",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
