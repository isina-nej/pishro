import OrderDetail from "@/components/profile/orderDetail";
import { prisma } from "@/lib/prisma";

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;

  // Fetch order from database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
    return <OrderDetail order={null} />;
  }

  // Parse items and fetch related courses
  // ✅ Validate items is an array and filter out undefined courseIds
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

  // Transform to component format
  const orderData = {
    id: order.id,
    total: order.total,
    status: order.status,
    paymentRef: order.paymentRef,
    createdAt: order.createdAt.toISOString(),
    user: order.user,
    items,
  };

  return <OrderDetail order={orderData} />;
}
