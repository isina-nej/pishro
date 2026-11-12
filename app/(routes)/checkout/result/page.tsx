import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { checkoutLoginUrl, checkoutResultPath } from "@/lib/checkout-redirect";
import Result from "@/components/checkout/result";
import CheckoutRouteFallback from "@/components/checkout/routeFallback";

export default async function CheckoutResultPage({ searchParams }: {
  searchParams: Promise<{ orderId?: string; result?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    const { orderId, result } = await searchParams;
    redirect(checkoutLoginUrl(checkoutResultPath(orderId || null, result || null)));
  }
  return (
    <div className="pt-20">
      <Suspense fallback={<CheckoutRouteFallback label="در حال بررسی نتیجه سفارش" />}>
        <Result />
      </Suspense>
    </div>
  );
}
