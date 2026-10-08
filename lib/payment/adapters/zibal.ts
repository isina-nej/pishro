import type {
  GatewayConfig,
  PaymentAdapter,
  PaymentRequestInput,
  PaymentRequestOutput,
  PaymentVerifyInput,
  PaymentVerifyOutput,
} from "../types";

export type ZibalReply = {
  result?: number;
  message?: string;
  trackId?: number;
  status?: number;
  amount?: number;
  orderId?: string | number;
  refNumber?: string | number;
  cardNumber?: string;
  paidAt?: string;
  verifiedAt?: string;
  createdAt?: string;
  wage?: number;
  multiplexingInfos?: Array<{ id: string; bankAccount: string; amount: number }>;
};

/**
 * جدول وضعیت‌های درگاه زیبال (IPG Status Codes)
 */
export const ZIBAL_STATUS_CODES: Record<number, string> = {
  [-1]: "در انتظار پرداخت",
  [-2]: "خطای داخلی درگاه زیبال",
  1: "پرداخت شده - تاییدشده",
  2: "پرداخت شده - تاییدنشده",
  3: "لغوشده توسط کاربر",
  4: "شماره کارت نامعتبر می‌باشد",
  5: "موجودی حساب کافی نمی‌باشد",
  6: "رمز واردشده اشتباه می‌باشد",
  7: "تعداد درخواست‌ها بیش از حد مجاز می‌باشد",
  8: "تعداد پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد",
  9: "مبلغ پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد",
  10: "صادرکننده‌ی کارت نامعتبر می‌باشد",
  11: "خطای سوییچ بانکی",
  12: "کارت قابل دسترسی نمی‌باشد",
  15: "تراکنش استرداد شده",
  16: "تراکنش در حال استرداد",
  18: "تراکنش ریورس شده",
  21: "پذیرنده نامعتبر است",
};

/**
 * جدول کدهای نتیجه درگاه زیبال (IPG Result Codes)
 */
export const ZIBAL_RESULT_CODES: Record<number, string> = {
  100: "عملیات با موفقیت تایید شد",
  102: "merchant یافت نشد",
  103: "merchant غیرفعال / عدم امضا قرارداد درگاه مربوطه",
  104: "merchant نامعتبر",
  105: "مبلغ سفارش بایستی بزرگتر از ۱,۰۰۰ ریال باشد",
  106: "callbackUrl نامعتبر می‌باشد (شروع با http یا https)",
  107: "percentMode نامعتبر می‌باشد (تنها 0 و 1 قابل قبول است)",
  108: "یک یا چند ذی‌نفع در multiplexingInfos نامعتبر می‌باشند",
  109: "یک یا چند ذی‌نفع در multiplexingInfos غیرفعال می‌باشند",
  110: "id = self در multiplexingInfos وجود ندارد",
  111: "amount با مجموع سهم‌ها در multiplexingInfos برابر نمی‌باشد",
  112: "موجودی کیف پول کارمزد جهت کسر کارمزد کافی نیست",
  113: "مبلغ تراکنش از سقف میزان تراکنش بیشتر است",
  114: "کد ملی ارسالی نامعتبر است",
  115: "آدرس IP شما در پنل کاربری زیبال ثبت نشده است",
  116: "feeMode نامعتبر می‌باشد (تنها عدد صحیح قابل قبول است)",
  201: "قبلاً تایید شده",
  202: "سفارش پرداخت نشده یا ناموفق بوده است",
  203: "trackId نامعتبر می‌باشد",
};

export function getZibalStatusMessage(status?: number): string {
  if (typeof status !== "number") return "وضعیت پرداخت نامشخص است";
  return ZIBAL_STATUS_CODES[status] || `وضعیت پرداخت ناشناخته (${status})`;
}

export function getZibalResultMessage(result?: number, fallbackMessage?: string): string {
  if (typeof result !== "number") return fallbackMessage || "نتیجه نامشخص";
  return ZIBAL_RESULT_CODES[result] || fallbackMessage || `خطای زیبال (کد ${result})`;
}

const BASE_URL = "https://gateway.zibal.ir";

async function callZibal(path: string, payload: Record<string, unknown>): Promise<ZibalReply> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  let data: ZibalReply | null = null;
  try {
    data = (await response.json()) as ZibalReply;
  } catch {
    // Non-JSON response
  }

  if (data && typeof data.result === "number") {
    return data;
  }

  if (!response.ok) {
    throw new Error(`Zibal HTTP ${response.status}`);
  }

  return data ?? {};
}

export class ZibalAdapter implements PaymentAdapter {
  name = "zibal";
  titleFa = "زیبال";

