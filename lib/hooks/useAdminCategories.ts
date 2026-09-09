import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";

export const adminCategoryKeys = {
  all: ["admin-categories"] as const,
  lists: () => [...adminCategoryKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: Record<string, string>) =>
    [...adminCategoryKeys.lists(), { page, limit, ...filters }] as const,
  detail: (id: string) => [...adminCategoryKeys.all, "detail", id] as const,
};

export function useAdminCategoriesList(
  page = 1,
  limit = 50,
  filters?: { search?: string; published?: string; featured?: string }
) {
  return useQuery({
    queryKey: adminCategoryKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters?.search) params.set("search", filters.search);
      if (filters?.published) params.set("published", filters.published);
      if (filters?.featured) params.set("featured", filters.featured);
      const { data } = await api.get(`/api/admin/categories?${params}`);
      return data.data as {
        items: Array<{
          id: string;
          slug: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          coverImage?: string | null;
          color?: string | null;
          published: boolean;
          featured: boolean;
          order: number;
          _count?: { courses: number };
        }>;
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      };
    },
  });
}

export function useAdminCategory(id: string, enabled = true) {
  return useQuery({
    queryKey: adminCategoryKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/categories/${id}`);
      return data.data;
    },
    enabled: enabled && !!id,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: res } = await api.post(`/api/admin/categories`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      toast.success("دسته‌بندی ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد دسته‌بندی");
    },
  });
}

export function useUpdateAdminCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: res } = await api.patch(`/api/admin/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      toast.success("دسته‌بندی ذخیره شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ذخیره دسته‌بندی");
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res } = await api.delete(`/api/admin/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      toast.success("دسته‌بندی حذف شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در حذف دسته‌بندی");
    },
  });
}
