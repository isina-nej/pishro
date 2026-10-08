import type {
  GatewayConfig,
  PaymentAdapter,
  PaymentRequestInput,
  PaymentRequestOutput,
  PaymentVerifyInput,
  PaymentVerifyOutput,
} from "../types";

type ZibalReply = {
  result?: number;
  message?: string;
  trackId?: number;
  status?: number;
  amount?: number;
  orderId?: string;
  refNumber?: string | number;
  cardNumber?: string;
};

const BASE_URL = "https://gateway.zibal.ir";

async function callZibal(path: string, payload: Record<string, unknown>): Promise<ZibalReply> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Zibal HTTP ${response.status}`);
  return (await response.json()) as ZibalReply;
}

export class ZibalAdapter implements PaymentAdapter {
  name = "zibal";
  titleFa = "زیبال";

  async requestPayment(input: PaymentRequestInput, config: GatewayConfig): Promise<PaymentRequestOutput> {
    const merchant = config.sandbox ? "zibal" : config.apiKey.trim();
    const rials = input.amount * 10;
    if (!merchant || !Number.isSafeInteger(rials) || rials <= 1000) {
      return { success: false, errorMessage: "شناسه پذیرنده یا مبلغ سفارش معتبر نیست" };
    }

    try {
      const data = await callZibal("/v1/request", {
        merchant,
        amount: rials,
        callbackUrl: input.callbackUrl,
        description: input.description,
        orderId: input.orderId,
        ...(input.mobile ? { mobile: input.mobile } : {}),
      });
      if (data.result === 100 && Number.isSafeInteger(data.trackId) && data.trackId! > 0) {
        const trackId = String(data.trackId);
        return {
          success: true,
          payUrl: `${BASE_URL}/start/${trackId}`,
          authority: trackId,
        };
      }
      return { success: false, errorMessage: data.message || `خطای زیبال (${data.result ?? "نامشخص"})` };
    } catch (error) {
      console.error("[Zibal.requestPayment]", error);
      return { success: false, errorMessage: "ارتباط با زیبال برقرار نشد" };
    }
  }

  async verifyPayment(input: PaymentVerifyInput, config: GatewayConfig): Promise<PaymentVerifyOutput> {
    const trackId = input.params.trackId;
    if (!trackId || !/^\d+$/.test(trackId) || !Number.isSafeInteger(Number(trackId)) ||
        Number(trackId) <= 0 || trackId !== input.authority) {
      return { success: false, retryable: true, errorMessage: "شناسه پیگیری با سفارش مطابقت ندارد" };
    }
    const merchant = config.sandbox ? "zibal" : config.apiKey.trim();
    if (!merchant) return { success: false, retryable: true, errorMessage: "شناسه پذیرنده تنظیم نشده است" };

    const payload = { merchant, trackId: Number(trackId) };
    const matchesOrder = (reply: ZibalReply) =>
      reply.amount === input.amount * 10 &&
      reply.orderId === input.orderId &&
      (reply.trackId === undefined || reply.trackId === Number(trackId));
    const confirmed = (reply: ZibalReply): PaymentVerifyOutput => ({
      success: true,
      refNumber: String(reply.refNumber || trackId),
      cardPan: reply.cardNumber,
    });

    try {
      // A callback is only a hint. For cancellations, ask Zibal before declaring failure.
      const inquiry = await callZibal("/v1/inquiry", payload);
      if (inquiry.result !== 100) {
        return { success: false, retryable: true, errorMessage: inquiry.message || "استعلام زیبال ناموفق بود" };
      }
      if (inquiry.status === 1 && matchesOrder(inquiry)) return confirmed(inquiry);
      if (inquiry.status === 2 && matchesOrder(inquiry)) {
        const reply = await callZibal("/v1/verify", payload);
        // result 201 means this track was already verified; recheck the order before fulfilling.
        if (reply.result === 100 || reply.result === 201) {
          const verified = await callZibal("/v1/inquiry", payload);
          return verified.result === 100 && verified.status === 1 && matchesOrder(verified)
            ? confirmed(verified)
            : { success: false, retryable: true, errorMessage: "تأیید زیبال با سفارش مطابقت ندارد" };
        }
        return { success: false, retryable: true, errorMessage: reply.message || "تأیید زیبال ناموفق بود" };
      }
      if (typeof inquiry.status === "number" && inquiry.status >= 3) {
        return { success: false, errorMessage: "پرداخت ناموفق یا لغوشده است" };
      }
      return {
        success: false,
        retryable: true,
        errorMessage: "وضعیت پرداخت هنوز تأیید نشده یا با سفارش مطابقت ندارد",
      };
    } catch (error) {
      console.error("[Zibal.verifyPayment]", error);
      return { success: false, retryable: true, errorMessage: "استعلام زیبال در دسترس نیست؛ دوباره بررسی کنید" };
    }
  }
}
