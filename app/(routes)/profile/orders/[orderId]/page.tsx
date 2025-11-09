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
