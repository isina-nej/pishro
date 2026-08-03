/**
 * GET /api/admin/logs — خواندن گزارش فعالیت‌های پنل
 *
 * پارامترها: page, limit, action, entityType, adminId, search, from, to
 * با `?options=1` به‌جای فهرست، مقادیر موجود برای فیلترها برگردانده می‌شود.
 */

import type { AuditAction } from "@prisma/client";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  getAuditLogs,
  getAuditFilterOptions,
  type AuditLogFilters,
} from "@/lib/services/audit-log-service";

const VALID_ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "ARCHIVE",
  "RESTORE",
  "PUBLISH",
  "UNPUBLISH",
  "LOGIN",
  "LOGIN_FAILED",
  "LOGOUT",
] as const;

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(req: Request) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "ورود به سیستم الزامی است",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    // گزارش نشان می‌دهد چه کسی چه کرده — دیدنش منحصر به مدیران است
    if (adminAuth.role !== "ADMIN") {
      return errorResponse(
        "دسترسی منحصر به مدیران است",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const { searchParams } = new URL(req.url);

    if (searchParams.get("options") === "1") {
      return successResponse(await getAuditFilterOptions());
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50)
    );

    const actionParam = searchParams.get("action");
    const filters: AuditLogFilters = {
      action:
        actionParam && (VALID_ACTIONS as readonly string[]).includes(actionParam)
          ? (actionParam as AuditAction)
          : undefined,
      entityType: searchParams.get("entityType") || undefined,
      adminId: searchParams.get("adminId") || undefined,
      search: searchParams.get("search") || undefined,
      from: parseDate(searchParams.get("from")),
      to: parseDate(searchParams.get("to")),
    };

    const { items, pagination } = await getAuditLogs(page, limit, filters);

    return paginatedResponse(
      items,
      pagination.page,
      pagination.limit,
      pagination.total,
      "گزارش با موفقیت بارگذاری شد"
    );
  } catch (error) {
    console.error("[GET /api/admin/logs] Error:", error);
    return errorResponse(
      "خطا در بارگذاری گزارش",
      ErrorCodes.DATABASE_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
