import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  type BookmarkTargetInput,
} from "@/lib/services/bookmark-service";
import type { BookmarkType } from "@/lib/schemas/bookmark-schema";
import type { BookmarkItem } from "@/lib/types/bookmark";

// ===========================
// Query Keys
// ===========================
export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  list: () => [...bookmarkKeys.all, "list"] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Hook برای دریافت همهٔ نشان‌شده‌های کاربر.
 *
 * لیست عمداً یک‌جا و بدون صفحه‌بندی گرفته می‌شود: هم پنل کاربر و هم دکمهٔ نشان
 * روی کارت‌ها از همین یک کش می‌خوانند، پس هر صفحه فقط یک درخواست می‌زند.
 * برای کاربر مهمان اصلاً اجرا نمی‌شود تا ۴۰۱ بی‌مورد نگیریم.
 */
export function useBookmarks() {
  const { status } = useSession();

  const query = useQuery<BookmarkItem[]>({
    queryKey: bookmarkKeys.list(),
    queryFn: getBookmarks,
    enabled: status === "authenticated",
    staleTime: 2 * 60 * 1000, // 2 دقیقه fresh - کاربر خودش تغییرش می‌دهد
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    // کوئری غیرفعال در React Query در حالت pending می‌ماند ولی isLoading نمی‌دهد؛
    // بدون این، تا وقتی سشن در حال خواندن است حالت «چیزی ذخیره نکرده‌ای» یک
    // لحظه ظاهر می‌شود.
    isLoading: status === "loading" || query.isLoading,
  };
}

/**
 * Hook برای اینکه بدانیم یک آیتم مشخص نشان شده یا نه.
 * از همان کش لیست می‌خواند و درخواست جداگانه‌ای نمی‌زند.
 */
export function useIsBookmarked(type: BookmarkType, itemId: string) {
  const { data, isLoading } = useBookmarks();

  return {
    isBookmarked: Boolean(
      data?.some((item) => item.type === type && item.itemId === itemId)
    ),
    isLoading,
  };
}

// ===========================
// Mutations
// ===========================

/**
 * Hook برای نشان‌کردن/برداشتن نشان یک آیتم.
 *
 * `bookmarked` وضعیت *فعلی* آیتم است؛ هوک خودش تصمیم می‌گیرد اضافه کند یا حذف.
 */
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarked,
      ...target
    }: BookmarkTargetInput & { bookmarked: boolean }) =>
      bookmarked ? removeBookmark(target) : addBookmark(target),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      toast.success(
        variables.bookmarked ? "از لیست شما حذف شد" : "به لیست شما اضافه شد"
      );
    },
    onError: (error: unknown) => {
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;

      toast.error(
        status === 401
          ? "برای ذخیره‌کردن باید وارد حساب کاربری شوید"
          : "خطایی رخ داد، دوباره تلاش کنید"
      );
    },
  });
}
