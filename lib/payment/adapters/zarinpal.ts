// lib/payment/adapters/zarinpal.ts
import { PaymentAdapter, PaymentRequestInput, PaymentRequestOutput, PaymentVerifyInput, PaymentVerifyOutput, GatewayConfig } from "../types";

export class ZarinpalAdapter implements PaymentAdapter {
  name = "zarinpal";
  titleFa = "زرین‌پال";

  private getBaseUrl(sandbox: boolean): string {
    return sandbox
      ? "https://sandbox.zarinpal.com/pg"
      : "https://payment.zarinpal.com/pg";
  }

  async requestPayment(
    input: PaymentRequestInput,
    config: GatewayConfig
  ): Promise<PaymentRequestOutput> {
    try {
      const baseUrl = this.getBaseUrl(config.sandbox);
      const url = `${baseUrl}/v4/payment/request.json`;

      // Amount in Toman
      const payload = {
        merchant_id: config.apiKey,
        amount: input.amount,
        currency: "IRT",
        description: input.description,
        callback_url: input.callbackUrl,
        metadata: {
          mobile: input.mobile,
          email: input.email,
          order_id: input.orderId,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.data?.code === 100 || data?.data?.code === 101) {
        const authority = data.data.authority;
        const payUrl = `${baseUrl}/StartPay/${authority}`;
        return {
          success: true,
          payUrl,
          authority,
        };
      }

      const errMsg =
        data?.errors?.message ||
        data?.errors?.validations?.[0]?.message ||
        `خطای زرین‌پال کد ${data?.errors?.code || data?.data?.code || "نامشخص"}`;

      return {
        success: false,
        errorMessage: errMsg,
      };
    } catch (err: unknown) {
      console.error("[ZarinpalAdapter.requestPayment error]:", err);
      return {
        success: false,
        errorMessage: "خطا در ارتباط با درگاه زرین‌پال",
      };
    }
  }

  async verifyPayment(
    input: PaymentVerifyInput,
    config: GatewayConfig
  ): Promise<PaymentVerifyOutput> {
    try {
      const authority = input.authority || input.params.Authority || input.params.authority;
      const status = input.params.Status || input.params.status;

      if (!authority || status !== "OK") {
        return {
          success: false,
          errorMessage: "پرداخت از سوی کاربر لغو شد یا ناموفق بود",
        };
      }

      const baseUrl = this.getBaseUrl(config.sandbox);
      const url = `${baseUrl}/v4/payment/verify.json`;

      const payload = {
        merchant_id: config.apiKey,
        amount: input.amount,
        currency: "IRT",
        authority,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.data?.code === 100 || data?.data?.code === 101) {
        return {
          success: true,
          refNumber: String(data.data.ref_id),
          cardPan: data.data.card_pan,
        };
      }

      return {
        success: false,
        errorMessage: `تأیید پرداخت ناموفق بود (کد: ${data?.errors?.code || data?.data?.code || "نامشخص"})`,
      };
    } catch (err: unknown) {
      console.error("[ZarinpalAdapter.verifyPayment error]:", err);
      return {
        success: false,
        errorMessage: "خطا در استعلام وضعیت پرداخت از زرین‌پال",
      };
    }
  }
}
