/**
 * Dashboard Service
 * سرویس‌های مربوط به داشبورد ادمین
 */

import { prisma } from "@/lib/prisma";
import {
  DashboardStats,
  MonthlyPayments,
  WeeklyProfit,
  DeviceStats,
  Period,
} from "@/types/dashboard";

/**
 * محاسبه نرخ رشد
 */
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 1 : 0;
  return Number(((current - previous) / previous).toFixed(2));
}

/**
 * دریافت تاریخ شروع بر اساس دوره
 */
function getStartDate(period: Period): Date {
  const now = new Date();
  const date = new Date();

  switch (period) {
    case "monthly":
      date.setMonth(now.getMonth() - 1);
      break;
    case "yearly":
      date.setFullYear(now.getFullYear() - 1);
      break;
    case "this_week":
      date.setDate(now.getDate() - 7);
      break;
    case "last_week":
      date.setDate(now.getDate() - 14);
      break;
  }

  return date;
}

/**
 * تبدیل تاریخ میلادی به شمسی (ساده‌شده)
 * در پروژه واقعی از کتابخانه moment-jalaali استفاده کنید
 */
function toJalaliMonth(date: Date): string {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // تقریب ساده برای ماه شمسی
  const monthIndex = date.getMonth();
  return months[monthIndex];
}

/**
 * تبدیل تاریخ به نام روز شمسی
 */
function toJalaliDay(date: Date): string {
  const days = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];
  return days[date.getDay()];
}

/**
 * دریافت آمار کلی داشبورد
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  // آمار ماه جاری
  const [
    currentViews,
    currentRevenue,
    currentOrders,
    currentUsers,
  ] = await Promise.all([
    // مجموع بازدیدها از دوره‌ها و اخبار
    prisma.course.aggregate({
      _sum: { views: true },
      where: { updatedAt: { gte: lastMonth } },
    }),
    // مجموع درآمد (تراکنش‌های موفق)
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        type: "PAYMENT",
        createdAt: { gte: lastMonth },
      },
    }),
    // تعداد سفارشات پرداخت شده
    prisma.order.count({
      where: {
        status: "PAID",
        createdAt: { gte: lastMonth },
      },
    }),
    // تعداد کاربران جدید
    prisma.user.count({
      where: {
        createdAt: { gte: lastMonth },
      },
    }),
  ]);

  // آمار ماه قبل
  const [
    previousViews,
    previousRevenue,
    previousOrders,
    previousUsers,
  ] = await Promise.all([
    prisma.course.aggregate({
      _sum: { views: true },
      where: {
        updatedAt: { gte: twoMonthsAgo, lt: lastMonth },
      },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        type: "PAYMENT",
        createdAt: { gte: twoMonthsAgo, lt: lastMonth },
      },
    }),
    prisma.order.count({
      where: {
        status: "PAID",
        createdAt: { gte: twoMonthsAgo, lt: lastMonth },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: twoMonthsAgo, lt: lastMonth },
      },
    }),
  ]);

  return {
    totalViews: {
      value: currentViews._sum.views || 0,
      growthRate: calculateGrowthRate(
        currentViews._sum.views || 0,
        previousViews._sum.views || 0
      ),
    },
    totalRevenue: {
      value: currentRevenue._sum.amount || 0,
      growthRate: calculateGrowthRate(
        currentRevenue._sum.amount || 0,
        previousRevenue._sum.amount || 0
      ),
    },
    totalOrders: {
      value: currentOrders,
      growthRate: calculateGrowthRate(currentOrders, previousOrders),
    },
    totalUsers: {
      value: currentUsers,
      growthRate: calculateGrowthRate(currentUsers, previousUsers),
    },
  };
}

/**
 * دریافت داده‌های پرداخت ماهانه
 */
