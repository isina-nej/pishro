"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/** مسیرهای جزئیات که نوبار کامل مخفی و دکمه شناور برگشت نمایش داده می‌شود */
export function isDetailPage(pathname: string | null): boolean {
  if (!pathname) return false;
  if (/^\/news\/[^/]+\/?$/.test(pathname)) return true;
  if (/^\/library\/[^/]+\/?$/.test(pathname)) return true;
  // جزئیات دوره: دقیقا دو سگمنت بعد از courses (صفحه لیست دسته‌بندی شامل نمی‌شود)
  if (/^\/courses\/[^/]+\/[^/]+\/?$/.test(pathname)) return true;
  if (/^\/crypto-prices\/[^/]+\/?$/.test(pathname)) return true;
  return false;
}

function getFallback(pathname: string | null): string {
  if (!pathname) return "/";
  if (pathname.startsWith("/courses/view/")) return "/profile/courses";
  if (pathname.startsWith("/news/")) return "/news";
  if (pathname.startsWith("/library/")) return "/library";
  if (pathname.startsWith("/courses/")) return "/courses";
  if (pathname.startsWith("/crypto-prices/")) return "/crypto-prices";
  return "/";
}

export default function DetailBackButton({
  pathname,
}: {
  pathname: string | null;
}) {
  const router = useRouter();
  const fallback = getFallback(pathname);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="بازگشت"
      title="بازگشت"
      className="fixed right-4 top-4 z-[9999] flex size-12 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground md:right-6 md:top-6"
    >
      <ArrowRight className="size-5" />
    </button>
  );
}
