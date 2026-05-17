import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const adminCourseKeys = {
  all: ["admin-courses"] as const,
  lists: () => [...adminCourseKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: Record<string, string>) =>
    [...adminCourseKeys.lists(), { page, limit, ...filters }] as const,
  detail: (id: string) => [...adminCourseKeys.all, "detail", id] as const,
};

export function useAdminCoursesList(
  page = 1,
  limit = 20,
  filters?: { search?: string; categoryId?: string }
) {
  return useQuery({
    queryKey: adminCourseKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters?.search) params.set("search", filters.search);
      if (filters?.categoryId) params.set("categoryId", filters.categoryId);
      const { data } = await axios.get(`/api/admin/courses?${params}`);
      return data.data as {
        items: Array<{
          id: string;
          subject: string;
          price: number;
          likes: number;
          dislikes: number;
          hasChapters: boolean;
          published: boolean;
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

export function useAdminCourse(id: string, enabled = true) {
  return useQuery({
    queryKey: adminCourseKeys.detail(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/courses/${id}`);
      return data.data;
    },
    enabled: enabled && !!id,
  });
}

export function useUpdateAdminCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const { data: res } = await axios.patch(`/api/admin/courses/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.lists() });
      toast.success("دوره ذخیره شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ذخیره دوره");
    },
  });
}

export async function uploadTempFile(
  file: File,
  kind: "thumbnail" | "video"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);
  const { data } = await axios.post("/api/admin/uploads/temp", formData);
  return data.data.tempPath as string;
}
