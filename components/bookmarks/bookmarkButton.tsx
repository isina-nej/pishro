"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsBookmarked, useToggleBookmark } from "@/lib/hooks/useBookmarks";
import type { BookmarkType } from "@/lib/schemas/bookmark-schema";

interface BookmarkButtonProps {
  type: BookmarkType;
  itemId: string;
  /** متن کنار آیکن. روی کارت‌ها معمولاً خاموش می‌ماند و فقط آیکن دیده می‌شود. */
  showLabel?: boolean;
  className?: string;
}

/**
 * دکمهٔ نشان‌کردن یک دوره/خبر/کتاب.
 *
 * وضعیت را از کش مشترک `useBookmarks` می‌خواند، پس چند دکمه در یک صفحه با هم
 * یک درخواست بیشتر نمی‌زنند. کاربر مهمان به صفحهٔ ورود می‌رود و بعد از ورود به
 * همین صفحه برمی‌گردد.
 */
const BookmarkButton = ({
  type,
  itemId,
  showLabel = false,
  className,
}: BookmarkButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { isBookmarked } = useIsBookmarked(type, itemId);
  const toggle = useToggleBookmark();

  // تا وقتی درخواست در راه است وضعیت برعکس نشان داده می‌شود تا کلیک بی‌درنگ
  // دیده شود؛ بعد از پاسخ، لیست تازه وضعیت واقعی را می‌نشاند.
  const active = toggle.isPending ? !isBookmarked : isBookmarked;

  const handleClick = (event: React.MouseEvent) => {
    // کارت‌ها داخل Link هستند؛ کلیک روی این دکمه نباید صفحه را عوض کند.
    event.preventDefault();
    event.stopPropagation();

    // تا وقتی سشن خوانده نشده معلوم نیست کاربر مهمان است یا نه؛ فرستادنش به
    // صفحهٔ ورود در این لحظه یعنی بیرون‌انداختن کاربرِ وارد‌شده.
    if (status === "loading") return;

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    toggle.mutate({ type, itemId, bookmarked: isBookmarked });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={active}
      aria-label={active ? "حذف از لیست من" : "ذخیره در لیست من"}
      title={active ? "حذف از لیست من" : "ذخیره در لیست من"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border transition-colors disabled:opacity-60",
        showLabel ? "px-4 py-2 text-sm font-medium" : "size-9",
        active
          ? "border-mySecondary/40 bg-mySecondary/10 text-mySecondary"
          : "border-border bg-background/80 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Bookmark className={cn("size-4 shrink-0", active && "fill-current")} />
      {showLabel && <span>{active ? "ذخیره شد" : "ذخیره"}</span>}
    </button>
  );
};

export default BookmarkButton;