export async function getMonthlyPayments(
  period: "monthly" | "yearly"
): Promise<MonthlyPayments> {
  const now = new Date();
  const monthsCount = period === "yearly" ? 12 : 6;

  const months: string[] = [];
  const receivedAmount: number[] = [];
  const dueAmount: number[] = [];

  // تولید لیست ماه‌ها
  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - i);
    months.push(toJalaliMonth(date));
  }

  // محاسبه مبالغ دریافتی و معوق برای هر ماه
  for (let i = monthsCount - 1; i >= 0; i--) {
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - i);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // مبالغ دریافت شده
    const received = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        type: "PAYMENT",
        createdAt: { gte: startDate, lt: endDate },
      },
    });

    // مبالغ معوق (سفارشات پرداخت نشده)
    const due = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: "PENDING",
        createdAt: { gte: startDate, lt: endDate },
      },
    });

    receivedAmount.push(received._sum.amount || 0);
    dueAmount.push(due._sum.total || 0);
  }

  const totalReceived = receivedAmount.reduce((sum, val) => sum + val, 0);
  const totalDue = dueAmount.reduce((sum, val) => sum + val, 0);

  return {
    months,
    receivedAmount,
    dueAmount,
    totalReceived,
    totalDue,
  };
}

/**
 * دریافت داده‌های سود هفتگی
 */
export async function getWeeklyProfit(
  period: "this_week" | "last_week"
): Promise<WeeklyProfit> {
  const now = new Date();
  const startDate = new Date(now);

  if (period === "this_week") {
    startDate.setDate(now.getDate() - 6);
  } else {
    startDate.setDate(now.getDate() - 13);
  }

  const days: string[] = [];
  const sales: number[] = [];
  const revenue: number[] = [];

  // محاسبه برای 7 روز
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(toJalaliDay(date));

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // تعداد فروش
    const orderCount = await prisma.order.count({
      where: {
        status: "PAID",
        createdAt: { gte: dayStart, lte: dayEnd },
      },
    });

    // مجموع درآمد
    const revenueSum = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        type: "PAYMENT",
        createdAt: { gte: dayStart, lte: dayEnd },
      },
    });

    sales.push(orderCount);
    revenue.push(revenueSum._sum.amount || 0);
  }

  return { days, sales, revenue };
}

/**
 * دریافت آمار دستگاه‌ها
 * توجه: در حالت واقعی باید از Google Analytics یا ابزار tracking استفاده شود
 * اینجا یک مثال ساده با داده‌های شبیه‌سازی شده است
 */
export async function getDeviceStats(
  period: "monthly" | "yearly"
): Promise<DeviceStats> {
  const startDate = getStartDate(period);

  // در پروژه واقعی، این داده‌ها باید از یک جدول تحلیلی یا سرویس tracking بیایند
  // اینجا داده‌های نمونه برگردانده می‌شوند

  // تعداد کل بازدیدکنندگان (بر اساس تعداد کاربران فعال)
  const totalVisitors = await prisma.user.count({
    where: {
      createdAt: { gte: startDate },
    },
  });

  // شبیه‌سازی توزیع دستگاه‌ها بر اساس آمار معمول
  const desktop = Math.round(totalVisitors * 0.45); // 45%
  const mobile = Math.round(totalVisitors * 0.40); // 40%
  const tablet = Math.round(totalVisitors * 0.10); // 10%
  const unknown = totalVisitors - desktop - mobile - tablet; // باقیمانده

  return {
    desktop,
    tablet,
    mobile,
    unknown: Math.max(0, unknown),
    totalVisitors,
  };
}

