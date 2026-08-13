import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { PaginationMeta } from "@/lib/api-response";

export type GuestChatStatus = "OPEN" | "ACTIVE" | "CLOSED";

export interface GuestChatMessage {
  id: string;
  sender: "VISITOR" | "ADMIN";
  body: string;
  adminId?: string | null;
  adminName?: string | null;
  createdAt: string;
}

export interface GuestChatConversation {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  topic: string | null;
  status: GuestChatStatus;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: GuestChatMessage[];
  _count?: { messages: number };
}

export const liveChatKeys = {
  all: ["admin-live-chat"] as const,
  list: (page: number, search: string, status: string) =>
    [...liveChatKeys.all, "list", page, search, status] as const,
  detail: (id: string) => [...liveChatKeys.all, "detail", id] as const,
};

export function useLiveChatList(
  page: number,
  limit = 20,
  filters?: { search?: string; status?: string }
) {
  return useQuery({
    queryKey: liveChatKeys.list(page, filters?.search || "", filters?.status || ""),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      const { data } = await api.get(`/api/admin/live-chat?${params}`);
      return {
        items: (data.data?.items ?? []) as GuestChatConversation[],
        pagination: data.data?.pagination as PaginationMeta | undefined,
      };
    },
    refetchInterval: 5000,
  });
}

export function useLiveChatDetail(id: string | null) {
  return useQuery({
    queryKey: liveChatKeys.detail(id || "none"),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/live-chat/${id}`);
      return data.data as GuestChatConversation;
    },
    refetchInterval: 3000,
  });
}

export function useReplyLiveChat(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      const { data } = await api.post(`/api/admin/live-chat/${id}`, { body });
      return data.data as GuestChatMessage;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: liveChatKeys.all });
      toast.success("پاسخ ارسال شد");
    },
    onError: () => toast.error("ارسال پاسخ ناموفق بود"),
  });
}

export function useUpdateLiveChatStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (status: GuestChatStatus) => {
      const { data } = await api.patch(`/api/admin/live-chat/${id}`, { status });
      return data.data as GuestChatConversation;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: liveChatKeys.all });
      toast.success("وضعیت به‌روزرسانی شد");
    },
    onError: () => toast.error("تغییر وضعیت ناموفق بود"),
  });
}
