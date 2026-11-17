import { CreditCard, Loader2, ShieldCheck } from "lucide-react";

export default function CheckoutRouteFallback({ label = "در حال آماده‌سازی صفحه" }: { label?: string }) {
  return (
    <div dir="rtl" role="status" aria-live="polite" className="relative flex min-h-[65vh] items-center justify-center bg-[var(--home-bg)] px-4 py-20">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-[1.75rem] border border-border/70 bg-card p-10 text-center shadow-[0_24px_75px_-40px_rgba(0,0,0,.3)]">
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          <CreditCard className="size-8" />
          <span className="absolute -bottom-2 -left-2 flex size-7 items-center justify-center rounded-full bg-card text-success shadow-sm"><ShieldCheck className="size-4" /></span>
        </div>
        <h2 className="text-lg font-black text-foreground">{label}</h2>
        <p className="text-xs leading-6 text-muted-foreground">اطلاعات سفارش با دقت در حال بارگذاری است.</p>
        <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
      </div>
    </div>
  );
}
