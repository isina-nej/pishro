// lib/payment/adapters/zibal.ts
import { PaymentAdapter, PaymentRequestInput, PaymentRequestOutput, PaymentVerifyInput, PaymentVerifyOutput, GatewayConfig } from "../types";

export class ZibalAdapter implements PaymentAdapter {
  name = "zibal";
  titleFa = "زیبال";

  async requestPayment(
    input: PaymentRequestInput,
    config: GatewayConfig
  ): Promise<PaymentRequestOutput> {
    try {
      const merchant = config.sandbox ? "zibal" : config.apiKey;
      const url = "https://gateway.zibal.ir/v1/request";

      // Zibal accepts Rials (amount * 10)
      const payload = {
        merchant,
        amount: input.amount * 10,
        callbackUrl: input.callbackUrl,
        description: input.description,
        orderId: input.orderId,
        mobile: input.mobile,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.result === 100) {
        const trackId = String(data.trackId);
        const payUrl = `https://gateway.zibal.ir/start/${trackId}`;
        return {
          success: true,
          payUrl,
          authority: trackId,
        };
      }

      return {
        success: false,
        errorMessage: data?.message || `خطای زیبال کد ${data?.result || "نامشخص"}`,
      };
    } catch (err: unknown) {
      console.error("[ZibalAdapter.requestPayment error]:", err);
      return {
        success: false,
        errorMessage: "خطا در برقراری ارتباط با زیبال",
      };
    }
  }

  async verifyPayment(
    input: PaymentVerifyInput,
    config: GatewayConfig
  ): Promise<PaymentVerifyOutput> {
    try {
      const trackId = input.authority || input.params.trackId;
      const success = input.params.success;

      if (!trackId || success !== "1") {
        return {
          success: false,
          errorMessage: "پرداخت لغو شده است یا موفقیت‌آمیز نبود",
        };
      }

      const merchant = config.sandbox ? "zibal" : config.apiKey;
      const url = "https://gateway.zibal.ir/v1/verify";

      const payload = {
        merchant,
        trackId: Number(trackId),
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // result 100: success, 201: already verified
      if (data?.result === 100 || data?.result === 201) {
        return {
          success: true,
          refNumber: String(data.refNumber),
          cardPan: data.cardNumber,
        };
      }

      return {
        success: false,
        errorMessage: data?.message || `خطای تأیید زیبال کد ${data?.result || "نامشخص"}`,
      };
    } catch (err: unknown) {
      console.error("[ZibalAdapter.verifyPayment error]:", err);
      return {
        success: false,
        errorMessage: "خطا در استعلام وضعیت پرداخت از زیبال",
      };
    }
  }
}
