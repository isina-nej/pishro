/**
 * Admin Transaction Management API (Single Transaction)
 * GET /api/admin/transactions/[id] - Get transaction by ID
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  ErrorCodes,
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            status: true,
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
          },
        },
      },
    });

    if (!transaction) {
      return notFoundResponse("Transaction", "Transaction not found");
    }

    return successResponse(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return errorResponse(
      "Error fetching transaction",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
