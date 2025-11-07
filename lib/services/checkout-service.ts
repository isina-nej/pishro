// @/lib/services/checkout-service.ts
import axios from "axios";
import { ApiSuccessResponse } from "@/lib/api-response";

export interface CheckoutItem {
  courseId: string;
}

export interface CheckoutRequest {
  userId: string;
  items: CheckoutItem[];
}

export interface CheckoutData {
  orderId: string;
  payUrl: string;
  total: number;
}

export interface CheckoutResponse {
  ok?: boolean;
  payUrl?: string;
  orderId?: string;
  error?: string;
}

export const checkoutService = {
  /**
   * Create a checkout session and get payment URL from backend
   */
  async createCheckoutSession(
    data: CheckoutRequest
  ): Promise<CheckoutResponse> {
    try {
      const payload = {
        ...data,
        _callbackUrl:
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify` ||
          `${window.location.origin}/api/payment/verify`,
      };

      const res = await axios.post<ApiSuccessResponse<CheckoutData>>("/api/checkout", payload);

      if (res.data.status === "success") {
        return {
          ok: true,
          payUrl: res.data.data.payUrl,
          orderId: res.data.data.orderId,
        };
      }

      return { error: res.data.message || "پرداخت ناموفق بود" };
    } catch (err) {
      console.error("[checkoutService] createCheckoutSession error:", err);
      return { error: "خطایی در ارتباط با سرور رخ داد" };
    }
  },
};
