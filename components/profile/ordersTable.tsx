"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./header";
import Link from "next/link";
import { LuSquareChevronLeft } from "react-icons/lu";
import { getUserOrders, UserOrder } from "@/lib/services/user-service";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const OrdersTable = () => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders(page, pageSize);
        setOrders(response.data.items);
        setTotal(response.data.pagination.total);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("خطا در دریافت سفارشات");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            پرداخت شده
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            در انتظار پرداخت
          </span>
        );
      case "failed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            ناموفق
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // ====== Loading State ======
  if (loading) {
    return (
      <div className="bg-white rounded-md mb-8 shadow p-10 flex justify-center items-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ====== Empty State ======
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-md mb-8 shadow">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-[#131834]">آخرین سفارشات</h4>
        </ProfileHeader>
        <div className="p-12 text-center text-gray-500">
          هنوز سفارشی ثبت نشده است
        </div>
      </div>
    );
  }

  // ====== Table ======
  return (
    <div className="bg-white rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131834]">
          آخرین سفارشات ({total})
        </h4>
      </ProfileHeader>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f5f5f5]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                دوره‌ها
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                تاریخ
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                مبلغ کل
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                وضعیت پرداخت
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-left">
                جزییات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f5f5f5]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  {order.itemCount} دوره
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs font-irsans text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  {order.total.toLocaleString("fa-IR")} تومان
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs flex justify-end">
                  <Link
                    href={`/profile/orders/${order.id}`}
                    className="flex items-center gap-1 text-[#214254] hover:text-blue-600 transition-colors"
                  >
                    <span className="text-xs">مشاهده</span>
                    <LuSquareChevronLeft className="size-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center items-center gap-3 py-5 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            قبلی
          </Button>
          <span className="text-sm text-gray-600">
            صفحه {page} از {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / pageSize)}
            onClick={() => setPage((prev) => prev + 1)}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
