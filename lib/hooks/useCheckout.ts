import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { orderService, type OrderResponse } from "@/lib/services/order-service";
import {
  checkoutService,
  type CheckoutRequest,
  type CheckoutResponse,
} from "@/lib/services/checkout-service";
import { userKeys } from "./useUser";
import { checkoutLoginUrl } from "@/lib/checkout-redirect";
import { PAYMENT_HANDOFF_KEY, serializePaymentHandoff } from "@/lib/payment-handoff";

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
      if (data.ok && data.payUrl && data.orderId) {
        const handoff = serializePaymentHandoff(
          data.orderId, data.payUrl, window.location.origin
        );
        if (!handoff) {
          toast.error("آدرس درگاه پرداخت معتبر نیست. لطفاً با پشتیبانی تماس بگیرید.");
          return;
        }

        queryClient.invalidateQueries({ queryKey: userKeys.all });
        queryClient.invalidateQueries({ queryKey: orderKeys.all });

        try {
          // Never expose a one-time gateway URL in address-bar / referrer logs.
          window.sessionStorage.setItem(PAYMENT_HANDOFF_KEY, handoff);
          window.location.assign(
            `/checkout/processing?orderId=${encodeURIComponent(data.orderId)}`
          );
        } catch {
          // Some privacy modes block sessionStorage. Preserve payment flow by
          // navigating straight to the validated URL returned by our API.
          window.location.assign(data.payUrl);
        }
      } else if (data.unauthorized) {
        window.location.assign(checkoutLoginUrl("/checkout?step=pay"));
      } else {
        toast.error(data.error || "خطا در ایجاد سفارش");
      }
    },
    onError: (error: Error) => {
      const resData =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string; error?: string } } }).response
              ?.data
          : undefined;
      const errorMessage = resData?.message || resData?.error;
      toast.error(errorMessage || "خطا در ارتباط با سرور");
    },
  });
}
