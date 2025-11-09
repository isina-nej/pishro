import { GoKebabHorizontal } from "react-icons/go";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ProfileHeader from "./header";
import Link from "next/link";

interface OrderItem {
  courseId: string;
  title?: string;
  price?: number;
  discountPercent?: number | null;
}

interface OrderDetailProps {
  order: {
    id: string;
    total: number;
    status: string;
    paymentRef?: string | null;
    createdAt: string;
    user?: {
      id: string;
      phone: string;
    };
    items: OrderItem[];
  } | null;
}

const OrderDetail = ({ order }: OrderDetailProps) => {
  // handle not found
  if (!order) {
    return (
      <div className="bg-white rounded-md">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-[#d52a16]">
            جزئیات سفارش پیدا نشد!
          </h4>
          <Link
            href="/profile/orders"
            className="text-xs text-[#879] hover:text-[#657] hover:underline underline-offset-4"
          >
            برگشت
          </Link>
        </ProfileHeader>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(order.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          icon: <FaCheckCircle className="text-white w-4" />,
          text: "پرداخت شده",
          bgColor: "bg-green-500",
        };
      case "FAILED":
        return {
          icon: <FaTimesCircle className="text-white w-4" />,
          text: "ناموفق",
          bgColor: "bg-red-500",
        };
      case "PENDING":
      default:
        return {
          icon: <GoKebabHorizontal className="text-white w-4" />,
          text: "درحال پردازش",
          bgColor: "bg-[#ffa200]",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="bg-white rounded-md">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131b22]">جزئیات سفارش</h4>
        <Link
          href="/profile/orders"
          className="text-xs text-[#879] hover:text-[#657] hover:underline underline-offset-4"
        >
          برگشت
        </Link>
      </ProfileHeader>

      {/* Status */}
      <div className="flex p-5 pb-0 items-center gap-2">
        <div
          className={`size-6 rounded-full ${statusInfo.bgColor} flex justify-center items-center`}
        >
          {statusInfo.icon}
        </div>
        <p className="text-xs">{statusInfo.text}</p>
      </div>

      {/* Order Details */}
      <div className="flex flex-wrap gap-4 text-[#1a1a1a] text-xs max-w-[580px] p-5 leading-9">
        <p>
          <strong className="font-medium text-[#879ca6]">شناسه سفارش:</strong>{" "}
          {order.id}
        </p>
        <p>
          <strong className="font-medium text-[#879ca6]">
            تاریخ ثبت سفارش:
          </strong>{" "}
          {formattedDate}
        </p>
        <p>
          <strong className="font-medium text-[#879ca6]">مبلغ سفارش:</strong>{" "}
          {order.total.toLocaleString("fa-IR")} تومان
        </p>
        {order.user?.phone && (
          <p>
            <strong className="font-medium text-[#879ca6]">شماره تماس:</strong>{" "}
            {order.user.phone}
          </p>
        )}
        {order.paymentRef && (
          <p>
            <strong className="font-medium text-[#879ca6]">
              شناسه پرداخت:
            </strong>{" "}
            {order.paymentRef}
          </p>
        )}
      </div>

      {/* Order Items */}
      {order.items.length > 0 && (
        <div className="p-5 pt-0">
          <h5 className="font-medium text-sm text-[#131b22] mb-3">
            اقلام سفارش
          </h5>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={item.courseId}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md text-xs"
              >
                <div>
                  <p className="font-medium text-[#131b22]">
                    {item.title || `دوره ${index + 1}`}
                  </p>
                </div>
                <div className="text-left">
                  {item.discountPercent && item.discountPercent > 0 ? (
                    <div>
                      <p className="text-gray-400 line-through">
                        {item.price?.toLocaleString("fa-IR")} تومان
                      </p>
                      <p className="text-green-600 font-medium">
                        {(
                          (item.price || 0) *
                          (1 - item.discountPercent / 100)
                        ).toLocaleString("fa-IR")}{" "}
                        تومان
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium">
                      {item.price?.toLocaleString("fa-IR")} تومان
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
