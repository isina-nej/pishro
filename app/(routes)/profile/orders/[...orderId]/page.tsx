import { profileOrdersData } from "@/public/data";
import OrderDetail from "@/components/profile/orderDetail";

interface OrderPageProps {
  params: {
    orderId: string[]; // به صورت catch-all دریافت می‌شود
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  // تبدیل آرایه orderId به یک رشته (payId)
  const awaitedParams = await params;
  const id = Array.isArray(awaitedParams.orderId)
    ? awaitedParams.orderId.join("/")
    : awaitedParams.orderId;

  // جستجو در داده‌های محلی بر اساس payId
  const order = profileOrdersData.find((order) => order.details.payId === id);

  return <OrderDetail order={order} />;
}
