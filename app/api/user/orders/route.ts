// @/app/api/user/orders/route.ts
import { Prisma, OrderStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  paginatedResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// ✅ Get all user's orders
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // "pending", "paid", "failed"
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.OrderWhereInput = { userId: session.user.id };
    if (status) where.status = status as OrderStatus;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // For each order, fetch course details from items JSON
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // ✅ Validate items is an array before mapping
        const itemsArray = Array.isArray(order.items)
          ? order.items
          : [];

        const courseIds = itemsArray
          .filter((item): item is { courseId: string } =>
            typeof item === 'object' &&
            item !== null &&
            'courseId' in item
          )
          .map((item) => item.courseId);

        const courses = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: {
            id: true,
            subject: true,
            price: true,
            img: true,
            discountPercent: true,
          },
        });

        const items = courses.map((course) => ({
          courseId: course.id,
          title: course.subject,
          price: course.price,
          img: course.img,
          discountPercent: course.discountPercent,
        }));

        return {
          id: order.id,
          total: order.total,
          status: order.status,
          paymentRef: order.paymentRef,
          createdAt: order.createdAt,
          items,
          itemCount: items.length,
        };
      })
    );

    return paginatedResponse(ordersWithDetails, page, limit, total);
  } catch (error) {
    console.error("[GET /api/user/orders] error:", error);
    return errorResponse(
      "خطایی در دریافت سفارشات رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
