import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api-client";

export interface AdminInvestmentFund {
  id: string;
  key: string;
  name: string;
  description: string | null;
  monthlyRate: number;
  minDuration: number;
  maxDuration: number;
  durationStep: number;
  minAmount: number;
  maxAmount: number;
  amountStep: number;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentFundFormData {
  key: string;
  name: string;
  description?: string;
  monthlyRate: number;
  minDuration: number;
  maxDuration: number;
  durationStep: number;
  minAmount: number;
  maxAmount: number;
  amountStep: number;
  order?: number;
  active?: boolean;
}

export const adminInvestmentFundKeys = {
  all: ["admin-investment-funds"] as const,
  list: () => [...adminInvestmentFundKeys.all, "list"] as const,
  detail: (id: string) => [...adminInvestmentFundKeys.all, "detail", id] as const,
};

export function useAdminInvestmentFunds() {
  return useQuery({
    queryKey: adminInvestmentFundKeys.list(),
    queryFn: async () => {
      const { data } = await api.get("/api/admin/investment-funds");
      return data.data as AdminInvestmentFund[];
    },
    staleTime: 60 * 1000,
  });
}

export function useCreateAdminInvestmentFund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InvestmentFundFormData) => {
      const { data } = await api.post("/api/admin/investment-funds", payload);
      return data.data as AdminInvestmentFund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminInvestmentFundKeys.list() });
      toast.success("صندوق با موفقیت ایجاد شد");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "خطایی در ایجاد صندوق رخ داد";
      toast.error(message);
    },
  });
}

export function useUpdateAdminInvestmentFund(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<InvestmentFundFormData>) => {
      const { data } = await api.patch(`/api/admin/investment-funds/${id}`, payload);
      return data.data as AdminInvestmentFund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminInvestmentFundKeys.list() });
      queryClient.invalidateQueries({ queryKey: adminInvestmentFundKeys.detail(id) });
      toast.success("صندوق با موفقیت به‌روزرسانی شد");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "خطایی در به‌روزرسانی صندوق رخ داد";
      toast.error(message);
    },
  });
}

export function useDeleteAdminInvestmentFund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/investment-funds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminInvestmentFundKeys.list() });
      toast.success("صندوق با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطایی در حذف صندوق رخ داد");
    },
  });
}