/**
 * کش ساده برای داشبورد (5 دقیقه)
 */
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 دقیقه

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedData(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/* ------------------------------------------------------------------ */
/* CRM Analytics                                                       */
/* آمار تحلیلی مربوط به بخش CRM (قیف فروش، سرنخ‌ها، تیکت‌های پشتیبانی) */
/* ------------------------------------------------------------------ */

/**
 * یک مرحله از قیف فروش به همراه تعداد و مبلغ معاملات آن مرحله
 */
export interface CrmPipelineFunnelStage {
  stageId: string;
  name: string;
  order: number;
  isWon: boolean;
  isLost: boolean;
  dealCount: number;
  totalAmount: number;
}

export type CrmPipelineFunnel = CrmPipelineFunnelStage[];

/**
 * دوره زمانی برای آمار تبدیل سرنخ‌ها
 */
export type CrmLeadConversionPeriod = "monthly" | "weekly";

export interface CrmLeadStatusCount {
  status: string;
  count: number;
}

export interface CrmLeadConversionStats {
  period: CrmLeadConversionPeriod;
  statusCounts: CrmLeadStatusCount[];
  total: number;
  convertedCount: number;
  /** درصد تبدیل سرنخ به مشتری (0 تا 100) */
  conversionRate: number;
}

export interface CrmTicketStatusCount {
  status: string;
  count: number;
}

export interface CrmTicketStats {
  statusCounts: CrmTicketStatusCount[];
  total: number;
  resolvedCount: number;
  /** میانگین زمان حل تیکت بر حسب ساعت (فقط تیکت‌های دارای resolvedAt) */
  avgResolutionHours: number;
}

/**
 * دریافت قیف فروش: تعداد و مجموع مبلغ معاملات به تفکیک مرحله pipeline
 * مرحله‌ها بر اساس فیلد order مرتب می‌شوند
 */
export async function getCrmPipelineFunnel(): Promise<CrmPipelineFunnel> {
  const cacheKey = "crm-pipeline-funnel";
  const cached = getCachedData<CrmPipelineFunnel>(cacheKey);
  if (cached) return cached;

  const [stages, dealAggregates] = await Promise.all([
    prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.deal.groupBy({
      by: ["stageId"],
      _count: { _all: true },
      _sum: { amount: true },
    }),
  ]);

  const aggByStage = new Map(dealAggregates.map((agg) => [agg.stageId, agg]));

  const result: CrmPipelineFunnel = stages.map((stage) => {
    const agg = aggByStage.get(stage.id);
    return {
      stageId: stage.id,
      name: stage.name,
      order: stage.order,
      isWon: stage.isWon,
      isLost: stage.isLost,
      dealCount: agg?._count._all ?? 0,
      totalAmount: agg?._sum.amount ?? 0,
    };
  });

  setCachedData(cacheKey, result);
  return result;
}

/**
 * دریافت آمار وضعیت سرنخ‌ها (Lead) به همراه نرخ تبدیل
 * @param period بازه زمانی: monthly (30 روز اخیر) یا weekly (7 روز اخیر)
 */
export async function getLeadConversionStats(
  period: CrmLeadConversionPeriod
): Promise<CrmLeadConversionStats> {
  const cacheKey = `crm-lead-conversion-${period}`;
  const cached = getCachedData<CrmLeadConversionStats>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const startDate = new Date(now);
  if (period === "weekly") {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setMonth(now.getMonth() - 1);
  }

  const statusGroups = await prisma.lead.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: { createdAt: { gte: startDate } },
  });

  const statusCounts: CrmLeadStatusCount[] = statusGroups.map((group) => ({
    status: group.status,
    count: group._count._all,
  }));

  const total = statusCounts.reduce((sum, item) => sum + item.count, 0);
  const convertedCount =
    statusCounts.find((item) => item.status === "CONVERTED")?.count ?? 0;
  const conversionRate =
    total > 0 ? Number(((convertedCount / total) * 100).toFixed(1)) : 0;

  const result: CrmLeadConversionStats = {
    period,
    statusCounts,
    total,
    convertedCount,
    conversionRate,
  };

  setCachedData(cacheKey, result);
  return result;
}

/**
 * دریافت آمار تیکت‌های پشتیبانی: توزیع وضعیت‌ها و میانگین زمان حل تیکت
 */
export async function getTicketStats(): Promise<CrmTicketStats> {
  const cacheKey = "crm-ticket-stats";
  const cached = getCachedData<CrmTicketStats>(cacheKey);
  if (cached) return cached;

  const [statusGroups, resolvedTickets] = await Promise.all([
    prisma.supportTicket.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.supportTicket.findMany({
      where: { resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    }),
  ]);

  const statusCounts: CrmTicketStatusCount[] = statusGroups.map((group) => ({
    status: group.status,
    count: group._count._all,
  }));

  const total = statusCounts.reduce((sum, item) => sum + item.count, 0);

  // محاسبه میانگین زمان حل تیکت در جاوااسکریپت (نه با AVG در دیتابیس)
  const resolutionHours = resolvedTickets
    .filter((ticket): ticket is typeof ticket & { resolvedAt: Date } => ticket.resolvedAt !== null)
    .map(
      (ticket) =>
        (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) /
        (1000 * 60 * 60)
    );

  const avgResolutionHours =
    resolutionHours.length > 0
      ? Number(
          (
            resolutionHours.reduce((sum, hours) => sum + hours, 0) /
            resolutionHours.length
          ).toFixed(1)
        )
      : 0;

  const result: CrmTicketStats = {
    statusCounts,
    total,
    resolvedCount: resolutionHours.length,
    avgResolutionHours,
  };

  setCachedData(cacheKey, result);
  return result;
}
