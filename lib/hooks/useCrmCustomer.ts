import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { PaginationMeta } from "@/lib/api-response";

/**
 * React Query hooks for the CRM Customers module: the customer list (backed
 * by the existing /api/admin/users endpoint), the composed customer-360
 * detail view, CRM activity notes, and customer tags. Query-key factories
 * follow the shape used in lib/hooks/useAdminCourses.ts.
 */

export const crmCustomerKeys = {
  all: ["crm-customers"] as const,
  lists: () => [...crmCustomerKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: CrmCustomerListFilters) =>
    [...crmCustomerKeys.lists(), { page, limit, ...filters }] as const,
  detail: (id: string) => [...crmCustomerKeys.all, "detail", id] as const,
};

export const crmTagKeys = {
  all: ["crm-tags"] as const,
  list: () => [...crmTagKeys.all, "list"] as const,
};

export interface CrmCustomerListItem {
  id: string;
  phone: string;
  phoneVerified: boolean;
  role: "USER" | "ADMIN";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  nationalCode: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  _count: {
    comments: number;
    orders: number;
    enrollments: number;
    transactions: number;
  };
}

export interface CrmCustomerListFilters {
  search?: string;
  role?: string;
  phoneVerified?: string;
}

/**
 * Backs the customer list page. Reuses the existing, already-shipped
 * GET /api/admin/users endpoint (do not fork its query logic).
 */
export function useCrmCustomersList(
  page = 1,
  limit = 20,
  filters?: CrmCustomerListFilters
) {
  return useQuery({
    queryKey: crmCustomerKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters?.search) params.set("search", filters.search);
      if (filters?.role) params.set("role", filters.role);
      if (filters?.phoneVerified) params.set("phoneVerified", filters.phoneVerified);
      const { data } = await api.get(`/api/admin/users?${params}`);
      return data.data as {
        items: CrmCustomerListItem[];
        pagination: PaginationMeta;
      };
    },
    staleTime: 60 * 1000,
  });
}

export interface CrmCustomerDetail {
  user: {
    id: string;
    phone: string;
    phoneVerified: boolean;
    role: "USER" | "ADMIN";
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    nationalCode: string | null;
    birthDate: string | null;
    avatarUrl: string | null;
    cardNumber: string | null;
    shebaNumber: string | null;
    accountOwner: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  orders: Array<{
    id: string;
    userId: string | null;
    items: unknown;
    total: number;
    status: "PENDING" | "PAID" | "FAILED";
    createdAt: string;
  }>;
  transactions: Array<{
    id: string;
    userId: string | null;
    orderId: string | null;
    amount: number;
    type: "PAYMENT" | "REFUND" | "WITHDRAWAL";
    status: "PENDING" | "SUCCESS" | "FAILED";
    createdAt: string;
  }>;
  investmentPortfolios: Array<{
    id: string;
    portfolioType: string;
    portfolioAmount: number;
    expectedReturn: number;
    purchasePrice: number;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";
    startDate: string;
    endDate: string | null;
  }>;
  enrollments: Array<{
    id: string;
    courseId: string;
    progress: number;
    completedAt: string | null;
    course: { id: string; subject: string } | null;
  }>;
  tags: Array<{ id: string; name: string; color: string | null }>;
  activities: Array<{
    id: string;
    type: "NOTE" | "CALL" | "EMAIL" | "MEETING" | "STATUS_CHANGE" | "SYSTEM";
    content: string;
    adminId: string | null;
    admin: { id: string; name: string } | null;
    createdAt: string;
  }>;
}

export function useCrmCustomerDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: crmCustomerKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/customers/${id}`);
      return data.data as CrmCustomerDetail;
    },
    enabled: enabled && !!id,
  });
}

export function useAddCustomerActivity(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const { data: res } = await api.post(
        `/api/admin/crm/customers/${customerId}/activities`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmCustomerKeys.detail(customerId) });
      toast.success("یادداشت ثبت شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت یادداشت");
    },
  });
}

export interface CrmTag {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
}

export function useCrmTags() {
  return useQuery({
    queryKey: crmTagKeys.list(),
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/crm/tags`);
      return data.data as CrmTag[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCrmTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; color?: string | null }) => {
      const { data: res } = await api.post(`/api/admin/crm/tags`, data);
      return res.data as CrmTag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmTagKeys.list() });
      toast.success("برچسب ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد برچسب");
    },
  });
}

export function useAssignCustomerTag(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tagId: string) => {
      const { data: res } = await api.post(
        `/api/admin/crm/customers/${customerId}/tags`,
        { tagId }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmCustomerKeys.detail(customerId) });
      toast.success("برچسب اضافه شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در اضافه کردن برچسب");
    },
  });
}

export function useUnassignCustomerTag(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tagId: string) => {
      await api.delete(`/api/admin/crm/customers/${customerId}/tags`, {
        params: { tagId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmCustomerKeys.detail(customerId) });
      toast.success("برچسب حذف شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در حذف برچسب");
    },
  });
}
