"use client";

import { useState } from "react";
import ProfileHeader from "./header";
import { useUserTransactions } from "@/lib/hooks/useUser";
import { Badge } from "@/components/ui/badge";
import EmptyState from "./emptyState";

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
        return <Badge variant="success">موفق</Badge>;
      case "pending":
        return (
          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            در انتظار
          </span>
        );
      case "failed":
        return <Badge variant="destructive">ناموفق</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      <div className="bg-card rounded-md mb-8 shadow p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-md mb-8 shadow">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-foreground">
            تراکنش‌های اخیر
          </h4>
        </ProfileHeader>
        <div className="p-8">
          <EmptyState
            title="هنوز تراکنشی ثبت نشده"
            description="پس از هر پرداخت یا بازگشت وجه، جزئیات تراکنش‌ها اینجا نمایش داده می‌شود."
            href="/courses"
            action="مشاهده دوره‌ها"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-foreground">
          تراکنش‌های اخیر ({total})
        </h4>
      </ProfileHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground text-right">
                نوع تراکنش
              </th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground text-right">
                مبلغ
              </th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground text-right">
                وضعیت
              </th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground text-right">
                شماره پیگیری
              </th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground text-right">
                تاریخ
              </th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground text-right">
                توضیحات
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-muted/40">
                <td className="px-5 py-4 whitespace-nowrap text-xs text-foreground">
                  {getTypeLabel(transaction.type)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-foreground">
                  <span
                    className={transaction.type === "refund" ? "text-success" : ""}
                  >
                    {transaction.amount.toLocaleString("fa-IR")} تومان
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs font-irsans text-muted-foreground">
                  {transaction.refNumber || "-"}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs font-irsans text-muted-foreground">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {transaction.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 p-4 border-t border-border">
          <button
            className="px-3 py-1 text-xs border border-input rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={loading || page === 1}
          >
            {loading ? (
              <div className="w-3 h-3 border-b-2 border-muted-foreground rounded-full animate-spin inline-block"></div>
            ) : (
              "قبلی"
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            صفحه {page} از {totalPages}
          </span>
          <button
            className="px-3 py-1 text-xs border border-input rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={loading || page === totalPages}
          >
            {loading ? (
              <div className="w-3 h-3 border-b-2 border-muted-foreground rounded-full animate-spin inline-block"></div>
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
