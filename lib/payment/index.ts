// lib/payment/index.ts
import { getPaymentGatewayConfig } from "@/lib/services/settings-service";
import {
  PaymentAdapter,
  PaymentRequestInput,
  PaymentRequestOutput,
  PaymentVerifyInput,
  PaymentVerifyOutput,
} from "./types";
import { ZarinpalAdapter } from "./adapters/zarinpal";
import { ZibalAdapter } from "./adapters/zibal";
import { NextPayAdapter } from "./adapters/nextpay";
import { SepAdapter } from "./adapters/sep";
import { MockAdapter } from "./adapters/mock";

export * from "./types";
export { ZarinpalAdapter } from "./adapters/zarinpal";
export { ZibalAdapter } from "./adapters/zibal";
export { NextPayAdapter } from "./adapters/nextpay";
export { SepAdapter } from "./adapters/sep";
export { MockAdapter } from "./adapters/mock";

export const SUPPORTED_GATEWAYS = [
  { id: "saman", titleFa: "سامان (SEP)", descFa: "درگاه مستقیم سامان (شاپرک)" },
  { id: "zarinpal", titleFa: "زرین‌پال", descFa: "درگاه واسط زرین‌پال (ZarinPal)" },
  { id: "zibal", titleFa: "زیبال", descFa: "درگاه واسط زیبال (Zibal)" },
  { id: "nextpay", titleFa: "نکست‌پی", descFa: "درگاه واسط نکست‌پی (NextPay)" },
  { id: "test", titleFa: "درگاه آزمایشی", descFa: "شبیه‌ساز پرداخت (محیط تست)" },
] as const;

export type SupportedGatewayId = (typeof SUPPORTED_GATEWAYS)[number]["id"];

const adapters: Record<string, PaymentAdapter> = {
  saman: new SepAdapter(),
  zarinpal: new ZarinpalAdapter(),
  zibal: new ZibalAdapter(),
  nextpay: new NextPayAdapter(),
  test: new MockAdapter(),
};

export function getPaymentAdapter(gatewayName?: string): PaymentAdapter {
  const key = gatewayName?.toLowerCase().trim();
  if (key && adapters[key]) {
    return adapters[key];
  }
  return adapters.zarinpal;
}

/**
 * Initiates payment for an order using the active gateway config
 */
export async function initiatePayment(
  input: PaymentRequestInput,
  overrideGateway?: string
): Promise<PaymentRequestOutput & { gateway: string }> {
  const config = await getPaymentGatewayConfig();
  const gateway = overrideGateway || config.gateway;

  // If no API key is provided and not in test gateway, fall back to mock in non-prod
  if (!config.apiKey && gateway !== "test" && !(gateway === "zibal" && config.sandbox)) {
    if (process.env.NODE_ENV !== "production" || config.sandbox) {
      console.warn(`[Payment] No API key for ${gateway}. Falling back to test adapter.`);
      const mockAdapter = adapters.test;
      const res = await mockAdapter.requestPayment(input, config);
      return { ...res, gateway: "test" };
    }
    return {
      success: false,
      errorMessage: "کلید API درگاه پرداخت در تنظیمات سیستم ثبت نشده است",
      gateway,
    };
  }

  const adapter = getPaymentAdapter(gateway);
  const result = await adapter.requestPayment(input, config);

  return {
    ...result,
    gateway: adapter.name,
  };
}

/**
 * Verifies payment for an order using the designated or active gateway
 */
export async function verifyPayment(
  input: PaymentVerifyInput,
  gatewayName?: string
): Promise<PaymentVerifyOutput> {
  const config = await getPaymentGatewayConfig();
  const gateway = gatewayName || config.gateway;

  if (gateway === "test") {
    return adapters.test.verifyPayment(input, config);
  }

  const adapter = getPaymentAdapter(gateway);
  return adapter.verifyPayment(input, config);
}
