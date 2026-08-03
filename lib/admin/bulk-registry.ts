// @/lib/admin/bulk-registry.ts
// رجیستری موجودیت‌های پنل ادمین برای عملیات گروهی (آرشیو/فعال‌سازی/حذف)
//
// چرا رجیستری و نه یک روت به‌ازای هر بخش:
//   ده صفحه‌ی لیست داریم و همه دقیقاً یک کار را می‌کنند — چند شناسه بگیر، یک
//   وضعیت را عوض کن یا حذف کن، و در لاگ ثبتش کن. با توصیف تفاوت‌ها به‌صورت
//   داده، یک روت (`app/api/admin/bulk/route.ts`) همه را پوشش می‌دهد و افزودن
//   بخش بعدی فقط یک ورودی در این جدول است، نه یک فایل جدید.
//
// نکته درباره‌ی «آرشیو»: بعضی مدل‌ها وضعیت طبیعی دارند (Course.status،
// DigitalBook.bookStatus، NewsArticle.published) و بعضی نداشتند، که برایشان
// `archivedAt` اضافه شد. این تفاوت اینجا پنهان می‌شود تا بقیه‌ی کد نفهمد.

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** عملیاتی که روی یک انتخاب گروهی قابل اجراست */
export type BulkAction = "archive" | "activate" | "delete";

type PrismaDelegateKey =
  | "newsArticle"
  | "course"
  | "digitalBook"
  | "user"
  | "lead"
  | "deal"
  | "supportTicket"
  | "customerSegment"
  | "investmentFund";

export interface EntityConfig {
  /** نام مدل در Prisma Client */
  delegate: PrismaDelegateKey;
  /** نامی که در لاگ و پیام‌ها به کاربر نشان داده می‌شود */
  label: string;
  /** نام مدل در دیتابیس، برای ستون entityType در AuditLog */
  entityType: string;
  /** ستون‌هایی که برای ساختن عنوان خوانا خوانده می‌شوند */
  labelFields: string[];
  /** ساخت عنوان خوانا از یک ردیف */
  toLabel: (row: Record<string, unknown>) => string;
  /** مقادیری که ردیف را آرشیو می‌کند */
  archiveData: Prisma.InputJsonObject | Record<string, unknown>;
  /** مقادیری که ردیف را به حالت فعال برمی‌گرداند */
  activateData: Record<string, unknown>;
  /**
   * آیا حذف واقعی مجاز است.
   * برای User عمداً false است: کاربر به سفارش، تراکنش و ثبت‌نام دوره وصل است و
   * حذفش یا با کلید خارجی شکست می‌خورد یا سابقه‌ی مالی را می‌برد. آرشیو کافی است.
   */
  allowDelete: boolean;
}

const joinName = (row: Record<string, unknown>, fallbackKey = "phone"): string => {
  const first = (row.firstName as string | null) ?? "";
  const last = (row.lastName as string | null) ?? "";
  const full = `${first} ${last}`.trim();
  return full || String(row[fallbackKey] ?? "بدون نام");
};

const text = (row: Record<string, unknown>, key: string): string =>
  String(row[key] ?? "بدون عنوان");

export const ENTITY_REGISTRY = {
  news: {
    delegate: "newsArticle",
    label: "خبر",
    entityType: "NewsArticle",
    labelFields: ["title"],
    toLabel: (r) => text(r, "title"),
    // draft=false تا خبرِ آرشیوشده دوباره در فهرست پیش‌نویس‌ها ظاهر نشود
    archiveData: { published: false, draft: false },
    activateData: { published: true, draft: false },
    allowDelete: true,
  },
  course: {
    delegate: "course",
    label: "دوره",
    entityType: "Course",
    labelFields: ["subject"],
    toLabel: (r) => text(r, "subject"),
    archiveData: { status: "ARCHIVED", published: false },
    activateData: { status: "ACTIVE", published: true },
    allowDelete: true,
  },
  book: {
    delegate: "digitalBook",
    label: "کتاب",
    entityType: "DigitalBook",
    labelFields: ["title"],
    toLabel: (r) => text(r, "title"),
    archiveData: { bookStatus: "ARCHIVED" },
    activateData: { bookStatus: "PUBLISHED" },
    allowDelete: true,
  },
  fund: {
    delegate: "investmentFund",
    label: "صندوق سرمایه‌گذاری",
    entityType: "InvestmentFund",
    labelFields: ["name"],
    toLabel: (r) => text(r, "name"),
    archiveData: { active: false },
    activateData: { active: true },
    allowDelete: true,
  },
  customer: {
    delegate: "user",
    label: "مشتری",
    entityType: "User",
    labelFields: ["firstName", "lastName", "phone"],
    toLabel: (r) => joinName(r),
    archiveData: { archivedAt: new Date() },
    activateData: { archivedAt: null },
    allowDelete: false,
  },
  lead: {
    delegate: "lead",
    label: "سرنخ",
    entityType: "Lead",
    labelFields: ["firstName", "lastName", "phone"],
    toLabel: (r) => joinName(r),
    archiveData: { archivedAt: new Date() },
    activateData: { archivedAt: null },
    allowDelete: true,
  },
  deal: {
    delegate: "deal",
    label: "معامله",
    entityType: "Deal",
    labelFields: ["title"],
    toLabel: (r) => text(r, "title"),
    archiveData: { archivedAt: new Date() },
    activateData: { archivedAt: null },
    allowDelete: true,
  },
  ticket: {
    delegate: "supportTicket",
    label: "تیکت",
    entityType: "SupportTicket",
    labelFields: ["subject"],
    toLabel: (r) => text(r, "subject"),
    archiveData: { archivedAt: new Date() },
    activateData: { archivedAt: null },
    allowDelete: true,
  },
  segment: {
    delegate: "customerSegment",
    label: "بخش مشتریان",
    entityType: "CustomerSegment",
    labelFields: ["name"],
    toLabel: (r) => text(r, "name"),
    archiveData: { archivedAt: new Date() },
    activateData: { archivedAt: null },
    allowDelete: true,
  },
} as const satisfies Record<string, EntityConfig>;

export type EntityKey = keyof typeof ENTITY_REGISTRY;

export const ENTITY_KEYS = Object.keys(ENTITY_REGISTRY) as EntityKey[];

export function isEntityKey(value: string): value is EntityKey {
  return value in ENTITY_REGISTRY;
}

export function getEntityConfig(key: EntityKey): EntityConfig {
  return ENTITY_REGISTRY[key];
}

/**
 * دسترسی به delegate مربوطه در Prisma Client.
 *
 * تایپ خروجی عمداً باز است: نُه delegate مختلف امضاهای متفاوت دارند و تلاش برای
 * یکی کردنشان در سطح تایپ، چیزی به ایمنی زمان اجرا اضافه نمی‌کند — کلید از
 * همین رجیستری می‌آید و ورودی کاربر با isEntityKey اعتبارسنجی شده است.
 */
export function getDelegate(config: EntityConfig) {
  return prisma[config.delegate] as unknown as {
    findMany: (args: unknown) => Promise<Record<string, unknown>[]>;
    updateMany: (args: unknown) => Promise<{ count: number }>;
    deleteMany: (args: unknown) => Promise<{ count: number }>;
  };
}
