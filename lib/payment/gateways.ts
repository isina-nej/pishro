// Safe to import from client components; no credentials, Prisma or server cache.
export const SUPPORTED_GATEWAYS = [
  { id: "saman", titleFa: "سامان (SEP)", descFa: "درگاه مستقیم سامان (شاپرک)" },
  { id: "zarinpal", titleFa: "زرین‌پال", descFa: "درگاه واسط زرین‌پال (ZarinPal)" },
  { id: "zibal", titleFa: "زیبال", descFa: "درگاه واسط زیبال (Zibal)" },
  { id: "nextpay", titleFa: "نکست‌پی", descFa: "درگاه واسط نکست‌پی (NextPay)" },
  { id: "test", titleFa: "درگاه آزمایشی", descFa: "شبیه‌ساز پرداخت (محیط تست)" },
] as const;

export type SupportedGatewayId = (typeof SUPPORTED_GATEWAYS)[number]["id"];

