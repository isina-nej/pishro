import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { LeadActivityCreateInput, LeadCreateInput, LeadUpdateInput } from "@/lib/schemas/crm-lead-schema";
import type { PaginationMeta } from "@/lib/api-response";

export type CrmLeadSource = "WEBSITE" | "REFERRAL" | "ADS" | "SOCIAL" | "PHONE" | "OTHER";
export type CrmLeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export interface CrmLeadListItem {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  email: string | null;
  source: CrmLeadSource;
  status: CrmLeadStatus;
  score: number | null;
  notes: string | null;
  assignedToId: string | null;
  assignedTo: { id: string; name: string; email: string } | null;
  _count: { deals: number; activities: number };
  createdAt: string;
  updatedAt: string;
}

export interface CrmLeadActivity {
  id: string;
  type: "NOTE" | "CALL" | "EMAIL" | "MEETING" | "STATUS_CHANGE" | "SYSTEM";
  content: string;
  adminId: string | null;
  admin: { id: string; name: string } | null;
  createdAt: string;
}

export interface CrmLeadDetail extends CrmLeadListItem {
  convertedUserId: string | null;
  convertedUser: { id: string; firstName: string | null; lastName: string | null; phone: string } | null;
  deals: Array<{ id: string; title: string; amount: number | null; stageId: string; createdAt: string }>;
  activities: CrmLeadActivity[];
}

export const LEAD_STATUS_LABELS: Record<CrmLeadStatus, string> = {
  NEW: "جدید",
  CONTACTED: "در تماس",
  QUALIFIED: "واجد شرایط",
  CONVERTED: "تبدیل شده",
  LOST: "از دست رفته",
};

export const LEAD_STATUS_BADGE_VARIANT: Record<
  CrmLeadStatus,
  "default" | "outline" | "secondary" | "destructive" | "success" | "premium"
> = {
  NEW: "outline",
  CONTACTED: "secondary",
  QUALIFIED: "premium",
  CONVERTED: "success",
  LOST: "destructive",
};

export const LEAD_SOURCE_LABELS: Record<CrmLeadSource, string> = {
  WEBSITE: "وبسایت",
  REFERRAL: "معرفی",
  ADS: "تبلیغات",
  SOCIAL: "شبکه‌های اجتماعی",
  PHONE: "تماس تلفنی",
  OTHER: "سایر",
};

export const crmLeadKeys = {
  all: ["crm-leads"] as const,
  lists: () => [...crmLeadKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: Record<string, string>) =>
    [...crmLeadKeys.lists(), { page, limit, ...filters }] as const,
  detail: (id: string) => [...crmLeadKeys.all, "detail", id] as const,
};

export function useCrmLeadsList(
  page = 1,
  limit = 20,
  filters?: { search?: string; status?: string; source?: string }
) {
  return useQuery({
    queryKey: crmLeadKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.source) params.set("source", filters.source);
      const { data } = await api.get(`/api/admin/crm/leads?${params}`);
      return data.data as {
        items: CrmLeadListItem[];
        pagination: PaginationMeta;
      };
    },
    staleTime: 60 * 1000,
  });
}

export function useCrmLead(id: string, enabled = true) {
  return useQuery({
    queryKey: crmLeadKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/leads/${id}`);
      return data.data as CrmLeadDetail;
    },
    enabled: enabled && !!id,
  });
}

export function useCreateCrmLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LeadCreateInput) => {
      const { data: res } = await api.post(`/api/admin/crm/leads`, data);
      return res.data as CrmLeadDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmLeadKeys.lists() });
      toast.success("سرنخ با موفقیت ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد سرنخ");
    },
  });
}

export function useUpdateCrmLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LeadUpdateInput }) => {
      const { data: res } = await api.patch(`/api/admin/crm/leads/${id}`, data);
      return res.data as CrmLeadDetail;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: crmLeadKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: crmLeadKeys.lists() });
      toast.success("سرنخ بروزرسانی شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در بروزرسانی سرنخ");
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      linkExistingCustomer,
      title,
    }: {
      id: string;
      linkExistingCustomer?: boolean;
      title?: string;
    }) => {
      const { data: res } = await api.post(`/api/admin/crm/leads/${id}/convert`, {
        linkExistingCustomer,
        title,
      });
      return res.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: crmLeadKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: crmLeadKeys.lists() });
      toast.success("سرنخ به فرصت فروش تبدیل شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در تبدیل سرنخ به فرصت فروش");
    },
  });
}

export function useAddLeadActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LeadActivityCreateInput }) => {
      const { data: res } = await api.post(`/api/admin/crm/leads/${id}/activities`, data);
      return res.data as CrmLeadActivity;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: crmLeadKeys.detail(id) });
      toast.success("یادداشت ثبت شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت یادداشت");
    },
  });
}
