// lib/payment/types.ts

export interface PaymentRequestInput {
  orderId: string;
  amount: number; // Toman
  callbackUrl: string;
  description: string;
  mobile?: string;
  email?: string;
  nationalCode?: string;
}

export interface PaymentRequestOutput {
  success: boolean;
  payUrl?: string;
  authority?: string;
  errorMessage?: string;
}

export interface PaymentVerifyInput {
  orderId: string;
  amount: number; // Toman
  authority?: string;
  params: Record<string, string>;
}

export interface PaymentVerifyOutput {
  success: boolean;
  retryable?: boolean; // Unknown/provider unavailable: leave order pending for a later inquiry.
  refNumber?: string;
  cardPan?: string;
  errorMessage?: string;
}

export interface GatewayConfig {
  apiKey: string;
  sandbox: boolean;
}

export interface PaymentAdapter {
  name: string;
  titleFa: string;
  requestPayment(
    input: PaymentRequestInput,
    config: GatewayConfig
  ): Promise<PaymentRequestOutput>;
  verifyPayment(
    input: PaymentVerifyInput,
    config: GatewayConfig
  ): Promise<PaymentVerifyOutput>;
}
