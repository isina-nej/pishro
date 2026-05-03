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
