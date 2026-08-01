import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { PaginationMeta } from "@/lib/api-response";
import type { SegmentRulesInput } from "@/lib/schemas/crm-segment-schema";

/**
 * React Query hooks for the CRM Customer Segments module. Query-key
 * factory shape follows lib/hooks/useAdminCourses.ts / useCrmCustomer.ts.
 */

export const crmSegmentKeys = {
  all: ["crm-segments"] as const,
  lists: () => [...crmSegmentKeys.all, "list"] as const,
  detail: (id: string) => [...crmSegmentKeys.all, "detail", id] as const,
  members: (id: string, page: number, limit: number) =>
    [...crmSegmentKeys.detail(id), "members", { page, limit }] as const,
};

export interface CrmSegment {
  id: string;
  name: string;
  description: string | null;
  rules: SegmentRulesInput;
  createdById: string | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmSegmentMember {
  id: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  phoneVerified: boolean;
  createdAt: string | null;
}

export function useCrmSegments() {
  return useQuery({
    queryKey: crmSegmentKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/segments`);
      return data.data as CrmSegment[];
    },
    staleTime: 60 * 1000,
  });
}

export function useCrmSegmentDetail(id: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: crmSegmentKeys.members(id, page, limit),
    queryFn: async () => {
      const { data } = await api.get(
        `/api/admin/crm/segments/${id}?page=${page}&limit=${limit}`
      );
      return data.data as {
        segment: CrmSegment;
        members: { items: CrmSegmentMember[]; pagination: PaginationMeta };
      };
    },
    enabled: enabled && !!id,
  });
}

export function useCreateCrmSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string | null;
      rules: SegmentRulesInput;
    }) => {
      const { data: res } = await api.post(`/api/admin/crm/segments`, data);
      return res.data as CrmSegment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmSegmentKeys.lists() });
      toast.success("سگمنت با موفقیت ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد سگمنت");
    },
  });
}

export function useUpdateCrmSegment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name?: string;
      description?: string | null;
      rules?: SegmentRulesInput;
    }) => {
      const { data: res } = await api.patch(`/api/admin/crm/segments/${id}`, data);
      return res.data as CrmSegment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmSegmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: crmSegmentKeys.lists() });
      toast.success("سگمنت با موفقیت ذخیره شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ذخیره سگمنت");
    },
  });
}

export function useDeleteCrmSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/crm/segments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmSegmentKeys.lists() });
      toast.success("سگمنت حذف شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در حذف سگمنت");
    },
  });
}
