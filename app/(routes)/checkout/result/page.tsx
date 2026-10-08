import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { checkoutLoginUrl, checkoutResultPath } from "@/lib/checkout-redirect";
import Result from "@/components/checkout/result";

const CheckoutResultPage = async ({ searchParams }: {
  searchParams: Promise<{ orderId?: string; result?: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    const { orderId, result } = await searchParams;
    redirect(checkoutLoginUrl(checkoutResultPath(orderId || null, result || null)));
  }
  return (
    <div className="pt-20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        }
      >
        <Result />
      </Suspense>
    </div>
  );
};

export default CheckoutResultPage;
