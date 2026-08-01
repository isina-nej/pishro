import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { PaginationMeta } from "@/lib/api-response";

export interface CrmTicketCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  email: string | null;
}

export interface CrmTicketAssignee {
  id: string;
  name: string;
  email: string;
}

export interface CrmTicketActivity {
  id: string;
  type: "NOTE" | "CALL" | "EMAIL" | "MEETING" | "STATUS_CHANGE" | "SYSTEM";
  content: string;
  ticketId: string | null;
  adminId: string | null;
  admin: CrmTicketAssignee | null;
  createdAt: string;
}

export interface CrmTicket {
  id: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  customerId: string | null;
  customer: CrmTicketCustomer | null;
  assignedToId: string | null;
  assignedTo: CrmTicketAssignee | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { activities: number };
}

export interface CrmTicketDetail extends CrmTicket {
  activities: CrmTicketActivity[];
}

export const crmTicketKeys = {
  all: ["crm-tickets"] as const,
  lists: () => [...crmTicketKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: Record<string, string | boolean | undefined>) =>
    [...crmTicketKeys.lists(), { page, limit, ...filters }] as const,
  detail: (id: string) => [...crmTicketKeys.all, "detail", id] as const,
};

export function useCrmTicketsList(
  page = 1,
  limit = 20,
  filters?: { search?: string; status?: string; priority?: string; assignedToMe?: boolean }
) {
  return useQuery({
    queryKey: crmTicketKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.assignedToMe) params.set("assignedToMe", "true");

      const { data } = await api.get(`/api/admin/crm/tickets?${params}`);
      return data.data as {
        items: CrmTicket[];
        pagination: PaginationMeta;
      };
    },
    staleTime: 30 * 1000,
  });
}

export function useCrmTicket(id: string, enabled = true) {
  return useQuery({
    queryKey: crmTicketKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/tickets/${id}`);
      return data.data as CrmTicketDetail;
    },
    enabled: enabled && !!id,
  });
}

export function useCreateCrmTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: res } = await api.post(`/api/admin/crm/tickets`, data);
      return res.data as CrmTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmTicketKeys.lists() });
      toast.success("تیکت با موفقیت ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد تیکت");
    },
  });
}

export function useUpdateCrmTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const { data: res } = await api.patch(`/api/admin/crm/tickets/${id}`, data);
      return res.data as CrmTicketDetail;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: crmTicketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: crmTicketKeys.lists() });
      toast.success("تیکت به‌روزرسانی شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی تیکت");
    },
  });
}

export function useAddTicketActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, content, type }: { ticketId: string; content: string; type?: string }) => {
      const { data: res } = await api.post(`/api/admin/crm/tickets/${ticketId}/activities`, {
        content,
        type,
      });
      return res.data as CrmTicketActivity;
    },
    onSuccess: (_data, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: crmTicketKeys.detail(ticketId) });
      toast.success("یادداشت ثبت شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت یادداشت");
    },
  });
}

export function useCrmTicketAssignees() {
  return useQuery({
    queryKey: [...crmTicketKeys.all, "assignees"] as const,
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/tickets/assignees`);
      return data.data as CrmTicketAssignee[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export async function lookupCustomerByPhone(phone: string) {
  try {
    const { data } = await api.get(`/api/admin/crm/tickets/customer-lookup`, {
      params: { phone },
    });
    return data.data as CrmTicketCustomer;
  } catch {
    return null;
  }
}
