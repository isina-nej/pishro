import { FaCheckCircle, FaTimesCircle, FaRegClock } from "react-icons/fa";

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
    items: OrderItem[];
  };
}

const OrderDetail = ({ order }: OrderDetailProps) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          icon: <FaCheckCircle className="text-success-foreground w-3.5" />,
          text: "پرداخت شده",
          bgColor: "bg-success",
        };
      case "failed":
        return {
          icon: <FaTimesCircle className="text-destructive-foreground w-3.5" />,
          text: "ناموفق",
          bgColor: "bg-destructive",
        };
      default:
        return {
          icon: <FaRegClock className="w-3.5 text-amber-900" />,
          text: "در انتظار پرداخت",
          bgColor: "bg-amber-400",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div>
      {/* Status */}
      <div className="flex items-center gap-2">
        <div
          className={`size-6 rounded-full ${statusInfo.bgColor} flex justify-center items-center`}
        >
          {statusInfo.icon}
        </div>
        <p className="text-xs font-medium text-foreground">{statusInfo.text}</p>
      </div>

      {/* Order Details */}
      <div className="flex flex-wrap gap-4 text-foreground text-xs leading-9 mt-3">
        <p>
          <strong className="font-medium text-muted-foreground">شناسه سفارش: </strong>
          {order.id}
        </p>
        <p>
          <strong className="font-medium text-muted-foreground">تاریخ ثبت سفارش: </strong>
          {formattedDate}
        </p>
        <p>
          <strong className="font-medium text-muted-foreground">مبلغ سفارش: </strong>
          {order.total.toLocaleString("fa-IR")} تومان
        </p>
        {order.paymentRef && (
          <p>
            <strong className="font-medium text-muted-foreground">شناسه پرداخت: </strong>
            {order.paymentRef}
          </p>
        )}
      </div>

      {/* Order Items */}
      {order.items.length > 0 && (
        <div className="mt-3">
          <h5 className="font-medium text-sm text-foreground mb-3">اقلام سفارش</h5>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={item.courseId}
                className="flex justify-between items-center p-3 bg-muted rounded-md text-xs"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.title || `دوره ${index + 1}`}
                  </p>
                </div>
                <div className="text-left">
                  {item.discountPercent && item.discountPercent > 0 ? (
                    <div>
                      <p className="text-muted-foreground line-through">
                        {item.price?.toLocaleString("fa-IR")} تومان
                      </p>
                      <p className="text-success font-medium">
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
