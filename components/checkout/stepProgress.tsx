"use client";

import { Check, CreditCard, ShoppingBag, ShieldCheck } from "lucide-react";
import { usePublicCopy } from "@/components/site/PublicContentProvider";

interface StepProgressProps {
  currentStep: "shoppingCart" | "pay" | "result";
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const copy = usePublicCopy("checkout");
  const steps = [
    { id: "shoppingCart", label: copy("steps.step1", "سبد خرید"), hint: "انتخاب محصولات", Icon: ShoppingBag },
    { id: "pay", label: copy("steps.step2", "بازبینی نهایی"), hint: "جزئیات سفارش", Icon: CreditCard },
    { id: "result", label: copy("steps.step3", "نتیجه پرداخت"), hint: "تأیید سفارش", Icon: ShieldCheck },
  ] as const;
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="مراحل تکمیل خرید" className="rounded-[1.5rem] border border-border/70 bg-card/90 px-4 py-5 shadow-[0_14px_40px_-30px_rgba(0,0,0,.25)] sm:px-7 sm:py-6">
      <ol className="grid grid-cols-3" dir="rtl">
        {steps.map(({ id, label, hint, Icon }, index) => {
          const active = currentStep === id;
          const completed = index < currentIndex;
          return (
            <li key={id} aria-current={active ? "step" : undefined} className="relative flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-right">
              {index > 0 && <span aria-hidden className="absolute right-[calc(50%+24px)] top-5 hidden h-px w-[calc(100%-48px)] bg-border sm:block" />}
              <span className={
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors sm:size-12 " +
                (active ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15" :
                 completed ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted/50 text-muted-foreground")
              }>
                {completed ? <Check className="size-5" /> : <Icon className="size-5" />}
              </span>
              <span className="min-w-0">
                <span className={"block text-xs font-bold sm:text-sm " + (active ? "text-primary" : "text-foreground")}>{label}</span>
                <span className="mt-1 hidden text-[11px] text-muted-foreground md:block">{hint}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
