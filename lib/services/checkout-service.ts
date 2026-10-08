// @/lib/services/checkout-service.ts
import axios from "axios";
import { ApiSuccessResponse } from "@/lib/api-response";

export interface CheckoutItem {
  courseId: string;
}

export interface CheckoutRequest {
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
  unauthorized?: boolean;
}

export const checkoutService = {
  /**
   * Create a checkout session and get payment URL from backend
   */
  async createCheckoutSession(
    data: CheckoutRequest
  ): Promise<CheckoutResponse> {
    try {
      const res = await axios.post<ApiSuccessResponse<CheckoutData>>("/api/checkout", data);

      if (res.data.status === "success") {
        return {
          ok: true,
          payUrl: res.data.data.payUrl,
          orderId: res.data.data.orderId,
        };
      }

      return { error: res.data.message || "پرداخت ناموفق بود" };
    } catch (err: unknown) {
      console.error("[checkoutService] createCheckoutSession error:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        return { unauthorized: true };
      }
      const resData =
        typeof err === "object" && err !== null && "response" in err
          ? (err as {
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                  data?: Record<string, string | string[]>;
                };
              };
            }).response?.data
          : undefined;
      const validationMsg =
        resData?.data && typeof resData.data === "object"
          ? Object.values(resData.data).flat().filter(Boolean).join(" - ")
          : undefined;
      const serverMsg = resData?.message || resData?.error || validationMsg;
      return { error: serverMsg || "خطایی در ارتباط با سرور رخ داد" };
    }
  },
};
