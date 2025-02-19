import ProfileHeader from "./header";
import { profileOrdersData } from "@/public/data";
import Link from "next/link";
import { LuSquareChevronLeft } from "react-icons/lu";
const OrdersTable = () => {
  return (
    <div className="bg-white rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131834]">آخرین سفارشات</h4>
      </ProfileHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f5f5f5]">
          {/* تنظیم ستون‌ها */}
          <colgroup>
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-gray-500">
                نام دوره
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500">
                تاریخ
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500">
                قابل پرداخت
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500">
                وضعیت پرداخت
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-left">
                جزییات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f5f5f5]">
            {profileOrdersData.map((item, idx) => (
              <tr key={idx}>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  {item.name}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs font-irsans text-gray-500">
                  {item.date}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  {item.price.toLocaleString("fa-IR")}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  {item.isPayed ? (
                    <div className="w-fit py-1.5 px-4 text-xs rounded bg-green-200 text-green-600">
                      پرداخت شده
                    </div>
                  ) : (
                    <div className="py-1.5 px-4 text-xs rounded bg-yellow-200 text-yellow-600">
                      در انتظار پرداخت
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs flex justify-end">
                  <button>
                    <Link href={`/profile/orders/${item.details.payId}`}>
                      <LuSquareChevronLeft className="text-[#214254] size-5" />
                    </Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
