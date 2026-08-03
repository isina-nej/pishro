/**
 * POST /api/admin/bulk — اجرای عملیات گروهی روی چند رکورد
 *
 * یک روت برای همه‌ی بخش‌های پنل. تفاوت موجودیت‌ها در
 * `lib/admin/bulk-registry.ts` توصیف شده، پس افزودن بخش جدید نیازی به روت
 * جدید ندارد.
 *
 * بدنه: { entity: "news", action: "archive", ids: ["..."] }
 */

import type { AuditAction } from "@prisma/client";
import { z } from "zod";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  ENTITY_KEYS,
  getDelegate,
  getEntityConfig,
  isEntityKey,
  type BulkAction,
} from "@/lib/admin/bulk-registry";
import {
  recordAuditMany,
  requestMeta,
  resolveAdminName,
} from "@/lib/services/audit-log-service";

const BulkRequestSchema = z.object({
  entity: z.string().min(1, "نوع رکورد الزامی است"),
  action: z.enum(["archive", "activate", "delete"], {
    message: "عملیات نامعتبر است",
  }),
  // سقف ۵۰۰ تا: یک updateMany/deleteMany بزرگ‌تر از این روی MySQL قفل طولانی
  // می‌سازد و درخواست هم به تایم‌اوت می‌خورد.
  ids: z
    .array(z.string().min(1))
    .min(1, "حداقل یک رکورد باید انتخاب شود")
    .max(500, "حداکثر ۵۰۰ رکورد در هر عملیات"),
});

const AUDIT_ACTION: Record<BulkAction, AuditAction> = {
  archive: "ARCHIVE",
  activate: "RESTORE",
  delete: "DELETE",
};

export async function POST(req: Request) {
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

    if (adminAuth.role !== "ADMIN") {
      return errorResponse(
        "دسترسی منحصر به مدیران است",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const parsed = BulkRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues[0]?.message ?? "درخواست نامعتبر است",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    const { entity, action, ids } = parsed.data;

    if (!isEntityKey(entity)) {
      return errorResponse(
        `نوع رکورد پشتیبانی نمی‌شود. مقادیر مجاز: ${ENTITY_KEYS.join("، ")}`,
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    const config = getEntityConfig(entity);

    if (action === "delete" && !config.allowDelete) {
      return errorResponse(
        `حذف ${config.label} مجاز نیست؛ از آرشیو استفاده کنید`,
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const delegate = getDelegate(config);

    // عنوان‌ها را *قبل* از تغییر می‌خوانیم — بعد از حذف دیگر چیزی برای خواندن
    // نمانده، و لاگِ حذف بدون عنوان عملاً بی‌فایده است.
    const select = Object.fromEntries(
      ["id", ...config.labelFields].map((f) => [f, true])
    );
    const rows = await delegate.findMany({ where: { id: { in: ids } }, select });

    if (rows.length === 0) {
      return errorResponse(
        "هیچ‌کدام از رکوردهای انتخاب‌شده پیدا نشد",
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }

    const foundIds = rows.map((r) => String(r.id));

    let affected: number;
    if (action === "delete") {
      ({ count: affected } = await delegate.deleteMany({
        where: { id: { in: foundIds } },
      }));
    } else {
      const data = action === "archive" ? config.archiveData : config.activateData;
      ({ count: affected } = await delegate.updateMany({
        where: { id: { in: foundIds } },
        data,
      }));
    }

    const { ip, userAgent } = requestMeta(req);
    const adminName = await resolveAdminName(adminAuth.id, adminAuth.phone);
    await recordAuditMany(
      rows.map((row) => ({
        action: AUDIT_ACTION[action],
        entityType: config.entityType,
        entityId: String(row.id),
        entityLabel: config.toLabel(row),
        adminId: adminAuth.id,
        adminName,
        batchSize: rows.length,
        ip,
        userAgent,
      }))
    );

    // اختلاف بین درخواست و یافته‌ها را برمی‌گردانیم تا رابط کاربری بتواند
    // «۳ از ۵ رکورد» را صادقانه نشان دهد به‌جای ادعای موفقیت کامل.
    const missing = ids.length - rows.length;

    return successResponse(
      { affected, requested: ids.length, missing },
      missing > 0
        ? `${affected} ${config.label} پردازش شد؛ ${missing} مورد پیدا نشد`
        : `${affected} ${config.label} با موفقیت پردازش شد`
    );
  } catch (error) {
    console.error("[POST /api/admin/bulk] Error:", error);

    // نقض کلید خارجی یعنی رکورد هنوز وابسته دارد — این خطای کاربر است نه سرور
    if (
      error instanceof Error &&
      (error.message.includes("Foreign key constraint") ||
        (error as { code?: string }).code === "P2003")
    ) {
      return errorResponse(
        "این رکوردها به داده‌های دیگری وابسته‌اند و قابل حذف نیستند؛ آرشیوشان کنید",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    return errorResponse(
      "خطا در اجرای عملیات گروهی",
      ErrorCodes.DATABASE_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
