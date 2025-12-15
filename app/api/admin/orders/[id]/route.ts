/**
 * Admin Order Management API (Single Order)
 * GET /api/admin/orders/[id] - Get order by ID
 * PATCH /api/admin/orders/[id] - Update order status
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

    const order = await prisma.order.findUnique({
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
        orderItems: {
          include: {
            course: {
              select: {
                id: true,
                subject: true,
                slug: true,
                img: true,
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return notFoundResponse("Order", "Order not found");
    }

    return successResponse(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return errorResponse(
      "Error fetching order",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
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
    const body = await req.json();

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return notFoundResponse("Order", "Order not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only allow updating status and paymentRef
    if (body.status !== undefined) updateData.status = body.status;
    if (body.paymentRef !== undefined) updateData.paymentRef = body.paymentRef;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
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
      },
    });

    return successResponse(updatedOrder, "Order updated successfully");
  } catch (error) {
    console.error("Error updating order:", error);
    return errorResponse(
      "Error updating order",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
