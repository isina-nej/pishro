"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
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
 * دکمهٔ ذخیره در لیست کاربر (بوکمارک).
 *
 * فقط برای کاربر لاگین‌شده رندر می‌شود؛ مهمان اصلاً دکمه را نمی‌بیند.
 * وضعیت از کش مشترک `useBookmarks` خوانده می‌شود تا چند دکمه در یک صفحه
 * درخواست جدا نزنند.
 */
const BookmarkButton = ({
  type,
  itemId,
  showLabel = false,
  className,
}: BookmarkButtonProps) => {
  const { status } = useSession();
  const { isBookmarked } = useIsBookmarked(type, itemId);
  const toggle = useToggleBookmark();

  // مهمان / در حال خواندن سشن: دکمه نمایش داده نمی‌شود.
  if (status !== "authenticated") {
    return null;
  }

  // تا وقتی درخواست در راه است وضعیت برعکس نشان داده می‌شود تا کلیک بی‌درنگ
  // دیده شود؛ بعد از پاسخ، لیست تازه وضعیت واقعی را می‌نشاند.
  const active = toggle.isPending ? !isBookmarked : isBookmarked;

  const handleClick = (event: React.MouseEvent) => {
    // کارت‌ها داخل Link هستند؛ کلیک روی این دکمه نباید صفحه را عوض کند.
    event.preventDefault();
    event.stopPropagation();
    toggle.mutate({ type, itemId, bookmarked: isBookmarked });
  };

  return (
    <button
      type="button"
      data-sound="bookmark"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={active}
      aria-label={active ? "حذف از لیست من" : "ذخیره در لیست من"}
      title={active ? "حذف از لیست من" : "ذخیره در لیست من"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-300 disabled:opacity-60",
        showLabel ? "px-4 py-2 text-sm font-medium" : "size-9",
        active
          ? "border-mySecondary/40 bg-mySecondary/10 text-mySecondary scale-105"
          : "border-border bg-background/80 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Bookmark
        className={cn(
          "size-4 shrink-0 transition-transform duration-300",
          active && "fill-current scale-110"
        )}
      />
      {showLabel && <span>{active ? "ذخیره شد" : "ذخیره"}</span>}
    </button>
  );
};

export default BookmarkButton;
