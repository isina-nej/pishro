// lib/payment/adapters/nextpay.ts
import { PaymentAdapter, PaymentRequestInput, PaymentRequestOutput, PaymentVerifyInput, PaymentVerifyOutput, GatewayConfig } from "../types";

export class NextPayAdapter implements PaymentAdapter {
  name = "nextpay";
  titleFa = "نکست‌پی";

  async requestPayment(
    input: PaymentRequestInput,
    config: GatewayConfig
  ): Promise<PaymentRequestOutput> {
    try {
      const url = "https://nextpay.org/nx/gateway/token";

      const payload = {
        api_key: config.apiKey,
        amount: input.amount, // Toman
        order_id: input.orderId,
        callback_uri: input.callbackUrl,
        customer_phone: input.mobile,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.code === -1) {
        const transId = String(data.trans_id);
        const payUrl = `https://nextpay.org/nx/gateway/payment/${transId}`;
        return {
          success: true,
          payUrl,
          authority: transId,
        };
      }

      return {
        success: false,
        errorMessage: `خطای نکست‌پی: کد ${data?.code || "نامشخص"}`,
      };
    } catch (err: unknown) {
      console.error("[NextPayAdapter.requestPayment error]:", err);
      return {
        success: false,
        errorMessage: "خطا در ارتباط با نکست‌پی",
      };
    }
  }

  async verifyPayment(
    input: PaymentVerifyInput,
    config: GatewayConfig
  ): Promise<PaymentVerifyOutput> {
    try {
      const transId = input.authority || input.params.trans_id;
      if (!transId) {
        return {
          success: false,
          errorMessage: "شناسه تراکنش نکست‌پی یافت نشد",
        };
      }

      const url = "https://nextpay.org/nx/gateway/verify";
      const payload = {
        api_key: config.apiKey,
        trans_id: transId,
        amount: input.amount,
        order_id: input.orderId,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.code === 0) {
        return {
          success: true,
          refNumber: String(data.Shaparak_Ref_Id || data.card_holder || transId),
          cardPan: data.card_holder,
        };
      }

      return {
        success: false,
        errorMessage: `تأیید تراکنش در نکست‌پی ناموفق بود (کد: ${data?.code})`,
      };
    } catch (err: unknown) {
      console.error("[NextPayAdapter.verifyPayment error]:", err);
      return {
        success: false,
        errorMessage: "خطا در استعلام وضعیت پرداخت از نکست‌پی",
      };
    }
  }
}
