import axios from "axios";
import { ApiSuccessResponse } from "@/lib/api-response";

export interface OrderItem {
  courseId: string;
  title?: string;
  price?: number;
  discountPercent?: number | null;
}

export interface OrderDetail {
  id: string;
  total: number;
  status: string;
  paymentRef?: string | null;
  createdAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    phone: string;
    name?: string | null;
  };
}

export interface OrderResponse {
  ok: boolean;
  order?: OrderDetail;
  error?: string;
}

export const orderService = {
  async getOrderById(orderId: string): Promise<OrderResponse> {
    try {
      const res = await axios.get<ApiSuccessResponse<OrderDetail>>(`/api/orders/${orderId}`);

      if (res.data.status === "success") {
        return { ok: true, order: res.data.data };
      }

      return { ok: false, error: res.data.message || "خطا در دریافت سفارش" };
    } catch (err) {
      console.error("[orderService] getOrderById error:", err);
      return { ok: false, error: "خطایی در دریافت اطلاعات سفارش رخ داد" };
    }
  },
};
