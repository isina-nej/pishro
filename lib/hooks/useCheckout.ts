import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { orderService, type OrderResponse } from "@/lib/services/order-service";
import {
  checkoutService,
  type CheckoutRequest,
  type CheckoutResponse,
} from "@/lib/services/checkout-service";
import { userKeys } from "./useUser";

// ===========================
// Query Keys
// ===========================
export const orderKeys = {
  all: ["orders"] as const,
  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Hook برای دریافت جزئیات سفارش
 * برای صفحه نتیجه پرداخت
 */
export function useOrder(orderId: string) {
  return useQuery<OrderResponse>({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId, // فقط اگر orderId وجود داشته باشد
    staleTime: 1 * 60 * 1000, // 1 دقیقه fresh
    retry: 2,
  });
}

// ===========================
// Mutations
// ===========================

/**
 * Hook برای ایجاد session چک‌اوت
 * و هدایت به درگاه پرداخت
 */
export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationFn: checkoutService.createCheckoutSession,
    onSuccess: (data) => {
      if (data.ok && data.payUrl) {
        // Invalidate کردن سفارشات و دوره‌های کاربر
        queryClient.invalidateQueries({ queryKey: userKeys.all });
        queryClient.invalidateQueries({ queryKey: orderKeys.all });

        // هدایت به صفحه processing (به جای redirect مستقیم)
        const processingUrl = `/checkout/processing?payUrl=${encodeURIComponent(
          data.payUrl
        )}&orderId=${data.orderId}`;
        window.location.href = processingUrl;
      } else {
        toast.error(data.error || "خطا در ایجاد سفارش");
      }
    },
    onError: (error: Error) => {
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "خطا در ارتباط با سرور");
    },
  });
}
