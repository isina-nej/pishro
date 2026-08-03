/**
 * Type Definitions for Bookmark API Responses
 */

import type { BookmarkType } from "@/lib/schemas/bookmark-schema";

/**
 * شکل یکدست یک آیتم نشان‌شده. نگاشت از دوره/خبر/کتاب به این شکل در روت
 * `/api/user/bookmarks` انجام می‌شود تا کارت پنل لازم نباشد سه مدل مختلف را
 * بشناسد.
 */
export interface BookmarkItem {
  /** شناسهٔ خود نشان (نه آیتم) */
  id: string;
  type: BookmarkType;
  /** شناسهٔ دوره/خبر/کتاب — برای حذف نشان از همین استفاده می‌شود */
  itemId: string;
  title: string;
  image: string | null;
  href: string;
  /** خط دوم کارت: مدرس دوره، نویسندهٔ خبر یا نویسندهٔ کتاب */
  subtitle: string | null;
  /** برچسب دسته‌بندی، اگر آیتم داشته باشد */
  badge: string | null;
  createdAt: string;
}

export interface BookmarkListResponse {
  items: BookmarkItem[];
}
