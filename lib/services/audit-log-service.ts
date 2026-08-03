// @/lib/services/audit-log-service.ts
// ثبت و خواندن گزارش فعالیت‌های پنل ادمین

import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface RecordAuditInput {
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  adminId?: string | null;
  adminName?: string | null;
  batchSize?: number | null;
  meta?: Prisma.InputJsonValue;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * ثبت یک رویداد در گزارش.
 *
 * عمداً هیچ‌وقت throw نمی‌کند: لاگ‌گیری نباید عملیاتی را که موفق شده بشکند.
 * اگر نوشتن لاگ خطا داد فقط در کنسول ثبت می‌شود — بهتر از این است که ادمین
 * پیام شکست ببیند در حالی که تغییرش واقعاً اعمال شده.
 */
export async function recordAudit(input: RecordAuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        entityLabel: input.entityLabel ?? null,
        adminId: input.adminId ?? null,
        adminName: input.adminName ?? null,
        batchSize: input.batchSize ?? null,
        meta: input.meta,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] failed to record entry:", error);
  }
}

/** ثبت چند رویداد با هم — برای عملیات گروهی، یک ردیف به ازای هر رکورد */
export async function recordAuditMany(entries: RecordAuditInput[]): Promise<void> {
  if (entries.length === 0) return;
  try {
    await prisma.auditLog.createMany({
      data: entries.map((e) => ({
        action: e.action,
        entityType: e.entityType,
        entityId: e.entityId ?? null,
        entityLabel: e.entityLabel ?? null,
        adminId: e.adminId ?? null,
        adminName: e.adminName ?? null,
        batchSize: e.batchSize ?? null,
        meta: e.meta === undefined ? undefined : (e.meta as Prisma.InputJsonValue),
        ip: e.ip ?? null,
        userAgent: e.userAgent ?? null,
      })),
    });
  } catch (error) {
    console.error("[audit] failed to record batch:", error);
  }
}

export interface AuditLogFilters {
  action?: AuditAction;
  entityType?: string;
  adminId?: string;
  search?: string;
  from?: Date;
  to?: Date;
}

/** خواندن گزارش با فیلتر و صفحه‌بندی */
export async function getAuditLogs(
  page = 1,
  limit = 50,
  filters: AuditLogFilters = {}
) {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters.action) where.action = filters.action;
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.adminId) where.adminId = filters.adminId;

  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    };
  }

  if (filters.search) {
    where.OR = [
      { entityLabel: { contains: filters.search } },
      { adminName: { contains: filters.search } },
      { entityId: { contains: filters.search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { admin: { select: { id: true, name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/** فهرست مقادیر موجود برای پر کردن فیلترهای صفحه‌ی گزارش */
export async function getAuditFilterOptions() {
  const [entityTypes, admins] = await Promise.all([
    prisma.auditLog.findMany({
      distinct: ["entityType"],
      select: { entityType: true },
      orderBy: { entityType: "asc" },
    }),
    prisma.auditLog.findMany({
      where: { adminId: { not: null } },
      distinct: ["adminId"],
      select: { adminId: true, adminName: true },
      orderBy: { adminName: "asc" },
    }),
  ]);

  return {
    entityTypes: entityTypes.map((e) => e.entityType),
    admins: admins
      .filter((a) => a.adminId)
      .map((a) => ({ id: a.adminId as string, name: a.adminName ?? "نامشخص" })),
  };
}

/**
 * نام ادمین برای ذخیره به‌صورت snapshot.
 *
 * `getAdminAuth` فقط id/phone/role را از توکن می‌دهد، ولی گزارش باید نام
 * خوانا نشان دهد — و باید بعد از حذف حساب ادمین هم خوانا بماند، که رابطه‌ی
 * کلید خارجی به‌تنهایی تضمینش نمی‌کند.
 */
export async function resolveAdminName(
  adminId: string,
  fallback?: string | null
): Promise<string> {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
      select: { name: true },
    });
    if (admin?.name) return admin.name;
  } catch (error) {
    console.error("[audit] failed to resolve admin name:", error);
  }
  return fallback || adminId;
}

/** استخراج IP و User-Agent از درخواست، برای ثبت در لاگ */
export function requestMeta(req: Request): { ip: string | null; userAgent: string | null } {
  const forwarded = req.headers.get("x-forwarded-for");
  return {
    // پشت nginx مقدار x-forwarded-for می‌تواند زنجیره باشد؛ اولی همان کلاینت است
    ip: forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip"),
    userAgent: req.headers.get("user-agent"),
  };
}
