import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return unauthorizedResponse("لطفاً وارد شوید");
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true, total: true, status: true, paymentRef: true, paymentAuthority: true,
      createdAt: true, orderItems: { select: { courseId: true, price: true, discountPercent: true,
        course: { select: { subject: true } } } },
    },
  });
  if (!order) return notFoundResponse("سفارش", "سفارش یافت نشد");
  return successResponse({
    id: order.id,
    total: order.total,
    status: order.status,
    paymentRef: order.paymentRef,
    paymentAuthority: order.paymentAuthority,
    createdAt: order.createdAt,
    items: order.orderItems.filter((item) => item.courseId).map((item) => ({
      courseId: item.courseId,
      title: item.course?.subject || "دوره",
      price: item.price,
      discountPercent: item.discountPercent,
    })),
  });
}
