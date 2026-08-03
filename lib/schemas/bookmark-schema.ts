// @/lib/schemas/bookmark-schema.ts
// اعتبارسنجی درخواست‌های نشان‌کردن آیتم‌ها (دوره، خبر، کتاب) برای پنل کاربر

import { z } from "zod";

/** انواع آیتمی که کاربر می‌تواند نشان کند */
export const BOOKMARK_TYPES = ["course", "news", "book"] as const;

export type BookmarkType = (typeof BOOKMARK_TYPES)[number];

/**
 * ستون جدول Bookmark که هر نوع آیتم در آن ذخیره می‌شود.
 * نگاشت اینجا متمرکز است تا مسیرها و سرویس‌ها نام ستون را دوباره ننویسند.
 */
export const BOOKMARK_COLUMN: Record<BookmarkType, "courseId" | "newsArticleId" | "digitalBookId"> = {
  course: "courseId",
  news: "newsArticleId",
  book: "digitalBookId",
};

export const BookmarkTargetSchema = z.object({
  type: z.enum(BOOKMARK_TYPES, {
    errorMap: () => ({ message: "نوع آیتم باید یکی از course، news یا book باشد" }),
  }),
  itemId: z.string().trim().min(1, "شناسه آیتم الزامی است"),
});

export type BookmarkTarget = z.infer<typeof BookmarkTargetSchema>;
