"use client";

import { useState } from "react";
import ProfileHeader from "./header";
import { LuSquareChevronLeft } from "react-icons/lu";
import { useUserOrders } from "@/lib/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderDetail from "./orderDetail";
import EmptyState from "./emptyState";
import type { UserOrder } from "@/lib/services/user-service";

const OrdersTable = () => {
  const [page, setPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const pageSize = 10;

  // استفاده از React Query hook
  const { data: response, isLoading: loading } = useUserOrders(page, pageSize);
  const orders = response?.data?.items || [];
  const total = response?.data?.pagination?.total || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">پرداخت شده</Badge>;
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-premium text-premium/40">
            در انتظار پرداخت
          </span>
        );
      case "failed":
        return <Badge variant="destructive">ناموفق</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      <div className="bg-card rounded-md mb-8 shadow p-10 flex justify-center items-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-muted rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ====== Empty State ======
  if (orders.length === 0) {
    return (
      <div className="bg-card rounded-md mb-8 shadow">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-foreground">آخرین سفارشات</h4>
        </ProfileHeader>
        <div className="p-8">
          <EmptyState
            title="هنوز سفارشی ثبت نشده"
            description="بعد از خرید دوره یا سبد سرمایه‌گذاری، وضعیت پرداخت و جزئیات سفارش‌ها اینجا نمایش داده می‌شود."
            href="/courses"
            action="مشاهده دوره‌ها"
          />
        </div>
      </div>
    );
  }

  // ====== Table ======
  return (
    <div className="bg-card rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-foreground">
          آخرین سفارشات ({total})
        </h4>
      </ProfileHeader>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 md:px-5 py-2 md:py-3 text-xs font-medium text-muted-foreground text-right">
                دوره‌ها
              </th>
              <th className="px-3 md:px-5 py-2 md:py-3 text-xs font-medium text-muted-foreground text-right">
                تاریخ
              </th>
              <th className="px-3 md:px-5 py-2 md:py-3 text-xs font-medium text-muted-foreground text-right">
                مبلغ کل
              </th>
              <th className="px-3 md:px-5 py-2 md:py-3 text-xs font-medium text-muted-foreground text-right">
                وضعیت پرداخت
              </th>
              <th className="px-3 md:px-5 py-2 md:py-3 text-xs font-medium text-muted-foreground text-left">
                جزییات
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-muted/40 transition-colors duration-150"
              >
                <td className="px-3 md:px-5 py-3 md:py-4 whitespace-nowrap text-xs text-foreground">
                  {order.itemCount} دوره
                </td>
                <td className="px-3 md:px-5 py-3 md:py-4 whitespace-nowrap text-xs font-irsans text-muted-foreground">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-3 md:px-5 py-3 md:py-4 whitespace-nowrap text-xs text-foreground">
                  {order.total.toLocaleString("fa-IR")} تومان
                </td>
                <td className="px-3 md:px-5 py-3 md:py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-3 md:px-5 py-3 md:py-4 whitespace-nowrap text-xs flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="text-xs">مشاهده</span>
                    <LuSquareChevronLeft className="size-4 md:size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center items-center gap-3 py-5 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
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

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="royal-theme max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>جزئیات سفارش</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetail order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTable;
