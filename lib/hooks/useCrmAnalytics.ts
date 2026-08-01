/**
 * useCrmAnalytics
 * هوک‌های React Query برای آمار تحلیلی CRM (قیف فروش، تبدیل سرنخ‌ها، تیکت‌های پشتیبانی)
 */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  CrmPipelineFunnel,
  CrmLeadConversionStats,
  CrmLeadConversionPeriod,
  CrmTicketStats,
} from "@/lib/services/dashboard-service";

// ===========================
// Query Keys
// ===========================
export const crmAnalyticsKeys = {
  all: ["crm-analytics"] as const,
  pipelineFunnel: () => [...crmAnalyticsKeys.all, "pipeline-funnel"] as const,
  leadConversion: (period: CrmLeadConversionPeriod) =>
    [...crmAnalyticsKeys.all, "lead-conversion", period] as const,
  ticketStats: () => [...crmAnalyticsKeys.all, "ticket-stats"] as const,
};

// دیتای داشبورد CRM هر ۵ دقیقه در سرویس کش می‌شود، staleTime هماهنگ با همان TTL
const CRM_ANALYTICS_STALE_TIME = 5 * 60 * 1000; // 5 دقیقه

/**
 * Hook برای دریافت قیف فروش (تعداد و مبلغ معاملات به تفکیک مرحله pipeline)
 */
export function useCrmPipelineFunnel() {
  return useQuery({
    queryKey: crmAnalyticsKeys.pipelineFunnel(),
    queryFn: async () => {
      const { data } = await api.get("/api/admin/crm/analytics/pipeline-funnel");
      return data.data as CrmPipelineFunnel;
    },
    staleTime: CRM_ANALYTICS_STALE_TIME,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook برای دریافت آمار وضعیت سرنخ‌ها و نرخ تبدیل
 */
export function useLeadConversionStats(period: CrmLeadConversionPeriod = "monthly") {
  return useQuery({
    queryKey: crmAnalyticsKeys.leadConversion(period),
    queryFn: async () => {
      const { data } = await api.get(
        `/api/admin/crm/analytics/lead-conversion?period=${period}`
      );
      return data.data as CrmLeadConversionStats;
    },
    staleTime: CRM_ANALYTICS_STALE_TIME,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook برای دریافت آمار تیکت‌های پشتیبانی
 */
export function useTicketStats() {
  return useQuery({
    queryKey: crmAnalyticsKeys.ticketStats(),
    queryFn: async () => {
      const { data } = await api.get("/api/admin/crm/analytics/ticket-stats");
      return data.data as CrmTicketStats;
    },
    staleTime: CRM_ANALYTICS_STALE_TIME,
    gcTime: 30 * 60 * 1000,
  });
}
