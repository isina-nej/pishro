// @/lib/utils/api-error.ts
// استخراج پیام خطای قابل نمایش از خطاهای axios و خطاهای عمومی

import { isAxiosError } from "axios";

/** بدنه‌ی خطایی که API این پروژه برمی‌گرداند (JSend envelope) */
interface ApiErrorBody {
  message?: string;
}

/**
 * پیام خطای مناسب نمایش به کاربر را از یک خطای ناشناخته بیرون می‌کشد.
 *
 * Replaces the `error?.response?.data?.message || "..."` pattern that is
 * repeated across the hooks, without typing the error as `any`.
 *
 * @param error - خطای گرفته‌شده در catch یا onError
 * @param fallback - پیام پیش‌فرض فارسی در صورت نبود پیام از سمت سرور
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
