import { GoKebabHorizontal } from "react-icons/go";
import ProfileHeader from "./header";

interface OrderDetailProps {
  order:
    | {
        name: string;
        date: string;
        price: number;
        isPayed: boolean;
        details: {
          payId: string;
          phoneNumber: string;
        };
      }
    | undefined;
}

const OrderDetail = ({ order }: OrderDetailProps) => {
  // handle not found
  if (!order)
    return (
      <div className="bg-white rounded-md">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-[#d52a16]">
            جزئیات سفارش پیدا نشد!
          </h4>
          <button className="text-xs text-[#879] hover:text-[#657] hover:underline underline-offset-4">
            برگشت
          </button>
        </ProfileHeader>
      </div>
    );

  // handle found
  return (
    <div className="bg-white rounded-md">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131b22]">جزئیات سفارش</h4>
        <button className="text-xs text-[#879] hover:text-[#657] hover:underline underline-offset-4">
          برگشت
        </button>
      </ProfileHeader>
      <div className="flex p-5 pb-0 items-center gap-2">
        <div className="size-6 rounded-full bg-[#ffa200] flex justify-center items-center">
          <GoKebabHorizontal className="text-white w-4" />
        </div>
        <p className="text-xs">درحال پردازش</p>
      </div>
      <div className="flex flex-wrap gap-4 text-[#1a1a1a] text-xs max-w-[580px] p-5 leading-9">
        <p>
          <strong className="font-medium text-[#879ca6]">شناسه سفارش:</strong>{" "}
          {order.details.payId}
        </p>
        <p>
          <strong className="font-medium text-[#879ca6]">
            تاریخ ثبت سفارش:
          </strong>{" "}
          {order.date}
        </p>
        <p>
          <strong className="font-medium text-[#879ca6]">مبلغ سفارش:</strong>{" "}
          {order.price.toLocaleString("fa-IR")}
        </p>
        <p>
          <strong className="font-medium text-[#879ca6]">شماره تماس:</strong>{" "}
          {order.details.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
