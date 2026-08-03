// @/lib/services/bookmark-service.ts
// لایهٔ شبکهٔ نشان‌شده‌های کاربر؛ هوک‌های lib/hooks/useBookmarks.ts از اینجا صدا می‌زنند

import axios from "axios";
import type { ApiResponse } from "@/lib/api-response";
import type { BookmarkType } from "@/lib/schemas/bookmark-schema";
import type { BookmarkItem, BookmarkListResponse } from "@/lib/types/bookmark";

export interface BookmarkTargetInput {
  type: BookmarkType;
  itemId: string;
}

/** GET /api/user/bookmarks */
export async function getBookmarks(): Promise<BookmarkItem[]> {
  const { data } = await axios.get<ApiResponse<BookmarkListResponse>>(
    "/api/user/bookmarks"
  );

  if (data.status !== "success") {
    throw new Error("دریافت لیست نشان‌شده‌ها ناموفق بود");
  }

  return (data.data as BookmarkListResponse).items;
}

/** POST /api/user/bookmarks */
export async function addBookmark(target: BookmarkTargetInput): Promise<void> {
  await axios.post("/api/user/bookmarks", target);
}

/** DELETE /api/user/bookmarks */
export async function removeBookmark(target: BookmarkTargetInput): Promise<void> {
  // axios.delete بدنه را فقط از طریق config می‌فرستد
  await axios.delete("/api/user/bookmarks", { data: target });
}
