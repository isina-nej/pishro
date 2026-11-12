"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Clock3, GraduationCap, ShieldAlert, Tag, Trash2, TrendingUp, Wallet } from "lucide-react";
import { useCartStore, isCourse, isPortfolio, type CartItem } from "@/stores/cart-store";
import { displayItemPricing, formatCheckoutPrice } from "@/lib/checkout-display";

interface ItemCardProps {
  data: CartItem;
  index?: number;
}

const portfolioRiskLabel = (type: "low" | "medium" | "high") =>
  type === "low" ? "کم‌ریسک" : type === "medium" ? "ریسک متوسط" : "پرریسک";

export default function ItemCard({ data, index = 0 }: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const course = isCourse(data);
  const portfolio = isPortfolio(data);
  const pricing = displayItemPricing(data);

  const remove = () => {
    if (isRemoving) return;
    setIsRemoving(true);
    window.setTimeout(() => removeFromCart(data.id), 180);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isRemoving ? 0 : 1, y: isRemoving ? -8 : 0 }}
      transition={{ duration: 0.2, delay: Math.min(index, 4) * 0.035 }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted/20 transition-all duration-200 hover:border-primary/25 hover:bg-muted/35"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-primary/5 sm:aspect-[5/4] sm:w-[168px]">
          {course ? (
            data.img && !imageError ? (
              <Image
                src={data.img}
                alt={data.subject}
                fill
                sizes="(max-width: 640px) calc(100vw - 64px), 168px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-primary/70">
                <BookOpen className="size-10" />
                <span className="text-xs">تصویر دوره</span>
              </div>
            )
          ) : (
            <div className="relative flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/15 via-primary/5 to-premium/10 text-primary">
              <BarChart3 className="size-10" />
              <span className="text-xs font-bold">سبد سرمایه‌گذاری</span>
            </div>
          )}
          {pricing.discountPercent > 0 && (
            <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground">
              <Tag className="size-3" />
              {pricing.discountPercent.toLocaleString("fa-IR")}٪ تخفیف
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-premium">
                  {course ? <GraduationCap className="size-3.5" /> : <TrendingUp className="size-3.5" />}
                  {course ? "دوره آموزشی" : "خدمت سرمایه‌گذاری"}
                </span>
                <h3 className="line-clamp-2 text-base font-black leading-7 text-foreground sm:text-lg">
                  {course ? data.subject : "سبد سرمایه‌گذاری " + (portfolio ? portfolioRiskLabel(data.portfolioType) : "")}
                </h3>
              </div>
              <button
                type="button"
                onClick={remove}
                disabled={isRemoving}
                title="حذف از سبد خرید"
                aria-label={course ? "حذف دوره از سبد خرید" : "حذف سبد سرمایه‌گذاری"}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-destructive disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {course && <p className="line-clamp-2 text-xs leading-6 text-muted-foreground">{data.description || "دسترسی به محتوای آموزشی پس از تکمیل فرایند خرید."}</p>}

            {portfolio && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-2 text-muted-foreground">
                  <Wallet className="size-3.5 text-primary" />
                  سرمایه: {formatCheckoutPrice(data.portfolioAmount)} تومان
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-2 text-muted-foreground">
                  <Clock3 className="size-3.5 text-primary" />
                  {data.portfolioDuration.toLocaleString("fa-IR")} ماه
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-2 text-muted-foreground">
                  <ShieldAlert className="size-3.5 text-premium" />
                  بازده تخمینی، بدون تضمین
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border/60 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">قیمت این مورد</p>
              {pricing.saved > 0 && (
                <p className="mt-1 text-xs font-medium text-success">
                  {formatCheckoutPrice(pricing.saved)} تومان تخفیف
                </p>
              )}
            </div>
            <div className="text-left">
              {pricing.saved > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatCheckoutPrice(pricing.original)} تومان
                </p>
              )}
              <p className="mt-1 text-xl font-black tabular-nums text-primary">
                {formatCheckoutPrice(pricing.final)} <span className="text-xs font-medium">تومان</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
