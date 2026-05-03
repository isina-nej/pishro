// @/app/api/orders/[id]/route.ts
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return notFoundResponse("Order", "سفارش یافت نشد");
    }

    // ✅ Parse items and fetch related courses
    // Validate items is an array and filter out undefined courseIds
    const itemsArray = Array.isArray(order.items) ? order.items : [];

    const courseIds = itemsArray
      .filter((item): item is { courseId: string } =>
        typeof item === 'object' &&
        item !== null &&
        'courseId' in item &&
        typeof item.courseId === 'string' &&
        item.courseId.length > 0
      )
      .map((item) => item.courseId);

    // Only fetch courses if we have valid courseIds
    const courses = courseIds.length > 0
      ? await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: {
            id: true,
            subject: true,
            price: true,
            discountPercent: true,
          },
        })
      : [];

    const items = courses.map((course) => ({
      courseId: course.id,
      title: course.subject,
      price: course.price,
      discountPercent: course.discountPercent,
    }));

    return successResponse({
      id: order.id,
      total: order.total,
      status: order.status,
      paymentRef: order.paymentRef,
      createdAt: order.createdAt,
      user: order.user,
      items,
    });
  } catch (err) {
    console.error("[GET /api/orders/:id] error:", err);
    return errorResponse(
      "خطایی در دریافت اطلاعات سفارش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
