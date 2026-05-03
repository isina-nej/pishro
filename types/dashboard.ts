/**
 * Dashboard Types
 * تایپ‌های مربوط به داشبورد ادمین
 */

/**
 * نوع دوره زمانی
 */
export type Period = "monthly" | "yearly" | "this_week" | "last_week";

/**
 * آمار با نرخ رشد
 */
export interface StatWithGrowth {
  value: number;
  growthRate: number; // 0.43 = 43%
}

/**
 * آمار کلی داشبورد
 */
export interface DashboardStats {
  totalViews: StatWithGrowth;
  totalRevenue: StatWithGrowth;
  totalOrders: StatWithGrowth;
  totalUsers: StatWithGrowth;
}

/**
 * داده‌های پرداخت ماهانه
 */
export interface MonthlyPayments {
  months: string[];
  receivedAmount: number[];
  dueAmount: number[];
  totalReceived: number;
  totalDue: number;
}

/**
 * داده‌های سود هفتگی
 */
export interface WeeklyProfit {
  days: string[];
  sales: number[];
  revenue: number[];
}

/**
 * آمار دستگاه‌ها
 */
export interface DeviceStats {
  desktop: number;
  tablet: number;
  mobile: number;
  unknown: number;
  totalVisitors: number;
}
