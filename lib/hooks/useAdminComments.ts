import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api-client";

export type AdminComment = {
  id: string;
  text: string;
  rating: number | null;
  userName: string | null;
  userAvatar: string | null;
  userRole: string | null;
  userCompany: string | null;
  published: boolean;
  verified: boolean;
  featured: boolean;
  views: number;
  createdAt: string | null;
  updatedAt: string | null;
};

const keys = {
  all: ["admin-comments"] as const,
  list: (featured?: boolean) => [...keys.all, "list", featured ?? "all"] as const,
};

function mutationError(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof (error.response.data as { message: unknown }).message === "string"
  ) {
    return (error.response.data as { message: string }).message;
  }
  return fallback;
}

export function useAdminComments(opts?: { featuredOnly?: boolean }) {
  const featuredOnly = opts?.featuredOnly;
  return useQuery({
    queryKey: keys.list(featuredOnly),
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "200" });
      if (featuredOnly) params.set("featured", "true");
      const { data } = await api.get(`/api/admin/comments?${params}`);
      const items = data?.data?.items ?? data?.data ?? [];
      return (Array.isArray(items) ? items : []) as AdminComment[];
    },
  });
}

export function useCreateAdminComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/comments", payload);
      return data.data as AdminComment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("نظر اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد نظر")),
  });
}

export function useUpdateAdminComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/comments/${id}`, payload);
      return data.data as AdminComment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("نظر به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی نظر")),
  });
}

export function useDeleteAdminComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/comments/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("نظر حذف شد");
    },
    onError: () => toast.error("خطا در حذف نظر"),
  });
}

export async function uploadCommentAvatar(file: File): Promise<string> {
  const form = new FormData();
  form.append("avatar", file);
  const { data } = await api.post("/api/admin/comments/upload-avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  const url = data?.data?.url as string | undefined;
  if (!url) throw new Error("آدرس تصویر برنگشت");
  return url;
}
