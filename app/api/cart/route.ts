import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-response";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("برای مشاهده سبد خرید باید وارد شوید");
    }

    const userId = session.user.id;

    // Get all pending orders for this user
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      include: {
        orderItems: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total
    const total = orders.reduce((sum, order) => sum + order.total, 0);

    return successResponse({
      orders,
      total,
      itemCount: orders.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return errorResponse("خطا در دریافت سبد خرید", "INTERNAL_SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("برای حذف از سبد خرید باید وارد شوید");
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return errorResponse("شناسه سفارش الزامی است", "INVALID_INPUT");
    }

    // Check if order belongs to user and is pending
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
        status: "PENDING",
      },
    });

    if (!order) {
      return errorResponse("سفارش یافت نشد", "NOT_FOUND");
    }

    // Delete the order and its items
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return successResponse(
      { message: "سفارش با موفقیت حذف شد" },
      "سفارش حذف شد"
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return errorResponse("خطا در حذف سفارش", "INTERNAL_SERVER_ERROR");
  }
}
