"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ShoppingBag, Sparkles } from "lucide-react";
import { usePublicCopy } from "@/components/site/PublicContentProvider";

export default function EmptyCart() {
  const copy = usePublicCopy("checkout");
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card px-6 py-16 text-center shadow-[0_24px_70px_-40px_rgba(0,0,0,.25)] sm:px-10 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="relative mx-auto flex size-24 items-center justify-center rounded-[1.75rem] border border-primary/15 bg-primary/5 text-primary">
        <ShoppingBag className="size-11" strokeWidth={1.4} />
        <Sparkles className="absolute -left-3 -top-3 size-6 text-premium" />
      </div>
      <div className="relative mx-auto mt-8 max-w-lg">
        <span className="mb-3 inline-block text-xs font-bold tracking-wider text-premium">شروع یک انتخاب خوب</span>
        <h2 className="text-2xl font-black text-foreground sm:text-3xl">{copy("empty.title", "سبد خرید شما خالی است")}</h2>
        <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">{copy("empty.description", "هنوز محصول یا دوره‌ای به سبد اضافه نکرده‌اید. از میان دوره‌ها انتخاب کنید و مسیر یادگیری را آغاز کنید.")}</p>
      </div>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/courses" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 hover:brightness-110 sm:w-auto">
          <BookOpen className="size-4.5" /> {copy("empty.courses", "مشاهده دوره‌ها")} <ArrowLeft className="size-4" />
        </Link>
        <Link href="/" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted sm:w-auto">
          {copy("empty.home", "بازگشت به صفحه اصلی")}
        </Link>
      </div>
    </section>
  );
}