  async requestPayment(input: PaymentRequestInput, config: GatewayConfig): Promise<PaymentRequestOutput> {
    const merchant = config.sandbox ? "zibal" : config.apiKey.trim();
    const rials = Math.round(input.amount * 10);
    if (!merchant || !Number.isSafeInteger(rials) || rials < 1000) {
      return { success: false, errorMessage: "شناسه پذیرنده یا مبلغ سفارش معتبر نیست (حداقل ۱۰۰ تومان)" };
    }

    try {
      const payload: Record<string, unknown> = {
        merchant,
        amount: rials,
        callbackUrl: input.callbackUrl,
        description: input.description,
        orderId: input.orderId,
      };
      if (input.mobile) payload.mobile = input.mobile;
      if (input.nationalCode) payload.nationalCode = input.nationalCode;

      const data = await callZibal("/v1/request", payload);
      if (data.result === 100 && Number.isSafeInteger(data.trackId) && data.trackId! > 0) {
        const trackId = String(data.trackId);
        return {
          success: true,
          payUrl: `${BASE_URL}/start/${trackId}`,
          authority: trackId,
        };
      }
      return {
        success: false,
        errorMessage: getZibalResultMessage(data.result, data.message),
      };
    } catch (error) {
      console.error("[Zibal.requestPayment]", error);
      return { success: false, errorMessage: "ارتباط با زیبال برقرار نشد" };
    }
  }

  async verifyPayment(input: PaymentVerifyInput, config: GatewayConfig): Promise<PaymentVerifyOutput> {
    const trackId = input.params.trackId;
    if (
      !trackId ||
      !/^\d+$/.test(trackId) ||
      !Number.isSafeInteger(Number(trackId)) ||
      Number(trackId) <= 0 ||
      trackId !== input.authority
    ) {
      return { success: false, retryable: true, errorMessage: "شناسه پیگیری با سفارش مطابقت ندارد" };
    }
    const merchant = config.sandbox ? "zibal" : config.apiKey.trim();
    if (!merchant) return { success: false, retryable: true, errorMessage: "شناسه پذیرنده تنظیم نشده است" };

    const payload = { merchant, trackId: Number(trackId) };
    const matchesOrder = (reply: ZibalReply) =>
      reply.amount === input.amount * 10 &&
      (reply.orderId === undefined || String(reply.orderId) === String(input.orderId)) &&
      (reply.trackId === undefined || reply.trackId === Number(trackId));

    const confirmed = (reply: ZibalReply): PaymentVerifyOutput => ({
      success: true,
      refNumber: String(reply.refNumber || trackId),
      cardPan: reply.cardNumber,
    });

    try {
      // A callback is only a hint. Ask Zibal before declaring failure.
      const inquiry = await callZibal("/v1/inquiry", payload);
      if (inquiry.result !== 100) {
        return {
          success: false,
          retryable: true,
          errorMessage: getZibalResultMessage(inquiry.result, inquiry.message || "استعلام زیبال ناموفق بود"),
        };
      }

      if (inquiry.status === 1 && matchesOrder(inquiry)) {
        return confirmed(inquiry);
      }

      if (inquiry.status === 2 && matchesOrder(inquiry)) {
        const reply = await callZibal("/v1/verify", payload);
        if (reply.result === 100 && matchesOrder(reply)) {
          return confirmed(reply);
        }
        // result 201 means this track was already verified; recheck the order before fulfilling.
        if (reply.result === 100 || reply.result === 201) {
          const verified = await callZibal("/v1/inquiry", payload);
          return verified.result === 100 && verified.status === 1 && matchesOrder(verified)
            ? confirmed(verified)
            : { success: false, retryable: true, errorMessage: "تأیید زیبال با سفارش مطابقت ندارد" };
        }
        return {
          success: false,
          retryable: true,
          errorMessage: getZibalResultMessage(reply.result, reply.message || "تأیید زیبال ناموفق بود"),
        };
      }

      if (typeof inquiry.status === "number" && inquiry.status >= 3) {
        return {
          success: false,
          errorMessage: getZibalStatusMessage(inquiry.status),
        };
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

  /**
   * استعلام وضعیت تراکنش از درگاه زیبال
   */
  async inquiryPayment(trackId: string | number, config: GatewayConfig): Promise<ZibalReply> {
    const merchant = config.sandbox ? "zibal" : config.apiKey.trim();
    if (!merchant) throw new Error("شناسه پذیرنده تنظیم نشده است");
    return callZibal("/v1/inquiry", { merchant, trackId: Number(trackId) });
  }
}
