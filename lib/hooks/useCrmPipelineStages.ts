import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";

export interface CrmPipelineStage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  isWon: boolean;
  isLost: boolean;
}

export const crmPipelineStageKeys = {
  all: ["crm-pipeline-stages"] as const,
  list: () => [...crmPipelineStageKeys.all, "list"] as const,
};

/**
 * لیست مراحل پایپ‌لاین فروش. سرور در صورت خالی بودن جدول، مجموعه پیش‌فرض را
 * می‌سازد، پس این هوک همیشه حداقل چند مرحله برمی‌گرداند.
 */
export function useCrmPipelineStages() {
  return useQuery({
    queryKey: crmPipelineStageKeys.list(),
    queryFn: async () => {
      const { data } = await api.get("/api/admin/crm/pipeline-stages");
      return data.data as CrmPipelineStage[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePipelineStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      order: number;
      color?: string | null;
      isWon?: boolean;
      isLost?: boolean;
    }) => {
      const { data } = await api.post("/api/admin/crm/pipeline-stages", payload);
      return data.data as CrmPipelineStage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmPipelineStageKeys.list() });
      toast.success("مرحله با موفقیت ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد مرحله");
    },
  });
}
