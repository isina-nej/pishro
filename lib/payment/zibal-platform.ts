/**
 * Zibal Platform API Client (پلتفرم جامع پرداختی زیبال)
 * Base URL: https://api.zibal.ir
 * Auth: Authorization: Bearer {{ACCESS_TOKEN}}
 */

const PLATFORM_BASE_URL = "https://api.zibal.ir";

export interface ZibalPlatformResponse<T = unknown> {
  result: number;
  message: string;
  data?: T;
  total?: number;
  sum?: number;
}

export interface ZibalWallet {
  id: number;
  name: string;
  balance: number;
  withdrawableBalance: number;
}

export interface ZibalSubMerchant {
  id: string;
  bankAccount: string;
  name: string;
  status: number; // 0: در انتظار تایید، 1: تایید شده، 2: رد شده، -1: حذف شده
}

export interface ZibalTransactionReportItem {
  trackId: number;
  amount: number;
  status: number;
  orderId?: string;
  paidAt?: string;
  refNumber?: string;
  description?: string;
  cardNumber?: string;
  mobile?: string;
  multiplexingInfos?: Array<{
    id: string;
    bankAccount: string;
    amount: number;
  }>;
}

export interface ZibalRefundItem {
  refundId: string;
  status: number; // 0: در انتظار پردازش، 1: پردازش شده در انتظار واریز، 2: موفق، 3: ناموفق
  statusEn?: string;
  statusFa?: string;
  amount?: number;
  wage?: number;
  description?: string;
  createdAt?: string;
  transactionDetail?: {
    trackId: number;
    amount: number;
    orderId?: string;
    paidAt?: string;
    cardNumber?: string;
  };
}

async function platformRequest<T>(
  path: string,
  method: "GET" | "POST",
  token: string,
  body?: Record<string, unknown>
): Promise<ZibalPlatformResponse<T>> {
  const url = `${PLATFORM_BASE_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });

  const json = (await response.json().catch(() => null)) as ZibalPlatformResponse<T> | null;
  if (!response.ok && !json) {
    throw new Error(`Zibal Platform HTTP ${response.status}`);
  }
  return json ?? { result: -1, message: "پاسخ نامعتبر از سرور زیبال" };
}

export const zibalPlatform = {
  /**
   * لیست کیف‌پول‌ها و موجودی
   */
  async getWalletList(token: string): Promise<ZibalPlatformResponse<ZibalWallet[]>> {
    return platformRequest<ZibalWallet[]>("/v1/wallet/list", "GET", token);
  },

  /**
   * استعلام موجودی یک کیف‌پول
   */
  async getWalletBalance(token: string, walletId: number): Promise<ZibalPlatformResponse<ZibalWallet[]>> {
    return platformRequest<ZibalWallet[]>("/v1/wallet/balance", "POST", token, { id: walletId });
  },

  /**
   * گزارش واریزی‌ها و تسویه‌ها
   */
  async getCheckoutReport(
    token: string,
    params: {
      fromDate?: string;
      toDate?: string | number;
      page?: number;
      size?: number;
      transactionTrackId?: number;
      verbose?: boolean;
    } = {}
  ): Promise<ZibalPlatformResponse<unknown[]>> {
    return platformRequest("/v1/report/checkout", "POST", token, {
      page: 1,
      size: 100,
      ...params,
    });
  },

  /**
   * صف تسویه
   */
  async getCheckoutQueue(
    token: string,
    params: { verbose?: boolean; subMerchants?: Array<{ id?: string; bankAccount?: string }> } = {}
  ): Promise<ZibalPlatformResponse<unknown[]>> {
    return platformRequest("/v1/report/checkout/queue", "POST", token, params);
  },

  /**
   * استعلام تسویه
   */
  async inquireCheckout(
    token: string,
    params: { walletId: string; checkoutRequestId?: string; uniqueCode?: string }
  ): Promise<ZibalPlatformResponse<unknown>> {
    return platformRequest("/v1/report/checkout/inquire", "POST", token, params);
  },

  /**
   * گزارش تراکنش‌های درگاه پرداخت
   */
  async getTransactionReport(
    token: string,
    params: {
      merchantId: string;
      page?: number;
      size?: number;
      trackId?: number;
      orderId?: string;
      cardNumber?: string;
      mobile?: string;
      amount?: number;
      status?: number;
      fromDate?: string;
      toDate?: string;
      verbose?: boolean;
    }
  ): Promise<ZibalPlatformResponse<ZibalTransactionReportItem[]>> {
    return platformRequest<ZibalTransactionReportItem[]>(
      "/v1/gateway/report/transaction",
      "POST",
      token,
      {
        page: 1,
        size: 100,
        ...params,
      }
    );
  },

  /**
   * تعریف ذی‌نفع جدید برای تسهیم
   */
  async createSubMerchant(
    token: string,
    params: { bankAccount: string; name: string; callbackUrl?: string }
  ): Promise<ZibalPlatformResponse<ZibalSubMerchant>> {
    return platformRequest<ZibalSubMerchant>("/v1/subMerchant/create", "POST", token, params);
  },

  /**
   * لیست ذی‌نفع‌های ثبت‌شده
   */
  async listSubMerchants(
    token: string,
    params: { page?: number; size?: number; subMerchant?: { id?: string; bankAccount?: string } } = {}
  ): Promise<ZibalPlatformResponse<ZibalSubMerchant[]>> {
    return platformRequest<ZibalSubMerchant[]>("/v1/subMerchant/list", "POST", token, {
      page: 1,
      size: 50,
      ...params,
    });
  },

  /**
   * ویرایش ذی‌نفع غیرفعال
   */
  async editSubMerchant(
    token: string,
    params: { id: string; bankAccount: string; name: string }
  ): Promise<ZibalPlatformResponse<ZibalSubMerchant>> {
    return platformRequest<ZibalSubMerchant>("/v1/subMerchant/edit", "POST", token, params);
  },

  /**
   * درخواست استرداد وجه (Refund / Reverse)
   */
  async requestRefund(
    token: string,
    params: {
      accountId: string;
      trackId: number;
      amount?: number; // به ریال (در صورت خالی بودن کل مبلغ استرداد می‌شود)
      cardNumber?: string;
      description?: string;
      tryReverse?: boolean; // اولویت با ریورس، در غیر این‌صورت ریفاند
    }
  ): Promise<ZibalPlatformResponse<{ reversed?: boolean; refundId?: string | number }>> {
    return platformRequest("/v1/account/refund", "POST", token, {
      tryReverse: false,
      ...params,
    });
  },

  /**
   * استعلام استرداد وجه
   */
  async inquireRefund(
    token: string,
    params: { refundId?: number | string; transactionTrackId?: number }
  ): Promise<ZibalPlatformResponse<ZibalRefundItem[]>> {
    return platformRequest<ZibalRefundItem[]>("/v1/account/refund/inquiry", "POST", token, params);
  },

  /**
   * لیست گزارشات استرداد وجه
   */
  async listRefunds(
    token: string,
    params: {
      page?: number;
      size?: number;
      status?: number[];
      type?: number;
      fromDate?: string;
      toDate?: string;
    } = {}
  ): Promise<ZibalPlatformResponse<ZibalRefundItem[]>> {
    return platformRequest<ZibalRefundItem[]>("/v1/account/refund/list", "POST", token, {
      page: 1,
      size: 50,
      ...params,
    });
  },
};
