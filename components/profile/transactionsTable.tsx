"use client";

import { useState } from "react";
import ProfileHeader from "./header";
import { useUserTransactions } from "@/lib/hooks/useUser";

const TransactionsTable = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // استفاده از React Query hook
  const { data: response, isLoading: loading } = useUserTransactions(page, pageSize);
  const transactions = response?.data?.items || [];
  const total = response?.data?.pagination?.total || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            موفق
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            در انتظار
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            ناموفق
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "payment":
        return "پرداخت";
      case "refund":
        return "بازگشت وجه";
      case "withdrawal":
        return "برداشت";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-md mb-8 shadow p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-md mb-8 shadow">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-[#131834]">
            تراکنش‌های اخیر
          </h4>
        </ProfileHeader>
        <div className="p-8 text-center text-gray-500">
          هیچ تراکنشی ثبت نشده است
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131834]">
          تراکنش‌های اخیر ({total})
        </h4>
      </ProfileHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f5f5f5]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                نوع تراکنش
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                مبلغ
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                وضعیت
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                شماره پیگیری
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                تاریخ
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                توضیحات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f5f5f5]">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  {getTypeLabel(transaction.type)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-900">
                  <span
                    className={
                      transaction.type === "refund" ? "text-green-600" : ""
                    }
                  >
                    {transaction.amount.toLocaleString("fa-IR")} تومان
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs font-irsans text-gray-500">
                  {transaction.refNumber || "-"}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs font-irsans text-gray-500">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {transaction.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 p-4 border-t border-[#f5f5f5]">
          <button
            className="px-3 py-1 text-xs border rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={loading || page === 1}
          >
            {loading ? (
              <div className="w-3 h-3 border-b-2 border-gray-500 rounded-full animate-spin inline-block"></div>
            ) : (
              "قبلی"
            )}
          </button>
          <span className="text-xs text-gray-600">
            صفحه {page} از {totalPages}
          </span>
          <button
            className="px-3 py-1 text-xs border rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={loading || page === totalPages}
          >
            {loading ? (
              <div className="w-3 h-3 border-b-2 border-gray-500 rounded-full animate-spin inline-block"></div>
            ) : (
              "بعدی"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
