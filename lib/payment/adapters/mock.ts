// lib/payment/adapters/mock.ts
import { PaymentAdapter, PaymentRequestInput, PaymentRequestOutput, PaymentVerifyInput, PaymentVerifyOutput, GatewayConfig } from "../types";

export class MockAdapter implements PaymentAdapter {
  name = "test";
  titleFa = "درگاه تستی (شبیه‌ساز)";

  async requestPayment(
    input: PaymentRequestInput,
    _config: GatewayConfig
  ): Promise<PaymentRequestOutput> {
    const fakeAuthority = `TEST-${Date.now()}`;
    const separator = input.callbackUrl.includes("?") ? "&" : "?";
    const payUrl = `${input.callbackUrl}${separator}orderId=${input.orderId}&Authority=${fakeAuthority}&Status=OK&trackId=${fakeAuthority}&success=1`;

    return {
      success: true,
      payUrl,
      authority: fakeAuthority,
    };
  }

  async verifyPayment(
    input: PaymentVerifyInput,
    _config: GatewayConfig
  ): Promise<PaymentVerifyOutput> {
    const status = input.params.Status || input.params.status;
    const success = input.params.success;

    if (status === "NOK" || success === "0") {
      return {
        success: false,
        errorMessage: "تراکنش تستی لغو شد",
      };
    }

    return {
      success: true,
      refNumber: `REF-${input.authority || Date.now()}`,
      cardPan: "603799******1234",
    };
  }
}
