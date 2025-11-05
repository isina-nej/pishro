// @/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    // ✅ Parse items and fetch related courses
    const courseIds = (order.items as { courseId: string }[]).map(
      (item) => item.courseId
    );

    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: {
        id: true,
        subject: true,
        price: true,
        discountPercent: true,
      },
    });

    const items = courses.map((course) => ({
      courseId: course.id,
      title: course.subject,
      price: course.price,
      discountPercent: course.discountPercent,
    }));

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        paymentRef: order.paymentRef,
        createdAt: order.createdAt,
        user: order.user,
        items,
      },
    });
  } catch (err) {
    console.error("[GET /api/orders/:id] error:", err);
    return NextResponse.json(
      { ok: false, error: "خطایی در دریافت اطلاعات سفارش رخ داد" },
      { status: 500 }
    );
  }
}
