/**
 * Admin Transaction Management API (Single Transaction)
 * GET /api/admin/transactions/[id] - Get transaction by ID
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
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
            email: true
          }
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
                    slug: true
                  }
                }
              }
            }
          }
        }
      }
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
