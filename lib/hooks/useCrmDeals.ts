import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { PaginationMeta } from "@/lib/api-response";
import type { CrmPipelineStage } from "@/lib/hooks/useCrmPipelineStages";

export interface CrmPersonRef {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
}

export interface CrmAdminRef {
  id: string;
  name: string;
  email?: string;
}

export interface CrmOrderRef {
  id: string;
  total: number;
  status: string;
  createdAt: string | null;
}

export interface CrmActivity {
  id: string;
  type: "NOTE" | "CALL" | "EMAIL" | "MEETING" | "STATUS_CHANGE" | "SYSTEM";
  content: string;
  dealId: string | null;
  adminId: string | null;
  admin?: CrmAdminRef | null;
  createdAt: string;
}

export interface CrmDeal {
  id: string;
  title: string;
  amount: number | null;
  stageId: string;
  stage?: CrmPipelineStage | null;
  leadId: string | null;
  lead?: CrmPersonRef | null;
  customerId: string | null;
  customer?: CrmPersonRef | null;
  orderId: string | null;
  order?: CrmOrderRef | null;
  ownerAdminId: string | null;
  ownerAdmin?: CrmAdminRef | null;
  expectedCloseDate: string | null;
  closedAt: string | null;
  activities?: CrmActivity[];
  createdAt: string;
  updatedAt: string;
}

export type CrmDealListItem = Omit<CrmDeal, "activities" | "order">;

interface CrmDealListResponse {
  items: CrmDealListItem[];
  pagination: PaginationMeta;
}

export const crmDealKeys = {
  all: ["crm-deals"] as const,
  lists: () => [...crmDealKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: Record<string, string | undefined>) =>
    [...crmDealKeys.lists(), { page, limit, ...filters }] as const,
  detail: (id: string) => [...crmDealKeys.all, "detail", id] as const,
};

export function useCrmDealsList(
  page = 1,
  limit = 20,
  filters?: { stageId?: string; search?: string }
) {
  return useQuery({
    queryKey: crmDealKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filters?.stageId) params.set("stageId", filters.stageId);
      if (filters?.search) params.set("search", filters.search);
      const { data } = await api.get(`/api/admin/crm/deals?${params}`);
      return data.data as CrmDealListResponse;
    },
    staleTime: 60 * 1000,
  });
}

export function useCrmDeal(id: string, enabled = true) {
  return useQuery({
    queryKey: crmDealKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/deals/${id}`);
      return data.data as CrmDeal;
    },
    enabled: enabled && !!id,
  });
}

export function useCreateCrmDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      amount?: number | null;
      stageId: string;
      leadId?: string | null;
      customerId?: string | null;
      ownerAdminId?: string | null;
      expectedCloseDate?: string | Date | null;
    }) => {
      const { data } = await api.post("/api/admin/crm/deals", payload);
      return data.data as CrmDeal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmDealKeys.lists() });
      toast.success("فرصت فروش با موفقیت ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد فرصت فروش");
    },
  });
}

export function useUpdateCrmDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const { data: res } = await api.patch(`/api/admin/crm/deals/${id}`, data);
      return res.data as CrmDeal;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: crmDealKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: crmDealKeys.lists() });
      toast.success("فرصت فروش ذخیره شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ذخیره فرصت فروش");
    },
  });
}

interface MoveDealStageVars {
  id: string;
  stageId: string;
}

interface MoveDealStageContext {
  previousLists: [QueryKey, CrmDealListResponse | undefined][];
}

/**
 * جابجایی مرحله یک دیل (drag-and-drop روی بورد کانبان). به‌روزرسانی خوش‌بینانه
 * (optimistic) بلافاصله کش لیست‌ها را اصلاح می‌کند تا کشیدن کارت حس تاخیر
 * نداشته باشد؛ در صورت خطا با context ذخیره‌شده rollback می‌شود.
 */
export function useMoveDealStage() {
  const queryClient = useQueryClient();

  return useMutation<CrmDeal, { response?: { data?: { message?: string } } }, MoveDealStageVars, MoveDealStageContext>({
    mutationFn: async ({ id, stageId }) => {
      const { data } = await api.patch(`/api/admin/crm/deals/${id}/stage`, { stageId });
      return data.data as CrmDeal;
    },
    onMutate: async ({ id, stageId }) => {
      await queryClient.cancelQueries({ queryKey: crmDealKeys.lists() });

      const previousLists = queryClient.getQueriesData<CrmDealListResponse>({
        queryKey: crmDealKeys.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData<CrmDealListResponse>(queryKey, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, stageId } : item
          ),
        });
      });

      return { previousLists };
    },
    onError: (error, _variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(error?.response?.data?.message || "خطا در جابجایی فرصت فروش");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: crmDealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: crmDealKeys.detail(variables.id) });
    },
  });
}

export function useAddDealActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      dealId,
      type,
      content,
    }: {
      dealId: string;
      type: CrmActivity["type"];
      content: string;
    }) => {
      const { data } = await api.post(`/api/admin/crm/deals/${dealId}/activities`, {
        type,
        content,
      });
      return data.data as CrmActivity;
    },
    onSuccess: (_data, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: crmDealKeys.detail(dealId) });
      toast.success("فعالیت با موفقیت ثبت شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت فعالیت");
    },
  });
}
