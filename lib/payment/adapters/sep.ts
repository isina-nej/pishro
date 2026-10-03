// lib/payment/adapters/sep.ts
// Direct gateway: Saman Electronic Payment (SEP), per doc v3.6 + neo-pg + Postman collection.
// Amounts: input is Toman, SEP expects Rial (x10).
import {
  PaymentAdapter,
  PaymentRequestInput,
  PaymentRequestOutput,
  PaymentVerifyInput,
  PaymentVerifyOutput,
  GatewayConfig,
} from "../types";

const TOKEN_URL = "https://sep.shaparak.ir/onlinepg/OnlinePG";
const SEND_TOKEN_URL = "https://sep.shaparak.ir/OnlinePG/SendToken";
const VERIFY_URL =
  "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction";
const REVERSE_URL =
  "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/ReverseTransaction";
const FETCH_TIMEOUT_MS = 15000;

function normalizeCellNumber(mobile?: string): string | undefined {
  if (!mobile) return undefined;
  let n = mobile.replace(/\D/g, "");
  if (n.startsWith("98")) n = n.slice(2);
  if (n.startsWith("0")) n = n.slice(1);
  return n.length >= 10 ? n : undefined;
}

async function postJson(url: string, payload: unknown, timeoutMs = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => null);
    return { res, data };
  } finally {
    clearTimeout(timer);
  }
}

async function postJsonRetry(url: string, payload: unknown, retries = 1) {
  let lastErr: unknown = null;
  for (let i = 0; i <= retries; i++) {
    try {
      return await postJson(url, payload);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

export class SepAdapter implements PaymentAdapter {
  name = "saman";
  titleFa = "سامان (SEP)";

  async requestPayment(
    input: PaymentRequestInput,
    config: GatewayConfig
  ): Promise<PaymentRequestOutput> {
    const terminalId = config.apiKey?.trim();
    if (!terminalId) {
      return {
        success: false,
        errorMessage: "شماره ترمینال سامان در تنظیمات درگاه ثبت نشده است",
      };
    }
    const amountRial = Math.round(input.amount * 10);
    if (!Number.isFinite(amountRial) || amountRial <= 0) {
      return { success: false, errorMessage: "مبلغ سفارش معتبر نیست" };
    }

    try {
      const payload: Record<string, unknown> = {
        action: "Token",
        TerminalId: terminalId,
        Amount: amountRial,
        ResNum: input.orderId,
        RedirectUrl: input.callbackUrl,
      };
      const cell = normalizeCellNumber(input.mobile);
      if (cell) payload.CellNumber = cell;

      const { res, data } = await postJson(TOKEN_URL, payload);

      if (data?.status === 1 && data?.token) {
        const token = String(data.token);
        // neo-pg: new base comes from X-IPG-Url header, fields unchanged.
        const ipgBase = res.headers?.get("x-ipg-url")?.trim();
        const payUrl = ipgBase
          ? `${ipgBase}${ipgBase.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
          : `${SEND_TOKEN_URL}?token=${encodeURIComponent(token)}`;
        return { success: true, payUrl, authority: token };
      }

      return {
        success: false,
        errorMessage:
          data?.errorDesc ||
          `خطای درگاه سامان (کد ${data?.errorCode ?? "نامشخص"})`,
      };
    } catch (err: unknown) {
      console.error("[SepAdapter.requestPayment error]:", err);
      return {
        success: false,
        errorMessage: "ارتباط با درگاه سامان برقرار نشد",
      };
    }
  }

  async verifyPayment(
    input: PaymentVerifyInput,
    config: GatewayConfig
  ): Promise<PaymentVerifyOutput> {
    const p = input.params;
    const state = p.State || p.state || "";
    const status = p.Status || p.status || "";
    const refNum = p.RefNum || p.refNum || "";

    if (!refNum || !(state === "OK" || status === "2")) {
      return {
        success: false,
        errorMessage: "پرداخت ناموفق بود یا توسط کاربر لغو شد",
      };
    }

    const terminalNumber = Number(config.apiKey);
    if (!Number.isFinite(terminalNumber)) {
      return {
        success: false,
        errorMessage: "شماره ترمینال سامان در تنظیمات درگاه معتبر نیست",
      };
    }

    try {
      // ponytail: single retry on network failure only; doc requires re-query
      // until an answer arrives (30-min window) — add a reconcile job when needed.
      const { data } = await postJsonRetry(VERIFY_URL, {
        RefNum: refNum,
        TerminalNumber: terminalNumber,
      });

      if (!(data?.Success === true && (data?.ResultCode === 0 || data?.ResultCode === 2))) {
        return {
          success: false,
          errorMessage:
            data?.ResultDescription ||
            `تأیید تراکنش سامان ناموفق بود (کد ${data?.ResultCode ?? "نامشخص"})`,
        };
      }

      const detail = data?.TransactionDetail || {};
      const paidRial = Number(detail.OrginalAmount ?? detail.AffectiveAmount);
      const expectedRial = Math.round(input.amount * 10);
      if (!Number.isFinite(paidRial) || paidRial !== expectedRial) {
        // Doc case B: amount mismatch → refund via report panel, no service.
        return {
          success: false,
          errorMessage: `مبلغ تراکنش (${paidRial}) با مبلغ سفارش مغایرت دارد`,
        };
      }

      if (
        detail.TerminalNumber !== undefined &&
        Number(detail.TerminalNumber) !== terminalNumber
      ) {
        return {
          success: false,
          errorMessage: "شماره ترمینال تراکنش با ترمینال فروشگاه مطابقت ندارد",
        };
      }

      return {
        success: true,
        refNumber: refNum,
        cardPan: detail.MaskedPan,
      };
    } catch (err: unknown) {
      console.error("[SepAdapter.verifyPayment error]:", err);
      return {
        success: false,
        errorMessage: "استعلام وضعیت پرداخت از سامان ناموفق بود",
      };
    }
  }

  // ponytail: manual refund within ~50 min after verify; wire to an admin
  // action + cron when chargeback flow is needed.
  async reverseTransaction(
    refNum: string,
    config: GatewayConfig
  ): Promise<{ success: boolean; message: string }> {
    const terminalNumber = Number(config.apiKey);
    try {
      const { data } = await postJson(REVERSE_URL, {
        RefNum: refNum,
        TerminalNumber: terminalNumber,
      });
      if (data?.Success === true && (data?.ResultCode === 0 || data?.ResultCode === 2)) {
        return { success: true, message: "برگشت وجه با موفقیت ثبت شد" };
      }
      return {
        success: false,
        message:
          data?.ResultDescription ||
          `برگشت وجه ناموفق بود (کد ${data?.ResultCode ?? "نامشخص"})`,
      };
    } catch (err: unknown) {
      console.error("[SepAdapter.reverseTransaction error]:", err);
      return { success: false, message: "ارتباط با سرویس برگشت وجه سامان برقرار نشد" };
    }
  }
}
